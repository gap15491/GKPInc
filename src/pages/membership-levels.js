import React from 'react'
import Layout from "../components/App/Layout"
import Navbar from "../components/App/Navbar"
import Footer from "../components/App/Footer"
import {Link} from 'gatsby'

const MembershipLevels = () => {
    return (
        <Layout>
            <Navbar />
  
            <div className="membership-levels-area ptb-100">
                <div className="container">
                    <div className="membership-levels-table table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>
                                        <span className="price">$500</span>
                                        <span className="title">Silver Membership</span>
                                        <span className="desc">You can view few features</span>
                                    </th>
                                    <th>
                                        <span className="price">$1,000</span>
                                        <span className="title">Gold Membership</span>
                                        <span className="desc">You can view most features</span>
                                    </th>
                                    <th>
                                        <span className="price">$1,500</span>
                                        <span className="title">Diamond Membership</span>
                                        <span className="desc">You can view all features</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Number of features</td>
                                    <td>4</td>
                                    <td>8</td>
                                    <td>15</td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Investment Fundamentals & Data Analytics
                                        </Link>
                                    </td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Hands-On Python & R In Data Science
                                        </Link>
                                    </td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Complete Data Science Bootcamp
                                        </Link>
                                    </td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Programming MasterclassName for Developers
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Hands-On Artificial Neural Networks
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            PRINCE2® Practitioner Certification Training
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            PMI-RMP® Certification Training
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            PRINCE2® Foundation Certification Training
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            PMP® Plus
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            PMP® Renewal Pack
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Digital Project Manager
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Agile Project Management; Agile Delivery
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Vue JS 2 - The Complete Guide
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Everything You Need to Program in Python
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Mathematical Foundation For Machine Learning
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Drawing Course - Beginner to Advanced
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Deep Learning and Artificial Intelligence
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Information About UI/UX Design Degree
                                        </Link>
                                    </td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Photography Photo modify and Beautiful
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="#">
                                            Professional IT Expert Certificate Course
                                        </Link>
                                    </td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-none"><i className='bx bx-x'></i></td>
                                    <td className="item-check"><i className='bx bx-check'></i></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <Link to="#" className="select-btn">
                                            Get it now
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to="#" className="select-btn">
                                            Get it now
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to="#" className="select-btn">
                                            Get it now
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </Layout>
    )
}

export default MembershipLevels