import { useState, useEffect } from "react";

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [askingForDateId, setAskingForDateId] = useState(null);
  const [proposedOptions, setProposedOptions] = useState({});

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
        // Limit to 5 options max
        if (currentOptions.length < 5) {
          return {
            ...prev,
            [askingForDateId]: [...currentOptions, newOption],
          };
        }
        return prev; // Do not add more than 5 options
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

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-serif mb-12">Admin Appointment View</h2>
  
        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-gray-100 rounded-lg shadow-lg p-6 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{appointment.name}</h3>
  
                {/* New vertical table for Email, Date, Time, and Status */}
                <div className="mt-4 flex-grow">
                  <h4 className="text-lg font-medium">Appointment Details:</h4>
                  <table className="min-w-full border mt-2">
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2 font-semibold">Email:</td>
                        <td className="border px-4 py-2">{appointment.email}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-semibold">Date:</td>
                        <td className="border px-4 py-2">{new Date(appointment.date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-semibold">Time:</td>
                        <td className="border px-4 py-2">{appointment.time}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-semibold">Status:</td>
                        <td className="border px-4 py-2">{appointment.status || "pending"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
  
                {/* Proposed Options Section */}
                <h4 className="text-lg font-medium mt-4">Proposed Options:</h4>
                {appointment.options?.length > 0 ? (
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointment.options.map((opt, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{new Date(opt.date).toLocaleDateString()}</td>
                          <td className="border px-4 py-2">{opt.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No proposed options</p>
                )}
  
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleConfirm(appointment._id)}
                    className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300 w-full mr-2"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleReject(appointment._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-300 w-full ml-2"
                  >
                    Reject
                  </button>
                </div>
  
                <div className="mt-2">
                  <button
                    onClick={() => handleAskForAnotherDate(appointment._id)}
                    className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300 w-full"
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
          <form onSubmit={handleSubmitNewOptions} className="mt-6 flex flex-col items-center">
            <div className="flex mb-4">
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
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Option
            </button>
          </form>
        )}
  
        {askingForDateId && proposedOptions[askingForDateId]?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg">Current Proposed Options:</h3>
            <div className="overflow-y-auto max-h-40 border rounded p-2">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {proposedOptions[askingForDateId].map((opt, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{new Date(opt.date).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{opt.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleSaveProposedOptions}
              className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300 mt-2"
            >
              Save Proposed Options
            </button>
          </div>
        )}
      </div>
    </section>
  );
};  
export default AdminAppointment;
