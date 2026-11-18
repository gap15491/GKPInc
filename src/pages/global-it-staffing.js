import React from 'react'
import { Link } from 'gatsby'
import ContentPage, { Points } from '../components/GKPI/ContentPage'

const faq = [
  ['What is global IT staffing?',
    'Global IT staffing means hiring technical professionals, such as developers, QA engineers, DevOps and support staff, from the best location for the role rather than only locally. GKP Solutions recruits, vets and places that talent with US companies, and stays the single point of contact.'],
  ['How much can a global IT team save?',
    'For many roles, a team in the Philippines, India or Indonesia costs roughly 55–65% less than the fully loaded cost of a US hire, and a nearshore team in Latin America roughly 40–45% less. Our Savings Calculator gives an estimate for your role and team size.'],
  ['Which countries do you hire in?',
    'Our leading locations are the Philippines and Argentina, with placements across Latin America, Asia, the UK, Canada and more. GKP can deploy talent in 150+ countries.'],
  ['How quickly can someone start?',
    'It depends on the role and seniority. We reply to every request within one business day with timing and a sourcing plan, and many roles can be filled in a few weeks.'],
]

const GlobalItStaffing = () => (
  <ContentPage
    title='Global IT Staffing'
    intro='Vetted developers, QA, DevOps, cloud and IT support engineers from the Philippines, Latin America and 150+ countries, recruited and managed for US companies by a team in Nashville.'
    faq={faq}
    related={[['/offshore-it-staffing', 'Offshore IT Staffing'], ['/nearshore-it-staffing', 'Nearshore IT Staffing in Latin America'],
      ['/it-staffing-nashville', 'IT Staffing in Nashville'], ['/insights', 'Insights: costs, countries and onboarding']]}>
    <h2>Hire from where the talent is, not just where you are</h2>
    <p>
      US companies compete for the same small pool of local engineers, and pay for it. GKP Solutions widens that pool.
      We recruit experienced technical professionals around the world, vet them for the skills and English your team
      needs, and place them on your projects as an extension of your team, with GKP as your single point of contact for
      contracts, payroll and support.
    </p>
    <Points items={[
      ['Offshore', 'Philippines, India and Indonesia: the biggest savings, with strong English and established remote-work culture.'],
      ['Nearshore', 'Argentina, Costa Rica and Latin America: overlap with US business hours for real-time collaboration.'],
      ['Anywhere else', 'Specialist skills in the UK, Canada, Asia and 150+ countries when the right person is somewhere else.'],
    ]} />

    <h2>Roles we place</h2>
    <ul>
      <li><b>Software development:</b> Python, Java, .NET, front-end, full-stack and mobile developers</li>
      <li><b>Quality assurance:</b> manual QA, test automation and SDETs, including Salesforce QA</li>
      <li><b>Cloud and DevOps:</b> AWS, Azure, DevOps and site reliability engineers</li>
      <li><b>Data and AI:</b> data engineers, database specialists and machine learning engineers</li>
      <li><b>Enterprise systems:</b> Oracle ERP, Infor, Salesforce and IAM / security engineers</li>
      <li><b>Delivery and support:</b> Scrum Masters, project managers, business analysts and IT support</li>
    </ul>

    <h2>How it works</h2>
    <ol>
      <li><b>Tell us what you need.</b> Send a <Link to='/request-talent'>talent request</Link> or <Link to='/book-a-call'>book a call</Link>. We reply within one business day.</li>
      <li><b>We recruit and screen.</b> We source candidates in the locations that fit the role and check technical skills, English and work history.</li>
      <li><b>You interview and choose.</b> You meet a short list and pick who joins your team.</li>
      <li><b>We handle the rest.</b> Contracts, international payments and ongoing support run through GKP, so you manage the work, not the paperwork.</li>
    </ol>

    <h2>What it costs</h2>
    <p>
      A US developer earning $140,000 costs about $182,000 a year once payroll taxes, benefits and overhead are added.
      A comparable full-time .NET developer through GKP is estimated at roughly $67,000–$73,000 a year offshore and around
      $103,000 nearshore. Try the <Link to='/savings-calculator'>Global Savings Calculator</Link> for your own roles and
      team size.
    </p>
    <p className='note'>Estimates only. Actual rates depend on seniority, skills and engagement length.</p>
  </ContentPage>
)

export default GlobalItStaffing
