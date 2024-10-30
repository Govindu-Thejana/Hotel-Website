import { useState, useEffect } from "react";

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [askingForDateId, setAskingForDateId] = useState(null);
  const [proposedOptions, setProposedOptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const availableTimes = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5555/appointments");
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to reject appointment");
      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== id)
      );
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
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
    setProposedOptions((prev) => ({
      ...prev,
      [id]: prev[id] || [],
    }));
  };

  const handleSubmitNewOptions = (e) => {
    e.preventDefault();
    if (newDate && newTime && askingForDateId) {
      const newOption = { date: newDate, time: newTime };
      setProposedOptions((prev) => {
        const currentOptions = prev[askingForDateId] || [];
        if (currentOptions.length < 5) {
          return {
            ...prev,
            [askingForDateId]: [...currentOptions, newOption],
          };
        }
        return prev;
      });
      setNewDate("");
      setNewTime("");
    }
  };

  const handleSaveProposedOptions = async () => {
    if (askingForDateId && proposedOptions[askingForDateId]?.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:5555/appointments/${askingForDateId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ options: proposedOptions[askingForDateId] }),
          }
        );

        if (!response.ok) throw new Error("Failed to save proposed options");

        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === askingForDateId
              ? { ...appointment, options: proposedOptions[askingForDateId] }
              : appointment
          )
        );
        setAskingForDateId(null);
        setProposedOptions((prev) => ({ ...prev, [askingForDateId]: [] }));
      } catch (error) {
        console.error("Error saving proposed options:", error);
      }
    }
  };

  const openRejectModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsModalOpen(false);
  };

  const confirmReject = () => {
    handleReject(selectedAppointmentId);
    closeRejectModal();
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-serif mb-12">Admin Appointment View</h2>

        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-gray-100 rounded-lg shadow-lg p-6 flex flex-col">
                <h3 className="text-xl font-semibold mb-4">{appointment.name}</h3>

                <div className="mt-2 flex-grow overflow-auto">
                  <h4 className="text-lg font-medium mb-2">Appointment Details:</h4>
                  <table className="w-full border rounded text-left">
                    <tbody>
                      <tr>
                        <td className="border px-2 sm:px-4 py-2 font-semibold">Email:</td>
                        <td className="border px-2 sm:px-4 py-2">{appointment.email}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 sm:px-4 py-2 font-semibold">Date:</td>
                        <td className="border px-2 sm:px-4 py-2">{new Date(appointment.date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 sm:px-4 py-2 font-semibold">Time:</td>
                        <td className="border px-2 sm:px-4 py-2">{appointment.time}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 sm:px-4 py-2 font-semibold">Status:</td>
                        <td className="border px-2 sm:px-4 py-2">{appointment.status || "Pending"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="text-lg font-medium mt-4">Proposed Options:</h4>
                {appointment.options?.length > 0 ? (
                  <table className="w-full mt-2 border rounded text-left">
                    <thead>
                      <tr>
                        <th className="border px-2 sm:px-4 py-2">Date</th>
                        <th className="border px-2 sm:px-4 py-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointment.options.map((opt, index) => (
                        <tr key={index}>
                          <td className="border px-2 sm:px-4 py-2">{new Date(opt.date).toLocaleDateString()}</td>
                          <td className="border px-2 sm:px-4 py-2">{opt.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 mt-2">No proposed options</p>
                )}

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleConfirm(appointment._id)}
                    className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => openRejectModal(appointment._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAskForAnotherDate(appointment._id)}
                    className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Ask for Another Date
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No appointments scheduled yet.</p>
        )}

        {askingForDateId && (
          <form onSubmit={handleSubmitNewOptions} className="mt-6 flex flex-col items-center w-full max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full">
              <label htmlFor="new-date" className="block sm:inline-block text-left">New Date:</label>
              <input
                type="date"
                id="new-date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                className="border rounded px-2 py-1 w-full"
              />
              <label htmlFor="new-time" className="block sm:inline-block text-left">New Time:</label>
              <select
                id="new-time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Select time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
                {/* Add color options */}
                <option value="scolor">scolor</option>
                <option value="pcolor">pcolor</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Option
            </button>
            <button
              onClick={handleSaveProposedOptions}
              className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300 mt-4"
            >
              Save Options
            </button>
          </form>
        )}

        {/* Reject Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Reject Appointment</h3>
              <p className="mb-4">Are you sure you want to reject this appointment?</p>
              <button
                onClick={confirmReject}
                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-300 mx-2"
              >
                Yes, Reject
              </button>
              <button
                onClick={closeRejectModal}
                className="bg-gray-300 py-1 px-4 rounded-md hover:bg-gray-400 transition duration-300 mx-2"
              >
                Cancel
              </button>

              
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


export default AdminAppointment;
