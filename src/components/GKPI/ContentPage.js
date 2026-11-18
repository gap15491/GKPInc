import React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../App/Layout'
import Navbar from '../App/Navbar'
import Footer from '../App/Footer'
import { BOOKINGS_URL } from '../../data/site'

// Shared layout for the landing pages (Global / Offshore / Nearshore IT Staffing, Nashville) and
// Insights articles: title, readable body text, optional FAQ (also published as FAQ structured data
// for Google), a call-to-action box and related links.

const ACCENT = '#ff5d22'

export const styles = `
  .cp-title { padding-top: 30px !important; padding-bottom: 24px !important; }
  @media (max-width: 991px) { .cp-title { padding-top: 20px !important; padding-bottom: 16px !important; } }
  .cp-body { font-size: 17px; line-height: 1.75; color: #374151; }
  .cp-body h2 { font-size: 26px; margin: 36px 0 12px; color: #1f2430; }
  .cp-body h3 { font-size: 20px; margin: 24px 0 8px; color: #1f2430; }
  .cp-body p { margin: 0 0 16px; font-size: 17px; }
  .cp-body ul, .cp-body ol { margin: 0 0 18px; padding-left: 22px; }
  .cp-body li { margin-bottom: 8px; font-size: 17px; }
  .cp-body table { width: 100%; border-collapse: collapse; margin: 8px 0 20px; font-size: 15.5px; }
  .cp-body th { text-align: left; background: #f8f9fb; padding: 10px 12px; border-bottom: 2px solid #e5e7eb; color: #1f2430; }
  .cp-body td { padding: 10px 12px; border-bottom: 1px solid #eceef2; vertical-align: top; }
  .cp-body .note { font-size: 14px; color: #6b7280; }
  .cp-body .tbl { overflow-x: auto; }
  .cp-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 26px 24px; margin: 28px 0; }
  .cp-pts { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 8px 0 24px; }
  .cp-pt { background: #f8f9fb; border: 1px solid #eceef2; border-radius: 10px; padding: 16px 18px; }
  .cp-pt b { display: block; color: #1f2430; margin-bottom: 4px; font-size: 16px; }
  .cp-pt span { font-size: 15px; line-height: 1.55; color: #4b5563; }
  .cp-faq h3 { font-size: 18px; margin: 20px 0 6px; }
  .cp-related a { color: ${ACCENT}; font-weight: 600; }
`

export const Points = ({ items }) => (
  <div className='cp-pts'>
    {items.map(([title, text]) => (
      <div className='cp-pt' key={title}><b>{title}</b><span>{text}</span></div>
    ))}
  </div>
)

const ContentPage = ({ title, intro, meta, children, faq, related, cta }) => {
  const faqLd = faq && faq.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  } : null
  return (
    <Layout>
      {faqLd && <Helmet><script type='application/ld+json'>{JSON.stringify(faqLd)}</script></Helmet>}
      <Navbar />
      <style>{styles}</style>
      <div className='page-title-area cp-title'>
        <div className='container'>
          <div className='page-title-content'>
            <h1 style={{ fontSize: 40, fontWeight: 700 }}>{title}</h1>
            {intro && <p className='mt-3'>{intro}</p>}
            {meta && <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 6 }}>{meta}</p>}
          </div>
        </div>
      </div>
      <section className='pb-100'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-9 col-md-12 cp-body'>
              {children}

              {faq && faq.length > 0 && (
                <div className='cp-faq'>
                  <h2>Frequently asked questions</h2>
                  {faq.map(([q, a]) => (
                    <div key={q}><h3>{q}</h3><p>{a}</p></div>
                  ))}
                </div>
              )}

              <div className='cp-card' style={{ borderTop: `4px solid ${ACCENT}` }}>
                <h3 style={{ marginTop: 0 }}>{(cta && cta.title) || 'Ready to build your team?'}</h3>
                <p>{(cta && cta.text) || "Tell us the roles you need and we'll come back within one business day with rates, timing and a sourcing plan."}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to='/request-talent' className='default-btn'><i className='flaticon-right'></i>Request Talent<span></span></Link>
                  <a href={BOOKINGS_URL} target='_blank' rel='noopener noreferrer' className='default-btn' style={{ background: '#1f2430' }}>
                    <i className='flaticon-right'></i>Book a Call<span></span>
                  </a>
                  <Link to='/savings-calculator' className='default-btn' style={{ background: '#51A173' }}>
                    <i className='flaticon-right'></i>Estimate Your Savings<span></span>
                  </Link>
                </div>
              </div>

              {related && related.length > 0 && (
                <div className='cp-related'>
                  <h3>Related</h3>
                  <ul>
                    {related.map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </Layout>
  )
}

export default ContentPage
