import React from 'react'
import './footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>Experience the perfect blend of flavor and hospitality at Amarasa Restaurant, where every meal is a feast for the senses.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li><b>Home</b></li>
            <li><b>About Us</b></li>
            <li><b>Delivery</b></li>
            <li><b>Privacy policy</b></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><b>0372260002</b></li>
            <li><u><b>suneragira@gmail.com</b></u></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Amarasa.com <a href="" target="_blank" rel="noopener noreferrer"><u><b>Amarasa</b></u></a> - All Right Reserved.</p>
    </div>
  )
}

export default Footer
