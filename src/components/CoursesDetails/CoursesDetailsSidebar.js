import React from 'react'
import {Link} from 'gatsby'

import course1 from '../../assets/images/courses/course1.jpg'

import Loadable from '@loadable/component'
const ModalVideo = Loadable(() => import('react-modal-video'))

// functional component
const CoursesDetailsSidebar = () => {
    const [isOpen, setIsOpen] = React.useState(true);
    const openModal = () => {
        setIsOpen(!isOpen);
    }

    return (
        <React.Fragment>
            {/* If you want to change the video need to update videoID */}
            <ModalVideo 
                channel='youtube' 
                isOpen={!isOpen} 
                videoId='bk7McNUjWgw' 
                onClose={() => setIsOpen(!isOpen)} 
            /> 

            <div className="courses-details-info">
                <div className="image">
                    <img src={course1} alt="course1" />
                    
                    <Link 
                        to="#" 
                        onClick={e => {e.preventDefault(); openModal()}} 
                        className="link-btn popup-youtube"
                    >
                    </Link>

                    <div className="content">
                        <i className="flaticon-google-play"></i>
                        <span>Course Preview</span>
                    </div>
                </div>

                <ul className="info">
                    <li className="price">
                        <div className="d-flex justify-content-between align-items-center">
                            <span><i className="flaticon-price-tag"></i> Price</span>
                            $49
                        </div>
                    </li>
                    <li>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><i className="flaticon-teacher"></i> Instructor</span>
                            Sarah Taylor
                        </div>
                    </li>
                    <li>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><i className="flaticon-stopwatch"></i> Duration</span>
                            7 weeks
                        </div>
                    </li>
                    <li>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><i className="flaticon-distance-education"></i> Lessons</span>
                            25
                        </div>
                    </li>
                    <li>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><i className="flaticon-web"></i> Enrolled</span>
                            255 students
                        </div>
                    </li>
                    <li>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><i className="flaticon-open-padlock"></i> Access</span>
                            Lifetime
                        </div>
                    </li>
                </ul>

                <div className="btn-box">
                    <Link to="#" className="default-btn">
                        <i className="flaticon-shopping-basket"></i> 
                        Add to Cart <span></span>
                    </Link>
                    <Link to="#" className="default-btn">
                        <i className="flaticon-price-tag"></i> 
                        Buy Now <span></span>
                    </Link>
                </div>

                <div className="courses-share">
                    <div className="share-info">
                        <span>Share This Course <i className="flaticon-share"></i></span>

                        <ul className="social-link">
                            <li>
                                <Link to="https://www.facebook.com/" className="d-block" target="_blank" rel="noreferrer">
                                    <i className='bx bxl-facebook'></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="https://twitter.com/" className="d-block" target="_blank" rel="noreferrer">
                                    <i className='bx bxl-twitter'></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="https://www.instagram.com/" className="d-block" target="_blank" rel="noreferrer">
                                    <i className='bx bxl-instagram'></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="https://www.linkedin.com/" className="d-block" target="_blank" rel="noreferrer">
                                    <i className='bx bxl-linkedin'></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CoursesDetailsSidebar