import React from 'react'
import ServiceSidebar from './ServiceSidebar'
import details1 from '../../assets/images/services/services-details1.jpg'
import project2 from '../../assets/images/projects/project2.jpg'
import charts from '../../assets/images/services/charts.jpg'

const ServiceDetailsContent = () => {
    return (
      <section className='services-details-area ptb-100'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-8 col-md-12'>
              <div className='services-details-desc'>
                <span className='sub-title'>Staffing Solutions</span>

                <div className='row align-items-center'>
                  <div className='col-lg-6 col-md-6'>
                    <div className='image'>
                      <img src={project2} alt='about' />
                    </div>
                  </div>

                  <div className='col-lg-6 col-md-6'>
                    <div className='content'>
                      <h3>Our People Include:</h3>
                      <ul>
                        <li>Software Engineers</li>
                        <li>UX Designers</li>
                        <li>DevOps Engineers</li>
                        <li>Database administrators</li>
                        <li>Mobile Developers</li>
                        <li>Network Engineers</li>
                        <li>Help desk support</li>
                        <li>...and more!</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p>
                  GKP offers deep expertise in the highest demand tech skill
                  sets, such as UI/UX, open source, mobile, Microsoft
                  development, data science, AI, DevOps, infrastructure, and
                  network security. Our high-touch, highly specialized teams,
                  create rich networks and amass in-depth knowledge of localized
                  technology markets; resulting in a truly consultative approach
                  and an exemplary track record of results. GKP provides
                  excellent results through strategic partnership and thought
                  leadership. As a leading staffing services firm specializing
                  in technology, finance, and accounting, GKP fully engages its
                  network of global professionals. We have successfully
                  delivered the human resources needs for dozens of employers,
                  including a high number from the Fortune 100.
                </p>
                <h3>Application Areas</h3>

                <div className='row'>
                  <div className='col-lg-4 col-sm-6 col-md-6'>
                    <div className='single-industries-serve-box'>
                      <div className='icon'>
                        <i className='flaticon-factory'></i>
                      </div>
                      Manufacturing
                    </div>
                  </div>

                  <div className='col-lg-4 col-sm-6 col-md-6'>
                    <div className='single-industries-serve-box'>
                      <div className='icon'>
                        <i className='flaticon-hospital'></i>
                      </div>
                      Healthcare
                    </div>
                  </div>

                  <div className='col-lg-4 col-sm-6 col-md-6'>
                    <div className='single-industries-serve-box'>
                      <div className='icon'>
                        <i className='flaticon-tracking'></i>
                      </div>
                      Automobile
                    </div>
                  </div>

                  <div className='col-lg-4 col-sm-6 col-md-6'>
                    <div className='single-industries-serve-box'>
                      <div className='icon'>
                        <i className='flaticon-investment'></i>
                      </div>
                      Banking
                    </div>
                  </div>

                  <div className='col-lg-4 col-sm-6 col-md-6'>
                    <div className='single-industries-serve-box'>
                      <div className='icon'>
                        <i className='flaticon-house'></i>
                      </div>
                      Real Estate
                    </div>
                  </div>

                  <div className='col-lg-4 col-sm-6 col-md-6'>
                    <div className='single-industries-serve-box'>
                      <div className='icon'>
                        <i className='flaticon-order'></i>
                      </div>
                      Logistics
                    </div>
                  </div>
                </div>

                <h3>Technologies That We Use</h3>
                <ul className='technologies-features'>
                  <li>
                    <span>JavaScript</span>
                  </li>
                  <li>
                    <span>Python</span>
                  </li>
                  <li>
                    <span>Flutter</span>
                  </li>
                  <li>
                    <span>Java</span>
                  </li>
                  <li>
                    <span>C/C++</span>
                  </li>
                  <li>
                    <span>Android</span>
                  </li>
                  <li>
                    <span>iOS</span>
                  </li>
                  <li>
                    <span>C#</span>
                  </li>
                  <li>
                    <span>PHP</span>
                  </li>
                  <li>
                    <span>Ruby</span>
                  </li>
                  <li>
                    <span>Selenium</span>
                  </li>
                </ul>
                {/*  <div className='charts-image'>
                //   <img src={charts} alt='about' /> PUT THE CHART BACK HERE MRR
                // </div> */}
              </div>
            </div>

            <div className='col-lg-4 col-md-12'>
              <ServiceSidebar />
            </div>
          </div>
        </div>
      </section>
    );
}

export default ServiceDetailsContent