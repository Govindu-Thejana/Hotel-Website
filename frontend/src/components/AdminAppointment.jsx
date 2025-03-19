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
  const [showCalendarView, setShowCalendarView] = useState(false);

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
        <h2 className="text-4xl font-serif mb-12 text-center text-gray-800">
          Admin Appointment View
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm flex items-center">
            <FaExclamationCircle className="mr-2" />
            {error}
          </div>
        )}

        <div className={editingAppointment ? "blur-sm" : ""}>
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
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg shadow-sm">
                  No cancelled appointments.
                </p>
              )}
            </div>
          </div>
        </div>

        {editingAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <FaEdit className="text-scolor mr-2" />
                Edit Appointment
              </h3>
              <p className="text-lg mb-4 font-medium text-gray-700">
                Client: {editingAppointment.name}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Date & Time
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={selectedDateTime}
                      onChange={(date) => setSelectedDateTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-scolor focus:border-scolor"
                      calendarClassName="bg-white shadow-lg rounded-lg border"
                      placeholderText="Select date and time"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-scolor text-white rounded-lg hover:bg-pcolor transition-colors duration-200"
                  >
                    {editingAppointment.status === "pending" ? "OK" : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <h3 className="text-2xl font-medium text-gray-800">
              Upcoming Appointments
            </h3>
            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <button
                onClick={() => setShowCalendarView(!showCalendarView)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  showCalendarView
                    ? "bg-scolor text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {showCalendarView ? "List View" : "Calendar View"}
              </button>

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

          {showCalendarView ? (
            <div className="bg-white rounded-lg shadow-md p-6 calendar-container">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setFilterDate(new Date())}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                >
                  <FaCalendarAlt /> Today
                </button>

                <h3 className="text-xl font-semibold text-center text-gray-800">
                  {filterDate
                    ? filterDate.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })
                    : new Date().toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                </h3>

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
                onChange={(date) => setFilterDate(date)}
                inline
                calendarClassName="admin-calendar"
                monthClassName={() => "text-center"}
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

                  return (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <span>{day}</span>
                      {count > 0 && (
                        <span className="appointment-count">{count}</span>
                      )}
                    </div>
                  );
                }}
              />

              {filterDate && (
                <div className="mt-8 date-appointments">
                  <h4 className="text-lg font-medium mb-4 flex items-center">
                    <FaCalendarAlt className="text-scolor mr-2" />
                    Appointments on {filterDate.toLocaleDateString()}
                  </h4>
                  {getFilteredAppointments().length > 0 ? (
                    <div className="space-y-4 appointment-list">
                      {getFilteredAppointments().map((appointment) => (
                        <div
                          key={appointment._id}
                          className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800 text-lg mb-1">
                                {appointment.name}
                              </p>
                              <div className="space-y-1 text-sm">
                                <p className="text-gray-600 flex items-center">
                                  <FaClock className="text-scolor mr-2" />{" "}
                                  {appointment.time}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                  <FaPhone className="text-gray-500 mr-2" />{" "}
                                  {appointment.phone}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                  <FaCommentAlt className="text-gray-500 mr-2" />{" "}
                                  {appointment.reason}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEdit(appointment)}
                                className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors"
                                title="Edit appointment"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleCancel(appointment._id)}
                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                title="Cancel appointment"
                              >
                                <FaTimes />
                              </button>
                              <button
                                onClick={() => handleDelete(appointment._id)}
                                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                                title="Delete appointment"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500 mb-2">
                        No appointments scheduled for this date
                      </p>
                      <button
                        onClick={() => setFilterDate(null)}
                        className="text-scolor hover:text-pcolor transition-colors"
                      >
                        View all appointments
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <AppointmentList
              appointments={
                filterDate ? getFilteredAppointments() : confirmedAppointments
              }
              handleCancel={handleCancel}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              showConfirmationStatus={true}
            />
          )}
        </div>
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
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {appointments.map((appointment) => (
      <div
        key={appointment._id}
        className="rounded-lg shadow-md p-6 transition-transform transform hover:scale-102 hover:shadow-lg bg-white border border-gray-200"
      >
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {appointment.name}
        </h3>

        <div className="space-y-2 mb-4">
          <p className="text-gray-700 flex items-center">
            <FaEnvelope className="text-gray-500 mr-2" />
            {appointment.email}
          </p>
          <p className="text-gray-700 flex items-center">
            <FaPhone className="text-gray-500 mr-2" />
            {appointment.phone}
          </p>
          <p className="text-gray-700 flex items-center">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            {new Date(appointment.date).toLocaleDateString()}
          </p>
          <p className="text-gray-700 flex items-center">
            <FaClock className="text-gray-500 mr-2" />
            {appointment.time}
          </p>
          <p className="text-gray-700 flex items-center">
            <FaCommentAlt className="text-gray-500 mr-2" />
            {appointment.reason}
          </p>
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

        {showCancellationDate && appointment.status === "cancelled" && (
          <p className="text-sm text-red-500 mb-4 italic">
            Cancelled on: {new Date(appointment.cancelledAt).toLocaleString()}
          </p>
        )}

        {showConfirmationStatus && appointment.status === "confirmed" && (
          <p className="text-sm text-green-500 mb-4 italic">
            Confirmed on: {new Date(appointment.confirmedAt).toLocaleString()}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {appointment.status === "pending" && (
            <button
              onClick={() => handleConfirm(appointment._id)}
              className="flex items-center px-4 py-2 bg-scolor text-white rounded-lg hover:bg-pcolor transition-colors duration-200"
            >
              <FaCheck className="mr-1" /> Confirm
            </button>
          )}
          {appointment.status !== "cancelled" && (
            <button
              onClick={() => handleCancel(appointment._id)}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <FaTimes className="mr-1" /> Cancel
            </button>
          )}
          <button
            onClick={() => handleEdit(appointment)}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          >
            <FaEdit className="mr-1" /> Edit
          </button>
          <button
            onClick={() => handleDelete(appointment._id)}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default AdminAppointment;
