import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/App/Layout'
import Navbar from '../components/App/Navbar'
import Footer from '../components/App/Footer'
import { rates, cleanSyncedTitles } from '../data/savings-calc'

// "Request Talent": a short, structured brief a hiring manager fills in.
// Posts to /api/talent-request (server.js), which emails Gary, sends the visitor a
// confirmation, and saves it so it shows up as a lead on the Sales page in GKP Placements.
// The Savings Calculator links here with ?role=&team=&loc= to pre-fill the form.

const ACCENT = '#ff5d22'

const SENIORITY = ['Junior', 'Mid-level', 'Senior', 'Lead / Architect', 'A mix']
const START = ['As soon as possible', 'Within 2 weeks', 'Within 30 days', 'In 1–3 months', 'Just exploring']
const ENGAGEMENT = ['Full-time contractor', 'Part-time', 'Project-based', 'Contract-to-hire', 'Not sure yet']
const LOCATIONS = ['Philippines', 'Latin America', 'India', 'Indonesia', 'UK / Europe', 'Canada', 'No preference']
const TIMEZONES = ['US Eastern', 'US Central', 'US Mountain', 'US Pacific', 'Flexible / async is fine']

// Extra roles people often ask for (on top of the calculator's roles and the titles
// GKP places today, which are loaded live from the Placements app).
const MORE_ROLES = [
  'AI Engineer', 'Android Developer', 'Angular Developer', 'Automation Engineer (RPA)', 'AWS Engineer',
  'Back-End Developer', 'BI / Power BI Developer', 'Blockchain Developer', 'Business Analyst', 'C# Developer',
  'Cloud Architect', 'Cloud Engineer', 'Cybersecurity Analyst', 'Data Analyst', 'Data Architect', 'Data Engineer',
  'Data Scientist', 'Database Administrator (DBA)', 'Delivery Manager', 'DevSecOps Engineer', 'Embedded Software Engineer',
  'Engineering Manager', 'ETL Developer', 'Flutter Developer', 'Front-End Developer', 'Full-Stack Developer',
  'Game Developer', 'GCP Engineer', 'Go (Golang) Developer', 'Help Desk / IT Support', 'iOS Developer',
  'IT Project Manager', 'Java Developer', 'JavaScript Developer', 'Kubernetes Engineer', 'Linux Administrator',
  'Low-Code / Power Platform Developer', 'Mobile Developer', 'Network Engineer', 'Node.js Developer',
  'PHP Developer', 'Product Designer (UI/UX)', 'Product Manager', 'Product Owner', 'Program Manager',
  'QA Automation Engineer', 'QA Engineer (manual testing)', 'React Developer', 'React Native Developer',
  'Ruby on Rails Developer', 'Salesforce Administrator', 'Salesforce Developer', 'SAP Consultant',
  'SDET', 'ServiceNow Developer', 'Snowflake Engineer', 'Solutions Architect', 'Systems Administrator',
  'Technical Writer', 'UI/UX Designer', 'Vue.js Developer', 'Workday Consultant',
]

