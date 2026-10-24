import React from 'react'
import ReactWOW from 'react-wow'
import { Link } from 'gatsby'
import bannerImg from '../../assets/images/banner-img1.png'

const Banner = () => {
    return (
        <div className="it-services-banner">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12">
                        <div className="main-banner-content">
                            <ReactWOW delay='.1s' animation='fadeInLeft'>
                                <h1>GARY WILL FIND YOU PEOPLE! YOU NEED PEOPLE? WE GOT PEOPLE! COME ON DOWN TO CRAZY GARY'S IT SOLUTIONS! WE'LL BEAT ANYBODY'S PRICES!!!!</h1>
                            </ReactWOW>

                            <ReactWOW delay='.1s' animation='fadeInLeft'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </ReactWOW>

                            <ReactWOW delay='.1s' animation='fadeInRight'>
                                <div className="btn-box">
                                    
                                </div>
                            </ReactWOW>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <ReactWOW delay='.1s' animation='fadeInUp'>
                            <div className="main-banner-image">
                                <img src={bannerImg} alt="banner" />
                            </div>
                        </ReactWOW>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner