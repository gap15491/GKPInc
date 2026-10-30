import React from 'react'
import { Helmet } from "react-helmet"

const SEO = () => {
    return (
      <div>
        <Helmet>
          <title>GKP Solutions</title>
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png?v=2' />
          <link rel='icon' type='image/png' sizes='192x192' href='/icon-192.png?v=2' />
          <link rel='shortcut icon' href='/favicon.ico?v=2' />
          <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png?v=2' />
          <meta name='description' content='GKP Solutions IT for Technology Staffing' />
          <meta
            name='og:title'
            property='og:title'
            content='Global Staffing and Solutions'></meta>
          <meta name='twitter:card' content=''></meta>
          <link rel='canonical' href='https://https://gkpsolutions.net/'></link>
          <meta
            property='og:image'
            content='https://res.cloudinary.com/dev-empty/image/upload/v1593069801/explore-learning.jpg'
          />
        </Helmet>
      </div>
    );
}

export default SEO
