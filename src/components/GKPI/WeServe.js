import React from 'react';
import {Link} from 'gatsby'

import VectorShape11 from '../../assets/images/shape/vector-shape11.png'

const WeServe = () => {
    return (
      <section className='industries-serve-area bg-fafafb pt-100 pb-70'>
        <div className='container'>
          <div className='section-title'>
            <h2>Industries We Serve</h2>
            <p>
              Don't let regulatory and compliance requirements limit your firm
              from leveraging global solutions to drive digital innovation. GKP
              works with all the complex control frameworks and regulatory
              requirements across critical industries. We have expertise in
              helping companies of all sizes manage their data and adhere to the
              various regulatory and compliance requirements.
            </p>
          </div>

          <div className='row'>
            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-industries-serve-box'>
                <div className='icon'>
                  <i className='flaticon-factory'></i>
                </div>
                Manufacturing
                <Link to='/service-details'></Link>
              </div>
            </div>

            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-industries-serve-box'>
                <div className='icon'>
                  <i className='flaticon-hospital'></i>
                </div>
                Healthcare
              </div>
            </div>

            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-industries-serve-box'>
                <div className='icon'>
                  <i className='flaticon-tracking'></i>
                </div>
                Automobile
              </div>
            </div>

            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-industries-serve-box'>
                <div className='icon'>
                  <i className='flaticon-investment'></i>
                </div>
                Banking
              </div>
            </div>

            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-industries-serve-box'>
                <div className='icon'>
                  <i className='flaticon-house'></i>
                </div>
                Real Estate
              </div>
            </div>

            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-industries-serve-box'>
                <div className='icon'>
                  <i className='flaticon-order'></i>
                </div>
                Logistics
              </div>
            </div>

            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-industries-serve-box'>
                <div className='icon'>
                  <i className='flaticon-family-insurance'></i>
                </div>
                Insurance
              </div>
            </div>

            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='single-industries-serve-box'>
                <div className='icon'>
                  <i className='flaticon-bitcoin'></i>
                </div>
                Investment
              </div>
            </div>
          </div>
        </div>

        <div className='vector-shape11'>
          <img src={VectorShape11} alt='Vector Shape' />
        </div>
      </section>
    );
}

export default WeServe;