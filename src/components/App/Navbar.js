import React from 'react';
import { useRecoilState } from 'recoil'
import { collapsedState } from '../../utils/recoil-atoms'
import {Link} from 'gatsby'
import logo from "../../assets/images/logo.png"

const NavbarTwo = () => {
    const [collapsed, setCollapsed] = useRecoilState(collapsedState);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    }

    // Runs once when the page loads (the empty [] below). Without it, this ran
    // after every keystroke in a form and jumped the page back to the top.
    React.useEffect(() => {
        const elementId = document.getElementById("navbar");
        const onScroll = () => {
            if (window.scrollY > 170) {
                elementId.classList.add("is-sticky");
            } else {
                elementId.classList.remove("is-sticky");
            }
        };
        document.addEventListener("scroll", onScroll);
        window.scrollTo(0, 0);
        return () => document.removeEventListener("scroll", onScroll);
    }, [])

    const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
    const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';

    return (
      <React.Fragment>
        {/* Keeps the menu on one line now that it has more links */}
        <style>{`
          @media (min-width: 992px) {
            .tarn-nav .navbar .navbar-nav .nav-item a { white-space: nowrap; }
            .tarn-nav .navbar .others-option .default-btn { white-space: nowrap; }
            .tarn-nav .navbar .others-option { flex-shrink: 0; }
            .tarn-nav .navbar .navbar-nav { flex-wrap: nowrap; }
          }
          @media (min-width: 992px) and (max-width: 1399px) {
            .tarn-nav .navbar .navbar-nav .nav-item { margin-left: 8px; margin-right: 8px; }
            .tarn-nav .navbar .navbar-nav .nav-item a { font-size: 15.5px; }
          }
          @media (min-width: 992px) and (max-width: 1199px) {
            .tarn-nav .navbar .navbar-nav .nav-item { margin-left: 6px; margin-right: 6px; }
            .tarn-nav .navbar .navbar-nav .nav-item a { font-size: 14px; }
            .tarn-nav .navbar-brand img { max-width: 120px; }
            .nav-cta-long { display: none; }
          }
          .nav-cta-short { display: none; }
          @media (min-width: 992px) and (max-width: 1199px) { .nav-cta-short { display: inline; } }
        `}</style>
        <div id='navbar' className='navbar-area navbar-style-two'>
          <div className='tarn-nav'>
            <div className='container'>
              <nav className='navbar navbar-expand-lg navbar-light'>
                <Link
                  to='/'
                  onClick={() => setCollapsed(true)}
                  className='navbar-brand'>
                  <img src={logo} alt='logo' width='175' height='175' />
                </Link>

                <button
                  onClick={toggleNavbar}
                  className={classTwo}
                  type='button'
                  data-toggle='collapse'
                  data-target='#navbarSupportedContent'
                  aria-controls='navbarSupportedContent'
                  aria-expanded='false'
                  aria-label='Toggle navigation'>
                  <span className='icon-bar top-bar'></span>
                  <span className='icon-bar middle-bar'></span>
                  <span className='icon-bar bottom-bar'></span>
                </button>

                <div className={classOne} id='navbarSupportedContent'>
                  <ul className='navbar-nav'>
                    <li className='nav-item'>
                      <Link
                        to='/'
                        activeClassName='active'
                        className='nav-link'>
                        Home
                      </Link>
                    </li>

                    <li className='nav-item'>
                      <Link
                        to='/service-details'
                        activeClassName='active'
                        className='nav-link'>
                        Services
                      </Link>
                    </li>

                    <li className='nav-item'>
                      <Link
                        to='/savings-calculator'
                        activeClassName='active'
                        className='nav-link'>
                        Savings Calculator
                      </Link>
                    </li>

                    <li className='nav-item'>
                      <Link
                        to='/request-talent'
                        activeClassName='active'
                        className='nav-link'>
                        Request Talent
                      </Link>
                    </li>

                    <li className='nav-item'>
                      <Link
                        to='/cio-roundtable'
                        activeClassName='active'
                        className='nav-link'>
                        CIO Roundtable
                      </Link>
                    </li>

                    <li className='nav-item'>
                      <Link
                        to='/about-us'
                        activeClassName='active'
                        className='nav-link'>
                        About Us
                      </Link>
                    </li>


                  </ul>

                  <div className='others-option d-flex align-items-center'>
                    <div className='option-item'>
                      <Link
                        to='/contact'
                        onClick={() => setCollapsed(true)}
                        className='default-btn'>
                        <i className='flaticon-right'></i>
                        <b className='nav-cta-long' style={{ fontWeight: 'inherit' }}>Contact GKP Solutions</b>
                        <b className='nav-cta-short' style={{ fontWeight: 'inherit' }}>Contact</b> <span></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
}

export default NavbarTwo
