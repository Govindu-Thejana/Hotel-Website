import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminCalendar from "./AdminCalendar";
import {
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaCommentAlt,
  FaExclamationCircle,
  FaFilter,
  FaExpand,
  FaWindowClose,
  FaHourglassHalf,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "./custom-calendar.css"; // We'll create this file next

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Replace separate date and time with DatePicker
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  // For filtering appointments
  const [filterDate, setFilterDate] = useState(null);

  // Remove showCalendarView state

  // Add state for popup calendar
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  // Add state for next appointment timer
  const [nextAppointment, setNextAppointment] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Add pagination state for each section
  const [pendingPage, setPendingPage] = useState(0);
  const [confirmedPage, setConfirmedPage] = useState(0);
  const [cancelledPage, setCancelledPage] = useState(0);
  const [upcomingPage, setUpcomingPage] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5555/appointments");
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleConfirm = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to confirm this appointment?"
    );
    if (!userConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "confirmed",
          confirmedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to confirm appointment");

      const updatedAppointment = await response.json();

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id ? updatedAppointment : appointment
        )
      );
    } catch (error) {
      console.error("Error confirming appointment:", error);
      setError("Failed to confirm appointment");
    }
  };

  const handleCancel = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!userConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          cancelledAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to cancel appointment");

      const updatedAppointment = await response.json();

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id ? updatedAppointment : appointment
        )
      );
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setError("Failed to cancel appointment");
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    // Convert the appointment date and time to a Date object for DatePicker
    const [year, month, day] = new Date(appointment.date)
      .toISOString()
      .split("T")[0]
      .split("-")
      .map(Number);
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const dateTime = new Date(year, month - 1, day, hours, minutes);
    setSelectedDateTime(dateTime);
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setSelectedDateTime(null);
  };

  const handleSaveEdit = async () => {
    if (!editingAppointment || !selectedDateTime) return;

    try {
      // Format date and time from the selected DateTime
      const date = selectedDateTime.toISOString().split("T")[0];
      const time = selectedDateTime.toTimeString().slice(0, 5); // HH:MM format

      const response = await fetch(
        `http://localhost:5555/appointments/${editingAppointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: date,
            time: time,
            phone: editingAppointment.phone,
            reason: editingAppointment.reason,
            status:
              editingAppointment.status === "cancelled"
                ? "confirmed"
                : editingAppointment.status,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update appointment");

      const updatedAppointment = await response.json();

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === editingAppointment._id
            ? updatedAppointment
            : appointment
        )
      );

      // Reset the edit state
      setEditingAppointment(null);
      setSelectedDateTime(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError("Failed to update appointment");
    }
  };

  // Filter appointments by selected date
  const getFilteredAppointments = () => {
    if (!filterDate) return confirmedAppointments;

    return confirmedAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === filterDate.getDate() &&
        appointmentDate.getMonth() === filterDate.getMonth() &&
        appointmentDate.getFullYear() === filterDate.getFullYear()
      );
    });
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!userConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete appointment");

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError("Failed to delete appointment");
    }
  };

  // Categorize and sort appointments
  const pendingAppointments = appointments
    .filter(
      (appointment) => !appointment.status || appointment.status === "pending"
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const confirmedAppointments = appointments
    .filter((appointment) => appointment.status === "confirmed")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const cancelledAppointments = appointments
    .filter((appointment) => appointment.status === "cancelled")
    .sort(
      (a, b) =>
        new Date(b.cancelledAt || b.createdAt) -
        new Date(a.cancelledAt || a.createdAt)
    );

  // Find and set the next appointment
  useEffect(() => {
    const findNextAppointment = () => {
      const now = new Date();

      // Filter confirmed appointments that are in the future
      const upcomingAppointments = appointments
        .filter((app) => app.status === "confirmed")
        .filter((app) => {
          const appointmentDate = new Date(app.date);
          appointmentDate.setHours(
            parseInt(app.time.split(":")[0]),
            parseInt(app.time.split(":")[1])
          );
          return appointmentDate > now;
        })
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          dateA.setHours(
            parseInt(a.time.split(":")[0]),
            parseInt(a.time.split(":")[1])
          );
          dateB.setHours(
            parseInt(b.time.split(":")[0]),
            parseInt(b.time.split(":")[1])
          );

          return dateA - dateB;
        });

      // Set the closest upcoming appointment
      if (upcomingAppointments.length > 0) {
        setNextAppointment(upcomingAppointments[0]);
      } else {
        setNextAppointment(null);
      }
    };

    findNextAppointment();
  }, [appointments]);

  // Update timer every second
  useEffect(() => {
    if (!nextAppointment) return;

    const timer = setInterval(() => {
      const now = new Date();
      const appointmentDate = new Date(nextAppointment.date);
      appointmentDate.setHours(
        parseInt(nextAppointment.time.split(":")[0]),
        parseInt(nextAppointment.time.split(":")[1])
      );

      const difference = appointmentDate - now;

      // If the appointment time has passed, find the next appointment
      if (difference < 0) {
        clearInterval(timer);
        setNextAppointment(null);
        return;
      }

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextAppointment]);

  // Reset pagination when appointments change
  useEffect(() => {
    setPendingPage(0);
    setConfirmedPage(0);
    setCancelledPage(0);
    setUpcomingPage(0);
  }, [appointments]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scolor"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-16 text-red-600 flex items-center justify-center">
        <FaExclamationCircle className="mr-2" />
        {error}
      </div>
    );

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-4xl font-serif text-center text-gray-800">
            Admin Appointment View
          </h2>

          <button
            onClick={() => setShowCalendarPopup(true)}
            className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center"
          >
            <FaCalendarAlt className="mr-2" /> Full Calendar
          </button>
        </div>

        {/* Next Appointment Timer */}
        {nextAppointment ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-8 shadow-sm border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-scolor text-white flex items-center justify-center mr-4">
                  <FaHourglassHalf size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Next Appointment
                  </h3>
                  <div className="flex items-center">
                    <FaUser className="text-gray-500 mr-2" />
                    <span className="text-gray-700 font-medium">
                      {nextAppointment.name}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <FaClock className="text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      {nextAppointment.time}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      {new Date(nextAppointment.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {timeRemaining.days}
                  </div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {timeRemaining.hours}
                  </div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {timeRemaining.minutes}
                  </div>
                  <div className="text-xs text-gray-500">Mins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {timeRemaining.seconds}
                  </div>
                  <div className="text-xs text-gray-500">Secs</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 mb-8 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600 flex items-center justify-center">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              No upcoming appointments scheduled
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm flex items-center">
            <FaExclamationCircle className="mr-2" />
            {error}
          </div>
        )}

        <div
          className={editingAppointment || showCalendarPopup ? "blur-sm" : ""}
        >
          {/* Move Upcoming Appointments to the top */}
          <div className="mb-12">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <h3 className="text-2xl font-medium text-gray-800">
                Upcoming Appointments
              </h3>
              <div className="flex items-center mt-4 md:mt-0">
                {/* Removed the redundant Full Calendar button */}
                <div className="relative">
                  <DatePicker
                    selected={filterDate}
                    onChange={(date) => setFilterDate(date)}
                    dateFormat="MMMM d, yyyy"
                    className="p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-scolor focus:border-scolor"
                    calendarClassName="bg-white shadow-lg rounded-lg border"
                    placeholderText="Filter by date"
                    isClearable
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <AppointmentList
              appointments={
                filterDate ? getFilteredAppointments() : confirmedAppointments
              }
              handleCancel={handleCancel}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              showConfirmationStatus={true}
              currentPage={upcomingPage}
              onNextPage={() => setUpcomingPage((prev) => prev + 1)}
              onPrevPage={() =>
                setUpcomingPage((prev) => Math.max(0, prev - 1))
              }
              itemsPerPage={3}
            />
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-medium mb-4 text-gray-800 flex items-center">
                <FaCalendarAlt className="text-scolor mr-2" />
                Pending Appointments ({pendingAppointments.length})
              </h3>
              {pendingAppointments.length > 0 ? (
                <AppointmentList
                  appointments={pendingAppointments}
                  handleConfirm={handleConfirm}
                  handleCancel={handleCancel}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  currentPage={pendingPage}
                  onNextPage={() => setPendingPage((prev) => prev + 1)}
                  onPrevPage={() =>
                    setPendingPage((prev) => Math.max(0, prev - 1))
                  }
                  itemsPerPage={3}
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg shadow-sm">
                  No pending appointments.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4 text-gray-800 flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Confirmed Appointments ({confirmedAppointments.length})
              </h3>
              {confirmedAppointments.length > 0 ? (
                <AppointmentList
                  appointments={confirmedAppointments}
                  handleCancel={handleCancel}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  showConfirmationStatus={true}
                  currentPage={confirmedPage}
                  onNextPage={() => setConfirmedPage((prev) => prev + 1)}
                  onPrevPage={() =>
                    setConfirmedPage((prev) => Math.max(0, prev - 1))
                  }
                  itemsPerPage={3}
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg shadow-sm">
                  No confirmed appointments.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4 text-gray-800 flex items-center">
                <FaTimes className="text-red-500 mr-2" />
                Cancelled Appointments ({cancelledAppointments.length})
              </h3>
              {cancelledAppointments.length > 0 ? (
                <AppointmentList
                  appointments={cancelledAppointments}
                  handleConfirm={handleConfirm}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  showCancellationDate={true}
                  currentPage={cancelledPage}
                  onNextPage={() => setCancelledPage((prev) => prev + 1)}
                  onPrevPage={() =>
                    setCancelledPage((prev) => Math.max(0, prev - 1))
                  }
                  itemsPerPage={3}
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg shadow-sm">
                  No cancelled appointments.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Appointment Modal */}
        {editingAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Edit Appointment
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-red-500 transition-colors p-2"
                >
                  <FaWindowClose size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Date & Time
                  </label>
                  <DatePicker
                    selected={selectedDateTime}
                    onChange={(date) => setSelectedDateTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scolor focus:border-scolor"
                    placeholderText="Select date and time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editingAppointment.phone || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scolor focus:border-scolor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={editingAppointment.reason || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        reason: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scolor focus:border-scolor"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-scolor text-white rounded-lg hover:bg-pcolor transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Calendar Popup */}
        {showCalendarPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[95vh] overflow-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <FaCalendarAlt className="text-scolor mr-2" />
                  Appointment Calendar
                </h3>
                <button
                  onClick={() => setShowCalendarPopup(false)}
                  className="text-gray-500 hover:text-red-500 transition-colors p-2"
                >
                  <FaWindowClose size={24} />
                </button>
              </div>

              {/* Remove the redundant box container - changed from div to fragment */}
              <>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setFilterDate(new Date())}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                  >
                    <FaCalendarAlt /> Today
                  </button>

                  <div className="appointment-legend flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-scolor"></div>
                      <span className="text-xs text-gray-600">
                        Has appointments
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                      <span className="text-xs text-gray-600">
                        No appointments
                      </span>
                    </div>
                  </div>
                </div>

                <DatePicker
                  selected={filterDate || new Date()}
                  onChange={(date) => {
                    setFilterDate(date);
                    // Keep popup open after date selection
                  }}
                  inline
                  calendarClassName="admin-calendar full-calendar"
                  monthClassName={() => "text-center"}
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="flex items-center justify-between px-2 py-2">
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        type="button"
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <h3 className="text-xl font-semibold text-center text-gray-800">
                        {date.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>

                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        type="button"
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  dayClassName={(date) => {
                    // Check if date is today
                    const isToday =
                      new Date().toDateString() === date.toDateString();

                    // Highlight dates that have appointments
                    const appointmentsOnDate = confirmedAppointments.filter(
                      (appointment) => {
                        const appointmentDate = new Date(appointment.date);
                        return (
                          appointmentDate.getDate() === date.getDate() &&
                          appointmentDate.getMonth() === date.getMonth() &&
                          appointmentDate.getFullYear() === date.getFullYear()
                        );
                      }
                    );

                    const hasAppointment = appointmentsOnDate.length > 0;

                    // Return CSS classes based on conditions
                    if (hasAppointment) {
                      return `has-appointments ${isToday ? "today" : ""}`;
                    }
                    return isToday ? "today" : undefined;
                  }}
                  renderDayContents={(day, date) => {
                    // Count appointments on this day
                    const appointmentsOnDate = confirmedAppointments.filter(
                      (appointment) => {
                        const appointmentDate = new Date(appointment.date);
                        return (
                          appointmentDate.getDate() === date.getDate() &&
                          appointmentDate.getMonth() === date.getMonth() &&
                          appointmentDate.getFullYear() === date.getFullYear()
                        );
                      }
                    );

                    const count = appointmentsOnDate.length;
                    const isCurrentMonth =
                      date.getMonth() === (filterDate || new Date()).getMonth();

                    return (
                      <div className="calendar-day-cell">
                        {count > 0 && (
                          <div
                            className="appointment-badge"
                            data-count={count}
                            title={`${count} appointment${
                              count !== 1 ? "s" : ""
                            }`}
                          >
                            <span>{count}</span>
                          </div>
                        )}
                        <span
                          className={`day-number ${
                            !isCurrentMonth ? "other-month" : ""
                          }`}
                        >
                          {day}
                        </span>
                      </div>
                    );
                  }}
                />

                {/* Only show appointment block if there are appointments for the selected date */}
                {filterDate && getFilteredAppointments().length > 0 && (
                  <div className="mt-8 date-appointments">
                    <h4 className="text-xl font-semibold mb-6 flex items-center">
                      <FaCalendarAlt className="text-scolor mr-2" />
                      Appointments on {filterDate.toLocaleDateString()}
                      <span className="ml-3 bg-scolor text-white text-sm py-1 px-3 rounded-full">
                        {getFilteredAppointments().length} total
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 appointment-list">
                      {getFilteredAppointments().map((appointment, index) => (
                        <div
                          key={appointment._id}
                          className="p-5 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Decorative element */}
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-scolor"></div>

                          <div className="flex justify-between items-start pl-3">
                            <div>
                              <div className="flex items-center mb-3">
                                <div className="w-10 h-10 rounded-full bg-scolor bg-opacity-20 flex items-center justify-center mr-3">
                                  <span className="text-scolor font-bold text-lg">
                                    {appointment.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 text-lg">
                                    {appointment.name}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <div className="flex items-center">
                                      <FaClock className="text-scolor mr-1" />
                                      {appointment.time}
                                    </div>
                                    <span className="mx-2">•</span>
                                    <div className="flex items-center">
                                      <FaPhone className="text-gray-400 mr-1" />
                                      {appointment.phone}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg mt-2 mb-4">
                                <p className="text-gray-700 text-sm flex items-start">
                                  <FaCommentAlt className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                  <span>{appointment.reason}</span>
                                </p>
                              </div>

                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={() => {
                                    setShowCalendarPopup(false);
                                    handleEdit(appointment);
                                  }}
                                  className="flex items-center text-sm px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                                >
                                  <FaEdit className="mr-1.5" /> Edit
                                </button>
                                <button
                                  onClick={() => {
                                    handleCancel(appointment._id);
                                    setShowCalendarPopup(false);
                                  }}
                                  className="flex items-center text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  <FaTimes className="mr-1.5" /> Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(appointment._id);
                                    setShowCalendarPopup(false);
                                  }}
                                  className="flex items-center text-sm px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                                >
                                  <FaTrash className="mr-1.5" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowCalendarPopup(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const AppointmentList = ({
  appointments,
  handleConfirm,
  handleCancel,
  handleEdit,
  handleDelete,
  showCancellationDate,
  showConfirmationStatus,
  currentPage = 0,
  onNextPage,
  onPrevPage,
  itemsPerPage = 3,
}) => {
  // Check if appointments array exists and has items
  if (!appointments || appointments.length === 0) {
    return (
      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg shadow-sm">
        No appointments to display.
      </p>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleAppointments = appointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Determine if pagination buttons should be enabled
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleAppointments.map((appointment, index) => (
          <div
            key={appointment._id}
            className="rounded-lg shadow-md p-6 transition-transform transform hover:scale-102 hover:shadow-lg bg-white border border-gray-200 relative"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {appointment.name}
            </h3>

            <div className="space-y-2 mb-4">
              {appointment.email && (
                <p className="text-gray-700 flex items-center">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  {appointment.email}
                </p>
              )}
              {appointment.phone && (
                <p className="text-gray-700 flex items-center">
                  <FaPhone className="text-gray-500 mr-2" />
                  {appointment.phone}
                </p>
              )}
              {appointment.date && (
                <p className="text-gray-700 flex items-center">
                  <FaCalendarAlt className="text-gray-500 mr-2" />
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
              )}
              {appointment.time && (
                <p className="text-gray-700 flex items-center">
                  <FaClock className="text-gray-500 mr-2" />
                  {appointment.time}
                </p>
              )}
              {appointment.reason && (
                <p className="text-gray-700 flex items-center">
                  <FaCommentAlt className="text-gray-500 mr-2" />
                  {appointment.reason}
                </p>
              )}
            </div>

            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                appointment.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : appointment.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {appointment.status === "cancelled" ? (
                <FaTimes className="mr-1" />
              ) : appointment.status === "confirmed" ? (
                <FaCheck className="mr-1" />
              ) : (
                <FaExclamationCircle className="mr-1" />
              )}
              {appointment.status || "pending"}
            </div>

            {showCancellationDate &&
              appointment.status === "cancelled" &&
              appointment.cancelledAt && (
                <p className="text-sm text-red-500 mb-4 italic">
                  Cancelled on:{" "}
                  {new Date(appointment.cancelledAt).toLocaleString()}
                </p>
              )}

            {showConfirmationStatus &&
              appointment.status === "confirmed" &&
              appointment.confirmedAt && (
                <p className="text-sm text-green-500 mb-4 italic">
                  Confirmed on:{" "}
                  {new Date(appointment.confirmedAt).toLocaleString()}
                </p>
              )}

            <div className="flex flex-wrap gap-2 mt-2">
              {handleConfirm && appointment.status === "pending" && (
                <button
                  onClick={() => handleConfirm(appointment._id)}
                  className="flex items-center px-4 py-2 bg-scolor text-white rounded-lg hover:bg-pcolor transition-colors duration-200"
                >
                  <FaCheck className="mr-1" /> Confirm
                </button>
              )}
              {handleCancel && appointment.status !== "cancelled" && (
                <button
                  onClick={() => handleCancel(appointment._id)}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  <FaTimes className="mr-1" /> Cancel
                </button>
              )}
              {handleEdit && (
                <button
                  onClick={() => handleEdit(appointment)}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-300"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
              )}
              {handleDelete && (
                <button
                  onClick={() => handleDelete(appointment._id)}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-300"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              )}
            </div>
            
            {/* Show navigation arrows only on the last card */}
            {index === visibleAppointments.length - 1 && (
              <div className="absolute flex space-x-2 right-6 -bottom-4">
                {canGoPrev && (
                  <button
                    onClick={onPrevPage}
                    className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-10"
                    aria-label="Previous page"
                  >
                    <FaArrowLeft className="text-gray-600" size={12} />
                  </button>
                )}
                {canGoNext && (
                  <button
                    onClick={onNextPage}
                    className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-10"
                    aria-label="Next page"
                  >
                    <FaArrowRight className="text-gray-600" size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Add a small page indicator instead of full controls */}
      {totalPages > 1 && (
        <div className="text-center text-xs text-gray-500 mt-4">
          Page {currentPage + 1} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default AdminAppointment;
