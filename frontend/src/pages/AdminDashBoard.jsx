import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Calendar,
  Users,
  Bell,
  Search,
  Sun,
  Moon,
  BarChart2,
  FileText
} from 'lucide-react';

// Sample Data Structures
const bookingTrendsData = [
  { month: 'Jan', bookings: 40 },
  { month: 'Feb', bookings: 30 },
  { month: 'Mar', bookings: 50 },
  { month: 'Apr', bookings: 45 },
  { month: 'May', bookings: 60 },
];

const quickStatsData = [
  { label: 'Total Bookings', value: '452', color: 'blue' },
  { label: 'Rooms Occupied', value: '87', color: 'green' },
  { label: 'Pending Requests', value: '12', color: 'yellow' },
  { label: 'Revenue', value: '$45,670', color: 'purple' }
];

const roomStatusData = [
  { roomNumber: '101', status: 'Available', type: 'Standard' },
  { roomNumber: '102', status: 'Booked', type: 'Deluxe' },
  { roomNumber: '103', status: 'Maintenance', type: 'Suite' },
];

const notificationsData = [
  { id: 1, message: 'New booking for Room 205', time: '2m ago' },
  { id: 2, message: 'Maintenance required for Room 103', time: '1h ago' },
  { id: 3, message: 'Upcoming event: Wedding Booking', time: '3h ago' },
];

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>


      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Dashboard Overview</h2>
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
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
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
            <div className="relative">
              <Bell className={isDarkMode ? 'text-white' : 'text-gray-700'} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {quickStatsData.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-${stat.color}-500 ${isDarkMode ? 'bg-gray-800 text-white' : ''
                }`}
            >
              <h3 className="text-gray-500 text-sm">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Analytics & Room Status */}
        <div className="grid grid-cols-2 gap-6">
          {/* Booking Trends Chart */}
          <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Booking Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingTrendsData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Room Status */}
          <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Room Status
            </h3>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th>Room</th>
                  <th>Status</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {roomStatusData.map((room, index) => (
                  <tr key={index} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <td>{room.roomNumber}</td>
                    <td>
                      <span className={`
                        px-2 py-1 rounded text-xs 
                        ${room.status === 'Available' ? 'bg-green-100 text-green-800' :
                          room.status === 'Booked' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}
                      `}>
                        {room.status}
                      </span>
                    </td>
                    <td>{room.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className={`mt-6 p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Notifications
          </h3>
          {notificationsData.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border-b last:border-b-0 ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
            >
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {notification.message}
              </p>
              <span className="text-sm text-gray-500">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;