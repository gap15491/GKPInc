import React from 'react'
import { Helmet } from 'react-helmet'
import { SITE_URL, ORG, seoFor } from '../../data/seo'

// Page title, description, share image and structured data for search engines.
// Everything comes from src/data/seo.js, looked up by the page's URL. It's added to every page by
// wrapPageElement in gatsby-ssr.js / gatsby-browser.js, so pages don't need to include it.

const OG_IMAGE = `${SITE_URL}/og-image.png`

const organization = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: ORG.name,
  alternateName: 'GKP Solutions',
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  image: OG_IMAGE,
  description:
    'Global IT staffing firm providing offshore and nearshore developers, QA, DevOps, cloud and IT support ' +
    'engineers to US companies.',
  telephone: ORG.phone,
  email: ORG.email,
  foundingDate: ORG.founded,
  address: { '@type': 'PostalAddress', addressLocality: ORG.city, addressRegion: ORG.region, addressCountry: ORG.country },
  areaServed: [{ '@type': 'Country', name: 'United States' }, 'Worldwide'],
  sameAs: [ORG.linkedin],
  knowsAbout: ['IT staffing', 'Offshore staffing', 'Nearshore staffing', 'Staff augmentation', 'Global IT staffing',
    'Software development outsourcing', 'QA outsourcing', 'DevOps outsourcing'],
  makesOffer: ['Global IT Staffing', 'Offshore IT Staffing', 'Nearshore IT Staffing', 'IT Staff Augmentation']
    .map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
}

const SEO = ({ path }) => {
  const s = seoFor(path)
  const article = s.article && {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: s.article.title,
    description: s.article.description,
    datePublished: s.article.date,
    dateModified: s.article.date,
    author: { '@type': 'Person', name: 'Gary Peck', jobTitle: 'Founder & CEO, GKP Solutions' },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: s.url,
    image: OG_IMAGE,
  }
  return (
    <Helmet>
      <html lang='en' />
      <title>{s.title}</title>
      <meta name='description' content={s.description} />
      {s.noindex ? <meta name='robots' content='noindex, follow' /> : <link rel='canonical' href={s.url} />}
      <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png?v=2' />
      <link rel='icon' type='image/png' sizes='192x192' href='/icon-192.png?v=2' />
      <link rel='shortcut icon' href='/favicon.ico?v=2' />
      <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png?v=2' />
      <meta property='og:type' content={s.article ? 'article' : 'website'} />
      <meta property='og:site_name' content='GKP Solutions' />
      <meta property='og:title' content={s.title} />
      <meta property='og:description' content={s.description} />
      <meta property='og:url' content={s.url} />
      <meta property='og:image' content={OG_IMAGE} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={s.title} />
      <meta name='twitter:description' content={s.description} />
      <meta name='twitter:image' content={OG_IMAGE} />
      <script type='application/ld+json'>{JSON.stringify(organization)}</script>
      {article && <script type='application/ld+json'>{JSON.stringify(article)}</script>}
    </Helmet>
  )
}

export default SEO
