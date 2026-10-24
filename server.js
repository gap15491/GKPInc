// Production server for the GKP Solutions website.
// - Serves the built Gatsby site from ./public
// - POST /api/contact saves a request to Postgres and emails a notification
//
// Environment variables (set in Railway > Variables):
//   DATABASE_URL    Postgres connection string (use ${{Postgres.DATABASE_URL}})
//   RESEND_API_KEY  API key from resend.com (optional; no email is sent without it)
//   NOTIFY_EMAIL    Where notifications go (default gary@gkpsolutions.net)
//   EMAIL_FROM      Sender, e.g. "GKP Website <website@gkpsolutions.net>"
//                   (default uses Resend's test sender until your domain is verified)
//   PORT            Set by Railway

const path = require('path')
const fs = require('fs')
const express = require('express')
const { Pool } = require('pg')

const PORT = process.env.PORT || 8080
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'gary@gkpsolutions.net'
const EMAIL_FROM = process.env.EMAIL_FROM || 'GKP Website <onboarding@resend.dev>'

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
  console.log('Database ready (contact_requests table).')
}

// --- helpers ---------------------------------------------------------------
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
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

async function sendEmail(r) {
  if (!process.env.RESEND_API_KEY) return
  const rows = [
    ['Name', r.name], ['Email', r.email], ['Phone', r.phone],
    ['Business', r.businessName], ['Job title', r.jobTitle],
    ['Location', r.location], ['Interested in', r.interest],
  ]
  const html = `
    <h2>New contact request from gkpsolutions website</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif">
      ${rows.map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${escapeHtml(v || '—')}</b></td></tr>`).join('')}
    </table>
    <h3 style="font-family:Arial,sans-serif">Message</h3>
    <p style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(r.message)}</p>`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: NOTIFY_EMAIL.split(',').map((s) => s.trim()),
      reply_to: r.email,
      subject: `Website inquiry: ${r.name} – ${r.businessName}`,
      html,
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
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

  let saved = false
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO contact_requests
          (name, email, phone, business_name, job_title, location, interest, message, ip, user_agent)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [r.name, r.email, r.phone, r.businessName, r.jobTitle, r.location,
         r.interest, r.message, req.ip, clean(req.get('user-agent'), 500)])
      saved = true
    } catch (err) {
      console.error('DB insert failed:', err.message)
    }
  }

  let emailed = false
  try {
    await sendEmail(r)
    emailed = !!process.env.RESEND_API_KEY
  } catch (err) {
    console.error('Email failed:', err.message)
  }

  if (!saved && !emailed) {
    return res.status(500).json({ error: 'Sorry, we could not send your request. Please email gary@gkpsolutions.net.' })
  }
  console.log(`Contact request from ${r.email} (saved=${saved}, emailed=${emailed})`)
  res.json({ ok: true })
})

app.get('/healthz', (req, res) => res.send('ok'))

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
  .finally(() => app.listen(PORT, '0.0.0.0', () => console.log(`GKP site listening on ${PORT}`)))
