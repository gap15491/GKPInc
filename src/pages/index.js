import React from 'react';
import Navbar from "../components/App/Navbar"
import Footer from "../components/App/Footer"
import Layout from "../components/App/Layout"
import MainBanner from '../components/GKPI/MainBanner'
import Services from '../components/GKPI/Services'
import WeServe from '../components/GKPI/WeServe'


const Home = () => {
    return (
      <Layout>
        <Navbar />
        <MainBanner />
        <Services />
        <WeServe />
        <Footer />
      </Layout>
    );
}

export default Home;