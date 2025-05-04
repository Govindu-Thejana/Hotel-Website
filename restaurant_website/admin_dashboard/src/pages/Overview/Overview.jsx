import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSync, FaShoppingCart, FaUser, FaDollarSign, FaClock, FaCalendar, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Overview.css';

const Overview = ({ url }) => {
    const [overviewData, setOverviewData] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        scheduledOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalItems: 0,
        recentOrders: [],
    });
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCalendarPopup, setShowCalendarPopup] = useState(false);
    const [filterDate, setFilterDate] = useState(new Date());

    const fetchOverviewData = async () => {
        setLoading(true);
        try {
            const ordersResponse = await axios.get(`${url}/api/orders/`);
            const productsResponse = await axios.get(`${url}/api/products/`);

            const orders = ordersResponse.data.data || [];
            const products = productsResponse.data.products || [];

            const totalOrders = orders.length;
            const pendingOrders = orders.filter(order => order.status === 'Pending').length;
            const completedOrders = orders.filter(order => order.status === 'Delivered').length;
            const scheduledOrders = orders.filter(order => order.orderType === 'Scheduled').length;
            const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            const totalItems = products.length;

            setAllOrders(orders);
            updateRecentOrders(orders, filterStatus);

            setOverviewData(prev => ({
                ...prev,
                totalOrders,
                pendingOrders,
                completedOrders,
                scheduledOrders,
                totalRevenue,
                averageOrderValue,
                totalItems,
            }));
        } catch (error) {
            console.error("Overview Fetch Error:", error);
            toast.error("Failed to fetch overview data");
        } finally {
            setLoading(false);
        }
    };

    const updateRecentOrders = (orders, status) => {
        let filteredOrders = orders;
        if (status !== 'All') {
            filteredOrders = orders.filter(order => order.status === status);
        }
        const recentOrders = filteredOrders.slice();
        setOverviewData(prev => ({
            ...prev,
            recentOrders,
        }));
    };

    const handleOrderUpdate = (update) => {
        setAllOrders(prev => {
            let newOrders;
            switch (update.operation) {
                case 'insert':
                    newOrders = [update.order, ...prev];
                    toast.success(`New order received from ${update.order.name} for Rs. ${update.order.totalAmount}`, {
                        autoClose: false,
                    });
                    break;
                case 'update':
                    const index = prev.findIndex(o => o._id === update.order._id);
                    newOrders = index >= 0
                        ? [...prev.slice(0, index), update.order, ...prev.slice(index + 1)]
                        : prev;
                    toast.info(`Order ${update.order._id.slice(-6)} updated to status: ${update.order.status}`, {
                        autoClose: false,
                    });
                    break;
                case 'delete':
                    newOrders = prev.filter(o => o._id !== update.orderId);
                    toast.warn(`Order ${update.orderId.slice(-6)} was deleted`);
                    break;
                default:
                    return prev;
            }

            const totalOrders = newOrders.length;
            const pendingOrders = newOrders.filter(order => order.status === 'Pending').length;
            const completedOrders = newOrders.filter(order => order.status === 'Delivered').length;
            const scheduledOrders = newOrders.filter(order => order.orderType === 'Scheduled').length;
            const totalRevenue = newOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            updateRecentOrders(newOrders, filterStatus);
            setOverviewData(prev => ({
                ...prev,
                totalOrders,
                pendingOrders,
                completedOrders,
                scheduledOrders,
                totalRevenue,
                averageOrderValue,
            }));

            return newOrders;
        });
    };

    useEffect(() => {
        fetchOverviewData();

        // WebSocket connection
        const wsUrl = url.replace('http://', 'wss://').replace('https://', 'wss://') + '/api/orders/ws';
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket Update:', data);
            toast.info(`${data.message || 'New update received'}`);
            if (data.message) {
                console.log(data.message);
            } else if (data.error) {
                toast.error(`WebSocket Error: ${data.error}`);
            } else {
                handleOrderUpdate(data);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            toast.error("Lost connection to updates. Please refresh manually.");
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            toast.warn("Disconnected from real-time updates");
        };

        return () => {
            ws.close();
        };
    }, [url]);

    useEffect(() => {
        updateRecentOrders(allOrders, filterStatus);
    }, [filterStatus, allOrders]);

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleManualRefresh = () => {
        fetchOverviewData();
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowCalendarPopup(false);
    };

    const closePopup = () => {
        setSelectedOrder(null);
    };

    const getFilteredScheduledOrders = () => {
        if (!filterDate) return [];
        return allOrders.filter(order => {
            if (order.orderType !== 'Scheduled' || !order.scheduleDateTime) return false;
            const scheduleDate = new Date(order.scheduleDateTime);
            return (
                scheduleDate.getDate() === filterDate.getDate() &&
                scheduleDate.getMonth() === filterDate.getMonth() &&
                scheduleDate.getFullYear() === filterDate.getFullYear()
            );
        });
    };

    return (
        <div className="ov-container">
            <header className="ov-header">
                <h3>Admin Dashboard Overview</h3>
                <div className="ov-button-group">
                    <button onClick={() => setShowCalendarPopup(true)} className="ov-calendar-btn">
                        <FaCalendarAlt /> View Calendar
                    </button>
                    <button onClick={handleManualRefresh} disabled={loading} className="ov-refresh-btn">
                        <FaSync /> {loading ? 'Refreshing...' : 'Refresh Now'}
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="ov-loading">Loading overview data...</div>
            ) : (
                <div className="ov-content">
                    <div className="ov-summary-cards">
                        {[
                            { icon: <FaShoppingCart />, label: 'Total Orders', value: overviewData.totalOrders },
                            { icon: <FaClock />, label: 'Pending Orders', value: overviewData.pendingOrders },
                            { icon: <FaCheckCircle />, label: 'Completed Orders', value: overviewData.completedOrders },
                            { icon: <FaCalendar />, label: 'Scheduled Orders', value: overviewData.scheduledOrders },
                            { icon: <FaDollarSign />, label: 'Total Revenue', value: `Rs. ${overviewData.totalRevenue.toLocaleString()}` },
                            { icon: <FaDollarSign />, label: 'Avg. Order Value', value: `Rs. ${overviewData.averageOrderValue.toFixed(2)}` },
                            { icon: <FaBox />, label: 'Total Menu Items', value: overviewData.totalItems },
                        ].map((item, index) => (
                            <div key={index} className="ov-summary-card">
                                <div className="ov-summary-label">
                                    {item.icon} {item.label}
                                </div>
                                <div className="ov-summary-value">{item.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="ov-recent-orders">
                        <div className="ov-recent-header">
                            <h4>Recent Orders</h4>
                            <select value={filterStatus} onChange={handleFilterChange} className="ov-status-filter">
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        {overviewData.recentOrders.length > 0 ? (
                            <div className="ov-orders-table">
                                <div className="ov-table-header">
                                    <span>Order ID</span>
                                    <span>Customer</span>
                                    <span>Items</span>
                                    <span>Total</span>
                                    <span>Status</span>
                                    <span>Type</span>
                                    <span>Scheduled</span>
                                    <span>Date</span>
                                </div>
                                {overviewData.recentOrders.map((order) => (
                                    <div key={order._id} className="ov-order-row" onClick={() => handleOrderClick(order)}>
                                        <span>{order._id.slice(-6)}</span>
                                        <span>{order.name || 'N/A'}</span>
                                        <span>{order.items?.length || 0}</span>
                                        <span>Rs. {order.totalAmount?.toLocaleString() || 0}</span>
                                        <span className={`ov-status ov-status-${order.status?.toLowerCase() || 'na'}`}>
                                            {order.status || 'N/A'}
                                        </span>
                                        <span>{order.orderType || 'N/A'}</span>
                                        <span>
                                            {order.orderType === 'Scheduled' && order.scheduleDateTime
                                                ? new Date(order.scheduleDateTime).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
                                                : 'N/A'}
                                        </span>
                                        <span>
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
                                                : 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="ov-no-orders">No recent orders found for {filterStatus} status</div>
                        )}
                    </div>
                </div>
            )}

            {selectedOrder && (
                <div className="ov-popup-overlay" onClick={closePopup}>
                    <div className="ov-popup-content" onClick={e => e.stopPropagation()}>
                        <h3>Order Details</h3>
                        <div className="ov-popup-details">
                            <p><FaUser /> <strong>Customer:</strong> {selectedOrder.name || 'N/A'}</p>
                            <p><FaShoppingCart /> <strong>Order ID:</strong> {selectedOrder._id}</p>
                            <p><FaDollarSign /> <strong>Total:</strong> Rs. {selectedOrder.totalAmount?.toLocaleString() || 0}</p>
                            <p><FaTruck /> <strong>Status:</strong> {selectedOrder.status || 'N/A'}</p>
                            <p><FaCalendar /> <strong>Type:</strong> {selectedOrder.orderType || 'N/A'}</p>
                            {selectedOrder.orderType === 'Scheduled' && selectedOrder.scheduleDateTime && (
                                <p><FaClock /> <strong>Scheduled:</strong> {new Date(selectedOrder.scheduleDateTime).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                            )}
                            <p><FaCalendar /> <strong>Date:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }) : 'N/A'}</p>
                            <h4>Items:</h4>
                            <ul className="ov-item-list">
                                {selectedOrder.items?.map((item, index) => (
                                    <li key={index}><FaBox /> {item.name} - Qty: {item.quantity} - Rs. {item.price?.toLocaleString()}</li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={closePopup} className="ov-close-btn"><FaTimesCircle /> Close</button>
                    </div>
                </div>
            )}

            {showCalendarPopup && (
                <div className="ov-calendar-overlay" onClick={() => setShowCalendarPopup(false)}>
                    <div className="ov-calendar-content" onClick={e => e.stopPropagation()}>
                        <div className="ov-calendar-header">
                            <h3><FaCalendarAlt /> Scheduled Orders Calendar</h3>
                            <button onClick={() => setShowCalendarPopup(false)} className="ov-calendar-close-btn"><FaTimesCircle /></button>
                        </div>
                        <div className="ov-calendar-controls">
                            <button onClick={() => setFilterDate(new Date())} className="ov-today-btn"><FaCalendarAlt /> Today</button>
                            <div className="ov-legend">
                                <div><span className="ov-legend-dot ov-legend-green"></span> Has scheduled orders</div>
                                <div><span className="ov-legend-dot ov-legend-gray"></span> No scheduled orders</div>
                            </div>
                        </div>
                        <DatePicker
                            selected={filterDate}
                            onChange={(date) => setFilterDate(date)}
                            inline
                            calendarClassName="ov-datepicker"
                            renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                                <div className="ov-datepicker-header">
                                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="ov-nav-btn">{'<'}</button>
                                    <h3>{date.toLocaleString("default", { month: "long", year: "numeric" })}</h3>
                                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="ov-nav-btn">{'>'}</button>
                                </div>
                            )}
                            dayClassName={(date) => {
                                const isToday = new Date().toDateString() === date.toDateString();
                                const hasOrders = allOrders.some(order =>
                                    order.orderType === 'Scheduled' && order.scheduleDateTime &&
                                    new Date(order.scheduleDateTime).toDateString() === date.toDateString()
                                );
                                return `ov-day ${hasOrders ? 'ov-day-has-orders' : ''} ${isToday ? 'ov-day-today' : ''}`;
                            }}
                            renderDayContents={(day, date) => {
                                const ordersOnDate = allOrders.filter(order =>
                                    order.orderType === 'Scheduled' && order.scheduleDateTime &&
                                    new Date(order.scheduleDateTime).toDateString() === date.toDateString()
                                ).length;
                                const isCurrentMonth = date.getMonth() === filterDate.getMonth();
                                return (
                                    <div className="ov-day-content">
                                        {ordersOnDate > 0 && <span className="ov-order-count">{ordersOnDate}</span>}
                                        <span className={isCurrentMonth ? '' : 'ov-day-other-month'}>{day}</span>
                                    </div>
                                );
                            }}
                        />
                        {filterDate && getFilteredScheduledOrders().length > 0 && (
                            <div className="ov-scheduled-orders">
                                <h4>
                                    <FaCalendarAlt /> Scheduled Orders on {filterDate.toLocaleDateString()}
                                    <span className="ov-order-total">{getFilteredScheduledOrders().length} total</span>
                                </h4>
                                <div className="ov-scheduled-list">
                                    {getFilteredScheduledOrders().map((order) => (
                                        <div key={order._id} className="ov-scheduled-item" onClick={() => handleOrderClick(order)}>
                                            <p><FaUser /> <strong>{order.name}</strong></p>
                                            <p><FaClock /> {new Date(order.scheduleDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p><FaDollarSign /> Rs. {order.totalAmount?.toLocaleString()}</p>
                                            <p><FaBox /> {order.items?.length || 0} items</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="ov-calendar-footer">
                            <button onClick={() => setShowCalendarPopup(false)} className="ov-calendar-close-footer">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview;