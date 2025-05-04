import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom';
import {
  MdOutlineDashboard,
  MdAddCircleOutline,
  MdList,
  MdShoppingCart
} from 'react-icons/md';

const Sidebar = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Establish WebSocket connection
    
    const wsUrl = url.replace('http://', 'wss://').replace('https://', 'wss://') + '/api/orders/ws';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected for sidebar updates');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message !== 'Connected to order updates') {
        // Increment notification count for new order updates
        setHasNewOrders(true);
        setNewOrderCount((prev) => prev + 1);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  // Reset notification when navigating to Orders page
  useEffect(() => {
    if (location.pathname === '/orders') {
      setHasNewOrders(false);
      setNewOrderCount(0);
    }
  }, [location]);

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
          <div className="sidebar-icon" style={{ position: 'relative' }}>
            <MdShoppingCart size={24} />
            {hasNewOrders && (
              <div
                className="notification-badge"
                aria-label={`${newOrderCount} new order updates`}
                title={`${newOrderCount} New Order Update${newOrderCount > 1 ? 's' : ''}`}
              >
                <div className="badge-content">
                  {newOrderCount > 9 ? '9+' : newOrderCount}
                </div>
              </div>
            )}
          </div>
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;