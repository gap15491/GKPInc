import React from 'react';
import {Link} from 'gatsby'

const WhatWeDo = () => {
    return (
      <section className='what-we-do-area bg-fafafb pt-100 pb-70'>
        <div className='container'>
          <div className='section-title'>
            <h2>What We Do</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna.
            </p>
          </div>

          <div className='row'>
            <div className='col-lg-4 col-md-6 col-sm-6'>
              <div className='single-what-we-do-box'>
                <div className='icon'>
                  <i className='flaticon-segmentation'></i>
                </div>
                <h3>
                  <Link to='/service-details'>Research</Link>
                </h3>
                <p>
                  Lorem ipsum dolor sit consectetur, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt.
                </p>

                <Link to='/service-details' className='link'>
                  Market Research <i className='flaticon-right'></i>
                </Link>
                <Link to='/service-details' className='link'>
                  Investment Research <i className='flaticon-right'></i>
                </Link>
                <Link to='/service-details' className='read-more-btn'>
                  <i className='flaticon-right'></i> Read More
                </Link>
              </div>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-6'>
              <div className='single-what-we-do-box'>
                <div className='icon'>
                  <i className='flaticon-analytics'></i>
                </div>
                <h3>
                  <Link to='/service-details'>Analytics</Link>
                </h3>
                <p>
                  Lorem ipsum dolor sit consectetur, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt.
                </p>

                <Link to='/service-details' className='link'>
                  Data Analytics <i className='flaticon-right'></i>
                </Link>
                <Link to='/service-details' className='link'>
                  Business Intelligence <i className='flaticon-right'></i>
                </Link>
                <Link to='/service-details' className='read-more-btn'>
                  <i className='flaticon-right'></i>Read More
                </Link>
              </div>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-6 offset-lg-0 offset-md-3 offset-sm-3'>
              <div className='single-what-we-do-box'>
                <div className='icon'>
                  <i className='flaticon-settings'></i>
                </div>
                <h3>
                  <Link to='/service-details'>Technology</Link>
                </h3>
                <p>
                  GKP boasts a wide array of the industry’s elite tech and
                  business talent, but unlike many other staffing agencies
                  we fully support our teams with C-level advisory and solution
                  consulting.{" "}
                </p>

                <Link to='/service-details' className='link'>
                  Intelligence Automation <i className='flaticon-right'></i>
                </Link>
                <Link to='/service-details' className='link'>
                  Quality Engineering <i className='flaticon-right'></i>
                </Link>
                <Link to='/service-details' className='read-more-btn'>
                  <i className='flaticon-right'></i> Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default WhatWeDo;