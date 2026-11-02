// Production server for the GKP Solutions website.
// - Serves the built Gatsby site from ./public
// - POST /api/contact saves a request to Postgres, emails a notification, and sends
//   the visitor a confirmation ("auto-reply") from Gary
// - POST /api/savings-report emails a Savings Calculator breakdown to the visitor and
//   saves them as a lead (rates are in src/data/savings-rates.json)
// - POST /api/talent-request saves a "Request Talent" brief, emails Gary, and sends the
//   visitor a copy of their request from Gary
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
//   BOOKINGS_URL    Your Microsoft Bookings page link, for the "Book a Call" page (optional)
//   PORT            Set by Railway

const path = require('path')
const fs = require('fs')
const express = require('express')
const { Pool } = require('pg')
const adminRouter = require('./admin')
const { rates: savingsRates, calcSavings, cleanSyncedTitles, money } = require('./src/data/savings-calc')

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
      ADD COLUMN IF NOT EXISTS email_detail TEXT,
      ADD COLUMN IF NOT EXISTS ref          TEXT`)
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
// By default it notifies Gary (NOTIFY_EMAIL); pass `to`/`from` to email a visitor instead.
async function resendSend({ subject, html, replyTo, to, from, attachments }) {
  const c = config()
  const recipients = to ? [].concat(to) : c.notify
  if (!c.apiKey) return { ok: false, detail: 'RESEND_API_KEY is not set on this service.' }
  try {
    const res = await fetch(process.env.RESEND_API_URL || 'https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${c.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: from || c.from,
        to: recipients,
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        html,
        ...(attachments ? { attachments } : {}),
      }),
    })
    const text = await res.text()
    if (!res.ok) return { ok: false, detail: `Resend ${res.status}: ${text}` }
    let id = ''
    try { id = JSON.parse(text).id || '' } catch (e) {}
    return { ok: true, detail: `Accepted by Resend (id ${id}) → ${recipients.join(', ')}` }
  } catch (err) {
    return { ok: false, detail: `Could not reach Resend: ${err.message}` }
  }
}

// --- emails sent to visitors, personally from Gary ----------------------------
// Uses the address in EMAIL_FROM (e.g. gary@gkpsolutions.net) with Gary's name on it.
// Replies go to the first NOTIFY_EMAIL address.
const SENDER_NAME = 'Gary Peck'
function personalSender() {
  const c = config()
  const m = c.from.match(/<([^>]+)>/)
  const address = (m ? m[1] : c.from).trim()
  return { from: `${SENDER_NAME} <${address}>`, replyTo: c.notify[0] || address }
}

const firstName = (name) => clean(name, 60).split(/\s+/)[0] || 'there'

const emailShell = (inner) => `
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2430;max-width:600px">
    ${inner}
    <p style="margin-top:24px">Best regards,<br>
      <b>Gary Peck</b><br>
      Founder &amp; CEO, GKP Solutions, Inc.<br>
      <a href="tel:+16159444405" style="color:#1f2430">+1 (615) 944-4405</a> ·
      <a href="https://www.gkpsolutions.net" style="color:#ff5d22">gkpsolutions.net</a></p>
  </div>`

function autoReplyHtml(r) {
  return emailShell(`
    <p>Hi ${escapeHtml(firstName(r.name))},</p>
    <p>Thank you for reaching out to GKP Solutions. I've received your request and will get back to you
      personally within one business day.</p>
    <p>If anything is time-sensitive, just reply to this email or call me directly at the number below.</p>
    <p>In the meantime, you can see what an offshore or nearshore team could save you with our
      <a href="https://www.gkpsolutions.net/savings-calculator" style="color:#ff5d22">Savings Calculator</a>.</p>`)
}

function savingsRow(label, value, bold) {
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eceef2;color:#6b7280">${label}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #eceef2;text-align:right">${bold ? `<b>${value}</b>` : value}</td></tr>`
}

