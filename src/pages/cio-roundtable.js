import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/App/Layout'
import Navbar from '../components/App/Navbar'
import Footer from '../components/App/Footer'
import { BOOKINGS_URL } from '../data/site'

// CIO Roundtable: lists upcoming virtual sessions scheduled in the GKP Placements app
// (via /api/roundtable-sessions) and registers people (/api/roundtable-register).
// With no sessions scheduled, visitors can join the invite list instead.

const ACCENT = '#ff5d22'
const card = { background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '24px', marginBottom: 20 }
const EMPTY = { name: '', email: '', company: '', jobTitle: '', website: '' }

function when(iso, minutes) {
  const d = new Date(iso)
  if (isNaN(d)) return { date: '', time: '', ct: '' }
  const end = new Date(d.getTime() + (minutes || 60) * 60000)
  const t = (x, tz) => x.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', ...(tz ? { timeZone: tz } : {}) })
  const zone = (tz) => (d.toLocaleTimeString('en-US', { timeZoneName: 'short', ...(tz ? { timeZone: tz } : {}) }).split(' ').pop())
  const local = Intl.DateTimeFormat().resolvedOptions().timeZone
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    date: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    time: `${t(d)} – ${t(end)} ${zone()}`,
    ct: local === 'America/Chicago' ? '' : `${t(d, 'America/Chicago')} ${zone('America/Chicago')} in Nashville`,
  }
}

function RegisterForm({ session, onDone }) {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState({ state: 'idle', text: '' })
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending', text: '' })
    try {
      const res = await fetch('/api/roundtable-register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session ? { ...form, sessionId: session.id } : { ...form, notify: true }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      onDone(form.email)
    } catch (err) {
      setStatus({ state: 'error', text: err.message || 'Sorry, something went wrong. Please try again.' })
    }
  }
  return (
    <form onSubmit={submit} style={{ marginTop: 16 }}>
      <div className='row'>
        <div className='col-lg-6 col-md-6'><div className='form-group'>
          <input type='text' name='name' className='form-control' required maxLength={200} placeholder='Your name *'
            autoComplete='name' value={form.name} onChange={update} /></div></div>
        <div className='col-lg-6 col-md-6'><div className='form-group'>
          <input type='email' name='email' className='form-control' required maxLength={200} placeholder='Work email *'
            autoComplete='email' value={form.email} onChange={update} /></div></div>
        <div className='col-lg-6 col-md-6'><div className='form-group'>
          <input type='text' name='company' className='form-control' required maxLength={200} placeholder='Company *'
            autoComplete='organization' value={form.company} onChange={update} /></div></div>
        <div className='col-lg-6 col-md-6'><div className='form-group'>
          <input type='text' name='jobTitle' className='form-control' maxLength={200} placeholder='Job title'
            autoComplete='organization-title' value={form.jobTitle} onChange={update} /></div></div>
        <div style={{ position: 'absolute', left: '-10000px' }} aria-hidden='true'>
          <input type='text' name='website' tabIndex='-1' autoComplete='off' value={form.website} onChange={update} />
        </div>
        <div className='col-12'>
          <button type='submit' className='default-btn' disabled={status.state === 'sending'}>
            <i className='flaticon-tick'></i>
            {status.state === 'sending' ? 'Sending...' : session ? 'Reserve my seat' : 'Add me to the invite list'}
            <span></span>
          </button>
          {status.state === 'error' && <p className='mt-3 text-danger'>{status.text}</p>}
        </div>
      </div>
    </form>
  )
}

