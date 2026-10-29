import React, { useState } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/App/Layout'
import Navbar from '../components/App/Navbar'
import Footer from '../components/App/Footer'
import { rates, calcSavings, money, MAX_TEAM } from '../data/savings-calc'

const ACCENT = '#ff5d22'

const styles = {
  card: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    padding: '28px 24px',
    marginBottom: 24,
  },
  label: { fontWeight: 600, marginBottom: 8, display: 'block' },
  stat: {
    borderRadius: 10,
    padding: '18px 16px',
    height: '100%',
    border: '1px solid #eceef2',
    background: '#f8f9fb',
  },
  statLabel: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  statValue: { fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: '#1f2430' },
  segment: (on) => ({
    flex: 1,
    padding: '12px 10px',
    borderRadius: 8,
    border: `2px solid ${on ? ACCENT : '#e5e7eb'}`,
    background: on ? '#fff4ef' : '#fff',
    fontWeight: 600,
    color: on ? '#b4410f' : '#1f2430',
    cursor: 'pointer',
    textAlign: 'center',
  }),
}

const SavingsCalculator = () => {
  const [roleId, setRoleId] = useState(rates.roles[0].id)
  const [region, setRegion] = useState('philippines')
  const [team, setTeam] = useState('3')
  const [lead, setLead] = useState({ name: '', email: '', company: '', website: '' })
  const [status, setStatus] = useState({ state: 'idle', text: '' })

  const result = calcSavings(roleId, region, team)

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
        body: JSON.stringify({ ...lead, roleId, region, team: result.team }),
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

      <div className='page-title-area'>
        <div className='container'>
          <div className='page-title-content'>
            <h2>Offshore Savings Calculator</h2>
            <p className='mt-3'>
              See what a GKP offshore or nearshore team could save you compared with hiring in the US.
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
                    <select id='role' className='form-control' value={roleId}
                      onChange={(e) => setRoleId(e.target.value)}>
                      {rates.roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className='col-lg-6 col-md-12 mb-4'>
                    <label htmlFor='team' style={styles.label}>Team size</label>
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
                    <span style={styles.label}>Where would your team be?</span>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} role='radiogroup'>
                      {Object.entries(rates.regions).map(([key, label]) => (
                        <button key={key} type='button' role='radio' aria-checked={region === key}
                          style={styles.segment(region === key)} onClick={() => setRegion(key)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {result && (
                <div style={styles.card} aria-live='polite'>
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
                        <div style={{ ...styles.statLabel, color: '#ffe3d6' }}>Estimated savings</div>
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