// Searchable role picker: click to browse every role, type to filter, or type anything not listed.
// Several roles can be entered separated by commas; picking a suggestion fills in the one being typed.
function RolePicker({ value, onChange, synced }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const box = useRef(null)
  const groups = useMemo(() => {
    const seen = new Set()
    const uniq = (list) => list.filter((r) => { const k = r.toLowerCase(); if (!r || seen.has(k)) return false; seen.add(k); return true })
    return [
      ['Popular roles', uniq(rates.roles.map((r) => r.label))],
      ['Roles we place today', uniq(synced)],
      ['More roles', uniq([...((rates.families && rates.families.list) || []).map((r) => r.label), ...MORE_ROLES]).sort((a, b) => a.localeCompare(b))],
    ].filter(([, list]) => list.length)
  }, [synced])

  const parts = value.split(',')
  const typing = parts[parts.length - 1].trim().toLowerCase()
  const shown = typing
    ? [['Matching roles', groups.flatMap(([, l]) => l).filter((r) => r.toLowerCase().includes(typing)).slice(0, 40)]]
    : groups
  const flat = shown.flatMap(([, l]) => l)

  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('touchstart', close) }
  }, [])

  const choose = (role) => {
    const keep = parts.slice(0, -1).map((p) => p.trim()).filter(Boolean)
    onChange([...keep, role].join(', '))
    setOpen(false)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(flat.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    else if (e.key === 'Enter' && open && flat[active]) { e.preventDefault(); choose(flat[active]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  let i = -1
  return (
    <div ref={box} style={{ position: 'relative' }}>
      <input id='roles' type='text' name='roles' className='form-control' required maxLength={300} autoComplete='off'
        role='combobox' aria-expanded={open} aria-autocomplete='list' aria-controls='role-list'
        placeholder='Choose from the list or type any role' style={styles.select}
        value={value} onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onKeyDown={onKey}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(0) }} />
      {open && (
        <div id='role-list' role='listbox' style={styles.menu}>
          {flat.length === 0 && (
            <div style={{ padding: '10px 14px', fontSize: 14, color: '#6b7280' }}>
              Not in our list? No problem — just keep typing. We place many more roles.
            </div>
          )}
          {shown.map(([label, list]) => list.length > 0 && (
            <div key={label}>
              <div style={styles.menuHead}>{label}</div>
              {list.map((r) => { i += 1; const idx = i; return (
                <div key={label + r} role='option' aria-selected={idx === active}
                  onMouseDown={(e) => { e.preventDefault(); choose(r) }} onMouseEnter={() => setActive(idx)}
                  style={{ ...styles.menuItem, background: idx === active ? '#fff3ee' : '#fff', color: idx === active ? ACCENT : '#1f2430' }}>
                  {r}
                </div>
              ) })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const REGION_TO_LOCATION = {
  philippines: 'Philippines', argentina: 'Latin America', indonesia: 'Indonesia', india: 'India',
}

const EMPTY = {
  name: '', email: '', phone: '', company: '', jobTitle: '',
  roles: '', headcount: '1', seniority: '', start: '', engagement: '', locations: [],
  timezone: '', budget: '', details: '',
  website: '', // honeypot - must stay empty
}

const styles = {
  card: { background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '28px 24px', marginBottom: 24 },
  h3: { fontSize: 20, marginBottom: 4 },
  sub: { fontSize: 14, color: '#6b7280', marginBottom: 18 },
  label: { fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' },
  select: {
    appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
    background: "#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23ff5d22' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\") no-repeat right 16px center",
    border: '1px solid #cfd4dc', borderRadius: 8, paddingRight: 44, cursor: 'pointer',
  },
  menu: {
    position: 'absolute', zIndex: 20, top: 'calc(100% + 4px)', left: 0, right: 0, maxHeight: 320, overflowY: 'auto',
    background: '#fff', border: '1px solid #cfd4dc', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  menuHead: { padding: '8px 14px 4px', fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.4 },
  menuItem: { padding: '8px 14px', fontSize: 15, cursor: 'pointer' },
  chip: (on) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', margin: '0 8px 8px 0',
    borderRadius: 999, border: `1px solid ${on ? ACCENT : '#cfd4dc'}`, background: on ? '#fff3ee' : '#fff',
    color: on ? ACCENT : '#1f2430', fontWeight: on ? 600 : 500, fontSize: 14, cursor: 'pointer', userSelect: 'none',
  }),
}

const RequestTalent = () => {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState({ state: 'idle', text: '' })
  const [synced, setSynced] = useState([])

  // Job titles GKP places today, from the Placements app (same feed as the Savings Calculator)
  useEffect(() => {
    fetch('/api/placement-stats')
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => setSynced(cleanSyncedTitles(d.roles)))
      .catch(() => {})
  }, [])

  // Pre-fill from the Savings Calculator link (?role=...&team=...&loc=...)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const q = new URLSearchParams(window.location.search)
    const role = (q.get('role') || '').slice(0, 120)
    const team = (q.get('team') || '').replace(/\D/g, '').slice(0, 2)
    const loc = REGION_TO_LOCATION[(q.get('loc') || '').toLowerCase()]
    if (role || team || loc) {
      setForm((f) => ({ ...f, roles: role || f.roles, headcount: team || f.headcount, locations: loc ? [loc] : f.locations }))
    }
  }, [])

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const toggleLocation = (loc) => {
    const has = form.locations.includes(loc)
    let next = has ? form.locations.filter((l) => l !== loc) : [...form.locations, loc]
    if (!has && loc === 'No preference') next = ['No preference']
    else if (!has) next = next.filter((l) => l !== 'No preference')
    setForm({ ...form, locations: next })
  }

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending', text: '' })
    try {
      const res = await fetch('/api/talent-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus({ state: 'sent', text: form.email })
      setForm(EMPTY)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setStatus({ state: 'error', text: err.message || 'Sorry, we could not send your request. Please email gary@gkpsolutions.net.' })
    }
  }

  const select = (name, options, placeholder) => (
    <select name={name} className='form-control' style={styles.select} value={form[name]} onChange={update}>
      <option value=''>{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )

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
            <h2>Request Talent</h2>
            <p className='mt-3'>
              Tell us who you need. We'll come back within one business day with rates, timing and
              how we'd find the right people.
            </p>
          </div>
        </div>
      </div>

      <section className='pb-100'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-md-12'>
              {status.state === 'sent' ? (
                <div style={{ ...styles.card, borderTop: `4px solid ${ACCENT}` }}>
                  <h3 style={{ fontSize: 24 }}>Thank you, your request is in.</h3>
                  <p style={{ color: '#4b5563', marginBottom: 8 }}>
                    I'll review it personally and get back to you within one business day. A copy of your request
                    is on its way to <b>{status.text}</b>.
                  </p>
                  <p style={{ color: '#4b5563', marginBottom: 20 }}>— Gary Peck, Founder &amp; CEO</p>
                  <button type='button' className='default-btn' onClick={() => setStatus({ state: 'idle', text: '' })}>
                    <i className='flaticon-right'></i>Request another role<span></span>
                  </button>
                  <Link className='default-btn ml-2' to='/book-a-call' style={{ background: '#1f2430' }}>
                    <i className='flaticon-right'></i>Book a call now<span></span>
                  </Link>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div style={styles.card}>
                    <h3 style={styles.h3}>1. The role</h3>
                    <p style={styles.sub}>The more you share, the faster we can match people.</p>
                    <div className='row'>
                      <div className='col-lg-8 col-md-12'>
                        <div className='form-group'>
                          <label style={styles.label} htmlFor='roles'>Role(s) you need *</label>
                          <RolePicker value={form.roles} synced={synced}
                            onChange={(v) => setForm((f) => ({ ...f, roles: v }))} />
                          <span style={{ fontSize: 13, color: '#6b7280', display: 'block', marginTop: 6 }}>
                            Not listed? Type it in. Need several roles? Separate them with commas.
                          </span>
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-12'>
                        <div className='form-group'>
                          <label style={styles.label} htmlFor='headcount'>How many people? *</label>
                          <input id='headcount' type='number' name='headcount' className='form-control' required
                            min='1' max='200' value={form.headcount} onChange={update} />
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-6'>
                        <div className='form-group'>
                          <label style={styles.label}>Seniority</label>
                          {select('seniority', SENIORITY, 'Select…')}
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-6'>
                        <div className='form-group'>
                          <label style={styles.label}>Ideal start</label>
                          {select('start', START, 'Select…')}
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-12'>
                        <div className='form-group'>
                          <label style={styles.label}>Engagement</label>
                          {select('engagement', ENGAGEMENT, 'Select…')}
                        </div>
                      </div>
                      <div className='col-12'>
                        <div className='form-group'>
                          <label style={styles.label} htmlFor='details'>Key skills and details</label>
                          <textarea id='details' name='details' className='form-control' rows='5' maxLength={5000}
                            placeholder='Tech stack, must-have skills, what the team works on, interview steps… You can also paste a job description.'
                            value={form.details} onChange={update} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.card}>
                    <h3 style={styles.h3}>2. Location and budget</h3>
                    <p style={styles.sub}>Pick any that work. GKP deploys talent in 150+ countries.</p>
                    <div style={{ marginBottom: 14 }} role='group' aria-label='Preferred locations'>
                      {LOCATIONS.map((loc) => {
                        const on = form.locations.includes(loc)
                        return (
                          <span key={loc} role='checkbox' aria-checked={on} tabIndex={0} style={styles.chip(on)}
                            onClick={() => toggleLocation(loc)}
                            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleLocation(loc) } }}>
                            {on ? '✓' : '+'} {loc}
                          </span>
                        )
                      })}
                    </div>
                    <div className='row'>
                      <div className='col-lg-6 col-md-12'>
                        <div className='form-group'>
                          <label style={styles.label}>Working hours should overlap with</label>
                          {select('timezone', TIMEZONES, 'Select…')}
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-12'>
                        <div className='form-group'>
                          <label style={styles.label} htmlFor='budget'>Budget (optional)</label>
                          <input id='budget' type='text' name='budget' className='form-control' maxLength={100}
                            placeholder='e.g. $35/hr per person, or $250k/yr total' value={form.budget} onChange={update} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.card}>
                    <h3 style={styles.h3}>3. Your details</h3>
                    <p style={styles.sub}>So we know who to get back to.</p>
                    <div className='row'>
                      <div className='col-lg-6 col-md-6'>
                        <div className='form-group'>
                          <input type='text' name='name' className='form-control' required maxLength={200}
                            placeholder='Your name *' autoComplete='name' value={form.name} onChange={update} />
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-6'>
                        <div className='form-group'>
                          <input type='email' name='email' className='form-control' required maxLength={200}
                            placeholder='Work email *' autoComplete='email' value={form.email} onChange={update} />
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-6'>
                        <div className='form-group'>
                          <input type='text' name='company' className='form-control' required maxLength={200}
                            placeholder='Company *' autoComplete='organization' value={form.company} onChange={update} />
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-6'>
                        <div className='form-group'>
                          <input type='text' name='jobTitle' className='form-control' maxLength={200}
                            placeholder='Your job title' autoComplete='organization-title' value={form.jobTitle} onChange={update} />
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-12'>
                        <div className='form-group'>
                          <input type='tel' name='phone' className='form-control' maxLength={50}
                            placeholder='Phone' autoComplete='tel' value={form.phone} onChange={update} />
                        </div>
                      </div>

                      {/* Honeypot field: hidden from people, catches spam bots */}
                      <div style={{ position: 'absolute', left: '-10000px' }} aria-hidden='true'>
                        <input type='text' name='website' tabIndex='-1' autoComplete='off' value={form.website} onChange={update} />
                      </div>

                      <div className='col-12'>
                        <button type='submit' className='default-btn' disabled={status.state === 'sending'}>
                          <i className='flaticon-tick'></i>
                          {status.state === 'sending' ? 'Sending...' : 'Send my request'}
                          <span></span>
                        </button>
                        {status.state === 'error' && <p className='mt-3 text-danger'>{status.text}</p>}
                        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 12, marginBottom: 0 }}>
                          No commitment. We only use your details to respond to this request.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  )
}

export default RequestTalent
