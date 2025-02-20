import { useState, useEffect } from "react";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    reason: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [error, setError] = useState("");

  // Fetch existing appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch all appointments from the backend
  const fetchAppointments = async () => {
    try {
      const response = await fetch("https://hotel-website-backend-drab.vercel.app/appointments");
      if (response.ok) {
        const data = await response.json();
        setExistingAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load available time slots");
    }
  };

  // Update booked slots when date changes
  // Update booked slots when date changes
  useEffect(() => {
    if (formData.date) {
      const selectedDateAppointments = existingAppointments.filter((app) => {
        const appDate = new Date(app.date);
        const selectedDate = new Date(formData.date);
        return (
          appDate.toDateString() === selectedDate.toDateString() &&
          app.status === "confirmed" // Only include confirmed appointments
        );
      });
      const bookedTimes = selectedDateAppointments.map((app) => app.time);
      setBookedSlots(bookedTimes);
    } else {
      setBookedSlots([]);
    }
  }, [formData.date, existingAppointments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if the slot is already booked
    if (bookedSlots.includes(formData.time)) {
      setError("This time slot is already booked. Please select another time.");
      return;
    }

    try {
      const response = await fetch("https://hotel-website-backend-drab.vercel.app/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          reason: "",
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // Refresh appointments list
        fetchAppointments();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit appointment");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit appointment. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate time options from 6 AM to 10 PM
  // Generate time options from 6 AM to 10 PM in "6:00 to 7:00" format
  const timeOptions = [];
  for (let hour = 6; hour <= 22; hour++) {
    const startTime = new Date();
    startTime.setHours(hour, 0, 0);
    const endTime = new Date();
    endTime.setHours(hour + 1, 0, 0);

    const formattedStartTime = startTime.toTimeString().slice(0, 5);
    const formattedEndTime = endTime.toTimeString().slice(0, 5);

    // Display text: "6:00 to 7:00"
    const displayText = `${formattedStartTime} to ${formattedEndTime}`;

    // Value remains in "HH:MM" format for backend processing
    timeOptions.push({ displayText, value: formattedStartTime });
  }

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto text-center">
        <div className="text-center mb-12">
          <h2 className="text-sm uppercase text-scolor italic tracking-widest">
            LET US SET A DATE AND START PLANNING YOUR DREAM EVENT. BOOK A
            MEETING WITH US
          </h2>
          <h2 className="text-4xl font-serif">Schedule & Appointments</h2>
        </div>

        {error && (
          <div className="mb-6 text-red-600 bg-red-100 p-3 rounded-lg max-w-lg mx-auto">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-gray-100 p-8 rounded-lg shadow-lg"
        >
          <div className="mb-6">
            <label
              className="block text-left text-gray-700 font-semibold mb-2"
              htmlFor="name"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-left text-gray-700 font-semibold mb-2"
              htmlFor="email"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="johndoe@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-left text-gray-700 font-semibold mb-2"
              htmlFor="phone"
            >
              Your Phone Number (preferably WhatsApp)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="+94 712 345 678"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-left text-gray-700 font-semibold mb-2"
              htmlFor="date"
            >
              Select a Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-left text-gray-700 font-semibold mb-2"
              htmlFor="time"
            >
              Preferred Time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            >
              <option value="">Select a time</option>
              {timeOptions.map(({ displayText, value }) => {
                const isBooked = bookedSlots.includes(value);
                return (
                  <option
                    key={value}
                    value={value}
                    disabled={isBooked}
                    className={isBooked ? "text-gray-400" : ""}
                  >
                    {displayText} {isBooked ? "(Booked)" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block text-left text-gray-700 font-semibold mb-2"
              htmlFor="reason"
            >
              Reason for Appointment
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Describe the reason for your appointment"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-scolor text-white py-3 px-6 rounded-md shadow-lg hover:bg-pcolor transition duration-300"
          >
            Book Appointment
          </button>
        </form>

        {showSuccess && (
          <div className="mt-8 bg-pcolor border border-pcolor text-white px-6 py-4 rounded-lg max-w-lg mx-auto shadow-lg">
            <span className="block sm:inline text-xl font-semibold">
              🎉 Appointment request successfully sent! We'll be in touch soon
              to confirm the details.
            </span>
          </div>
        )}

        <div className="mt-8 text-gray-600">
          <p className="text-sm">
            We will reach out to confirm your appointment. Please provide the
            best time and date that works for you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
