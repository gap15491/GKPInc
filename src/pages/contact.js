import React, { useState } from 'react'
import Layout from '../components/App/Layout'
import Navbar from '../components/App/Navbar'
import Footer from '../components/App/Footer'

const INTERESTS = [
  'Staff Augmentation',
  'Offshore / Nearshore Team',
  'Direct Hire',
  'Project-Based Delivery',
  'Other',
]

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  businessName: '',
  jobTitle: '',
  location: '',
  interest: '',
  message: '',
  website: '', // honeypot - must stay empty
}

const Contact = () => {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState({ state: 'idle', text: '' })

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending', text: '' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setForm(EMPTY)
      setStatus({
        state: 'sent',
        text: 'Thank you! Your request was received. We will be in touch shortly.',
      })
    } catch (err) {
      setStatus({
        state: 'error',
        text:
          err.message ||
          'Sorry, we could not send your request. Please email gary@gkpsolutions.net.',
      })
    }
  }

  return (
    <Layout>
      <Navbar />

      <div className='page-title-area'>
        <div className='container'>
          <div className='page-title-content'>
            <h2>Contact GKP Solutions</h2>
            <p className='mt-3'>
              Tell us a little about your needs and we'll get back to you within
              one business day.
            </p>
          </div>
        </div>
      </div>

      <section className='contact-area pb-100'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-md-12'>
              <div className='contact-form'>
                <form onSubmit={submit}>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6'>
                      <div className='form-group'>
                        <input type='text' name='name' className='form-control'
                          required maxLength={200} placeholder='Your name *'
                          value={form.name} onChange={update} />
                      </div>
                    </div>
                    <div className='col-lg-6 col-md-6'>
                      <div className='form-group'>
                        <input type='email' name='email' className='form-control'
                          required maxLength={200} placeholder='Email address *'
                          value={form.email} onChange={update} />
                      </div>
                    </div>
                    <div className='col-lg-6 col-md-6'>
                      <div className='form-group'>
                        <input type='tel' name='phone' className='form-control'
                          maxLength={50} placeholder='Phone'
                          value={form.phone} onChange={update} />
                      </div>
                    </div>
                    <div className='col-lg-6 col-md-6'>
                      <div className='form-group'>
                        <input type='text' name='businessName' className='form-control'
                          required maxLength={200} placeholder='Business name *'
                          value={form.businessName} onChange={update} />
                      </div>
                    </div>
                    <div className='col-lg-6 col-md-6'>
                      <div className='form-group'>
                        <input type='text' name='jobTitle' className='form-control'
                          maxLength={200} placeholder='Job title'
                          value={form.jobTitle} onChange={update} />
                      </div>
                    </div>
                    <div className='col-lg-6 col-md-6'>
                      <div className='form-group'>
                        <input type='text' name='location' className='form-control'
                          maxLength={200} placeholder='Location (City, State / Country)'
                          value={form.location} onChange={update} />
                      </div>
                    </div>
                    <div className='col-lg-12 col-md-12'>
                      <div className='form-group'>
                        <select name='interest' className='form-control'
                          value={form.interest} onChange={update}>
                          <option value=''>What are you interested in?</option>
                          {INTERESTS.map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='col-lg-12 col-md-12'>
                      <div className='form-group'>
                        <textarea name='message' className='form-control'
                          rows='7' required maxLength={5000}
                          placeholder='How can we help? *'
                          value={form.message} onChange={update} />
                      </div>
                    </div>

                    {/* Honeypot field: hidden from people, catches spam bots */}
                    <div style={{ position: 'absolute', left: '-10000px' }} aria-hidden='true'>
                      <input type='text' name='website' tabIndex='-1' autoComplete='off'
                        value={form.website} onChange={update} />
                    </div>

                    <div className='col-lg-12 col-md-12'>
                      <button type='submit' className='default-btn'
                        disabled={status.state === 'sending'}>
                        <i className='flaticon-tick'></i>
                        {status.state === 'sending' ? 'Sending...' : 'Send Request'}
                        <span></span>
                      </button>
                      {status.text && (
                        <p className={`mt-3 ${status.state === 'sent' ? 'text-success' : 'text-danger'}`}>
                          {status.text}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  )
}

export default Contact
