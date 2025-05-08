import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  // Fetch existing appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch all appointments from the backend
  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "https://hotel-website-backend-drab.vercel.app/appointments"
      );
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
    setIsSubmitting(true);

    // Check if the slot is already booked
    if (bookedSlots.includes(formData.time)) {
      setError("This time slot is already booked. Please select another time.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "https://hotel-website-backend-drab.vercel.app/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Appointment request sent successfully!");
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
        setTimeout(() => setShowSuccess(false), 5000);
        // Refresh appointments list
        fetchAppointments();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit appointment");
      }
    } catch (error) {
      toast.error("Error submitting appointment");
      console.error("Error:", error);
      setError("Failed to submit appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    <div className="relative z-10">
      {/* Decorative elements */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-pcolor/5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-scolor/5 rounded-full blur-xl"></div>
      <div className="absolute top-1/4 right-0 w-4 h-20 bg-scolor rounded-l-lg hidden lg:block"></div>
      <div className="absolute top-2/3 left-0 w-4 h-20 bg-pcolor rounded-r-lg hidden lg:block"></div>

      <div className="relative">
        {/* Form Container - Styled with a prominent border and shadow */}
        <div className="max-w-5xl mx-auto relative">
          {/* Inner border decoration */}
          <div className="absolute inset-0 border-2 border-scolor/20 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 border-2 border-pcolor/20 rounded-2xl transform -rotate-1"></div>

          {/* Main form content */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 transform">
            {error && (
              <div className="mb-6 text-red-600 bg-red-50 p-4 rounded-lg border-l-4 border-red-500 flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Two-column form layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column: Personal details */}
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-gray-800 flex items-center">
                  <span className="bg-scolor text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                    1
                  </span>
                  Your Information
                </h3>

                {/* Name field */}
                <div className="relative">
                  <label
                    className={`block text-gray-700 font-medium mb-2 transition-all ${
                      selectedField === "name" ? "text-scolor" : ""
                    }`}
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
                    onFocus={() => setSelectedField("name")}
                    onBlur={() => setSelectedField(null)}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none ${
                      selectedField === "name"
                        ? "border-scolor ring-1 ring-scolor/20"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email field */}
                <div className="relative">
                  <label
                    className={`block text-gray-700 font-medium mb-2 transition-all ${
                      selectedField === "email" ? "text-scolor" : ""
                    }`}
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setSelectedField("email")}
                    onBlur={() => setSelectedField(null)}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none ${
                      selectedField === "email"
                        ? "border-scolor ring-1 ring-scolor/20"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="johndoe@example.com"
                    required
                  />
                </div>

                {/* Phone field */}
                <div className="relative">
                  <label
                    className={`block text-gray-700 font-medium mb-2 transition-all ${
                      selectedField === "phone" ? "text-scolor" : ""
                    }`}
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setSelectedField("phone")}
                    onBlur={() => setSelectedField(null)}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none ${
                      selectedField === "phone"
                        ? "border-scolor ring-1 ring-scolor/20"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="+94 712 345 678"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 italic">
                    Preferably WhatsApp enabled
                  </p>
                </div>
              </div>

              {/* Right column: Appointment details */}
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-gray-800 flex items-center">
                  <span className="bg-scolor text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                    2
                  </span>
                  Appointment Details
                </h3>

                {/* Date field */}
                <div className="relative">
                  <label
                    className={`block text-gray-700 font-medium mb-2 transition-all ${
                      selectedField === "date" ? "text-scolor" : ""
                    }`}
                    htmlFor="date"
                  >
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      onFocus={() => setSelectedField("date")}
                      onBlur={() => setSelectedField(null)}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none appearance-none ${
                        selectedField === "date"
                          ? "border-scolor ring-1 ring-scolor/20"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Time field */}
                <div className="relative">
                  <label
                    className={`block text-gray-700 font-medium mb-2 transition-all ${
                      selectedField === "time" ? "text-scolor" : ""
                    }`}
                    htmlFor="time"
                  >
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      onFocus={() => setSelectedField("time")}
                      onBlur={() => setSelectedField(null)}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none appearance-none ${
                        selectedField === "time"
                          ? "border-scolor ring-1 ring-scolor/20"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      required
                    >
                      <option value="">Select a time slot</option>
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Available
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      Booked
                    </span>
                  </div>
                </div>

                {/* Reason field */}
                <div className="relative">
                  <label
                    className={`block text-gray-700 font-medium mb-2 transition-all ${
                      selectedField === "reason" ? "text-scolor" : ""
                    }`}
                    htmlFor="reason"
                  >
                    Reason for Appointment
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    onFocus={() => setSelectedField("reason")}
                    onBlur={() => setSelectedField(null)}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none resize-none ${
                      selectedField === "reason"
                        ? "border-scolor ring-1 ring-scolor/20"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Briefly describe the purpose of your appointment (e.g., wedding planning, venue tour, menu tasting)"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit button area */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-scolor text-white py-3.5 px-8 rounded-lg shadow-lg hover:bg-pcolor transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                  isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 text-sm uppercase tracking-wider font-medium flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Request Appointment"
                  )}
                </span>
                <span className="absolute inset-0 bg-pcolor transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </button>

              <p className="text-sm text-gray-500 mt-4">
                We will reach out to confirm your appointment shortly after
                submission.
              </p>
            </div>
          </div>
        </div>

        {/* Success message with animation */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 relative z-50 animate-scale-in-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-center mb-2">
                Appointment Request Submitted!
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Thank you for your interest! Our team will review your request
                and contact you shortly to confirm your appointment.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-scolor text-white py-2 px-4 rounded-lg hover:bg-pcolor transition duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add styles to make appointment form animation work
const styleElement = document.createElement("style");
styleElement.textContent = `
  @keyframes scale-in-center {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  .animate-scale-in-center {
    animation: scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }
`;
document.head.appendChild(styleElement);

export default AppointmentForm;
