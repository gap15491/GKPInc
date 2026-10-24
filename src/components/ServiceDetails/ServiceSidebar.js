import React from 'react'
import {Link} from 'gatsby'

const ServiceSidebar = () => {
    return (
      <div className='services-contact-info'>
        <h3>Contact Info</h3>

        <ul>
          <li>
            <i className='bx bx-envelope'></i>
            <a href='mailto:gary@gkpsolutions.net'>&nbsp;gary@gkpsolutions.net</a>
          </li>
          <li>
            <div className='icon'>
              <i className='bx bx-phone-call'></i>
              <a href='tel:+16159444405'>+1 (615) 944-4405</a>
            </div>
            <span></span>
          </li>
          <li>
            <div className='icon'>
              <i className='bx bx-map'></i>
              <span></span>
              Nashville, USA
            </div>
          </li>
         
        </ul>
      </div>
    );
}

export default ServiceSidebar