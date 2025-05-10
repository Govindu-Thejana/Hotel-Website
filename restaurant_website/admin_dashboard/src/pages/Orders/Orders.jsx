import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all'); // New state for search field

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/orders/`);
      setOrders(response.data.data);
      setFilteredOrders(response.data.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const status = event.target.value;
    try {
      const response = await axios.patch(`${url}/api/orders/${orderId}/status`, { status });
      if (response.data.success) {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status } : order));
        setFilteredOrders(filteredOrders.map(order => order._id === orderId ? { ...order, status } : order));
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Failed to update status: " + error.message);
    }
  };

  const deleteOrderHandler = async (orderId) => {
    try {
      const response = await axios.delete(`${url}/api/orders/${orderId}`);
      if (response.data.success) {
        setOrders(orders.filter(order => order._id !== orderId));
        setFilteredOrders(filteredOrders.filter(order => order._id !== orderId));
        toast.success(response.data.message);
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Delete Order Error:", error);
      toast.error("Failed to delete order: " + error.message);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => {
        switch (searchField) {
          case 'orderId':
            return order._id.toLowerCase().includes(term);
          case 'name':
            return order.name.toLowerCase().includes(term);
          case 'email':
            return order.email.toLowerCase().includes(term);
          case 'status':
            return order.status.toLowerCase().includes(term);
          case 'paymentMethod':
            return order.paymentMethod.toLowerCase().includes(term);
          case 'city':
            return order.shippingAddress?.city.toLowerCase().includes(term);
          case 'totalAmount':
            return order.totalAmount.toString().includes(term);
          case 'orderType':
            return order.orderType?.toLowerCase().includes(term);
          case 'itemName':
            return order.items.some(item => item.name.toLowerCase().includes(term));
          case 'scheduleDateTime':
            return order.scheduleDateTime?.toLowerCase().includes(term);
          case 'all':
          default:
            return (
              order._id.toLowerCase().includes(term) ||
              order.name.toLowerCase().includes(term) ||
              order.email.toLowerCase().includes(term) ||
              order.status.toLowerCase().includes(term) ||
              order.paymentMethod.toLowerCase().includes(term) ||
              order.shippingAddress?.city.toLowerCase().includes(term) ||
              order.totalAmount.toString().includes(term) ||
              order.orderType?.toLowerCase().includes(term) ||
              order.scheduleDateTime?.toLowerCase().includes(term) ||
              order.items.some(item => item.name.toLowerCase().includes(term))
            );
        }
      });
      setFilteredOrders(filtered);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#FFD700', borderColor: '#FFA500' };
      case 'Processing':
        return { backgroundColor: '#87CEEB', borderColor: '#4682B4' };
      case 'Delivered':
        return { backgroundColor: '#32CD32', borderColor: '#228B22' };
      case 'Cancelled':
        return { backgroundColor: '#FF6347', borderColor: '#DC143C' };
      default:
        return { backgroundColor: '#f0f0f0', borderColor: '#ccc' };
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='orders-container'>
      <div className="orders-header">
        <h3>Orders Management</h3>
        <div className="search-controls">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="search-field-select"
          >
            <option value="all">All Fields</option>
            <option value="orderId">Order ID</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="status">Status</option>
            <option value="paymentMethod">Payment Method</option>
            <option value="city">City</option>
            <option value="totalAmount">Total Amount</option>
            <option value="orderType">Order Type</option>
            <option value="itemName">Item Name</option>
            <option value="scheduleDateTime">Schedule Date/Time</option>
          </select>
          <input
            type="search"
            placeholder={`Search by ${searchField === 'all' ? 'any field' : searchField}`}
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className='order-item'>
              <div className="order-icon">
                <img src={assets.parcel_icon} alt="Parcel" />
              </div>
              <div className="order-details">
                <div className="customer-info">
                  <p><strong>Order Id:</strong> {order._id}</p>
                  <p><strong>Delivery:</strong> {order.orderType || 'N/A'}</p>
                  <p><strong>Time:</strong> {order.scheduleDateTime || ''}</p>
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  {order.phoneNumber && <p><strong>Phone:</strong> {order.phoneNumber}</p>}
                  {order.shippingAddress && (
                    <p><strong>Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}, {order.shippingAddress.zipCode}</p>
                  )}
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                </div>
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="order-item-detail">
                        <img
                          src={item.image ? item.image : assets.placeholder_image}
                          alt={item.name || "Item"}
                          className="product-preview"
                          loading="lazy"
                          onError={(e) => { e.target.src = assets.placeholder_image; }}
                        />
                        <div className="item-info">
                          <p><strong>{item.name}</strong></p>
                          <p>Qty: {item.quantity} | Price: Rs. {item.price} | Total: Rs. {item.quantity * item.price}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="order-summary-actions">
                <div className="order-total">
                  <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
                </div>
                <div className="order-actions">
                  <select
                    name="status"
                    value={order.status}
                    onChange={(e) => statusHandler(e, order._id)}
                    className="status-select"
                    style={getStatusStyles(order.status)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    className="delete-btn"
                    onClick={() => deleteOrderHandler(order._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;