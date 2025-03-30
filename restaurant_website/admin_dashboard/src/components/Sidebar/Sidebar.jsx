import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import {
  MdOutlineDashboard,
  MdAddCircleOutline,
  MdList,
  MdShoppingCart
} from 'react-icons/md';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Amarasa <span>Admin</span></h2>
      </div>
      <div className="sidebar-options">
        <NavLink
          to='/'
          className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <div className="sidebar-icon">
            <MdOutlineDashboard size={24} />
          </div>
          <p>Overview</p>
        </NavLink>

        <NavLink
          to='/add'
          className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <div className="sidebar-icon">
            <MdAddCircleOutline size={24} />
          </div>
          <p>Add Items</p>
        </NavLink>

        <NavLink
          to='/list'
          className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <div className="sidebar-icon">
            <MdList size={24} />
          </div>
          <p>List Items</p>
        </NavLink>

        <NavLink
          to='/orders'
          className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}
        >
          <div className="sidebar-icon">
            <MdShoppingCart size={24} />
          </div>
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;