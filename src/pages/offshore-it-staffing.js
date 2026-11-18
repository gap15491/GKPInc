import React from 'react'
import { Link } from 'gatsby'
import ContentPage, { Points } from '../components/GKPI/ContentPage'

const faq = [
  ['What is offshore IT staffing?',
    'Offshore IT staffing means hiring developers, QA, DevOps or support engineers in another region, usually Asia, who work remotely as part of your team. GKP Solutions recruits and places them, and handles contracts and payments.'],
  ['How much cheaper is an offshore developer?',
    'For many roles, an offshore professional in the Philippines, India or Indonesia costs roughly 55–65% less than the fully loaded cost of an equivalent US hire. For example, a QA automation engineer is estimated at about $26–$29 per hour through GKP.'],
  ['What about time zones?',
    'The Philippines is 13–14 hours ahead of US Central time, so many offshore professionals work a full or partial US-hours shift. We agree the overlap you need before anyone starts.'],
  ['Is English a problem?',
    'The Philippines has one of the highest levels of English proficiency in Asia, and we screen every candidate for spoken and written English.'],
]

const OffshoreItStaffing = () => (
  <ContentPage
    title='Offshore IT Staffing'
    intro='Build an offshore team of developers, QA, DevOps and IT support engineers in the Philippines, India or Indonesia, at a fraction of US cost, with a US-based partner managing it for you.'
    faq={faq}
    related={[['/insights/philippines-vs-argentina-offshore-qa', 'Philippines vs. Argentina for Offshore QA'],
      ['/insights/how-to-onboard-an-offshore-team', 'How to Onboard an Offshore Team'], ['/nearshore-it-staffing', 'Nearshore IT Staffing'],
      ['/global-it-staffing', 'Global IT Staffing']]}>
    <h2>Why companies build offshore teams</h2>
    <Points items={[
      ['Lower cost', 'Typically 55–65% less than the fully loaded cost of a US hire for the same role.'],
      ['Strong English', 'The Philippines ranks among the top English-speaking countries in Asia.'],
      ['Round-the-clock coverage', 'Teams can cover overnight support, testing and monitoring while your US team is offline.'],
      ['Scale fast', 'Add engineers to a project without a long local hiring search.'],
    ]} />

    <h2>Where we hire offshore</h2>
    <h3>Philippines</h3>
    <p>
      GKP's largest offshore location. A deep pool of developers, QA engineers and IT support professionals, strong
      English, and a long history of working with US companies, including on US-hours shifts.
    </p>
    <h3>India</h3>
    <p>A very large engineering market with depth in enterprise systems, data, cloud and software development.</p>
    <h3>Indonesia</h3>
    <p>A fast-growing talent market for software development and QA, at some of the most competitive rates in Asia.</p>

    <h2>Typical offshore rates</h2>
    <div className='tbl'>
      <table>
        <thead><tr><th>Role</th><th>Philippines</th><th>India</th><th>US fully loaded</th></tr></thead>
        <tbody>
          <tr><td>QA Engineer (manual)</td><td>~$25/hr</td><td>~$22/hr</td><td>~$59/hr</td></tr>
          <tr><td>QA Automation Engineer</td><td>~$29/hr</td><td>~$26/hr</td><td>~$72/hr</td></tr>
          <tr><td>.NET Developer</td><td>~$35/hr</td><td>~$32/hr</td><td>~$88/hr</td></tr>
        </tbody>
      </table>
    </div>
    <p className='note'>
      GKP estimates for full-time engagements. US figures are typical base salaries plus about 30% for payroll taxes,
      benefits and overhead, divided by 2,080 hours. Actual rates depend on seniority and skills.
      See the <Link to='/savings-calculator'>Savings Calculator</Link> for your roles.
    </p>

    <h2>What GKP handles</h2>
    <ul>
      <li>Recruiting, technical screening and English assessment</li>
      <li>Contracts and international contractor payments</li>
      <li>A US point of contact in Nashville for anything that comes up</li>
      <li>Replacement support if someone isn't the right fit</li>
    </ul>
  </ContentPage>
)

export default OffshoreItStaffing
