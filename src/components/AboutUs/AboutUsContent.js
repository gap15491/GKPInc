import React from 'react'
import { Link } from 'gatsby'
import aboutImage from '../../assets/images/about/about-img5.png'
import starIcon from '../../assets/images/star-icon.png'
import icon4 from '../../assets/images/icons/icon4.png'
import icon5 from '../../assets/images/icons/icon5.png'
import icon6 from '../../assets/images/icons/icon6.png'
import icon7 from '../../assets/images/icons/icon7.png'
import shape1 from '../../assets/images/shape/circle-shape1.png'
 
const AboutUsContent = () => {
    return (
        <section className="about-area ptb-100">
         

            <div className="circle-shape1">
                <img src={shape1} alt="banner" />
            </div>

            <div className="container">
                <div className="about-inner-area">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="about-text">
                                <h3>Our Philosophy</h3>
                                <p>Real innovations and a positive customer experience are the heart of our success. This is through:</p>
                                
                                <ul className="features-list">
                                    <li><i className="flaticon-tick"></i>Defining the client's real needs.</li>
                                    <li><i className="flaticon-tick"></i>Matching those needs to the right people.</li>
                                    <li><i className="flaticon-tick"></i>Delivering on our promises.</li>
                                    <li><i className="flaticon-tick"></i>Building a true partnership.</li>
                                </ul>
                            </div>
                        </div>
    
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="about-text">
                                <h3>Our Mission</h3>
                                <p>Our mission is to deliver real innovations and a positive customer experience. We do this by:</p>
                                
                                <ul className="features-list">
                                    <li><i className="flaticon-tick"></i>Exceeding expectations and delighting customers.</li>
                                    <li><i className="flaticon-tick"></i>Being a partner that you can always trust.</li>
                                    <li><i className="flaticon-tick"></i>Making sure that your goals are achieved.</li>
                                    <li><i className="flaticon-tick"></i>Always finding the right talent and growing their skills.</li>
                                </ul>
                            </div>
                        </div>
    
                        <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-0 offset-md-3 offset-sm-3">
                            <div className="about-text">
                                <h3>Who We Are</h3>
                                <p>We purposefully differentiate ourselves from your average staffing company. This is what makes us different:</p>
                                
                                <ul className="features-list">
                                    <li><i className="flaticon-tick"></i> We do MUCH more than just helping to fill job orders.</li>
                                    <li><i className="flaticon-tick"></i> We have senior leaders with backgrounds in real consulting.</li>
                                    <li><i className="flaticon-tick"></i> We support your teams every step of the way.</li>
                                    <li><i className="flaticon-tick"></i> We know your strongest asset is your people.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="circle-shape1">
                <img src={shape1} alt="banner" />
            </div>
        </section>
    )
}

export default AboutUsContent;
