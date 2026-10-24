// Production server for the GKP Solutions website.
// - Serves the built Gatsby site from ./public
// - POST /api/contact saves a request to Postgres and emails a notification
// - /admin is a password-protected page to review submissions
//
// Environment variables (set in Railway > Variables):
//   DATABASE_URL    Postgres connection string (use ${{Postgres.DATABASE_URL}})
//   RESEND_API_KEY  API key from resend.com (no email is sent without it)
//   NOTIFY_EMAIL    Where notifications go (default gary@gkpsolutions.net; comma-separate several)
//   EMAIL_FROM      Sender, e.g. "GKP Website <website@gkpsolutions.net>"
//                   (default uses Resend's test sender until your domain is verified)
//   ADMIN_PASSWORD  Password for /admin (the admin page is disabled until this is set)
//   ADMIN_USER      Username for /admin (default "admin")
//   PORT            Set by Railway

const path = require('path')
const fs = require('fs')
const express = require('express')
const { Pool } = require('pg')
const adminRouter = require('./admin')

const PORT = process.env.PORT || 8080
const config = () => ({
  apiKey: (process.env.RESEND_API_KEY || '').trim(),
  notify: (process.env.NOTIFY_EMAIL || 'gary@gkpsolutions.net')
    .split(',').map((s) => s.trim()).filter(Boolean),
  from: (process.env.EMAIL_FROM || 'GKP Website <onboarding@resend.dev>').trim(),
})

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Railway's internal network doesn't use SSL; its public proxy does.
      ssl: /railway\.internal|localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)
        ? false
        : { rejectUnauthorized: false },
    })
  : null

async function initDb() {
  if (!pool) {
    console.warn('DATABASE_URL is not set - contact submissions will not be saved.')
    return
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_requests (
      id            SERIAL PRIMARY KEY,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      phone         TEXT,
      business_name TEXT NOT NULL,
      job_title     TEXT,
      location      TEXT,
      interest      TEXT,
      message       TEXT NOT NULL,
      ip            TEXT,
      user_agent    TEXT
    )`)
  // Columns added later (safe to run every start)
  await pool.query(`
    ALTER TABLE contact_requests
      ADD COLUMN IF NOT EXISTS status       TEXT NOT NULL DEFAULT 'new',
      ADD COLUMN IF NOT EXISTS email_status TEXT,
      ADD COLUMN IF NOT EXISTS email_detail TEXT`)
  console.log('Database ready (contact_requests table).')
}

// --- helpers ---------------------------------------------------------------
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const escapeHtml = (s) =>
  String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Simple in-memory rate limit: 5 submissions per IP per 15 minutes
const hits = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

// Sends through Resend. Always resolves to { ok, detail } so callers can record what happened.
async function resendSend({ subject, html, replyTo }) {
  const c = config()
  if (!c.apiKey) return { ok: false, detail: 'RESEND_API_KEY is not set on this service.' }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${c.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: c.from,
        to: c.notify,
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        html,
      }),
    })
    const text = await res.text()
    if (!res.ok) return { ok: false, detail: `Resend ${res.status}: ${text}` }
    let id = ''
    try { id = JSON.parse(text).id || '' } catch (e) {}
    return { ok: true, detail: `Accepted by Resend (id ${id}) → ${c.notify.join(', ')}` }
  } catch (err) {
    return { ok: false, detail: `Could not reach Resend: ${err.message}` }
  }
}

function notificationHtml(r) {
  const rows = [
    ['Name', r.name], ['Email', r.email], ['Phone', r.phone],
    ['Business', r.businessName], ['Job title', r.jobTitle],
    ['Location', r.location], ['Interested in', r.interest],
  ]
  return `
    <h2>New contact request from the GKP Solutions website</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif">
      ${rows.map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${escapeHtml(v || '—')}</b></td></tr>`).join('')}
    </table>
    <h3 style="font-family:Arial,sans-serif">Message</h3>
    <p style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(r.message)}</p>`
}

// --- app -------------------------------------------------------------------
const app = express()
app.set('trust proxy', true)
app.use(express.json({ limit: '50kb' }))

app.post('/api/contact', async (req, res) => {
  const b = req.body || {}
  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (clean(b.website, 200)) return res.json({ ok: true })

  const r = {
    name: clean(b.name, 200),
    email: clean(b.email, 200),
    phone: clean(b.phone, 50),
    businessName: clean(b.businessName, 200),
    jobTitle: clean(b.jobTitle, 200),
    location: clean(b.location, 200),
    interest: clean(b.interest, 100),
    message: clean(b.message, 5000),
  }
  if (!r.name || !r.businessName || !r.message || !EMAIL_RE.test(r.email)) {
    return res.status(400).json({ error: 'Please fill in your name, a valid email, business name and message.' })
  }
  if (rateLimited(req.ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  let id = null
  if (pool) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO contact_requests
          (name, email, phone, business_name, job_title, location, interest, message, ip, user_agent)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
        [r.name, r.email, r.phone, r.businessName, r.jobTitle, r.location,
         r.interest, r.message, req.ip, clean(req.get('user-agent'), 500)])
      id = rows[0].id
    } catch (err) {
      console.error('DB insert failed:', err.message)
    }
  }

  const mail = await resendSend({
    subject: `Website inquiry: ${r.name} – ${r.businessName}`,
    html: notificationHtml(r),
    replyTo: r.email,
  })
  console.log(`Contact request from ${r.email}: saved=${id !== null}, email ${mail.ok ? 'OK' : 'FAILED'} - ${mail.detail}`)

  if (id !== null) {
    await pool.query(
      'UPDATE contact_requests SET email_status=$1, email_detail=$2 WHERE id=$3',
      [mail.ok ? 'sent' : 'failed', mail.detail.slice(0, 1000), id]
    ).catch((err) => console.error('Email status update failed:', err.message))
  }

  if (id === null && !mail.ok) {
    return res.status(500).json({ error: 'Sorry, we could not send your request. Please email gary@gkpsolutions.net.' })
  }
  res.json({ ok: true })
})

app.get('/healthz', (req, res) => res.send('ok'))

app.use('/admin', adminRouter({ pool, config, resendSend, escapeHtml }))

// Static Gatsby site
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir, { extensions: ['html'] }))
app.use((req, res) => {
  const notFound = path.join(publicDir, '404.html')
  if (fs.existsSync(notFound)) return res.status(404).sendFile(notFound)
  res.status(404).send('Not found')
})

initDb()
  .catch((err) => console.error('Database init failed:', err.message))
  .finally(() => {
    const c = config()
    console.log(`Email config: key ${c.apiKey ? 'set' : 'MISSING'}, from "${c.from}", to ${c.notify.join(', ')}`)
    console.log(`Admin page: ${process.env.ADMIN_PASSWORD ? 'enabled at /admin' : 'disabled (set ADMIN_PASSWORD)'}`)
    app.listen(PORT, '0.0.0.0', () => console.log(`GKP site listening on ${PORT}`))
  })
