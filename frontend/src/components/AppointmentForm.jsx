import { useState, useEffect } from "react";

// filepath: /c:/Users/yasiru/Documents/GitHub/Hotel-Website/frontend/src/components/AppointmentForm.jsx

const Calendar = ({ onDateSelect, appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="border p-2"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isConfirmed = appointments.some(
        (appointment) => new Date(appointment.date).toDateString() === date.toDateString() && appointment.status === "confirmed"
      );
      const isPastDate = date < today.setHours(0, 0, 0, 0);
      const isToday = date.toDateString() === today.toDateString();
      days.push(
        <div
          key={i}
          className={`border p-2 cursor-pointer ${isConfirmed || isPastDate ? "bg-red-200 cursor-not-allowed" : ""} ${isToday ? "bg-blue-200" : ""}`}
          onClick={() => !isConfirmed && !isPastDate && onDateSelect(date)}
        >
          <div>{i}</div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-4 py-2 bg-gray-300 rounded">
          Previous
        </button>
        <h3 className="text-xl font-medium">
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="px-4 py-2 bg-gray-300 rounded">
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        <div className="font-bold">Sun</div>
        <div className="font-bold">Mon</div>
        <div className="font-bold">Tue</div>
        <div className="font-bold">Wed</div>
        <div className="font-bold">Thu</div>
        <div className="font-bold">Fri</div>
        <div className="font-bold">Sat</div>
        {renderDays()}
      </div>
    </div>
  );
};

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
  const [appointments, setAppointments] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5555/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        setFormData({ name: "", email: "", phone: "", date: "", time: "", reason: "" });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateSelect = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date.toLocaleDateString("en-CA"), // Format date as YYYY-MM-DD
    }));
  };

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <Calendar onDateSelect={handleDateSelect} appointments={appointments} />
          </div>

          <div className="mb-6">
            <label
              className="block text-left text-gray-700 font-semibold mb-2"
              htmlFor="time"
            >
              Preferred Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
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
            className="bg-scolor text-white py-3 px-6 rounded-md shadow-lg hover:bg-gradient-to-l transition duration-300"
          >
            Book Appointment
          </button>
        </form>

        {showSuccess && (
          <div className="mt-8 bg-pcolor border border-pcolor text-white px-6 py-4 rounded-lg max-w-lg mx-auto shadow-lg">
            <span className="block sm:inline text-xl font-semibold">
              🎉 Appointment request successfully sent! We’ll be in touch soon
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