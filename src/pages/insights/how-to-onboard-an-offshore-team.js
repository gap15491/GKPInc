import React from 'react'
import { Link } from 'gatsby'
import ContentPage from '../../components/GKPI/ContentPage'

const OnboardOffshoreTeam = () => (
  <ContentPage
    title='How to Onboard an Offshore Team'
    intro='The first 30 days decide whether an offshore or nearshore engineer becomes a real part of your team. Here is a practical plan.'
    meta='By Gary Peck, Founder & CEO · November 18, 2026 · 7 min read'
    related={[['/offshore-it-staffing', 'Offshore IT Staffing'], ['/nearshore-it-staffing', 'Nearshore IT Staffing'],
      ['/insights/philippines-vs-argentina-offshore-qa', 'Philippines vs. Argentina for Offshore QA']]}
    cta={{ title: 'Planning an offshore or nearshore team?', text: 'We help you choose the location, find the people and get them productive quickly.' }}>
    <p>
      Most offshore engagements that struggle don't fail because of talent. They fail because the new engineer spends the
      first weeks waiting for access, guessing at priorities and working alone. Treat remote engineers exactly like a new
      local hire, with a few adjustments for distance and time zones, and they become productive fast.
    </p>

    <h2>Before day one</h2>
    <ul>
      <li><b>Accounts and access.</b> Email, chat, code repository, ticketing, VPN and test environments should be ready on day one. This is the most common cause of a slow start.</li>
      <li><b>Security basics.</b> Agree on device requirements, multi-factor authentication and how data is handled, and share any client security policies up front.</li>
      <li><b>A written starter pack.</b> A one-page overview of the product, architecture diagram, how to run the code locally, the team's definition of done, and who to ask about what.</li>
      <li><b>A named buddy.</b> One person on your team who answers questions for the first month.</li>
      <li><b>Agreed working hours.</b> Decide the daily overlap window (for example, 9 a.m.–1 p.m. Central) and put it in everyone's calendar.</li>
    </ul>

    <h2>Week 1: connect and contribute something small</h2>
    <ul>
      <li>Start with a video call to introduce the team, the product and how work flows.</li>
      <li>Add them to every stand-up, planning meeting and team channel, not a separate "offshore" channel.</li>
      <li>Give them a small, real task they can finish and ship in the first few days, such as a bug fix or a test case.</li>
      <li>Pair with their buddy on a code review so they learn your standards early.</li>
    </ul>

    <h2>Weeks 2–4: build ownership</h2>
    <ul>
      <li>Move from small tasks to owning a feature, test area or service.</li>
      <li>Hold a short weekly one-on-one to remove blockers and give feedback.</li>
      <li>Ask them to update the starter pack with anything that was missing. It improves onboarding for the next hire.</li>
      <li>Review progress at day 30: what's working, what's slowing them down, and what they should own next.</li>
    </ul>

    <h2>Make time zones work for you</h2>
    <p>
      Nearshore engineers in Latin America share most of the US working day. With offshore teams in Asia, protect a few
      hours of overlap for meetings and questions, and use the rest of their day for focused work that's ready for your
      team in the morning. Written handoffs at the end of each day keep both sides moving.
    </p>

    <h2>Respect local calendars and culture</h2>
    <p>
      Put your team's public holidays on the shared calendar. The Philippines and Argentina both have holidays the US
      doesn't, and knowing them ahead of time avoids surprises at release time. Recognize good work publicly, just as you
      would for anyone on the team.
    </p>

    <h2>Common mistakes to avoid</h2>
    <ul>
      <li>Giving only low-value or isolated tasks, which leads to disengagement and turnover</li>
      <li>Communicating only through tickets, with no face-to-face time</li>
      <li>Leaving access and environment setup until after the start date</li>
      <li>No single person responsible for the new engineer's success</li>
    </ul>

    <h2>Where a staffing partner helps</h2>
    <p>
      GKP handles recruiting, contracts and international payments, and stays in touch with both you and the engineer
      through onboarding, so small problems get raised early. If you're weighing locations, start with{' '}
      <Link to='/insights/philippines-vs-argentina-offshore-qa'>Philippines vs. Argentina</Link> or the{' '}
      <Link to='/savings-calculator'>Global Savings Calculator</Link>.
    </p>
  </ContentPage>
)

export default OnboardOffshoreTeam
