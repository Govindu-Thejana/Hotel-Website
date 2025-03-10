import React, { useState, useEffect } from "react";

const AdminCalendarAdmin = ({ appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Helper function to format time
  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Render the calendar grid
  const renderCalendar = () => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="border p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const hasAppointments = appointments.some(
        (appointment) =>
          new Date(appointment.date).toDateString() === date.toDateString()
      );

      days.push(
        <div
          key={i}
          className={`border p-2 cursor-pointer ${
            hasAppointments ? "bg-green-50" : ""
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div>{i}</div>
          {hasAppointments && (
            <div className="text-xs text-green-600">Has appointments</div>
          )}
        </div>
      );
    }

    return days;
  };

  // Render time slots with appointments and reasons
  const renderTimeSlots = () => {
    if (!selectedDate) return null;

    const slots = [];
    const confirmedAppointments = appointments.filter(
      (appointment) =>
        new Date(appointment.date).toDateString() ===
        selectedDate.toDateString()
    );

    // Create a map of appointments by hour
    const appointmentsByHour = {};
    confirmedAppointments.forEach((appointment) => {
      const hour = parseInt(appointment.time.split(":")[0]);
      if (!appointmentsByHour[hour]) {
        appointmentsByHour[hour] = [];
      }
      appointmentsByHour[hour].push(appointment);
    });

    // Create time slots from 6 AM to 10 PM
    for (let hour = 6; hour < 22; hour++) {
      const timeSlotStart = `${hour}:00`;
      const timeSlotEnd = `${hour + 1}:00`;
      const appointmentsInSlot = appointmentsByHour[hour] || [];

      slots.push(
        <div key={hour} className="p-2 border-b">
          <div className="font-bold">
            {timeSlotStart} - {timeSlotEnd}
          </div>
          {appointmentsInSlot.length > 0 ? (
            <div className="mt-1">
              {appointmentsInSlot.map((appointment) => (
                <div key={appointment._id} className="text-sm space-y-1">
                  <div>
                    <span className="text-red-600 font-bold">Booked:</span>{" "}
                    {appointment.name} at {formatTime(appointment.time)}
                  </div>
                  <div className="text-gray-600 pl-4">
                    Reason: {appointment.reason || "No reason provided"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 mt-1">Available</div>
          )}
        </div>
      );
    }

    return (
      <div className="w-1/2 p-4 border-l">
        <h4 className="text-lg font-bold mb-2">
          Appointments for {selectedDate.toDateString()}
        </h4>
        {slots}
      </div>
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="mt-12 flex">
      <div className="w-1/2">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="px-4 py-2 bg-gray-300 rounded">
            Previous
          </button>
          <h3 className="text-xl font-medium">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
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
          {renderCalendar()}
        </div>
      </div>
      {renderTimeSlots()}
    </div>
  );
};

export default AdminCalendarAdmin;
