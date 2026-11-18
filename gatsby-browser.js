// all styles here
import "./src/assets/css/bootstrap.min.css"
import "./src/assets/css/animate.min.css"
import "./src/assets/css/boxicons.min.css"
import "./src/assets/css/flaticon.css"
import './node_modules/react-modal-video/css/modal-video.min.css'
import 'react-accessible-accordion/dist/fancy-example.css'
import 'react-image-lightbox/style.css'
import "./src/assets/css/style.css"
import "./src/assets/css/responsive.css"
// Search-engine tags (title, description, canonical, structured data) for every page.
// Settings live in src/data/seo.js.
import React from 'react'
import SEO from './src/components/App/SEO'
export const wrapPageElement = ({ element, props }) => (
  <>
    <SEO path={props.location.pathname} />
    {element}
  </>
)
