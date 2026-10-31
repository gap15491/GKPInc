import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/App/Layout'
import Navbar from '../components/App/Navbar'
import Footer from '../components/App/Footer'
import { rates, calcSavings, cleanSyncedTitles, money, MAX_TEAM, SYNCED_PREFIX } from '../data/savings-calc'

const ACCENT = '#ff5d22'

const styles = {
  card: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    padding: '28px 24px',
    marginBottom: 24,
  },
  label: { fontWeight: 600, marginBottom: 2, display: 'block' },
  hint: { fontSize: 13, color: '#6b7280', marginBottom: 8, display: 'block' },
  // Makes the dropdowns look clickable: white box, border and a down-arrow on the right
  select: {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    background: "#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23ff5d22' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\") no-repeat right 16px center",
    border: '1px solid #cfd4dc',
    borderRadius: 8,
    paddingRight: 44,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  stat: {
    borderRadius: 10,
    padding: '18px 16px',
    height: '100%',
    border: '1px solid #eceef2',
    background: '#f8f9fb',
  },
  statLabel: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  statValue: { fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: '#1f2430' },
}

const SavingsCalculator = () => {
  const [roleId, setRoleId] = useState(rates.roles[0].id)
  const [region, setRegion] = useState('philippines')
  const [team, setTeam] = useState('1')
  const [lead, setLead] = useState({ name: '', email: '', company: '', website: '' })
  const [status, setStatus] = useState({ state: 'idle', text: '' })
  const [placed, setPlaced] = useState([])
  const [syncedRoles, setSyncedRoles] = useState([])

  // Live data from the GKP Placements app (via server.js): where talent is placed today,
  // and the job titles currently placed (added to the Role dropdown)
  useEffect(() => {
    fetch('/api/placement-stats')
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => {
        setPlaced(Array.isArray(d.countries) ? d.countries : [])
        setSyncedRoles(cleanSyncedTitles(d.roles))
      })
      .catch(() => {})
  }, [])

  const result = calcSavings(roleId, region, team, syncedRoles)

  const setTeamSafe = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 2)
    setTeam(digits)
  }
  const bump = (d) => {
    const n = Math.min(MAX_TEAM, Math.max(1, (parseInt(team, 10) || 1) + d))
    setTeam(String(n))
  }
  const updateLead = (e) => setLead({ ...lead, [e.target.name]: e.target.value })

  const sendReport = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending', text: '' })
    try {
      const res = await fetch('/api/savings-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, roleId, region, team: result ? result.team : team }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus({
        state: 'sent',
        text: `Done! Your savings breakdown is on its way to ${lead.email}.`,
      })
    } catch (err) {
      setStatus({ state: 'error', text: err.message || 'Sorry, something went wrong. Please try again.' })
    }
  }

  return (
    <Layout>
      <Navbar />

      <style>{`
        .calc-title { padding-top: 30px !important; padding-bottom: 24px !important; }
        @media (max-width: 991px) { .calc-title { padding-top: 20px !important; padding-bottom: 16px !important; } }
      `}</style>
      <div className='page-title-area calc-title'>
        <div className='container'>
          <div className='page-title-content'>
            <h2>Global Savings Calculator</h2>
            <p className='mt-3'>
              See what a GKP global team could save you compared with hiring in the US.
            </p>
          </div>
        </div>
      </div>

      <section className='pb-100'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-md-12'>

              <div style={styles.card}>
                <div className='row'>
                  <div className='col-lg-6 col-md-12 mb-4'>
                    <label htmlFor='role' style={styles.label}>Role</label>
                    <span style={styles.hint}>Select a role from the list below</span>
                    <select id='role' className='form-control' style={styles.select} value={roleId}
                      onChange={(e) => setRoleId(e.target.value)}>
                      <optgroup label='Popular roles'>
                        {rates.roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </optgroup>
                      {syncedRoles.length > 0 && (
                        <optgroup label='Roles we place today'>
                          {syncedRoles.map((t) => (
                            <option key={t} value={SYNCED_PREFIX + t}>{t}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                  <div className='col-lg-6 col-md-12 mb-4'>
                    <label htmlFor='team' style={styles.label}>Team size</label>
                    <span style={styles.hint}>How many people do you need?</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type='button' className='form-control' aria-label='Fewer people'
                        style={{ width: 56, flex: 'none', fontSize: 22, padding: 0 }} onClick={() => bump(-1)}>−</button>
                      <input id='team' type='text' inputMode='numeric' className='form-control'
                        style={{ textAlign: 'center' }} value={team}
                        onChange={(e) => setTeamSafe(e.target.value)}
                        onBlur={() => setTeam(String(result ? result.team : 1))} />
                      <button type='button' className='form-control' aria-label='More people'
                        style={{ width: 56, flex: 'none', fontSize: 22, padding: 0 }} onClick={() => bump(1)}>+</button>
                    </div>
                  </div>
                  <div className='col-12'>
                    <label htmlFor='region' style={styles.label}>Where would your team be?</label>
                    <span style={styles.hint}>Select a location from the list below</span>
                    <select id='region' className='form-control' style={styles.select} value={region}
                      onChange={(e) => setRegion(e.target.value)}>
                      {Object.entries(rates.regions).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <p style={{ margin: '10px 0 0', fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
                      <i className='bx bx-world' style={{ color: ACCENT, marginRight: 6 }}></i>
                      These are our leading locations today. GKP also deploys talent in{' '}
                      <b style={{ color: '#1f2430' }}>150+ other countries</b>.{' '}
                      <Link to='/contact'>Ask us about any location</Link>.
                    </p>

                    {placed.length > 0 && (
                      <div style={{ marginTop: 18 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
                          Where GKP talent is placed today
                        </div>
                        {placed.map((c) => (
                          <div key={c.country} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 130, flex: 'none', fontSize: 14 }}>{c.country}</div>
                            <div style={{ flex: 1, background: '#f1f2f5', borderRadius: 6, height: 12, overflow: 'hidden' }}>
                              <div style={{ width: `${c.share}%`, background: ACCENT, height: '100%', borderRadius: 6 }} />
                            </div>
                            <div style={{ width: 40, flex: 'none', textAlign: 'right', fontSize: 14, color: '#6b7280' }}>
                              {c.share}%
                            </div>
                          </div>
                        ))}
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>Share of current GKP placements by country.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {result && (
                <div style={styles.card} aria-live='polite'>
                  <p style={{ margin: '0 0 16px', fontSize: 14, color: '#6b7280', fontStyle: 'italic' }}>
                    * These numbers are general estimates only. Figures may fluctuate up or down depending on
                    the specific technical skill requirements in a job description.
                  </p>
                  <div className='row'>
                    <div className='col-lg-4 col-md-4 mb-3'>
                      <div style={styles.stat}>
                        <div style={styles.statLabel}>Hiring in the US</div>
                        <div style={styles.statValue}>{money(result.usTotal)}</div>
                        <div style={styles.statLabel}>per year</div>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-4 mb-3'>
                      <div style={styles.stat}>
                        <div style={styles.statLabel}>With GKP Solutions</div>
                        <div style={styles.statValue}>{money(result.gkpTotal)}</div>
                        <div style={styles.statLabel}>per year</div>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-4 mb-3'>
                      <div style={{ ...styles.stat, background: ACCENT, borderColor: ACCENT }}>
                        <div style={{ ...styles.statLabel, color: '#ffe3d6' }}>Estimated savings*</div>
                        <div style={{ ...styles.statValue, color: '#fff' }}>{money(result.savings)}</div>
                        <div style={{ ...styles.statLabel, color: '#ffe3d6' }}>per year · {result.savingsPct}% less</div>
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 14 }}>
                    {result.team} × {result.roleLabel}, {result.regionLabel}. That's about{' '}
                    {money(result.savings / result.team)} saved per person, every year.
                  </p>
                </div>
              )}

              <div style={styles.card}>
                <h3 style={{ fontSize: 22, marginBottom: 6 }}>Get the full breakdown by email</h3>
                <p style={{ color: '#6b7280', marginBottom: 20 }}>
                  We'll send you this estimate with the per-person costs and the assumptions behind it.
                </p>
                {status.state === 'sent' ? (
                  <p className='text-success' style={{ fontWeight: 600, marginBottom: 0 }}>{status.text}</p>
                ) : (
                  <form onSubmit={sendReport}>
                    <div className='row'>
                      <div className='col-lg-4 col-md-12'>
                        <div className='form-group'>
                          <input type='text' name='name' className='form-control' required maxLength={200}
                            placeholder='Your name *' autoComplete='name' value={lead.name} onChange={updateLead} />
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-12'>
                        <div className='form-group'>
                          <input type='email' name='email' className='form-control' required maxLength={200}
                            placeholder='Work email *' autoComplete='email' value={lead.email} onChange={updateLead} />
                        </div>
                      </div>
                      <div className='col-lg-4 col-md-12'>
                        <div className='form-group'>
                          <input type='text' name='company' className='form-control' maxLength={200}
                            placeholder='Company' autoComplete='organization' value={lead.company} onChange={updateLead} />
                        </div>
                      </div>
                      {/* Honeypot field: hidden from people, catches spam bots */}
                      <div style={{ position: 'absolute', left: '-10000px' }} aria-hidden='true'>
                        <input type='text' name='website' tabIndex='-1' autoComplete='off'
                          value={lead.website} onChange={updateLead} />
                      </div>
                      <div className='col-12'>
                        <button type='submit' className='default-btn' disabled={status.state === 'sending'}>
                          <i className='flaticon-right'></i>
                          {status.state === 'sending' ? 'Sending...' : 'Email me the breakdown'}
                          <span></span>
                        </button>
                        {status.state === 'error' && <p className='mt-3 text-danger'>{status.text}</p>}
                      </div>
                    </div>
                  </form>
                )}
              </div>

              <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>
                Estimates only. US cost is a typical base salary for the role plus about{' '}
                {Math.round((rates.usLoadedMultiplier - 1) * 100)}% for payroll taxes, benefits and overhead.
                GKP cost assumes a full-time contractor ({rates.hoursPerYear.toLocaleString('en-US')} hours/year)
                at typical market rates for the region. Your actual quote depends on seniority, skills and
                engagement length. <Link to='/contact'>Contact us</Link> for a precise quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  )
}

export default SavingsCalculator
