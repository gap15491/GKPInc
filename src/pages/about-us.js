import React from 'react'
import Layout from "../components/App/Layout"
import Navbar from "../components/App/Navbar"
import Footer from "../components/App/Footer"
import AboutUsContent from '../components/AboutUs/AboutUsContent'
import WhyChooseUs from '../components/AboutUs/WhyChooseUs'
const AboutUs = () => {
    return (
      <Layout>
        <Navbar />
        <WhyChooseUs />
        <AboutUsContent />

        <Footer />
      </Layout>
    );
}

export default AboutUs;