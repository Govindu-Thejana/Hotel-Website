import { useState, useEffect } from 'react';

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [askingForDateId, setAskingForDateId] = useState(null);
  const [proposedOptions, setProposedOptions] = useState([]); // Store proposed options for the selected appointment

  // Define available times as a constant array
  const availableTimes = ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'];

  // Simulating fetching appointments from a backend
  useEffect(() => {
    const fetchAppointments = () => {
      const dummyAppointments = [
        { id: 1, name: 'John Doe', email: 'johndoe@example.com', date: '2024-11-10', time: '10:00', status: 'pending', options: [] },
        { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', date: '2024-11-12', time: '14:00', status: 'pending', options: [] },
      ];
      setAppointments(dummyAppointments);
    };

    fetchAppointments();
  }, []);

  const handleDelete = (id) => {
    setAppointments((prev) => prev.filter(appointment => appointment.id !== id));
    console.log(`Deleted appointment with id: ${id}`);
  };

  const handleConfirm = (id) => {
    setAppointments((prev) => 
      prev.map(appointment => 
        appointment.id === id ? { ...appointment, status: 'confirmed' } : appointment
      )
    );
    console.log(`Confirmed appointment with id: ${id}`);
  };

  const handleAskForAnotherDate = (id) => {
    setAskingForDateId(id);
    setProposedOptions([]); // Reset proposed options for new requests
  };

  const handleSubmitNewOptions = (e) => {
    e.preventDefault();
    if (newDate && newTime) {
      const newOption = { date: newDate, time: newTime };
      setProposedOptions((prev) => [...prev, newOption]); // Add new option to proposed options
      setNewDate(''); // Reset date input
      setNewTime(''); // Reset time input
    }
  };

  const handleSaveProposedOptions = () => {
    if (askingForDateId && proposedOptions.length > 0) {
      setAppointments((prev) => 
        prev.map(appointment => 
          appointment.id === askingForDateId ? { ...appointment, options: proposedOptions } : appointment
        )
      );
      console.log(`Saved proposed options for appointment id: ${askingForDateId}`, proposedOptions);
      setAskingForDateId(null); // Close date selection
      setProposedOptions([]); // Reset proposed options
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
              {appointments.map(({ id, name, email, date, time, status, options }) => (
                <tr key={id}>
                  <td className="py-2 px-4 border-b">{name}</td>
                  <td className="py-2 px-4 border-b">{email}</td>
                  <td className="py-2 px-4 border-b">{date}</td>
                  <td className="py-2 px-4 border-b">{time}</td>
                  <td className="py-2 px-4 border-b">{status}</td>
                  <td className="py-2 px-4 border-b">
                    {options.length > 0 ? options.map((opt, index) => (
                      <div key={index}>{opt.date} at {opt.time}</div>
                    )) : 'No proposed options'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleConfirm(id)}
                      className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300 mr-2"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleAskForAnotherDate(id)}
                      className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Ask for Another Date
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
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
            <label htmlFor="new-date" className="mr-2">New Date:</label>
            <input
              type="date"
              id="new-date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
              className="border rounded px-2 py-1"
            />
            <label htmlFor="new-time" className="mr-2 ml-4">New Time:</label>
            <select
              id="new-time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
              className="border rounded px-2 py-1"
            >
              <option value="">Select a time</option>
              {availableTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300 ml-2">
              Add Option
            </button>
          </form>
        )}

        {askingForDateId && proposedOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg">Current Proposed Options:</h3>
            <div className="overflow-y-auto max-h-40 border rounded p-2">
              {proposedOptions.map((opt, index) => (
                <div key={index}>{opt.date} at {opt.time}</div>
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
