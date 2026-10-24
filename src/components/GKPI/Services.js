import React from 'react';
import {Link} from 'gatsby'

import ServiceIcon7 from '../../assets/images/services/service-icon7.png'
import ServiceIcon8 from '../../assets/images/services/service-icon8.png'
import ServiceIcon9 from '../../assets/images/services/service-icon9.png'
import ServiceIcon10 from '../../assets/images/services/service-icon10.png'
import ServiceIcon11 from '../../assets/images/services/service-icon11.png'
import ServiceIcon12 from '../../assets/images/services/service-icon12.png'
import ServiceShape4 from '../../assets/images/services/service-shape4.png'

const Services = () => {
    return (
      <section className='services-area ptb-100'>
        <div className='container'>
          <div className='section-title'>
            <h2>One Goal. One Vision. One Team.</h2>
            <p>
              We specialize in helping our clients integrate people with the
              skills they need to solve problems. The business world has enough
              challenges without worrying about things that aren't part of your
              core business. Get the talent you need for design, development,
              analysis, and operations to deliver side-by-side with your teams.
              We also support our team with senior technology and project leaders
              every step of the way. We are unmatched in the world at providing
              this level of service.
            </p>
          </div>

          <div className='row'>
            <div className='col-lg-4 col-md-6 col-sm-12'>
              <div className='single-services-box-item'>
                <div className='icon'>
                  <img src={ServiceIcon7} alt='Service Icon' />
                </div>
                <h3>Technology</h3>
                <p>
                  GKP boasts a wide array of the industry’s elite tech and
                  business talent, but unlike many other staffing agencies we
                  fully support our teams with C-level advisory and solution
                  consulting.
                </p>
                <div className='shape'>
                  <img src={ServiceShape4} alt='Service Shape' />
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-12'>
              <div className='single-services-box-item'>
                <div className='icon'>
                  <img src={ServiceIcon8} alt='Service Icon' />
                </div>
                <h3>Design</h3>
                <p>
                  Create your long-term customer experience strategy with one of
                  our designers now. Our professionals help companies take a
                  human-first approach to deliver superior products.
                </p>
                <div className='shape'>
                  <img src={ServiceShape4} alt='Service Shape' />
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-12'>
              <div className='single-services-box-item'>
                <div className='icon'>
                  <img src={ServiceIcon9} alt='Service Icon' />
                </div>
                <h3>Operations</h3>
                <p>
                  GKP has a solid track record of allowing companies to
                  outsource ongoing maintenance, day-to-day processes, and
                  legacy systems support so that your company can focus on its
                  core competencies.
                </p>
                <div className='shape'>
                  <img src={ServiceShape4} alt='Service Shape' />
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-12'>
              <div className='single-services-box-item wow fadeInUp'>
                <div className='icon'>
                  <img src={ServiceIcon10} alt='Service Icon' />
                </div>
                <h3>Quality Assurance</h3>
                <p>
                  Partnering with GKP for your QA needs will allow you to ramp
                  up teams quickly with top-tier professionals around the globe.
                  The "follow the sun" testing approach allows businesses to
                  deliver better results faster.
                </p>
                <div className='shape'>
                  <img src={ServiceShape4} alt='Service Shape' />
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-12'>
              <div className='single-services-box-item wow fadeInUp'>
                <div className='icon'>
                  <img src={ServiceIcon11} alt='Service Icon' />
                </div>
                <h3>Leadership</h3>
                <p>
                  Missed opportunites for human resources innovation can have
                  strategic implications for your company. The massive shifts to
                  virtual work environments and hybrid models that combine
                  remote and onsite work will continue. GKP provides the
                  leadership to build high-performing teams globally.
                </p>
                <div className='shape'>
                  <img src={ServiceShape4} alt='Service Shape' />
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-12'>
              <div className='single-services-box-item wow fadeInUp'>
                <div className='icon'>
                  <img src={ServiceIcon12} alt='Service Icon' />
                </div>
                <h3>Process</h3>
                <p>
                  GKP can help shift your company's mindset and culture. Empower
                  people by training them in a new way of working. Change how
                  you create and deliver value to customers. And thrive in the
                  digital age with business agility.
                </p>
                <div className='shape'>
                  <img src={ServiceShape4} alt='Service Shape' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default Services;
