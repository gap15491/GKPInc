import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'

// Homepage strip with live numbers from the GKP Placements app (via /api/placement-stats):
// how many countries GKP talent is working in today, and how many clients GKP has served.
// Numbers only - no names. If the Placements app can't be reached, the live numbers are hidden.

const ACCENT = '#ff5d22'

const TalentSnapshot = () => {
  const [snap, setSnap] = useState(null)

  useEffect(() => {
    fetch('/api/placement-stats')
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => setSnap(d && d.snapshot ? d.snapshot : null))
      .catch(() => {})
  }, [])

  const stats = [
    snap && snap.countries > 0 && { value: snap.countries, label: snap.countries === 1 ? 'country with GKP talent on assignment today' : 'countries with GKP talent on assignment today' },
    snap && snap.clients > 0 && { value: snap.clients, label: snap.clients === 1 ? 'client served since 2020' : 'clients served since 2020' },
    { value: '150+', label: 'countries we can hire in' },
  ].filter(Boolean)

  return (
    <section style={{ padding: '36px 0', background: '#fff8f5', borderTop: '1px solid #ffe3d6', borderBottom: '1px solid #ffe3d6' }}>
      <div className='container'>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 44px', flex: '1 1 520px' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ minWidth: 170, flex: '1 1 170px' }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: ACCENT, lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 15, color: '#4b5563', marginTop: 4, maxWidth: 260, lineHeight: 1.45 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to='/request-talent' className='default-btn'>
              <i className='flaticon-right'></i>Request Talent<span></span>
            </Link>
            <Link to='/book-a-call' className='default-btn' style={{ background: '#1f2430' }}>
              <i className='flaticon-right'></i>Book a Call<span></span>
            </Link>
          </div>
        </div>
        {snap && (snap.countries > 0 || snap.clients > 0) && (
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 14 }}>Live from GKP's placement records.</div>
        )}
      </div>
    </section>
  )
}

export default TalentSnapshot
