import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/App/Layout'
import Navbar from '../components/App/Navbar'
import Footer from '../components/App/Footer'

// "Book a Call": embeds Gary's Microsoft Bookings page. The link comes from the BOOKINGS_URL
// variable on the website service in Railway (read at runtime via /api/site-config), so it can be
// changed without editing code. Until it's set, the page shows phone/email instead.

const ACCENT = '#ff5d22'
const card = { background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '24px', marginBottom: 24 }

const BookACall = () => {
  const [cfg, setCfg] = useState({ loading: true, bookingsUrl: '' })

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => setCfg({ loading: false, bookingsUrl: (d && d.bookingsUrl) || '' }))
      .catch(() => setCfg({ loading: false, bookingsUrl: '' }))
  }, [])

  return (
    <Layout>
      <Navbar />
      <style>{`
        .bc-title { padding-top: 30px !important; padding-bottom: 24px !important; }
        @media (max-width: 991px) { .bc-title { padding-top: 20px !important; padding-bottom: 16px !important; } }
      `}</style>
      <div className='page-title-area bc-title'>
        <div className='container'>
          <div className='page-title-content'>
            <h2>Book a Call</h2>
            <p className='mt-3'>
              Pick a time that works for you. We'll talk through the roles you need, where they could be based,
              and what it would cost. No commitment.
            </p>
          </div>
        </div>
      </div>

      <section className='pb-100'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-md-12'>
              {cfg.loading ? (
                <div style={{ ...card, color: '#6b7280' }}>Loading the calendar…</div>
              ) : cfg.bookingsUrl ? (
                <>
                  <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                    <iframe title='Book a call with GKP Solutions' src={cfg.bookingsUrl}
                      style={{ width: '100%', height: 1050, border: 0, display: 'block' }} loading='lazy' />
                  </div>
                  <p style={{ fontSize: 14, color: '#6b7280' }}>
                    Calendar not loading?{' '}
                    <a href={cfg.bookingsUrl} target='_blank' rel='noopener noreferrer' style={{ color: ACCENT }}>
                      Open the booking page in a new tab
                    </a>.
                  </p>
                </>
              ) : (
                <div style={card}>
                  <h3 style={{ fontSize: 22 }}>Let's find a time</h3>
                  <p style={{ color: '#4b5563' }}>
                    Call or email me directly and we'll set up a time that suits you.
                  </p>
                  <p style={{ fontSize: 18, marginBottom: 6 }}>
                    <i className='bx bx-phone-call' style={{ color: ACCENT, marginRight: 8 }}></i>
                    <a href='tel:+16159444405'>+1 (615) 944-4405</a>
                  </p>
                  <p style={{ fontSize: 18 }}>
                    <i className='bx bx-envelope' style={{ color: ACCENT, marginRight: 8 }}></i>
                    <a href='mailto:gary@gkpsolutions.net'>gary@gkpsolutions.net</a>
                  </p>
                  <Link to='/contact' className='default-btn'>
                    <i className='flaticon-right'></i>Send a message instead<span></span>
                  </Link>
                </div>
              )}
              <p style={{ fontSize: 14, color: '#6b7280' }}>
                Already know who you need? <Link to='/request-talent' style={{ color: ACCENT }}>Send us a talent request</Link> and
                we'll come prepared.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  )
}

export default BookACall