function savingsReportHtml(name, s) {
  return emailShell(`
    <p>Hi ${escapeHtml(firstName(name))},</p>
    <p>Thanks for using the GKP Solutions Savings Calculator. Here's the breakdown for your estimate:</p>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:520px;border:1px solid #eceef2">
      ${savingsRow('Role', escapeHtml(s.roleLabel))}
      ${savingsRow('Team size', s.team)}
      ${savingsRow('Team location', escapeHtml(s.regionLabel))}
      ${savingsRow('US cost per person / year', money(s.usPerPerson))}
      ${savingsRow('GKP cost per person / year', money(s.gkpPerPerson))}
      ${savingsRow('US team cost / year', money(s.usTotal))}
      ${savingsRow('GKP team cost / year', money(s.gkpTotal))}
      <tr><td style="padding:10px 12px;background:#ff5d22;color:#fff"><b>Estimated savings / year</b></td>
        <td style="padding:10px 12px;background:#ff5d22;color:#fff;text-align:right"><b>${money(s.savings)} (${s.savingsPct}%)</b></td></tr>
    </table>
    <p style="font-size:13px;color:#6b7280">How we estimate: US cost is a typical base salary of ${money(s.usSalary)} plus about
      ${Math.round((savingsRates.usLoadedMultiplier - 1) * 100)}% for payroll taxes, benefits and overhead. GKP cost assumes a
      full-time contractor at about $${s.hourlyRate.toFixed(2)}/hour (${savingsRates.hoursPerYear.toLocaleString('en-US')} hours/year).
      Your actual quote depends on seniority, skills and engagement length.</p>
    <p>I'd be glad to put together an exact quote and share a few sample candidate profiles for this role.
      Just reply to this email and let me know a good time to talk.</p>`)
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

// --- Request Talent -----------------------------------------------------------
const pick = (v, list) => (list.includes(v) ? v : '')
const TALENT_OPTIONS = {
  seniority: ['Junior', 'Mid-level', 'Senior', 'Lead / Architect', 'A mix'],
  start: ['As soon as possible', 'Within 2 weeks', 'Within 30 days', 'In 1–3 months', 'Just exploring'],
  engagement: ['Full-time contractor', 'Part-time', 'Project-based', 'Contract-to-hire', 'Not sure yet'],
  locations: ['Philippines', 'Latin America', 'India', 'Indonesia', 'UK / Europe', 'Canada', 'No preference'],
  timezone: ['US Eastern', 'US Central', 'US Mountain', 'US Pacific', 'Flexible / async is fine'],
}

function talentRows(t) {
  return [
    ['Role(s)', t.roles], ['How many', t.headcount], ['Seniority', t.seniority], ['Ideal start', t.start],
    ['Engagement', t.engagement], ['Locations', t.locations.join(', ')], ['Hours overlap', t.timezone],
    ['Budget', t.budget],
  ].filter(([, v]) => v !== '' && v != null)
}

function talentTable(t) {
  return `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px;border:1px solid #eceef2">
    ${talentRows(t).map(([k, v]) => savingsRow(k, escapeHtml(v))).join('')}
  </table>
  ${t.details ? `<p style="margin:14px 0 4px;color:#6b7280">Skills and details</p>
    <p style="white-space:pre-wrap;margin:0;padding:12px;background:#f8f9fb;border:1px solid #eceef2">${escapeHtml(t.details)}</p>` : ''}`
}

function talentSummary(t) {
  return [
    `Talent request: ${t.headcount} × ${t.roles}`,
    ...talentRows(t).slice(2).map(([k, v]) => `${k}: ${v}`),
    t.details ? `\nDetails:\n${t.details}` : '',
  ].filter(Boolean).join('\n')
}

function talentConfirmHtml(t) {
  return emailShell(`
    <p>Hi ${escapeHtml(firstName(t.name))},</p>
    <p>Thank you for your talent request. I'll review it personally and get back to you within one business day
      with rates, timing and how we'd source the right people.</p>
    <p>Here's a copy of what you sent:</p>
    ${talentTable(t)}
    <p>If anything changes or you'd like to add a job description, just reply to this email.</p>`)
}

function talentNotifyHtml(t) {
  return `
    <h2 style="font-family:Arial,sans-serif">New talent request: ${escapeHtml(t.headcount)} × ${escapeHtml(t.roles)}</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif">
      ${[['Name', t.name], ['Email', t.email], ['Phone', t.phone], ['Company', t.company], ['Job title', t.jobTitle]]
        .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${escapeHtml(v || '—')}</b></td></tr>`).join('')}
    </table>
    <div style="font-family:Arial,sans-serif;margin-top:12px">${talentTable(t)}</div>`
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

  if (id === null && !mail.ok) {
    return res.status(500).json({ error: 'Sorry, we could not send your request. Please email gary@gkpsolutions.net.' })
  }

  // Confirmation email to the visitor, personally from Gary
  const sender = personalSender()
  const reply = await resendSend({
    to: r.email,
    from: sender.from,
    replyTo: sender.replyTo,
    subject: 'Thanks for contacting GKP Solutions',
    html: autoReplyHtml(r),
  })
  console.log(`Auto-reply to ${r.email}: ${reply.ok ? 'OK' : 'FAILED'} - ${reply.detail}`)

  if (id !== null) {
    await pool.query(
      'UPDATE contact_requests SET email_status=$1, email_detail=$2 WHERE id=$3',
      [mail.ok ? 'sent' : 'failed',
       `Notification: ${mail.detail} | Auto-reply: ${reply.ok ? 'sent' : 'FAILED'} - ${reply.detail}`.slice(0, 1000), id]
    ).catch((err) => console.error('Email status update failed:', err.message))
  }

  res.json({ ok: true })
})

app.post('/api/talent-request', async (req, res) => {
  const b = req.body || {}
  if (clean(b.website, 200)) return res.json({ ok: true }) // honeypot

  const n = parseInt(b.headcount, 10)
  const t = {
    name: clean(b.name, 200), email: clean(b.email, 200), phone: clean(b.phone, 50),
    company: clean(b.company, 200), jobTitle: clean(b.jobTitle, 200),
    roles: clean(b.roles, 300), headcount: Number.isFinite(n) ? Math.min(200, Math.max(1, n)) : 1,
    seniority: pick(b.seniority, TALENT_OPTIONS.seniority), start: pick(b.start, TALENT_OPTIONS.start),
    engagement: pick(b.engagement, TALENT_OPTIONS.engagement),
    locations: (Array.isArray(b.locations) ? b.locations : []).filter((l) => TALENT_OPTIONS.locations.includes(l)).slice(0, 7),
    timezone: pick(b.timezone, TALENT_OPTIONS.timezone), budget: clean(b.budget, 100), details: clean(b.details, 5000),
  }
  if (!t.name || !t.company || !t.roles || !EMAIL_RE.test(t.email)) {
    return res.status(400).json({ error: 'Please fill in the role, your name, a valid email and your company.' })
  }
  if (rateLimited(req.ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const summary = talentSummary(t)
  let id = null
  if (pool) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO contact_requests
          (name, email, phone, business_name, job_title, location, interest, message, ip, user_agent)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
        [t.name, t.email, t.phone, t.company, t.jobTitle, t.locations.join(', '), 'Talent request',
         summary, req.ip, clean(req.get('user-agent'), 500)])
      id = rows[0].id
    } catch (err) {
      console.error('DB insert failed:', err.message)
    }
  }

  const notify = await resendSend({
    subject: `Talent request: ${t.headcount} × ${t.roles} – ${t.company}`.slice(0, 200),
    html: talentNotifyHtml(t),
    replyTo: t.email,
  })
  if (id === null && !notify.ok) {
    return res.status(500).json({ error: 'Sorry, we could not send your request. Please email gary@gkpsolutions.net.' })
  }
  const sender = personalSender()
  const reply = await resendSend({
    to: t.email, from: sender.from, replyTo: sender.replyTo,
    subject: 'Your talent request with GKP Solutions',
    html: talentConfirmHtml(t),
  })
  console.log(`Talent request from ${t.email}: saved=${id !== null}, notify ${notify.ok ? 'OK' : 'FAILED'} - ${notify.detail}; copy ${reply.ok ? 'OK' : 'FAILED'}`)
  if (id !== null) {
    await pool.query(
      'UPDATE contact_requests SET email_status=$1, email_detail=$2 WHERE id=$3',
      [notify.ok ? 'sent' : 'failed',
       `Notification: ${notify.detail} | Copy to visitor: ${reply.ok ? 'sent' : 'FAILED'} - ${reply.detail}`.slice(0, 1000), id]
    ).catch((err) => console.error('Email status update failed:', err.message))
  }
  res.json({ ok: true })
})

// Savings Calculator: email the visitor their breakdown and record them as a lead.
// Leads appear on the /admin page alongside contact requests ("Savings calculator").
app.post('/api/savings-report', async (req, res) => {
  const b = req.body || {}
  if (clean(b.website, 200)) return res.json({ ok: true }) // honeypot

  const name = clean(b.name, 200)
  const email = clean(b.email, 200)
  const company = clean(b.company, 200)
  const { roles: syncedRoles } = await getPlacementStats()
  const s = calcSavings(clean(b.roleId, 100), clean(b.region, 50), b.team, syncedRoles)
  if (!name || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter your name and a valid email.' })
  }
  if (!s) return res.status(400).json({ error: 'Please choose a role and team location.' })
  if (rateLimited(req.ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const summary = `Savings calculator: ${s.team} × ${s.roleLabel}, ${s.regionLabel}. ` +
    `US ${money(s.usTotal)}/yr vs GKP ${money(s.gkpTotal)}/yr = ${money(s.savings)} saved (${s.savingsPct}%).`

  let id = null
  if (pool) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO contact_requests
          (name, email, business_name, interest, message, ip, user_agent)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [name, email, company || '—', 'Savings calculator', summary, req.ip,
         clean(req.get('user-agent'), 500)])
      id = rows[0].id
    } catch (err) {
      console.error('DB insert failed:', err.message)
    }
  }

  const sender = personalSender()
  const report = await resendSend({
    to: email,
    from: sender.from,
    replyTo: sender.replyTo,
    subject: `Your GKP savings estimate: ${money(s.savings)} per year`,
    html: savingsReportHtml(name, s),
  })
  const notify = await resendSend({
    subject: `Savings calculator lead: ${name}${company ? ' – ' + company : ''}`,
    replyTo: email,
    html: notificationHtml({ name, email, businessName: company, interest: 'Savings calculator', message: summary }),
  })
  console.log(`Savings report to ${email}: saved=${id !== null}, report ${report.ok ? 'OK' : 'FAILED'} - ${report.detail}; notify ${notify.ok ? 'OK' : 'FAILED'}`)

  if (id !== null) {
    await pool.query(
      'UPDATE contact_requests SET email_status=$1, email_detail=$2 WHERE id=$3',
      [notify.ok ? 'sent' : 'failed',
       `Notification: ${notify.detail} | Report to visitor: ${report.ok ? 'sent' : 'FAILED'} - ${report.detail}`.slice(0, 1000), id]
    ).catch((err) => console.error('Email status update failed:', err.message))
  }

  if (!report.ok) {
    return res.status(502).json({ error: 'Sorry, we could not send the email right now. Please try again or email gary@gkpsolutions.net.' })
  }
  res.json({ ok: true })
})

// Live data from the GKP Placements app for the Savings Calculator:
//  - countries: share of current placements by country (percentages only, never counts)
//  - roles: job titles currently placed, added to the calculator's Role dropdown
// Needs PLACEMENTS_STATS_URL (e.g. https://<placements-app>/api/public/placement-countries)
// and PLACEMENTS_STATS_TOKEN (same value as PUBLIC_STATS_TOKEN on the placements app).
// Refreshed at most once an hour; if the app can't be reached, the last good copy is used.
let placementCache = { at: 0, data: null }
async function getPlacementStats() {
  const empty = { countries: [], roles: [], snapshot: { countries: 0, clients: 0 } }
  const url = (process.env.PLACEMENTS_STATS_URL || '').trim()
  const token = (process.env.PLACEMENTS_STATS_TOKEN || '').trim()
  if (!url || !token) return empty
  if (placementCache.data && Date.now() - placementCache.at < 60 * 60 * 1000) return placementCache.data
  try {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const { countries = [], total = 0, roles = [], clients_served: clients = 0 } = await r.json()
    const TOP = 6
    const top = countries.slice(0, TOP)
    const rest = countries.slice(TOP).reduce((n, c) => n + c.count, 0)
    const rows = [...top, ...(rest ? [{ country: 'Other countries', count: rest }] : [])]
    const data = {
      countries: total
        ? rows.map((c) => ({ country: String(c.country).slice(0, 40), share: Math.max(1, Math.round((c.count / total) * 100)) }))
        : [],
      roles: cleanSyncedTitles(roles),
      // Homepage "talent snapshot": numbers only
      snapshot: { countries: countries.length, clients: Number(clients) || 0 },
    }
    placementCache = { at: Date.now(), data }
    return data
  } catch (err) {
    console.error('Placement stats unavailable:', err.message)
    return placementCache.data || empty
  }
}

const sendPlacementStats = async (req, res) => res.json(await getPlacementStats())
app.get('/api/placement-stats', sendPlacementStats)
app.get('/api/placement-countries', sendPlacementStats) // older name, kept so nothing breaks

// Website leads for the Sales page in the GKP Placements app.
// GET /api/leads?after=<id> returns contact-form and Savings Calculator submissions newer than <id>.
// Protected by the same secret as the placement stats (PLACEMENTS_STATS_TOKEN here,
// PUBLIC_STATS_TOKEN on the placements app); without it the endpoint is turned off.
app.get('/api/leads', async (req, res) => {
  res.set('Cache-Control', 'no-store')
  const token = (process.env.PLACEMENTS_STATS_TOKEN || '').trim()
  const given = (req.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
  const crypto = require('crypto')
  const same = (a, b) => crypto.timingSafeEqual(
    crypto.createHash('sha256').update(a).digest(), crypto.createHash('sha256').update(b).digest())
  if (!token || !given || !same(given, token)) return res.status(404).json({ error: 'Not found' })
  if (!pool) return res.json({ leads: [] })
  const after = Math.max(0, parseInt(req.query.after, 10) || 0)
  try {
    const { rows } = await pool.query(
      `SELECT id, created_at, name, email, phone, business_name, job_title, location, interest, message, ref
       FROM contact_requests WHERE id > $1 ORDER BY id ASC LIMIT 200`, [after])
    res.json({ leads: rows })
  } catch (err) {
    console.error('Leads export failed:', err.message)
    res.status(500).json({ error: 'Could not read leads' })
  }
})

// Settings the static pages need at runtime (set in Railway > Variables, no rebuild needed).
app.get('/api/site-config', (req, res) => {
  const url = (process.env.BOOKINGS_URL || '').trim()
  res.set('Cache-Control', 'no-store')
  res.json({ bookingsUrl: /^https:\/\/[^\s"'<>]+$/.test(url) ? url : '' })
})

// --- CIO Roundtable ------------------------------------------------------------
// Sessions are scheduled in the GKP Placements app (Roundtable tab). This server reads them with
// the same secret as the placement stats, caches them for 5 minutes, and never shows the meeting link
// publicly - it's only emailed to people who register.
let rtCache = { at: 0, sessions: null }
function placementsOrigin() {
  try { return new URL((process.env.PLACEMENTS_STATS_URL || '').trim()).origin } catch (e) { return '' }
}
async function getRoundtableSessions(fresh) {
  const origin = placementsOrigin()
  const token = (process.env.PLACEMENTS_STATS_TOKEN || '').trim()
  if (!origin || !token) return []
  if (!fresh && rtCache.sessions && Date.now() - rtCache.at < 5 * 60 * 1000) return rtCache.sessions
  try {
    const r = await fetch(`${origin}/roundtable/api/public`, {
      headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const { sessions = [] } = await r.json()
    rtCache = { at: Date.now(), sessions: Array.isArray(sessions) ? sessions : [] }
    return rtCache.sessions
  } catch (err) {
    console.error('Roundtable sessions unavailable:', err.message)
    return rtCache.sessions || []
  }
}

app.get('/api/roundtable-sessions', async (req, res) => {
  const sessions = await getRoundtableSessions(false)
  res.set('Cache-Control', 'no-store')
  res.json({ sessions: sessions.map(({ join_url, ...pub }) => pub) })
})

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsText = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => '\\' + c).replace(/\r?\n/g, '\\n')
function roundtableIcs(s, organizerEmail) {
  const start = new Date(s.starts_at)
  const end = new Date(start.getTime() + (s.duration_min || 60) * 60000)
  const desc = [s.summary, s.join_url ? `Join: ${s.join_url}` : 'The meeting link will be emailed before the session.'].filter(Boolean).join('\n\n')
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GKP Solutions//CIO Roundtable//EN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT', `UID:gkp-roundtable-${s.id}@gkpsolutions.net`, `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`, `SUMMARY:${icsText('GKP CIO Roundtable: ' + s.title)}`,
    `DESCRIPTION:${icsText(desc)}`, `LOCATION:${icsText(s.join_url || 'Virtual')}`,
    `ORGANIZER;CN=Gary Peck:mailto:${organizerEmail}`, 'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n')
}
function roundtableWhen(s) {
  const d = new Date(s.starts_at)
  const fmt = (tz) => d.toLocaleString('en-US', { timeZone: tz, weekday: 'long', month: 'long', day: 'numeric',
    year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
  return `${fmt('America/Chicago')} (${d.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })})`
}

app.post('/api/roundtable-register', async (req, res) => {
  const b = req.body || {}
  if (clean(b.website, 200)) return res.json({ ok: true }) // honeypot
  const r = {
    name: clean(b.name, 200), email: clean(b.email, 200), company: clean(b.company, 200),
    jobTitle: clean(b.jobTitle, 200), sessionId: parseInt(b.sessionId, 10),
  }
  if (!r.name || !r.company || !EMAIL_RE.test(r.email)) {
    return res.status(400).json({ error: 'Please enter your name, a valid work email and your company.' })
  }
  // No session picked: join the invite list for future Roundtables
  if (b.notify === true && !Number.isFinite(r.sessionId)) {
    if (rateLimited(req.ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    let id = null
    if (pool) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO contact_requests (name, email, business_name, job_title, interest, message, ref, ip, user_agent)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
          [r.name, r.email, r.company, r.jobTitle, 'CIO Roundtable',
           'Asked to be invited to future CIO Roundtable sessions.', 'rt:list', req.ip, clean(req.get('user-agent'), 500)])
        id = rows[0].id
      } catch (err) { console.error('DB insert failed:', err.message) }
    }
    const sender = personalSender()
    const reply = await resendSend({
      to: r.email, from: sender.from, replyTo: sender.replyTo,
      subject: "You're on the GKP CIO Roundtable invite list",
      html: emailShell(`<p>Hi ${escapeHtml(firstName(r.name))},</p>
        <p>Thanks for your interest in the GKP CIO Roundtable. You're on the invite list, and I'll email you as soon as
          the next session is scheduled.</p>
        <p>If there's a topic you'd like us to cover, just reply and let me know.</p>`),
    })
    const notify = await resendSend({
      subject: `Roundtable invite list: ${r.name} – ${r.company}`, replyTo: r.email,
      html: notificationHtml({ name: r.name, email: r.email, businessName: r.company, jobTitle: r.jobTitle,
        interest: 'CIO Roundtable', message: 'Asked to be invited to future CIO Roundtable sessions.' }),
    })
    if (id === null && !reply.ok && !notify.ok) {
      return res.status(500).json({ error: 'Sorry, something went wrong. Please email gary@gkpsolutions.net.' })
    }
    return res.json({ ok: true })
  }

  let s = (await getRoundtableSessions(false)).find((x) => x.id === r.sessionId)
  if (!s) s = (await getRoundtableSessions(true)).find((x) => x.id === r.sessionId)
  if (!s) return res.status(400).json({ error: 'That session is no longer open. Please choose another.' })
  if (s.full) return res.status(400).json({ error: 'Sorry, that session is full.' })
  if (rateLimited(req.ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })

  const when = roundtableWhen(s)
  let id = null
  if (pool) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO contact_requests
          (name, email, business_name, job_title, interest, message, ref, ip, user_agent)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [r.name, r.email, r.company, r.jobTitle, 'CIO Roundtable',
         `Registered for the CIO Roundtable: "${s.title}" on ${when}.`, `rt:${s.id}`, req.ip,
         clean(req.get('user-agent'), 500)])
      id = rows[0].id
    } catch (err) {
      console.error('DB insert failed:', err.message)
    }
  }

  const sender = personalSender()
  const organizer = (sender.from.match(/<([^>]+)>/) || [])[1] || 'gary@gkpsolutions.net'
  const confirm = await resendSend({
    to: r.email, from: sender.from, replyTo: sender.replyTo,
    subject: `You're registered: GKP CIO Roundtable, ${new Date(s.starts_at).toLocaleDateString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric' })}`,
    html: emailShell(`
      <p>Hi ${escapeHtml(firstName(r.name))},</p>
      <p>You're registered for the <b>GKP CIO Roundtable</b>. I'm glad you're joining us.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px;border:1px solid #eceef2">
        ${savingsRow('Session', escapeHtml(s.title), true)}
        ${savingsRow('When', escapeHtml(when))}
        ${savingsRow('Length', `${s.duration_min || 60} minutes`)}
        ${savingsRow('Where', 'Virtual')}
      </table>
      ${s.join_url
        ? `<p style="margin-top:18px"><a href="${escapeHtml(s.join_url)}" style="display:inline-block;background:#ff5d22;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold">Join link</a></p>`
        : '<p style="margin-top:18px">I\'ll email you the meeting link before the session.</p>'}
      <p>A calendar invite is attached. If you can no longer attend, just reply and let me know.</p>`),
    attachments: [{ filename: 'gkp-cio-roundtable.ics',
      content: Buffer.from(roundtableIcs(s, organizer)).toString('base64') }],
  })
  if (id === null && !confirm.ok) {
    return res.status(500).json({ error: 'Sorry, we could not complete your registration. Please email gary@gkpsolutions.net.' })
  }
  const notify = await resendSend({
    subject: `Roundtable registration: ${r.name} – ${r.company}`,
    replyTo: r.email,
    html: notificationHtml({ name: r.name, email: r.email, businessName: r.company, jobTitle: r.jobTitle,
      interest: 'CIO Roundtable', message: `Registered for "${s.title}" on ${when}.` }),
  })
  console.log(`Roundtable registration ${r.email} for #${s.id}: saved=${id !== null}, confirm ${confirm.ok ? 'OK' : 'FAILED'} - ${confirm.detail}; notify ${notify.ok ? 'OK' : 'FAILED'}`)
  if (id !== null) {
    await pool.query('UPDATE contact_requests SET email_status=$1, email_detail=$2 WHERE id=$3',
      [notify.ok ? 'sent' : 'failed',
       `Notification: ${notify.detail} | Confirmation: ${confirm.ok ? 'sent' : 'FAILED'} - ${confirm.detail}`.slice(0, 1000), id])
      .catch((err) => console.error('Email status update failed:', err.message))
  }
  res.json({ ok: true, hasLink: Boolean(s.join_url) })
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
