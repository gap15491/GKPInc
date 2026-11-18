// Search-engine tags (title, description, canonical, structured data) for every page, included in the
// HTML Google first sees. Settings live in src/data/seo.js. Mirrors wrapPageElement in gatsby-browser.js.
import React from 'react'
import SEO from './src/components/App/SEO'
export const wrapPageElement = ({ element, props }) => (
  <>
    <SEO path={props.location.pathname} />
    {element}
  </>
)
