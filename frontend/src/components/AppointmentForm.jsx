import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock, FaTimes, FaCheck } from "react-icons/fa";

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update formData when selectedDate changes - Improved to prevent timezone issues
  useEffect(() => {
    if (selectedDate) {
      // Create a date without time component to avoid timezone issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      console.log("Setting formatted date:", formattedDate);

      setFormData((prev) => ({
        ...prev,
        date: formattedDate,
      }));
    }
  }, [selectedDate]);

  // Fetch existing appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Improved fetch function with better error handling and loading state
  const fetchAppointments = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://hotel-website-backend-drab.vercel.app/appointments"
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched appointments:", data);

      // Filter only confirmed appointments
      const confirmedAppointments = data.filter(
        (app) => app.status === "confirmed"
      );
      setExistingAppointments(confirmedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load available time slots. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update booked slots when date changes - Fixed timezone issue
  useEffect(() => {
    if (!formData.date) {
      setBookedSlots([]);
      return;
    }

    try {
      // Use the date directly without adjustment to fix the day shift issue
      console.log("Checking appointments for date:", formData.date);

      const selectedDateAppointments = existingAppointments.filter((app) => {
        if (!app.date) return false;

        // Compare dates without timezone influence
        const formattedDate = formData.date;
        const appDateStr = app.date.split("T")[0]; // Extract YYYY-MM-DD part only

        console.log(
          `Comparing: app date=${appDateStr}, selected date=${formattedDate}`
        );

        return appDateStr === formattedDate && app.status === "confirmed";
      });

      console.log("Selected date appointments:", selectedDateAppointments);

      // Extract and normalize time formats with improved handling
      const bookedTimes = selectedDateAppointments
        .map((app) => {
          if (!app.time) return null;

          // More robust time format normalization
          let timeValue = app.time;

          // Handle both "HH:MM" and "HH:MM:SS" formats
          if (timeValue.includes(":")) {
            const parts = timeValue.split(":");
            // Ensure hours and minutes are properly padded
            const hours = parts[0].padStart(2, "0");
            const minutes = parts.length > 1 ? parts[1].padStart(2, "0") : "00";
            timeValue = `${hours}:${minutes}`;
          }

          // Log the original and normalized time for debugging
          console.log(`Normalizing time: ${app.time} → ${timeValue}`);

          return timeValue;
        })
        .filter(Boolean); // Remove any null values

      console.log("Normalized booked slots for selected date:", bookedTimes);
      setBookedSlots(bookedTimes);

      // If the current selected time is booked, clear it
      if (formData.time && bookedTimes.includes(formData.time)) {
        setFormData((prev) => ({
          ...prev,
          time: "", // Clear the time if it's now booked
        }));
      }
    } catch (error) {
      console.error("Error processing booked slots:", error);
    }
  }, [formData.date, existingAppointments]);

  // Helper function to check if a time slot is booked with improved comparison
  const isTimeSlotBooked = (timeValue) => {
    if (!timeValue || !bookedSlots.length) return false;

    // Normalize the time format for comparison
    const normalizedTime = timeValue.trim();

    // Debug log for time slot checking
    const isBooked = bookedSlots.some((bookedTime) => {
      const normalizedBookedTime = bookedTime.trim();
      const matches = normalizedBookedTime === normalizedTime;
      if (matches) {
        console.log(
          `Time slot match: ${normalizedTime} matches ${normalizedBookedTime}`
        );
      }
      return matches;
    });

    return isBooked;
  };

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

  // Generate time options with consistent format
  const timeOptions = [];
  for (let hour = 6; hour <= 22; hour++) {
    const startTime = new Date();
    startTime.setHours(hour, 0, 0);
    const endTime = new Date();
    endTime.setHours(hour + 1, 0, 0);

    // Ensure consistent "HH:MM" format with zero padding
    const formattedStartTime =
      startTime.getHours().toString().padStart(2, "0") +
      ":" +
      startTime.getMinutes().toString().padStart(2, "0");

    const formattedEndTime =
      endTime.getHours().toString().padStart(2, "0") +
      ":" +
      endTime.getMinutes().toString().padStart(2, "0");

    // Display text: "06:00 to 07:00"
    const displayText = `${formattedStartTime} to ${formattedEndTime}`;

    // Value remains in "HH:MM" format for backend processing
    timeOptions.push({
      displayText,
      value: formattedStartTime,
    });
  }

  // Group time options by morning, afternoon, and evening for better organization
  const groupTimeOptions = () => {
    const morning = timeOptions.filter((option) => {
      const hour = parseInt(option.value.split(":")[0], 10);
      return hour >= 6 && hour < 12;
    });

    const afternoon = timeOptions.filter((option) => {
      const hour = parseInt(option.value.split(":")[0], 10);
      return hour >= 12 && hour < 18;
    });

    const evening = timeOptions.filter((option) => {
      const hour = parseInt(option.value.split(":")[0], 10);
      return hour >= 18 && hour <= 22;
    });

    return { morning, afternoon, evening };
  };

  const groupedTimeOptions = groupTimeOptions();

  // Get today's date as a Date object for DatePicker
  const today = new Date();

  // Function to check if a date has appointments - Fixed version
  const getAppointmentsForDate = (date) => {
    if (!date) return [];

    // Format the date to YYYY-MM-DD for consistent string comparison
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    return existingAppointments.filter((app) => {
      if (!app.date) return false;

      // Compare date strings directly to avoid timezone issues
      const appDateStr = app.date.split("T")[0];
      return appDateStr === dateString && app.status === "confirmed";
    });
  };

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

            {/* Show loading indicator */}
            {isLoading && (
              <div className="mb-6 text-blue-600 bg-blue-50 p-4 rounded-lg flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-blue-500"
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
                <span>Loading available time slots...</span>
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

                {/* Date field replaced with DatePicker */}
                <div className="relative">
                  <label
                    className={`block text-gray-700 font-medium mb-2 transition-all ${
                      selectedField === "date" ? "text-scolor" : ""
                    }`}
                    htmlFor="date"
                  >
                    Preferred Date
                  </label>
                  <div className="relative calendar-wrapper">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={today}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select a date"
                      onFocus={() => setSelectedField("date")}
                      onBlur={() => setSelectedField(null)}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none appearance-none ${
                        selectedField === "date"
                          ? "border-scolor ring-1 ring-scolor/20"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      required
                      // Custom rendering for dates with appointments
                      dayClassName={(date) => {
                        const appts = getAppointmentsForDate(date);
                        // Add different classes based on how many appointments exist
                        if (appts.length > 0) {
                          // Add class that indicates appointment density
                          return appts.length >= 3
                            ? "has-many-appointments"
                            : "has-appointments";
                        }
                        return undefined;
                      }}
                      renderDayContents={(day, date) => {
                        const appointments = getAppointmentsForDate(date);
                        const count = appointments.length;

                        // Get all booked times for this date to show in tooltip
                        const bookedTimes = appointments
                          .map((app) => {
                            const timeOption = timeOptions.find(
                              (opt) => opt.value === app.time
                            );
                            return timeOption
                              ? timeOption.displayText
                              : app.time;
                          })
                          .join(", ");

                        const tooltipText =
                          count > 0
                            ? `${count} appointment${
                                count > 1 ? "s" : ""
                              } booked: ${bookedTimes}`
                            : "";

                        return (
                          <div className="day-content" title={tooltipText}>
                            {day}
                            {count > 0 && (
                              <>
                                <span
                                  className="appointment-dot"
                                  title={`${count} appointment(s)`}
                                ></span>
                                <span className="appointment-count">
                                  {count}
                                </span>
                              </>
                            )}
                          </div>
                        );
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                  </div>

                  {/* Legend for calendar - Improved with counts */}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      <span className="w-2 h-2 bg-scolor rounded-full mr-1"></span>
                      Dates with appointments
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 rounded">
                      <span className="w-4 h-4 bg-scolor/30 rounded-sm mr-1 flex items-center justify-center text-amber-900 text-[8px] font-bold">
                        3+
                      </span>
                      High booking dates
                    </span>
                    <span className="text-gray-500 italic text-[10px] ml-1">
                      Hover over dates to see booked times
                    </span>
                  </div>
                </div>

                {/* Time field with enhanced attractive design */}
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
                    <div
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 cursor-pointer ${
                        selectedField === "time"
                          ? "border-scolor ring-1 ring-scolor/20"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedField("time")}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={
                            formData.time ? "text-gray-800" : "text-gray-500"
                          }
                        >
                          {formData.time
                            ? timeOptions.find(
                                (opt) => opt.value === formData.time
                              )?.displayText || "Select a time slot"
                            : "Select a time slot"}
                        </span>
                        <FaClock className="text-gray-400" />
                      </div>
                    </div>

                    {selectedField === "time" && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="p-2 max-h-60 overflow-y-auto">
                          {/* Morning time slots */}
                          <div className="mb-3">
                            <div className="px-3 py-1.5 bg-scolor/5 rounded-md mb-1 flex items-center">
                              <div className="w-2 h-2 rounded-full bg-scolor mr-2"></div>
                              <h4 className="text-xs font-medium text-gray-700">
                                MORNING
                              </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-1 px-1">
                              {groupedTimeOptions.morning.map(
                                ({ displayText, value }) => {
                                  const isBooked = isTimeSlotBooked(value);
                                  return (
                                    <button
                                      key={value}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() => {
                                        handleChange({
                                          target: { name: "time", value },
                                        });
                                        setSelectedField(null);
                                      }}
                                      className={`py-2 px-3 text-sm rounded ${
                                        formData.time === value
                                          ? "bg-scolor text-white font-medium shadow-sm"
                                          : isBooked
                                          ? "bg-red-50 text-gray-400 cursor-not-allowed border border-red-100"
                                          : "hover:bg-scolor/5 text-gray-700 border border-transparent hover:border-scolor/20"
                                      } transition-all duration-150 flex items-center justify-center`}
                                    >
                                      <div className="flex items-center">
                                        <FaClock
                                          className={`mr-1.5 text-xs ${
                                            isBooked
                                              ? "text-red-300"
                                              : formData.time === value
                                              ? "text-white"
                                              : "text-scolor"
                                          }`}
                                        />
                                        <span className="whitespace-nowrap">
                                          {value}
                                        </span>
                                        {isBooked && (
                                          <FaTimes className="ml-1.5 text-xs text-red-500" />
                                        )}
                                        {formData.time === value && (
                                          <FaCheck className="ml-1.5 text-xs" />
                                        )}
                                      </div>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Afternoon time slots */}
                          <div className="mb-3">
                            <div className="px-3 py-1.5 bg-pcolor/5 rounded-md mb-1 flex items-center">
                              <div className="w-2 h-2 rounded-full bg-pcolor mr-2"></div>
                              <h4 className="text-xs font-medium text-gray-700">
                                AFTERNOON
                              </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-1 px-1">
                              {groupedTimeOptions.afternoon.map(
                                ({ displayText, value }) => {
                                  const isBooked = isTimeSlotBooked(value);
                                  return (
                                    <button
                                      key={value}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() => {
                                        handleChange({
                                          target: { name: "time", value },
                                        });
                                        setSelectedField(null);
                                      }}
                                      className={`py-2 px-3 text-sm rounded ${
                                        formData.time === value
                                          ? "bg-scolor text-white font-medium shadow-sm"
                                          : isBooked
                                          ? "bg-red-50 text-gray-400 cursor-not-allowed border border-red-100"
                                          : "hover:bg-pcolor/5 text-gray-700 border border-transparent hover:border-pcolor/20"
                                      } transition-all duration-150 flex items-center justify-center`}
                                    >
                                      <div className="flex items-center">
                                        <FaClock
                                          className={`mr-1.5 text-xs ${
                                            isBooked
                                              ? "text-red-300"
                                              : formData.time === value
                                              ? "text-white"
                                              : "text-pcolor"
                                          }`}
                                        />
                                        <span className="whitespace-nowrap">
                                          {value}
                                        </span>
                                        {isBooked && (
                                          <FaTimes className="ml-1.5 text-xs text-red-500" />
                                        )}
                                        {formData.time === value && (
                                          <FaCheck className="ml-1.5 text-xs" />
                                        )}
                                      </div>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Evening time slots */}
                          <div>
                            <div className="px-3 py-1.5 bg-scolor/10 rounded-md mb-1 flex items-center">
                              <div className="w-2 h-2 rounded-full bg-scolor/80 mr-2"></div>
                              <h4 className="text-xs font-medium text-gray-700">
                                EVENING
                              </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-1 px-1">
                              {groupedTimeOptions.evening.map(
                                ({ displayText, value }) => {
                                  const isBooked = isTimeSlotBooked(value);
                                  return (
                                    <button
                                      key={value}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() => {
                                        handleChange({
                                          target: { name: "time", value },
                                        });
                                        setSelectedField(null);
                                      }}
                                      className={`py-2 px-3 text-sm rounded ${
                                        formData.time === value
                                          ? "bg-scolor text-white font-medium shadow-sm"
                                          : isBooked
                                          ? "bg-red-50 text-gray-400 cursor-not-allowed border border-red-100"
                                          : "hover:bg-scolor/10 text-gray-700 border border-transparent hover:border-scolor/30"
                                      } transition-all duration-150 flex items-center justify-center`}
                                    >
                                      <div className="flex items-center">
                                        <FaClock
                                          className={`mr-1.5 text-xs ${
                                            isBooked
                                              ? "text-red-300"
                                              : formData.time === value
                                              ? "text-white"
                                              : "text-scolor/80"
                                          }`}
                                        />
                                        <span className="whitespace-nowrap">
                                          {value}
                                        </span>
                                        {isBooked && (
                                          <FaTimes className="ml-1.5 text-xs text-red-500" />
                                        )}
                                        {formData.time === value && (
                                          <FaCheck className="ml-1.5 text-xs" />
                                        )}
                                      </div>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-scolor rounded-sm mr-1"></div>
                            <span>Selected</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-50 border border-red-100 rounded-sm mr-1"></div>
                            <span>Unavailable</span>
                          </div>
                          <button
                            type="button"
                            className="text-gray-700 hover:text-scolor"
                            onClick={() => setSelectedField(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Hidden select for form submission */}
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    >
                      <option value="">Select a time slot</option>
                      {timeOptions.map(({ displayText, value }) => (
                        <option
                          key={value}
                          value={value}
                          disabled={isTimeSlotBooked(value)}
                        >
                          {displayText}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Improved warning for booked slots */}
                  {formData.date && bookedSlots.length > 0 && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-xs text-amber-700 flex items-start">
                        <span className="text-amber-600 font-medium">
                          <strong>Note:</strong> {bookedSlots.length} time slot
                          {bookedSlots.length !== 1 ? "s" : ""} on this date{" "}
                          {bookedSlots.length !== 1 ? "are" : "is"} already
                          booked.
                          {process.env.NODE_ENV === "development" && (
                            <span className="block mt-1 text-gray-500">
                              Booked slots: {bookedSlots.join(", ")}
                            </span>
                          )}
                        </span>
                      </p>
                    </div>
                  )}
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
                      Processing....
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

      {/* Add custom styles for the calendar and time selection */}
      <style jsx>{`
        .has-appointments {
          position: relative;
          background-color: rgba(var(--color-scolor-rgb), 0.1);
          border-radius: 4px;
          font-weight: 500;
        }

        .has-many-appointments {
          position: relative;
          background-color: rgba(var(--color-scolor-rgb), 0.2);
          border-radius: 4px;
          font-weight: 600;
        }

        .day-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .appointment-dot {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--color-scolor);
        }

        .appointment-count {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 0.75rem;
          color: var(--color-scolor);
          background-color: rgba(var(--color-scolor-rgb), 0.1);
          border-radius: 50%;
          padding: 0.2rem;
        }

        .react-datepicker {
          font-family: inherit;
          border-color: #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom-color: #e5e7eb;
        }

        .react-datepicker__day--selected {
          background-color: var(--color-scolor) !important;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: rgba(var(--color-scolor-rgb), 0.5) !important;
        }

        .react-datepicker__day:hover {
          background-color: rgba(var(--color-scolor-rgb), 0.1) !important;
        }

        .react-datepicker__day--disabled {
          color: #d1d5db !important;
        }

        /* Styles for time slot selection */
        select option:disabled {
          color: #999;
          background-color: #ffe6e6;
          font-style: italic;
        }

        .booked-slot {
          color: #999;
          background-color: #ffe6e6;
        }

        /* Time picker custom styles */
        .time-slot-pill {
          transition: all 0.2s ease;
        }
        .time-slot-pill:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .time-slot-pill:active:not(:disabled) {
          transform: translateY(0);
        }

        /* Style for time slot groups */
        .time-group-header {
          position: sticky;
          top: 0;
          z-index: 5;
          background-color: white;
        }
      `}</style>
    </div>
  );
};

// Add CSS variables for the theme colors
const styleElement = document.createElement("style");
styleElement.textContent = `
  :root {
    --color-scolor: var(--tw-color-scolor, #be8b60);
    --color-scolor-rgb: 190, 139, 96;
    --color-pcolor: var(--tw-color-pcolor, #9c6c3b);
  }

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

  /* DatePicker customizations */
  .calendar-wrapper .react-datepicker-wrapper {
    width: 100%;
  }

  .calendar-wrapper .react-datepicker__input-container {
    width: 100%;
  }
`;
document.head.appendChild(styleElement);

export default AppointmentForm;
