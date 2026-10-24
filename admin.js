// Password-protected admin page for contact submissions: /admin
const crypto = require('crypto')
const express = require('express')

module.exports = function adminRouter({ pool, config, resendSend, escapeHtml: h }) {
  const router = express.Router()
  router.use(express.urlencoded({ extended: false, limit: '10kb' }))

  // --- security -------------------------------------------------------------
  const safeEqual = (a, b) => {
    const x = crypto.createHash('sha256').update(String(a)).digest()
    const y = crypto.createHash('sha256').update(String(b)).digest()
    return crypto.timingSafeEqual(x, y)
  }
  const failures = new Map() // ip -> [timestamps] to slow down password guessing

  router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    res.set('X-Robots-Tag', 'noindex, nofollow')
    const password = process.env.ADMIN_PASSWORD
    if (!password) {
      return res.status(503).send('Admin page is turned off. Add an ADMIN_PASSWORD variable in Railway to enable it.')
    }
    const now = Date.now()
    const recent = (failures.get(req.ip) || []).filter((t) => now - t < 15 * 60 * 1000)
    if (recent.length >= 10) return res.status(429).send('Too many failed logins. Try again in 15 minutes.')

    const [scheme, encoded] = (req.get('authorization') || '').split(' ')
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString()
      const i = decoded.indexOf(':')
      const user = decoded.slice(0, i)
      const pass = decoded.slice(i + 1)
      if (safeEqual(user, process.env.ADMIN_USER || 'admin') && safeEqual(pass, password)) return next()
      recent.push(now)
      failures.set(req.ip, recent)
    }
    res.set('WWW-Authenticate', 'Basic realm="GKP Admin", charset="UTF-8"')
    res.status(401).send('Login required.')
  })

  // Block cross-site form posts
  router.use((req, res, next) => {
    if (req.method !== 'POST') return next()
    const origin = req.get('origin') || req.get('referer') || ''
    if (origin) {
      try {
        if (new URL(origin).host !== req.get('host')) return res.status(403).send('Bad origin.')
      } catch (e) {
        return res.status(403).send('Bad origin.')
      }
    }
    next()
  })

  router.use((req, res, next) => {
    if (!pool) return res.status(503).send('DATABASE_URL is not set on this service, so there are no submissions to show.')
    next()
  })

  // --- pages ----------------------------------------------------------------
  const fmtDate = (d) =>
    new Date(d).toLocaleString('en-US', {
      timeZone: 'America/Chicago', month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    })

  const page = (body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>GKP Admin – Contact Requests</title>
<style>
  :root{--accent:#ff5d22;--ink:#1f2430;--muted:#6b7280;--line:#e5e7eb;--bg:#f6f7f9;--ok:#15803d;--bad:#b91c1c}
  *{box-sizing:border-box} body{margin:0;font:15px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg)}
  header{background:#fff;border-bottom:1px solid var(--line);padding:14px 16px}
  .wrap{max-width:1000px;margin:0 auto;padding:0 16px}
  header .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:0}
  h1{font-size:20px;margin:0} a{color:var(--accent)}
  .tabs{display:flex;gap:6px;flex-wrap:wrap;margin:18px 0 12px}
  .tabs a{padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--ink);text-decoration:none;font-size:14px}
  .tabs a.on{background:var(--ink);color:#fff;border-color:var(--ink)}
  .card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:12px}
  .card.new{border-left:4px solid var(--accent)}
  .top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
  .name{font-weight:700;font-size:16px} .muted{color:var(--muted);font-size:13px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:4px 16px;margin:10px 0}
  .msg{white-space:pre-wrap;background:var(--bg);border-radius:8px;padding:10px 12px;margin:8px 0}
  .pill{display:inline-block;font-size:12px;padding:2px 8px;border-radius:999px;background:var(--bg);border:1px solid var(--line)}
  .pill.new{background:#fff1eb;border-color:#ffd2bf;color:#b4410f}
  .ok{color:var(--ok)} .bad{color:var(--bad)}
  button,.btn{font:inherit;font-size:14px;padding:6px 12px;border-radius:6px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--ink);text-decoration:none;display:inline-block}
  button.primary{background:var(--accent);border-color:var(--accent);color:#fff}
  .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .panel{background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin-top:18px}
  .panel code{background:var(--bg);padding:1px 5px;border-radius:4px;word-break:break-all}
  .flash{border-radius:8px;padding:10px 12px;margin-top:14px;word-break:break-word}
  .flash.ok{background:#ecfdf3;border:1px solid #bbf7d0} .flash.bad{background:#fef2f2;border:1px solid #fecaca}
  .empty{text-align:center;color:var(--muted);padding:40px 0}
  details summary{cursor:pointer;color:var(--muted);font-size:13px}
</style></head><body>${body}</body></html>`

  router.get('/', async (req, res, next) => {
    try {
      const filter = ['new', 'handled', 'all'].includes(req.query.filter) ? req.query.filter : 'new'
      const where = filter === 'all' ? '' : 'WHERE status = $1'
      const { rows } = await pool.query(
        `SELECT * FROM contact_requests ${where} ORDER BY created_at DESC LIMIT 500`,
        filter === 'all' ? [] : [filter])
      const counts = Object.fromEntries(
        (await pool.query('SELECT status, COUNT(*)::int n FROM contact_requests GROUP BY status')).rows
          .map((r) => [r.status, r.n]))
      const total = Object.values(counts).reduce((a, b) => a + b, 0)
      const c = config()

      let flash = ''
      if (req.query.test) {
        const ok = req.query.test === 'ok'
        flash = `<div class="flash ${ok ? 'ok' : 'bad'}"><b>${ok ? 'Test email accepted.' : 'Test email failed.'}</b> ${h(req.query.detail || '')}
          ${ok ? '<br><span class="muted">If it does not arrive within a few minutes, check your spam/junk folder and the Emails log in your Resend dashboard.</span>' : ''}</div>`
      }

      const cards = rows.map((r) => `
        <div class="card ${r.status === 'new' ? 'new' : ''}">
          <div class="top">
            <div>
              <div class="name">${h(r.name)} <span class="muted">· ${h(r.business_name)}</span></div>
              <div class="muted">${fmtDate(r.created_at)} · #${r.id}</div>
            </div>
            <div class="row">
              <span class="pill ${r.status === 'new' ? 'new' : ''}">${r.status === 'new' ? 'New' : 'Handled'}</span>
              <form method="post" action="/admin/${r.id}/status">
                <input type="hidden" name="status" value="${r.status === 'new' ? 'handled' : 'new'}">
                <input type="hidden" name="back" value="${filter}">
                <button>${r.status === 'new' ? 'Mark handled' : 'Mark as new'}</button>
              </form>
            </div>
          </div>
          <div class="grid">
            <div><span class="muted">Email</span><br><a href="mailto:${h(r.email)}">${h(r.email)}</a></div>
            <div><span class="muted">Phone</span><br>${r.phone ? `<a href="tel:${h(r.phone)}">${h(r.phone)}</a>` : '—'}</div>
            <div><span class="muted">Job title</span><br>${h(r.job_title || '—')}</div>
            <div><span class="muted">Location</span><br>${h(r.location || '—')}</div>
            <div><span class="muted">Interested in</span><br>${h(r.interest || '—')}</div>
          </div>
          <div class="msg">${h(r.message)}</div>
          <details><summary>Email notification:
            ${r.email_status === 'sent' ? '<span class="ok">sent</span>' : r.email_status === 'failed' ? '<span class="bad">failed</span>' : 'not recorded'}</summary>
            <div class="muted" style="margin-top:6px;word-break:break-word">${h(r.email_detail || 'Submitted before email tracking was added.')}</div>
          </details>
        </div>`).join('')

      res.send(page(`
        <header><div class="wrap">
          <h1>Contact Requests</h1>
          <div class="row"><a class="btn" href="/admin/export.csv">Download CSV</a><a class="btn" href="/">View site</a></div>
        </div></header>
        <main class="wrap">
          ${flash}
          <nav class="tabs">
            <a class="${filter === 'new' ? 'on' : ''}" href="/admin?filter=new">New (${counts.new || 0})</a>
            <a class="${filter === 'handled' ? 'on' : ''}" href="/admin?filter=handled">Handled (${counts.handled || 0})</a>
            <a class="${filter === 'all' ? 'on' : ''}" href="/admin?filter=all">All (${total})</a>
          </nav>
          ${cards || `<div class="empty">No ${filter === 'all' ? '' : filter + ' '}requests.</div>`}

          <div class="panel">
            <b>Email notifications</b>
            <div class="grid">
              <div><span class="muted">Resend API key</span><br>${c.apiKey ? `<span class="ok">Set</span> <span class="muted">(${h(c.apiKey.slice(0, 5))}…)</span>` : '<span class="bad">Missing</span>'}</div>
              <div><span class="muted">From</span><br><code>${h(c.from)}</code></div>
              <div><span class="muted">To</span><br><code>${h(c.notify.join(', '))}</code></div>
            </div>
            <form method="post" action="/admin/test-email"><button class="primary">Send test email</button>
              <span class="muted">Shows Resend's exact response.</span></form>
          </div>
          <p class="muted" style="margin:18px 0 30px">Times shown in Central Time.</p>
        </main>`))
    } catch (err) {
      next(err)
    }
  })

  router.post('/:id(\\d+)/status', async (req, res, next) => {
    try {
      const status = req.body.status === 'handled' ? 'handled' : 'new'
      await pool.query('UPDATE contact_requests SET status=$1 WHERE id=$2', [status, req.params.id])
      const back = ['new', 'handled', 'all'].includes(req.body.back) ? req.body.back : 'new'
      res.redirect(303, `/admin?filter=${back}`)
    } catch (err) {
      next(err)
    }
  })

  router.post('/test-email', async (req, res) => {
    const r = await resendSend({
      subject: 'Test email from your GKP website',
      html: '<p>This is a test notification from the GKP Solutions website admin page. If you can read this, contact-form emails are working.</p>',
    })
    console.log(`Admin test email: ${r.ok ? 'OK' : 'FAILED'} - ${r.detail}`)
    res.redirect(303, `/admin?test=${r.ok ? 'ok' : 'fail'}&detail=${encodeURIComponent(r.detail.slice(0, 600))}`)
  })

  router.get('/export.csv', async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, created_at, status, name, email, phone, business_name, job_title, location, interest, message
         FROM contact_requests ORDER BY created_at DESC`)
      const cols = ['id', 'created_at', 'status', 'name', 'email', 'phone', 'business_name', 'job_title', 'location', 'interest', 'message']
      const cell = (v) => {
        let s = v instanceof Date ? v.toISOString() : String(v == null ? '' : v)
        if (/^[=+\-@]/.test(s)) s = "'" + s // stop spreadsheet formula injection
        return `"${s.replace(/"/g, '""')}"`
      }
      const csv = [cols.join(','), ...rows.map((r) => cols.map((k) => cell(r[k])).join(','))].join('\r\n')
      res.set('Content-Type', 'text/csv; charset=utf-8')
      res.set('Content-Disposition', `attachment; filename="gkp-contact-requests-${new Date().toISOString().slice(0, 10)}.csv"`)
      res.send('﻿' + csv)
    } catch (err) {
      next(err)
    }
  })

  router.use((err, req, res, next) => {
    console.error('Admin error:', err.message)
    res.status(500).send('Something went wrong loading the admin page. Check the deploy logs.')
  })

  return router
}
