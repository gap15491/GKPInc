import React from 'react'
import starIcon from '../../assets/images/star-icon.png'
import howItWork from '../../assets/images/how-its-work.png'

const WhyChooseUs = () => {
    return (
      <section className='how-its-work-area ptb-100'>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-lg-6 col-md-12'>
              <div className='how-its-work-content'>
                <span className='sub-title'>
                  <img src={starIcon} alt='banner' />
                  Customers Love Us
                </span>
                <h2>Why Choose Us?</h2>
                <p>
                  GKP seeks to add value at every step of your staffing process.
                  Unlike most companies that are simply trying to fill job
                  descriptions, GKP provides you with true thought leadership in
                  the fast-paced business world. We don't just do the basics for
                  staffing. We are real advisory and solutioning partners for our
                  clients. We are also unique in that we follow a true Design
                  Thinking process for global staffing that drives innovation.
                </p>
                <div className='inner-box'>
                  <div className='single-item'>
                    <div className='count-box'>1</div>
                    <h3>Understand Your Goals</h3>
                    <p>
                      We want to understand the short-term and long-term goals
                      and objectives of your company so we can align a staffing
                      strategy with your true needs.
                    </p>
                  </div>
                  <div className='single-item'>
                    <div className='count-box'>2</div>
                    <h3>Look for Actionable Insights</h3>
                    <p>
                      Once we have an accurate view of your people landscape, we
                      look for skills gaps and identify potential candidates
                      that can bring the most value to your organization.
                    </p>
                  </div>
                  <div className='single-item'>
                    <div className='count-box'>3</div>
                    <h3>Plan for Success</h3>
                    <p>
                      We take a holistic look at the people, processes, and
                      technologies that are needed for success and put
                      together a plan of action. We consider the timeline of
                      deliverables required to complete the mission.
                    </p>
                  </div>
                  <div className='single-item'>
                    <div className='count-box'>4</div>
                    <h3>Deliver</h3>
                    <p>
                      This is the heart of what GKP does. We execute on the plan we have built together
                      and bring you the world's top talent. We are unmatched in making sure you have the
                      right skills and the right personalities for winning teams.
                    </p>
                  </div>
                  <div className='single-item'>
                    <div className='count-box'>5</div>
                    <h3>Communication and Support</h3>
                    <p>
                      The success of any relationship hinges on good communication.
                      That's why GKP always keeps a solid communication plan in place.
                      We also provide ongoing support of our people and follow through together
                      to make sure everything is going to plan and that we are on the road to success.
                   
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-lg-6 col-md-12'>
              <div className='how-its-work-image'>
                <img src={howItWork} alt='banner' />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default WhyChooseUs
