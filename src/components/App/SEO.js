import React from 'react'
import { Helmet } from "react-helmet"

const SEO = () => {
    return (
      <div>
        <Helmet>
          <title>GKP Solutions</title>
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
