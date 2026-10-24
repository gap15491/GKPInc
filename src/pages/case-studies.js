import React from 'react'
import Layout from "../components/App/Layout"
import Navbar from "../components/App/Navbar"
import Footer from "../components/App/Footer"
import TwoColumns from '../components/Studies/TwoColumns'

// Functional component
const CaseStudies = () => {
    return (
        <Layout>
            <Navbar />
           <TwoColumns />
            <Footer />
        </Layout>
    );
}

export default CaseStudies