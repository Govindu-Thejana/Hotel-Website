import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  Users,
  Bell,
  Search,
  Sun,
  Moon,
  BarChart2,
  FileText,
  Clock,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  // Format date function
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5555/bookedRoom/bookings');
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings data');
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5555/appointments/');
        setAppointments(response.data);
        setAppointmentsLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to fetch appointments data');
        setAppointmentsLoading(false);
      }
    };

    fetchBookings();
    fetchAppointments();
  }, []);

  // Sample Data Structure for booking trends
  const bookingTrendsData = [
    { month: 'Jan', bookings: 40 },
    { month: 'Feb', bookings: 30 },
    { month: 'Mar', bookings: 50 },
    { month: 'Apr', bookings: 45 },
    { month: 'May', bookings: 60 },
  ];

  // Dynamic quickStatsData using only the Total Bookings stat
  const quickStatsData = [
    {
      label: 'Total Bookings',
      value: loading ? '...' : bookings.length.toString(),
      color: 'blue'
    }
  ];

  const notificationsData = [
    { id: 1, message: 'New booking for Room 205', time: '2m ago' },
    { id: 2, message: 'Maintenance required for Room 103', time: '1h ago' },
    { id: 3, message: 'Upcoming event: Wedding Booking', time: '3h ago' },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNotificationClick = () => {
    toast.info('You have 3 new notifications', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Helper function to get status color class
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'
        }`}
    >
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          Dashboard Overview
        </h2>
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          {/* Search Bar */}
          <div className="relative flex-grow mr-4">
            <input
              type="text"
              placeholder="Search bookings, rooms, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-2 pl-10 rounded-lg ${isDarkMode
                ? 'bg-gray-800 text-white border-gray-700'
                : 'bg-white border-gray-200'
                }`}
            />
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
          </div>

          {/* Dark Mode Toggle & Notifications */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode
                ? 'bg-gray-700 text-yellow-400'
                : 'bg-gray-200 text-gray-700'
                }`}
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </button>

            <div
              className="relative cursor-pointer"
              onClick={handleNotificationClick}
            >
              <Bell className={isDarkMode ? 'text-white' : 'text-gray-700'} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats - Now with only Total Bookings */}
        <div className="mb-6">
          {quickStatsData.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${stat.color === 'blue' ? 'border-blue-500' : 'border-gray-500'
                } ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
            >
              <h3 className="text-gray-500 text-sm">{stat.label}</h3>
              <p
                className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Analytics & Appointments */}
        <div className="grid grid-cols-2 gap-6">
          <div
            className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
                }`}
            >
              Booking Trends
            </h3>

            <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded border border-dashed border-gray-300">
              <div className="text-center">
                <BarChart2
                  size={48}
                  className="mx-auto mb-2 text-gray-400"
                />
                <p className="text-gray-500">
                  Chart will appear here after installing recharts
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Run: npm install recharts
                </p>
              </div>
            </div>
          </div>

          {/* Appointments Section - Replacing Room Status */}
          <div
            className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
                }`}
            >
              Recent Appointments
            </h3>
            {appointmentsLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto mb-3 text-gray-400" size={40} />
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[300px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white dark:bg-gray-800">
                    <tr className="text-left border-b">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Date & Time</th>
                      <th className="pb-2">Reason</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((appointment, index) => (
                      <tr
                        key={appointment._id}
                        className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} 
                        ${index !== appointments.length - 1 ? 'border-b' : ''}`}
                      >
                        <td className="py-3">{appointment.name}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="mr-1">{formatDate(appointment.date)}</span>
                            <Clock size={14} className="mr-1 text-gray-400" />
                            <span>{appointment.time}</span>
                          </div>
                        </td>
                        <td className="py-3">{appointment.reason}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusColor(appointment.status)}`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {appointments.length > 5 && (
                  <div className="text-center mt-4">
                    <button
                      className={`text-blue-500 hover:text-blue-700 text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : ''}`}
                    >
                      View all {appointments.length} appointments
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div
          className={`mt-6 p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
          >
            Notifications
          </h3>
          {notificationsData.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border-b last:border-b-0 ${isDarkMode
                ? 'border-gray-700 hover:bg-gray-700'
                : 'hover:bg-gray-100'
                }`}
            >
              <p
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
              >
                {notification.message}
              </p>
              <span className="text-sm text-gray-500">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
    </div>
  );
};

export default AdminDashboard;