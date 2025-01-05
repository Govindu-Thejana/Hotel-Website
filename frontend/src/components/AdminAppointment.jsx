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

    // Initial fetch
    fetchAppointments();

    // Set up polling to refresh appointments every 5 seconds
    const intervalId = setInterval(fetchAppointments, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
        method: "UPDATE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }), // Update the status to rejected
      });
      if (!response.ok) throw new Error("Failed to reject appointment");

      // Update the local state to reflect the rejection
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "rejected" } // Update status to rejected
            : appointment
        )
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
        body: JSON.stringify({ status: "confirmed" }), // Update the status
      });
      if (!response.ok) throw new Error("Failed to confirm appointment");

      // Update the local state to reflect the confirmation
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "confirmed" } // Update status to confirmed
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

        // Update the local state after saving the proposed options
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === askingForDateId
              ? { ...appointment, options: proposedOptions[askingForDateId] } // Save proposed options to the appointment
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

  // Categorize appointments
  const pendingAppointments = appointments.filter(
    (appointment) => !appointment.status || appointment.status === "pending"
  );
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );
  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status === "rejected"
  );

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-serif mb-12">Admin Appointment View</h2>

        <div>
          <h3 className="text-2xl font-medium mb-4">Pending Appointments</h3>
          {pendingAppointments.length > 0 ? (
            <AppointmentList
              appointments={pendingAppointments}
              handleConfirm={handleConfirm}
              handleReject={handleReject}
              handleAskForAnotherDate={handleAskForAnotherDate}
            />
          ) : (
            <p className="text-gray-600">No pending appointments.</p>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-medium mt-12 mb-4">
            Confirmed Appointments
          </h3>
          {confirmedAppointments.length > 0 ? (
            <AppointmentList appointments={confirmedAppointments} />
          ) : (
            <p className="text-gray-600">No confirmed appointments.</p>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-medium mt-12 mb-4">
            Rejected Appointments
          </h3>
          {rejectedAppointments.length > 0 ? (
            <AppointmentList appointments={rejectedAppointments} />
          ) : (
            <p className="text-gray-600">No rejected appointments.</p>
          )}
        </div>
      </div>
    </section>
  );
};

const AppointmentList = ({
  appointments,
  handleConfirm,
  handleReject,
  handleAskForAnotherDate,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {appointments.map((appointment) => (
      <div
        key={appointment._id}
        className="bg-gray-100 rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-2">{appointment.name}</h3>
        <p>Email: {appointment.email}</p>
        <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
        <p>Time: {appointment.time}</p>
        <p>Status: {appointment.status || "pending"}</p>

        {handleConfirm && (
          <button onClick={() => handleConfirm(appointment._id)}>Confirm</button>
        )}
        {handleReject && (
          <button onClick={() => handleReject(appointment._id)}>Reject</button>
        )}
        {handleAskForAnotherDate && (
          <button onClick={() => handleAskForAnotherDate(appointment._id)}>
            Ask for Another Date
          </button>
        )}
      </div>
    ))}
  </div>
);

export default AdminAppointment;