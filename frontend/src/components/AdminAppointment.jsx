import { useState, useEffect } from "react";
import AdminCalendar from "./AdminCalendar";

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

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
    setNewDate(new Date(appointment.date).toISOString().split("T")[0]);
    setNewTime(appointment.time);
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setNewDate("");
    setNewTime("");
  };

  const handleSaveEdit = async () => {
    if (!editingAppointment || !newDate || !newTime) return;

    try {
      const response = await fetch(
        `http://localhost:5555/appointments/${editingAppointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: newDate,
            time: newTime,
            phone: editingAppointment.phone, // Include phone field
            reason: editingAppointment.reason, // Include reason field
            status:
              editingAppointment.status === "cancelled"
                ? "confirmed"
                : editingAppointment.status, // If cancelled, change to confirmed
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
      setNewDate("");
      setNewTime("");
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError("Failed to update appointment");
    }
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
    return <div className="text-center py-16">Loading appointments...</div>;
  if (error)
    return <div className="text-center py-16 text-red-600">{error}</div>;

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif mb-12 text-center">
          Admin Appointment View
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className={editingAppointment ? "blur-sm" : ""}>
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-medium mb-4">
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
                <p className="text-gray-600">No pending appointments.</p>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4">
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
                <p className="text-gray-600">No confirmed appointments.</p>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-medium mb-4">
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
                <p className="text-gray-600">No cancelled appointments.</p>
              )}
            </div>
          </div>
        </div>

        {editingAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Edit Appointment</h3>
              {/* Display client's name */}
              <p className="text-lg mb-4 font-medium">
                Client: {editingAppointment.name}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {editingAppointment.status === "pending" ? "OK" : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <AdminCalendar appointments={confirmedAppointments} />
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
        className={`rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 ${appointment.status === "cancelled"
          ? "bg-red-50"
          : appointment.status === "confirmed"
            ? "bg-green-50"
            : "bg-gray-100"
          }`}
      >
        <h3 className="text-xl font-semibold mb-2">{appointment.name}</h3>
        <p className="text-gray-700">Email: {appointment.email}</p>
        <p className="text-gray-700">Phone: {appointment.phone}</p>
        <p className="text-gray-700">
          Date: {new Date(appointment.date).toLocaleDateString()}
        </p>
        <p className="text-gray-700">Time: {appointment.time}</p>
        <p className="text-gray-700">Reason: {appointment.reason}</p>
        <p
          className={`font-medium ${appointment.status === "cancelled"
            ? "text-red-600"
            : appointment.status === "confirmed"
              ? "text-green-600"
              : "text-gray-600"
            }`}
        >
          Status: {appointment.status || "pending"}
        </p>

        {showCancellationDate && appointment.status === "cancelled" && (
          <p className="text-sm text-red-500 mt-2">
            Cancelled on: {new Date(appointment.cancelledAt).toLocaleString()}
          </p>
        )}

        {showConfirmationStatus && appointment.status === "confirmed" && (
          <p className="text-sm text-green-500 mt-2">
            Confirmed on: {new Date(appointment.confirmedAt).toLocaleString()}
          </p>
        )}

        <div className="flex space-x-2 mt-4">
          {appointment.status === "pending" && (
            <button
              onClick={() => handleConfirm(appointment._id)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Confirm
            </button>
          )}
          <button
            onClick={() => handleCancel(appointment._id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={() => handleEdit(appointment)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(appointment._id)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default AdminAppointment;
