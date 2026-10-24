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

    React.useEffect(() => {
        let elementId = document.getElementById("navbar");
        document.addEventListener("scroll", () => {
            if (window.scrollY > 170) {
                elementId.classList.add("is-sticky");
            } else {
                elementId.classList.remove("is-sticky");
            }
        });
        window.scrollTo(0, 0);
    })

    const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
    const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';

    return (
      <React.Fragment>
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
                        to='/about-us'
                        activeClassName='active'
                        className='nav-link'>
                        About Us
                      </Link>
                    </li>


                  </ul>

                  <div className='others-option d-flex align-items-center'>
                    <div className='option-item'>
               
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
