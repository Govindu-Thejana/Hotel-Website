import React, { useState, useContext } from 'react';
import './navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';  // Import StoreContext here

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount } = useContext(StoreContext);  // Correct usage of StoreContext

  return (
    <div className='navbar'>
      <Link to='/'> <img src={assets.logo} alt="Logo" className='logo' /></Link>
      <ul className='navbar-menu'>
        <li>
          <Link to='/' className={menu === "Home" ? "active" : ""} onClick={() => setMenu("Home")}>
            Home
          </Link>
        </li>
        <li>
          <a href='#explore-menu' className={menu === "Menu" ? "active" : ""} onClick={() => setMenu("Menu")}>
            Menu
          </a>
        </li>
        <div className='navbar-search-icon'>
          <li>
            <Link to='/cart' className={menu === "Cart" ? "active" : ""} onClick={() => setMenu("Cart")}>
              Cart
            </Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </li>
        </div>
        <li>
          <a href='#app-download' className={menu === "Mobile-App" ? "active" : ""} onClick={() => setMenu("Mobile-App")}>
            Mobile App
          </a>
        </li>
        <li>
          <a href='#footer' className={menu === "Contact Us" ? "active" : ""} onClick={() => setMenu("Contact Us")}>
            Contact Us
          </a>
        </li>
      </ul>
      <div className='navbar-right'>
        <img src={assets.search_icon} alt="Search" />
        <div className='navbar-search-icon'>
          <Link to='/cart'> <img src={assets.basket_icon} alt="Basket" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        <button onClick={() => setShowLogin(true)}>Sign In</button>
      </div>
    </div>
  );
};

export default Navbar;
