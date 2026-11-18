import React from 'react'
import { Link } from 'gatsby'
import ContentPage, { Points } from '../components/GKPI/ContentPage'

const faq = [
  ['What is nearshore IT staffing?',
    'Nearshore IT staffing means hiring technical talent in a nearby region with similar time zones. For US companies that usually means Latin America, such as Argentina, Mexico, Colombia or Costa Rica, where engineers can work during US business hours.'],
  ['How much does a nearshore developer cost?',
    'Rates vary by country and seniority. Published 2026 benchmarks put Latin American developers at roughly $30–$60 per hour for mid-level and $50–$85 for senior. A full-time mid-level .NET developer in Argentina through GKP is estimated at about $49 per hour.'],
  ['Nearshore or offshore: which is better?',
    'Nearshore is best when your team needs real-time collaboration during US hours, such as daily stand-ups, pair programming and fast feedback. Offshore saves more and suits work with clear specs, or round-the-clock coverage. Many companies use both.'],
  ['How good is English in Latin America?',
    'It varies by country. Argentina ranks first in Latin America on the EF English Proficiency Index, and we screen every candidate for spoken and written English.'],
]

const NearshoreItStaffing = () => (
  <ContentPage
    title='Nearshore IT Staffing in Latin America'
    intro='Developers, QA, DevOps and data engineers in Argentina, Costa Rica and across Latin America who work your hours, join your stand-ups and cost far less than a US hire.'
    faq={faq}
    related={[['/insights/nearshore-dotnet-developer-cost-2027', 'What a Nearshore .NET Developer Costs in 2027'],
      ['/insights/philippines-vs-argentina-offshore-qa', 'Philippines vs. Argentina for Offshore QA'],
      ['/offshore-it-staffing', 'Offshore IT Staffing'], ['/global-it-staffing', 'Global IT Staffing']]}>
    <h2>Why nearshore</h2>
    <Points items={[
      ['Same working day', 'Buenos Aires is 2–3 hours ahead of US Central time, so the whole team works together in real time.'],
      ['Strong English', 'Argentina ranks first in Latin America for English proficiency.'],
      ['Senior talent', 'Experienced engineers in .NET, Java, Python, cloud, data and QA automation.'],
      ['Lower cost', 'Typically 40–45% less than the fully loaded cost of a comparable US hire.'],
    ]} />

    <h2>Where we hire nearshore</h2>
    <p>
      <b>Argentina</b> is GKP's leading nearshore location, known for senior engineering talent and strong English. We
      also place professionals in <b>Costa Rica</b> and can recruit across <b>Mexico, Colombia, Chile, Brazil</b> and the
      rest of Latin America depending on the skills you need.
    </p>

    <h2>Roles we place nearshore</h2>
    <ul>
      <li>.NET, Java, Python, Go and full-stack developers</li>
      <li>QA automation engineers and SDETs</li>
      <li>DevOps, cloud (AWS, Azure) and site reliability engineers</li>
      <li>Data engineers and database specialists</li>
      <li>ERP specialists (Oracle, Infor) and business analysts</li>
    </ul>

    <h2>Nearshore cost at a glance</h2>
    <p>
      A US developer on a $140,000 salary costs about $182,000 a year fully loaded. A full-time nearshore .NET developer
      through GKP is estimated at about $103,000 a year. Read the full breakdown in{' '}
      <Link to='/insights/nearshore-dotnet-developer-cost-2027'>What a Nearshore .NET Developer Costs in 2027</Link>, or
      use the <Link to='/savings-calculator'>Savings Calculator</Link>.
    </p>
  </ContentPage>
)

export default NearshoreItStaffing
