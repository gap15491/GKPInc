import React from 'react'
import { RecoilRoot } from 'recoil'
import GoTop from './GoTop'
import SEO from './SEO'

const Layout = ({ children }) => {
    return (
        <RecoilRoot>
            <SEO />
            {children}
            <GoTop scrollStepInPx="100" delayInMs="10.50" />
        </RecoilRoot>
    )
}

export default Layout
