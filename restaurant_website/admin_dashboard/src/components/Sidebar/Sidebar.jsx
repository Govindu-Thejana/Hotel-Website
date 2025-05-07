import React, { useEffect, useState, useRef } from 'react';
import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom';
import {
  MdOutlineDashboard,
  MdAddCircleOutline,
  MdList,
  MdShoppingCart
} from 'react-icons/md';
import { useDispatch } from 'react-redux';

const Sidebar = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const [hasNewOrders, setHasNewOrders] = useState(
    parseInt(localStorage.getItem('newOrderCount') || '0') > 0
  );
  const [newOrderCount, setNewOrderCount] = useState(
    parseInt(localStorage.getItem('newOrderCount') || '0')
  );
  const location = useLocation();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Sync newOrderCount with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('newOrderCount', newOrderCount.toString());
    setHasNewOrders(newOrderCount > 0);
  }, [newOrderCount]);

  const connectWebSocket = () => {
    // Clean up any existing connection
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    // Establish WebSocket connection
    const wsUrl = url.replace('http://', 'ws://').replace('https://', 'wss://') + '/api/orders/ws';
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected for sidebar updates');
      clearTimeout(reconnectTimeoutRef.current); // Clear any pending reconnect
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message !== 'Connected to order updates') {
          // Increment notification count for new order updates
          setNewOrderCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        dispatch({
          type: 'orders/addNotification',
          payload: { message: 'Error processing order update', type: 'error' },
        });
      }
    };

    ws.onclose = (event) => {
      console.log('Sidebar WebSocket disconnected:', event.code, event.reason);

      // Attempt to reconnect after a delay, unless it was a clean close or component unmounting
      if (!event.wasClean) {
        /*dispatch({
                  type: 'orders/addNotification',
                  payload: { message: 'Disconnected from order updates. Reconnecting...', type: 'warn' },
                }); */

        // Set up reconnection with exponential backoff
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect sidebar WebSocket...');
          connectWebSocket();
        }, 3000); // Wait 3 seconds before reconnecting
      }
    };

    ws.onerror = (error) => {
      console.error('Sidebar WebSocket error:', error);
      dispatch({
        type: 'orders/addNotification',
        payload: { message: 'WebSocket error in sidebar', type: 'error' },
      });
    };

    // Set up ping handling to respond to server pings
    ws.addEventListener('ping', () => {
      // No need to manually respond as the browser handles pong responses
      console.log('Received ping in sidebar');
    });

    return ws;
  };

  useEffect(() => {
    const ws = connectWebSocket();

    // Keep-alive from client side - send a heartbeat every 25 seconds
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log('Sending sidebar heartbeat');
        ws.send(JSON.stringify({ type: 'heartbeat' }));
      } else if (ws.readyState !== WebSocket.CONNECTING) {
        // If socket is closed or closing and not already connecting, try to reconnect
        console.log('Sidebar WebSocket not open, reconnecting...');
        connectWebSocket();
      }
    }, 25000);

    // Cleanup WebSocket connection and intervals on component unmount
    return () => {
      clearInterval(heartbeatInterval);
      clearTimeout(reconnectTimeoutRef.current);

      if (ws && ws.readyState === WebSocket.OPEN) {
        // Send a clean close
        ws.close(1000, "Component unmounting");
      }
    };
  }, [url, dispatch]); // Added dispatch to dependencies

  // Reset notification count when navigating to Orders page
  useEffect(() => {
    if (location.pathname === '/orders') {
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