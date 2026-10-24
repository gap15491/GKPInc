import React from 'react'
import Layout from "../components/App/Layout"
import Navbar from "../components/App/Navbar"
import Footer from "../components/App/Footer"
import CourseDetailsContent from '../components/CoursesDetails/CourseDetailsContent'
import RelatedCourses from '../components/CoursesDetails/RelatedCourses'

const Details = () => {
    return (
        <Layout>
            <Navbar />
            <CourseDetailsContent />
            <RelatedCourses />
            <Footer />
        </Layout>
    );
}

export default Details