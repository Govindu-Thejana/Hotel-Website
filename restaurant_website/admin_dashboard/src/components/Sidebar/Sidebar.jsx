import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Amarasa <span>Admin</span></h2>
      </div>
      
      <div className="sidebar-options">
        <NavLink 
          to='/add' 
          className={({isActive}) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <div className="sidebar-icon">
            <img src={assets.add_icon} alt="Add Items" />
          </div>
          <p>Add Items</p>
        </NavLink>
        
        <NavLink 
          to='/list' 
          className={({isActive}) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <div className="sidebar-icon">
            <img src={assets.order_icon} alt="List Items" />
          </div>
          <p>List Items</p>
        </NavLink>
        
        <NavLink 
          to='/orders' 
          className={({isActive}) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <div className="sidebar-icon">
            <img src={assets.order_icon} alt="Orders" />
          </div>
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
