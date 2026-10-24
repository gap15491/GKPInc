import React from 'react'
import {Link} from 'gatsby'
import logo from "../../assets/images/logo.png"
import footerMap from "../../assets/images/footer-map.png"

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
      <footer className='footer-area bg-color'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-4 col-sm-6'>
              <div className='single-footer-widget'>
                <a href='/' className='logo'>
                  <img src={logo} alt='logo' />
                </a>
                <p>
                  We empower businesses with superior global resources and
                  leadership. Whether you need to drive innovation or just need
                  to outsource day-to-day operations, we will develop the
                  absolute best solution for your needs.
                </p>

                <ul className='social-link'>
                  <li>
                    <Link
                      to='https://www.linkedin.com/in/garypeck1/'
                      className='d-block'
                      target='_blank'
                      rel='noreferrer'>
                      <i className='bx bxl-linkedin'></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className='col-lg-2 col-sm-6'>
              <div className='single-footer-widget pl-5'>
                <h3>Explore</h3>

                <ul className='footer-links-list'>
                  <li>
                    <Link to='/'>Home</Link>
                  </li>
                  <li>
                    <Link to='/service-details'>Services</Link>
                  </li>
                  <li>
                    <Link to='/about-us'>About Us</Link>
                  </li>
                  <li>
                    <Link to='/contact'>Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className='col-lg-2 col-sm-6'>
              <div className='single-footer-widget'>
                {/*} <h3>Resources</h3>

                <ul className='footer-links-list'>
                  <li>
                    <Link to='/services'>Services</Link>
                  </li>
                  <li>
                    <Link to='/testimonials'>Testimonials</Link>
                  </li>
                  <li>
                    <Link to='/case-studies'>Case Studies</Link>
                  </li>
                </ul>*/}
              </div>
            </div>

            <div className='col-lg-4 col-sm-6'>
              <div className='single-footer-widget'>
                <h3>Address</h3>

                <ul className='footer-contact-info'>
                  <li>
                    <i className='bx bx-phone-call'></i>
                    <a href='tel:+16159444405'>+1 (615) 944 4405</a>
                  </li>
                  <li>
                    <i className='bx bx-envelope'></i>
                    <a href='mailto:gary@gkpsolutions.net'>
                      gary@gkpsolutions.net
                    </a>
                  </li>

                  <li>
                    <i className='bx bx-map'></i>
                    Nashville, TN
                    <br /> USA
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='footer-bottom-area'>
            <div className='row align-items-center'>
              <div className='col-lg-6 col-md-6'>
                {/* <ul>
                  <li>
                    <Link to='/privacy-policy'>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to='/terms-of-service'>Terms & Conditions</Link>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
        </div>

        <div className='footer-map'>
          <img src={footerMap} alt='footer-logo' />
        </div>
      </footer>
    );
}

export default Footer;