const CioRoundtable = () => {
  const [sessions, setSessions] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [done, setDone] = useState({}) // session id (or 'list') -> email

  useEffect(() => {
    fetch('/api/roundtable-sessions')
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => setSessions(Array.isArray(d.sessions) ? d.sessions : []))
      .catch(() => setSessions([]))
  }, [])

  return (
    <Layout>
      <Navbar />
      <style>{`
        .rt-title { padding-top: 30px !important; padding-bottom: 24px !important; }
        @media (max-width: 991px) { .rt-title { padding-top: 20px !important; padding-bottom: 16px !important; } }
      `}</style>
      <div className='page-title-area rt-title'>
        <div className='container'>
          <div className='page-title-content'>
            <h2>CIO Roundtable</h2>
            <p className='mt-3'>
              Small, virtual conversations for technology leaders on building and running global teams:
              what works offshore and nearshore, what doesn't, and what peers are doing right now.
            </p>
          </div>
        </div>
      </div>

      <section className='pb-100'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-md-12'>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                {['Virtual, about an hour', 'Hosted by Gary Peck, Founder & CEO', 'Peer discussion, not a sales pitch', 'No cost to attend'].map((t) => (
                  <span key={t} style={{ padding: '6px 14px', borderRadius: 999, background: '#fff3ee', color: ACCENT, fontWeight: 600, fontSize: 14 }}>{t}</span>
                ))}
              </div>

              <h3 style={{ fontSize: 24, marginBottom: 16 }}>Upcoming sessions</h3>

              {sessions === null && <div style={{ ...card, color: '#6b7280' }}>Loading sessions…</div>}

              {sessions && sessions.map((s) => {
                const w = when(s.starts_at, s.duration_min)
                return (
                  <div key={s.id} style={card}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ width: 72, flex: 'none', textAlign: 'center', border: `2px solid ${ACCENT}`, borderRadius: 10, padding: '6px 0' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{w.month}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{w.day}</div>
                      </div>
                      <div style={{ flex: '1 1 300px' }}>
                        <h4 style={{ fontSize: 21, marginBottom: 4 }}>{s.title}</h4>
                        <div style={{ color: '#4b5563', fontSize: 15 }}>{w.date} · {w.time} · Virtual</div>
                        {w.ct && <div style={{ color: '#9ca3af', fontSize: 13 }}>{w.ct}</div>}
                        {s.summary && <p style={{ margin: '12px 0 0', whiteSpace: 'pre-wrap', color: '#4b5563' }}>{s.summary}</p>}
                        {s.speakers && <p style={{ margin: '8px 0 0', fontSize: 14, color: '#6b7280' }}><b>With:</b> {s.speakers}</p>}
                      </div>
                    </div>
                    {done[s.id] ? (
                      <p className='text-success' style={{ fontWeight: 600, margin: '16px 0 0' }}>
                        You're registered! A confirmation and calendar invite are on the way to {done[s.id]}.
                      </p>
                    ) : s.full ? (
                      <p style={{ margin: '16px 0 0', color: '#6b7280', fontWeight: 600 }}>This session is full.</p>
                    ) : openId === s.id ? (
                      <RegisterForm session={s} onDone={(email) => setDone({ ...done, [s.id]: email })} />
                    ) : (
                      <button type='button' className='default-btn' style={{ marginTop: 16 }} onClick={() => setOpenId(s.id)}>
                        <i className='flaticon-right'></i>Register<span></span>
                      </button>
                    )}
                  </div>
                )
              })}

              {sessions && sessions.length === 0 && (
                <div style={card}>
                  <h4 style={{ fontSize: 20 }}>No sessions on the calendar right now</h4>
                  <p style={{ color: '#4b5563', marginBottom: 0 }}>
                    Join the invite list and you'll be the first to hear when the next Roundtable is scheduled.
                  </p>
                  {done.list ? (
                    <p className='text-success' style={{ fontWeight: 600, margin: '16px 0 0' }}>
                      Thanks! You're on the list. We'll email {done.list} when the next session is set.
                    </p>
                  ) : (
                    <RegisterForm session={null} onDone={(email) => setDone({ ...done, list: email })} />
                  )}
                </div>
              )}

              <p style={{ fontSize: 14, color: '#6b7280' }}>
                Want to talk one-on-one instead? <a href={BOOKINGS_URL} target='_blank' rel='noopener noreferrer' style={{ color: ACCENT }}>Book a call with Gary</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  )
}

export default CioRoundtable
