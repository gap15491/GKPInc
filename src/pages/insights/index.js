import React from 'react'
import { Link } from 'gatsby'
import Layout from '../../components/App/Layout'
import Navbar from '../../components/App/Navbar'
import Footer from '../../components/App/Footer'
import { styles } from '../../components/GKPI/ContentPage'
import { INSIGHTS } from '../../data/seo'

const fmt = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const Insights = () => (
  <Layout>
    <Navbar />
    <style>{styles}</style>
    <div className='page-title-area cp-title'>
      <div className='container'>
        <div className='page-title-content'>
          <h1 style={{ fontSize: 40, fontWeight: 700 }}>Insights</h1>
          <p className='mt-3'>Practical guides on offshore and nearshore IT teams: costs, choosing a country and making remote teams work.</p>
        </div>
      </div>
    </div>
    <section className='pb-100'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-lg-9 col-md-12'>
            {INSIGHTS.map((a) => (
              <Link key={a.path} to={a.path} style={{ display: 'block', color: 'inherit' }}>
                <div className='cp-card' style={{ margin: '0 0 20px' }}>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>{fmt(a.date)} · {a.readMins} min read</div>
                  <h2 style={{ fontSize: 24, margin: '0 0 8px', color: '#1f2430' }}>{a.title}</h2>
                  <p style={{ color: '#4b5563', margin: '0 0 10px' }}>{a.description}</p>
                  <span style={{ color: '#ff5d22', fontWeight: 600 }}>Read article →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </Layout>
)

export default Insights
