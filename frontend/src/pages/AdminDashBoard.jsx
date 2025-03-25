import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RoomBookingCalendar from "../components/booking/BookingManagement";
import AdminCalendarAdmin from "../components/AdminCalenderAdmin";

const AdminDashboard = () => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAvailableRooms();
    fetchAppointments();
  }, []);

  const fetchAvailableRooms = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("http://localhost:5555/rooms");
      // Only filter rooms that are available (true)
      const availableRooms = result.data.data.filter(
        (room) => room.availability === true // Ensure availability is 'true'
      );
      setAvailableRooms(availableRooms); // Only set available rooms
    } catch (error) {
      setErrorMessage("Failed to fetch available rooms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const result = await axios.get("http://localhost:5555/appointments");
      setAppointments(result.data.data || []);
    } catch (error) {
      setErrorMessage("Failed to fetch appointments. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md min-h-screen p-4">
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>

        {/* Navigation Links */}
        <nav className="mb-8">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin-dashboard"
                className="flex items-center p-2 rounded-lg bg-blue-50 text-blue-700"
              >
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-rooms"
                className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <span className="ml-3">Rooms</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-bookings"
                className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <span className="ml-3">Bookings</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-appointment"
                className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <span className="ml-3">Appointments</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Appointment Stats in Sidebar */}
        <div className="pt-4 border-t border-gray-200">
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          </div>

          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {errorMessage}</span>
            </div>
          )}

          {/* Rooms Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Room ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Room Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Price Per Night
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Availability
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {availableRooms.map((room) => (
                    <tr
                      key={room._id || room.roomId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {room.roomId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {room.roomType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {room.pricePerNight}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {room.availability ? "Available" : "Not Available"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <Link
                            to={`/admin-roomview/${room._id}`}
                            className="gap-2"
                          >
                            <button className="text-blue-600 hover:text-blue-800">
                              View
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Original RoomBookingCalendar Component */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">
              Room Booking Management
            </h3>
            <RoomBookingCalendar />
          </div>

          {/* New AdminCalendar Component */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6">Appointment Calendar</h3>
            <AdminCalendarAdmin appointments={appointments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
