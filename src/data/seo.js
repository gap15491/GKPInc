// Search-engine settings for every page: the title and description Google shows, and whether the page
// should be in search results at all. The SEO component (src/components/App/SEO.js) reads this by URL,
// and gatsby-node.js builds /sitemap.xml from it. To change how a page appears in Google, edit it here.
//
// Tips: titles under ~60 characters, descriptions under ~155 characters, with the search phrase early.

const SITE_URL = 'https://www.gkpsolutions.net'

const ORG = {
  name: 'GKP Solutions, Inc.',
  phone: '+1-615-944-4405',
  email: 'gary@gkpsolutions.net',
  city: 'Nashville',
  region: 'TN',
  country: 'US',
  linkedin: 'https://www.linkedin.com/in/garypeck1/',
  founded: '2020',
}

const DEFAULT = {
  title: 'GKP Solutions | Global IT Staffing, Offshore & Nearshore Teams',
  description:
    'GKP Solutions provides global IT staffing: offshore and nearshore developers, QA, DevOps and support engineers ' +
    'for US companies. Nashville, TN. Talent in 150+ countries.',
}

// path -> { title, description, priority (sitemap), noindex }
const PAGES = {
  '/': {
    title: 'Global IT Staffing, Offshore & Nearshore Developers | GKP Solutions',
    description:
      'Hire offshore and nearshore IT talent with GKP Solutions: developers, QA, DevOps, cloud and support engineers ' +
      'from the Philippines, Latin America and 150+ countries. Based in Nashville.',
    priority: 1.0,
  },
  '/service-details/': {
    title: 'IT Staffing Services & Staff Augmentation | GKP Solutions',
    description:
      'IT staff augmentation, offshore and nearshore teams, and project delivery for application development, ' +
      'infrastructure and operations. See how GKP Solutions works.',
    priority: 0.8,
  },
  '/about-us/': {
    title: 'About GKP Solutions | Nashville Global IT Staffing Firm',
    description:
      'GKP Solutions is a Nashville-based global IT staffing firm founded in 2020, placing offshore and nearshore ' +
      'technical talent with US companies.',
    priority: 0.6,
  },
  '/global-it-staffing/': {
    title: 'Global IT Staffing Services | GKP Solutions',
    description:
      'Global IT staffing for US companies: vetted developers, QA, DevOps and support engineers in the Philippines, ' +
      'Latin America, India and 150+ countries, managed from Nashville.',
    priority: 0.9,
  },
  '/offshore-it-staffing/': {
    title: 'Offshore IT Staffing & Offshore Developers | GKP Solutions',
    description:
      'Build an offshore IT team in the Philippines, India or Indonesia. Developers, QA and support engineers at ' +
      'up to 60% less than US cost, with a US point of contact.',
    priority: 0.9,
  },
  '/nearshore-it-staffing/': {
    title: 'Nearshore IT Staffing in Latin America | GKP Solutions',
    description:
      'Nearshore developers and engineers in Argentina, Mexico, Colombia and Costa Rica who work US hours. ' +
      'Staff augmentation and dedicated teams from GKP Solutions.',
    priority: 0.9,
  },
  '/it-staffing-nashville/': {
    title: 'IT Staffing in Nashville, TN | GKP Solutions',
    description:
      'Nashville IT staffing firm helping Middle Tennessee companies hire developers, QA, DevOps and support ' +
      'engineers onshore, nearshore and offshore.',
    priority: 0.9,
  },
  '/savings-calculator/': {
    title: 'Offshore vs US Developer Cost Calculator | GKP Solutions',
    description:
      'Compare the cost of hiring in the US with an offshore or nearshore team in the Philippines, Argentina, ' +
      'India or Indonesia. Free estimate by role and team size.',
    priority: 0.8,
  },
  '/request-talent/': {
    title: 'Request IT Talent | GKP Solutions',
    description:
      'Tell us the roles you need and get rates, timing and a sourcing plan within one business day. Offshore, ' +
      'nearshore and global IT staffing.',
    priority: 0.7,
  },
  '/book-a-call/': {
    title: 'Book a Call | GKP Solutions',
    description: 'Book a time with Gary Peck, Founder & CEO of GKP Solutions, to talk through your IT staffing needs.',
    priority: 0.5,
  },
  '/cio-roundtable/': {
    title: 'CIO Roundtable on Offshore & Nearshore Teams | GKP Solutions',
    description:
      'Virtual roundtable discussions for CIOs and technology leaders on building and running offshore and ' +
      'nearshore teams. Register for the next session.',
    priority: 0.6,
  },
  '/contact/': {
    title: 'Contact GKP Solutions | IT Staffing, Nashville TN',
    description: 'Contact GKP Solutions about offshore, nearshore or global IT staffing. We reply within one business day.',
    priority: 0.6,
  },
  '/insights/': {
    title: 'Insights on Offshore & Nearshore IT Teams | GKP Solutions',
    description:
      'Guides on offshore and nearshore IT staffing: costs, choosing a country, and onboarding remote teams, from ' +
      'GKP Solutions.',
    priority: 0.7,
  },
}

// Articles in the Insights section (newest first). Each also has a page in src/pages/insights/.
const INSIGHTS = [
  {
    path: '/insights/philippines-vs-argentina-offshore-qa/',
    title: 'Philippines vs. Argentina for Offshore QA',
    description:
      'Comparing the Philippines and Argentina for QA engineers: cost, time zones, English, talent pool and which ' +
      'teams each location suits best.',
    date: '2026-11-18',
    readMins: 6,
  },
  {
    path: '/insights/nearshore-dotnet-developer-cost-2027/',
    title: 'What a Nearshore .NET Developer Costs in 2027',
    description:
      'Typical 2027 hourly rates for nearshore .NET developers in Latin America by seniority and country, compared ' +
      'with the fully loaded cost of a US hire.',
    date: '2026-11-18',
    readMins: 5,
  },
  {
    path: '/insights/how-to-onboard-an-offshore-team/',
    title: 'How to Onboard an Offshore Team',
    description:
      'A practical 30-day plan for onboarding offshore and nearshore engineers: access, documentation, overlap ' +
      'hours, first tasks and feedback.',
    date: '2026-11-18',
    readMins: 7,
  },
]
INSIGHTS.forEach((a) => {
  PAGES[a.path] = { title: `${a.title} | GKP Solutions`, description: a.description, priority: 0.7, article: a }
})

// Leftover pages from the website template: kept out of search results and the sitemap.
const NOINDEX = [
  '/case-studies/', '/coming-soon/', '/course-details/', '/faq/', '/gallery/', '/it-services/',
  '/membership-levels/', '/profile-authentication/', '/services/', '/privacy-policy/', '/terms-of-service/', '/404/',
  '/404.html',
]

function normalize(path) {
  let p = (path || '/').split(/[?#]/)[0]
  if (!p.endsWith('/') && !p.endsWith('.html')) p += '/'
  return p
}

function seoFor(path) {
  const p = normalize(path)
  const page = PAGES[p] || {}
  return {
    path: p,
    url: SITE_URL + (p === '/' ? '/' : p),
    title: page.title || DEFAULT.title,
    description: page.description || DEFAULT.description,
    noindex: NOINDEX.includes(p) || p.startsWith('/404'),
    article: page.article || null,
  }
}

module.exports = { SITE_URL, ORG, DEFAULT, PAGES, INSIGHTS, NOINDEX, seoFor, normalize }
