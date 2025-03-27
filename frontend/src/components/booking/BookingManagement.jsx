import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar, Search, X, User, Mail, Phone, Home, Calendar as CalendarIcon, DollarSign, List, MessageSquare, Tag } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const RoomBookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useState({
    confirmationCode: "",
    startDate: "",
    endDate: "",
    roomId: "",
    status: "", // Added status to searchParams
  });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomsResponse, bookingsResponse] = await Promise.all([
          axios.get("https://hotel-website-backend-drab.vercel.app/rooms"),
          axios.get("https://hotel-website-backend-drab.vercel.app/bookedRoom/bookings"),
        ]);

        const validRooms = (roomsResponse.data.data || []).filter(
          (room) => room && room.roomId && room.roomType
        );
        setRooms(validRooms);
        if (validRooms.length === 0) {
          console.warn("No valid rooms found:", roomsResponse.data);
          setError("No valid room data available.");
        }

        const validBookings = (bookingsResponse.data || []).filter(
          (booking) => booking && booking.bookingId && booking.roomId
        );
        setBookings(validBookings);
        setFilteredBookings(validBookings);
        if (validBookings.length === 0) {
          console.warn("No valid bookings found:", bookingsResponse.data);
        }
      } catch (error) {
        setError("Failed to load data. Please try again.");
        toast.error("Error fetching data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (field) => (e) =>
    setSearchParams((prev) => ({ ...prev, [field]: e.target.value }));

  const applyFilters = () => {
    let filtered = [...bookings];
    const { confirmationCode, roomId, startDate, endDate, status } = searchParams;

    if (confirmationCode) {
      filtered = filtered.filter((booking) =>
        booking.bookingConfirmationCode.toLowerCase().includes(confirmationCode.toLowerCase())
      );
      if (filtered.length === 1) {
        setSelectedDate(new Date(filtered[0].checkIn));
        toast.info(`Finding booking for ${filtered[0].bookingConfirmationCode}`);
      } else if (filtered.length === 0) {
        toast.error("No booking found with this confirmation code");
      }
    }

    if (roomId) {
      filtered = filtered.filter((booking) =>
        booking.roomId?.roomId.toString().toLowerCase().includes(roomId.toLowerCase())
      );
    }

    if (startDate || endDate) {
      const sDate = startDate ? new Date(startDate) : null;
      const eDate = endDate ? new Date(endDate) : null;
      filtered = filtered.filter((booking) => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        if (sDate && eDate) {
          return (
            (checkIn >= sDate && checkIn <= eDate) ||
            (checkOut >= sDate && checkOut <= eDate) ||
            (checkIn <= sDate && checkOut >= eDate)
          );
        }
        if (sDate) return checkIn >= sDate || checkOut >= sDate;
        if (eDate) return checkIn <= eDate;
        return true;
      });
      if (startDate && !confirmationCode) setSelectedDate(new Date(startDate));
    }

    if (status) {
      filtered = filtered.filter((booking) =>
        booking.status.toLowerCase().includes(status.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
    if (filtered.length > 0) {
      toast.success(`Found ${filtered.length} bookings`);
    } else {
      toast.info("No bookings match the applied filters");
    }
  };

  const resetFilters = () => {
    setSearchParams({ confirmationCode: "", startDate: "", endDate: "", roomId: "", status: "" });
    setFilteredBookings(bookings);
    setSelectedDate(new Date());
    toast.info("Filters reset");
  };

  const handleUpdateStatus = useCallback(async () => {
    if (!selectedBooking?.bookingId || !newStatus) {
      toast.error("No booking or status selected");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5555/bookedRoom/bookings/status/${selectedBooking._id}`,
        { status: newStatus }
      );
      const updatedBookings = bookings.map((booking) =>
        booking.bookingId === selectedBooking.bookingId ? { ...booking, status: newStatus } : booking
      );
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Booking status updated to ${newStatus}`);
      setIsStatusModalOpen(false);
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking status:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedBooking, newStatus]);

  const getDatesForHeader = () => {
    const dates = [];
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < 8; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        fullDate: date,
        day: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        weekday: date.toLocaleString("default", { weekday: "short" }),
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }
    return dates;
  };

  const isDateWithinRange = (date, startDate, endDate) =>
    new Date(date).setHours(0, 0, 0, 0) >= new Date(startDate).setHours(0, 0, 0, 0) &&
    new Date(date).setHours(0, 0, 0, 0) <= new Date(endDate).setHours(0, 0, 0, 0);

  const renderBookings = (roomId, date) => {
    const booking = filteredBookings.find(
      (b) => b.roomId?.roomId === roomId && isDateWithinRange(date, b.checkIn, b.checkOut)
    );
    if (!booking) return null;

    return (
      <div className="h-full relative group">
        <div className="absolute top-1 right-1 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">
          ${booking.totalAmount}
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 bg-green-100 text-gray-800 text-xs p-1 rounded cursor-pointer hover:bg-green-200 transition-colors"
          onClick={() => {
            setSelectedBooking(booking);
            setIsModalOpen(true);
          }}
        >
          {booking.fullName} ({booking.status})
          <span className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
            Click for details
          </span>
        </div>
      </div>
    );
  };

  if (loading && !rooms.length && !bookings.length) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      {/* Top controls */}
      <div className="bg-gray-100 p-4 flex items-center gap-4 border-b border-gray-200">
        <Calendar className="w-5 h-5 text-gray-600" />
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
        >
          <Search className="w-4 h-4" />
          {isSearchExpanded ? "Hide Search" : "Show Search"}
        </button>
      </div>

      {/* Search panel */}
      {isSearchExpanded && (
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { label: "Confirmation Code", key: "confirmationCode", type: "text" },
              { label: "Start Date", key: "startDate", type: "date" },
              { label: "End Date", key: "endDate", type: "date" },
              { label: "Room ID", key: "roomId", type: "text" },
              { label: "Status", key: "status", type: "select", options: ["", "Confirmed", "Cancelled", "Completed"] }, // Added status filter
            ].map(({ label, key, type, options }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                {type === "select" ? (
                  <select
                    value={searchParams[key]}
                    onChange={handleSearchChange(key)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option || "All"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={searchParams[key]}
                    onChange={handleSearchChange(key)}
                    placeholder={type === "text" ? `Enter ${label.toLowerCase()}` : ""}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={resetFilters}
            >
              Reset
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-[250px_repeat(8,1fr)]">
            <div className="p-4 font-semibold text-gray-800 border-r border-b bg-gray-50">Room ID</div>
            {getDatesForHeader().map((date, idx) => (
              <div key={idx} className={`p-3 text-center border-r border-b bg-gray-50 ${date.isToday ? "bg-blue-50" : ""}`}>
                <div className="font-semibold text-gray-800">{date.weekday}</div>
                <div className="text-sm">{date.day}</div>
                <div className="text-xs text-gray-500">{date.month}</div>
              </div>
            ))}
          </div>
          {rooms.map((room) =>
            room ? (
              <div key={room.roomId} className="grid grid-cols-[250px_repeat(8,1fr)]">
                <div className="p-4 border-r border-b bg-gray-50 flex items-center">
                  <div className="font-medium text-gray-800">{room.roomId}</div>
                  <span className="ml-2 text-xs text-gray-500">({room.roomType})</span>
                </div>
                {getDatesForHeader().map((date, idx) => (
                  <div key={idx} className="h-20 border-r border-b p-1 relative">
                    {renderBookings(room.roomId, date.fullDate)}
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Search Results Section */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Results ({filteredBookings.length})</h3>
        {filteredBookings.length === 0 ? (
          <p className="text-gray-500">No bookings match your search criteria.</p>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setSelectedBooking(booking);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{booking.fullName}</p>
                    <p className="text-sm text-gray-600">
                      Room: {booking.roomId?.roomId || "N/A"} | {booking.roomId?.roomType || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Check-In: {new Date(booking.checkIn).toLocaleDateString()} | Check-Out: {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Confirmation: {booking.bookingConfirmationCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">${booking.totalAmount}</p>
                    <p
                      className={`text-sm font-medium ${booking.status === "Confirmed"
                        ? "text-green-600"
                        : booking.status === "Cancelled"
                          ? "text-red-600"
                          : "text-gray-600"
                        }`}
                    >
                      {booking.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Inside your RoomBookingCalendar component */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.01]">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                <Home className="w-6 h-6 text-blue-600" />
                Booking Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              {/* Left Column - Guest Info */}
              <div className="space-y-5 bg-gray-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Full Name:</strong>
                    <p className="mt-1 text-gray-800">{selectedBooking.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Email:</strong>
                    <p className="mt-1 text-gray-800">{selectedBooking.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Phone:</strong>
                    <p className="mt-1 text-gray-800">{selectedBooking.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Guests:</strong>
                    <p className="mt-1 text-gray-800">
                      {selectedBooking.guests.adults} Adults, {selectedBooking.guests.children} Children
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Info */}
              <div className="space-y-5 bg-gray-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Room:</strong>
                    <p className="mt-1 text-gray-800">
                      {selectedBooking.roomId?.roomId || "N/A"} ({selectedBooking.roomId?.roomType || "N/A"})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Check-In:</strong>
                    <p className="mt-1 text-gray-800">
                      {new Date(selectedBooking.checkIn).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Check-Out:</strong>
                    <p className="mt-1 text-gray-800">
                      {new Date(selectedBooking.checkOut).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Total Amount:</strong>
                    <p className="mt-1 text-blue-600 font-semibold">${selectedBooking.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <div>
                    <strong className="text-gray-900 font-semibold">Status:</strong>
                    <p
                      className={`mt-1 font-medium inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${selectedBooking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : selectedBooking.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {selectedBooking.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-8 space-y-5 bg-gray-50 p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <List className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <strong className="text-gray-900 font-semibold">Booked Dates:</strong>
                  <p className="mt-1 text-gray-800">
                    {selectedBooking.bookedDates?.length > 0
                      ? selectedBooking.bookedDates.map((date) => new Date(date).toLocaleDateString()).join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <strong className="text-gray-900 font-semibold">Special Requests:</strong>
                  <p className="mt-1 text-gray-800">{selectedBooking.specialRequests || "None"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <List className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <strong className="text-gray-900 font-semibold">Addons:</strong>
                  <p className="mt-1 text-gray-800">
                    {selectedBooking.addons?.length > 0
                      ? selectedBooking.addons.map((addon) => `${addon.type} ($${addon.price.toFixed(2)})`).join(", ")
                      : "None"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-600" />
                <div>
                  <strong className="text-gray-900 font-semibold">Confirmation Code:</strong>
                  <p className="mt-1 font-mono text-gray-800 bg-gray-200 px-2 py-1 rounded">{selectedBooking.bookingConfirmationCode}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-between gap-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 font-semibold"
                onClick={() => {
                  setNewStatus(selectedBooking.status);
                  setIsStatusModalOpen(true);
                }}
              >
                <Tag className="w-5 h-5" />
                Update Status
              </button>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-md font-semibold"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Status Update Confirmation Modal */}
      {isStatusModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Update Booking Status</h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Update the status for booking <span className="font-semibold">"{selectedBooking.bookingConfirmationCode}"</span>:
              </p>
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {newStatus === selectedBooking.status && (
                <p className="text-yellow-600 text-sm">This is the current status.</p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                disabled={loading}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={loading || newStatus === selectedBooking.status}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 ${loading || newStatus === selectedBooking.status ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomBookingCalendar;