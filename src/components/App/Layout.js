import React from 'react'
import { RecoilRoot } from 'recoil'
import GoTop from './GoTop'

const Layout = ({ children }) => {
    return (
        <RecoilRoot>
            {children}
            <GoTop scrollStepInPx="100" delayInMs="10.50" />
        </RecoilRoot>
    )
}

export default Layout
