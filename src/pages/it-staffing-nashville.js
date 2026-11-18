import React from 'react'
import { Link } from 'gatsby'
import ContentPage, { Points } from '../components/GKPI/ContentPage'

const faq = [
  ['Is GKP Solutions based in Nashville?',
    'Yes. GKP Solutions is a Nashville-area IT staffing firm, founded in 2020 by Gary Peck, who has worked in Middle Tennessee technology for about 30 years.'],
  ['Do you only place people in Nashville?',
    'No. We help Nashville and Middle Tennessee companies hire locally, nearshore in Latin America and offshore in Asia, depending on the role, budget and how closely the person needs to work with your team.'],
  ['What roles do you fill?',
    'Developers, QA and test automation, DevOps and cloud, data, ERP and Salesforce specialists, IAM / security, Scrum Masters, project managers and IT support.'],
]

const ItStaffingNashville = () => (
  <ContentPage
    title='IT Staffing in Nashville, TN'
    intro='A Nashville IT staffing partner for Middle Tennessee companies: developers, QA, DevOps and support engineers, hired locally, nearshore or offshore.'
    faq={faq}
    related={[['/global-it-staffing', 'Global IT Staffing'], ['/nearshore-it-staffing', 'Nearshore IT Staffing'],
      ['/offshore-it-staffing', 'Offshore IT Staffing'], ['/cio-roundtable', 'CIO Roundtable']]}>
    <h2>A local partner with a global reach</h2>
    <p>
      Nashville's technology market has grown fast, and local engineers are in high demand across healthcare,
      logistics, finance and software. GKP Solutions gives Middle Tennessee companies more options: we recruit in the
      locations that fit each role, from here at home to Latin America and Asia, and stay your local point of contact
      throughout.
    </p>
    <Points items={[
      ['Local relationships', 'Founded in 2020 by Gary Peck, with 25+ years in IT, including software development at HCA and IT recruiting.'],
      ['Cost flexibility', 'Mix local, nearshore and offshore talent to fit your budget. Offshore roles often cost 55–65% less.'],
      ['Peer network', 'Our CIO Roundtable brings technology leaders together to share what works with global teams.'],
    ]} />

    <h2>How we help Nashville teams</h2>
    <ul>
      <li><b>Staff augmentation:</b> add developers, QA or DevOps engineers to an existing team</li>
      <li><b>Dedicated teams:</b> a nearshore or offshore team built around your project</li>
      <li><b>Hard-to-fill roles:</b> ERP, Salesforce, IAM and data specialists from a global pool</li>
    </ul>
    <p>
      <Link to='/book-a-call'>Book a call</Link> to talk through your needs, or join an upcoming{' '}
      <Link to='/cio-roundtable'>CIO Roundtable</Link>.
    </p>
  </ContentPage>
)

export default ItStaffingNashville
