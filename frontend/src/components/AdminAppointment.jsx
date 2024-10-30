import { useState, useEffect } from "react";

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [askingForDateId, setAskingForDateId] = useState(null);
  const [proposedOptions, setProposedOptions] = useState([]);

  const availableTimes = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

  // Fetch appointments from the database
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5555/appointments"); // Updated port
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Delete appointment
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
        // Updated port
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete appointment");
      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // Confirm appointment
  const handleConfirm = async (id) => {
    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
        // Updated port
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (!response.ok) throw new Error("Failed to confirm appointment");

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "confirmed" }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  const handleAskForAnotherDate = (id) => {
    setAskingForDateId(id);
    setProposedOptions([]);
  };

  const handleSubmitNewOptions = (e) => {
    e.preventDefault();
    if (newDate && newTime) {
      const newOption = { date: newDate, time: newTime };
      setProposedOptions((prev) => [...prev, newOption]);
      setNewDate("");
      setNewTime("");
    }
  };

  const handleSaveProposedOptions = async () => {
    if (askingForDateId && proposedOptions.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:5555/appointments/${askingForDateId}`,
          {
            // Updated port
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ options: proposedOptions }),
          }
        );

        if (!response.ok) throw new Error("Failed to save proposed options");

        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === askingForDateId
              ? { ...appointment, options: proposedOptions }
              : appointment
          )
        );
        setAskingForDateId(null);
        setProposedOptions([]);
      } catch (error) {
        console.error("Error saving proposed options:", error);
      }
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-serif mb-12">Admin Appointment View</h2>

        {appointments.length > 0 ? (
          <table className="min-w-full bg-gray-100 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Time</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Proposed Options</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="py-2 px-4 border-b">{appointment.name}</td>
                  <td className="py-2 px-4 border-b">{appointment.email}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{appointment.time}</td>
                  <td className="py-2 px-4 border-b">
                    {appointment.status || "pending"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {appointment.options?.length > 0
                      ? appointment.options.map((opt, index) => (
                          <div key={index}>
                            {new Date(opt.date).toLocaleDateString()} at{" "}
                            {opt.time}
                          </div>
                        ))
                      : "No proposed options"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleConfirm(appointment._id)}
                      className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300 mr-2"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleAskForAnotherDate(appointment._id)}
                      className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Ask for Another Date
                    </button>
                    <button
                      onClick={() => handleDelete(appointment._id)}
                      className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-300 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No appointments scheduled yet.</p>
        )}

        {askingForDateId && (
          <form onSubmit={handleSubmitNewOptions} className="mt-6">
            <label htmlFor="new-date" className="mr-2">
              New Date:
            </label>
            <input
              type="date"
              id="new-date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
              className="border rounded px-2 py-1"
            />
            <label htmlFor="new-time" className="mr-2 ml-4">
              New Time:
            </label>
            <select
              id="new-time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
              className="border rounded px-2 py-1"
            >
              <option value="">Select a time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300 ml-2"
            >
              Add Option
            </button>
          </form>
        )}

        {askingForDateId && proposedOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg">Current Proposed Options:</h3>
            <div className="overflow-y-auto max-h-40 border rounded p-2">
              {proposedOptions.map((opt, index) => (
                <div key={index}>
                  {new Date(opt.date).toLocaleDateString()} at {opt.time}
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveProposedOptions}
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
            >
              Save Proposed Options
            </button>
            <button
              onClick={() => setAskingForDateId(null)}
              className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-gray-600 transition duration-300 mt-2 ml-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminAppointment;
