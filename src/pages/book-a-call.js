import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/App/Layout'
import Navbar from '../components/App/Navbar'
import Footer from '../components/App/Footer'
import { BOOKINGS_URL } from '../data/site'

// "Book a Call": sends visitors to Gary's Microsoft Bookings calendar (opens in a new tab;
// personal Bookings pages can't always be shown inside another site). The link lives in
// src/data/site.js; a BOOKINGS_URL variable in Railway overrides it.

const ACCENT = '#ff5d22'
const card = { background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '24px', marginBottom: 24 }

const BookACall = () => {
  // Optional override from the BOOKINGS_URL variable in Railway; otherwise the link in src/data/site.js
  const [url, setUrl] = useState(BOOKINGS_URL)
  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => { if (d && d.bookingsUrl) setUrl(d.bookingsUrl) })
      .catch(() => {})
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
              <div style={{ ...card, borderTop: `4px solid ${ACCENT}` }}>
                <div className='row align-items-center'>
                  <div className='col-lg-7 col-md-12 mb-3'>
                    <h3 style={{ fontSize: 24, marginBottom: 8 }}>Pick a time on my calendar</h3>
                    <p style={{ color: '#4b5563', marginBottom: 6 }}>
                      Choose any open slot that suits you. Microsoft sends you a calendar invite as soon as you book.
                    </p>
                    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 0 }}>— Gary Peck, Founder &amp; CEO</p>
                  </div>
                  <div className='col-lg-5 col-md-12 mb-3' style={{ textAlign: 'center' }}>
                    <a href={url} target='_blank' rel='noopener noreferrer' className='default-btn'
                      style={{ fontSize: 17, padding: '14px 28px 14px 54px' }}>
                      <i className='flaticon-right'></i>Open my booking calendar<span></span>
                    </a>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 10 }}>Opens Microsoft Bookings in a new tab</div>
                  </div>
                </div>
              </div>
              <div style={card}>
                <h4 style={{ fontSize: 18, marginBottom: 12 }}>Prefer to reach me directly?</h4>
                <p style={{ fontSize: 17, marginBottom: 6 }}>
                  <i className='bx bx-phone-call' style={{ color: ACCENT, marginRight: 8 }}></i>
                  <a href='tel:+16159444405'>+1 (615) 944-4405</a>
                </p>
                <p style={{ fontSize: 17, marginBottom: 0 }}>
                  <i className='bx bx-envelope' style={{ color: ACCENT, marginRight: 8 }}></i>
                  <a href='mailto:gary@gkpsolutions.net'>gary@gkpsolutions.net</a>
                </p>
              </div>
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
