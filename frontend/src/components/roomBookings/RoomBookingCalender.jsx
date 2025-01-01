import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, isWithinInterval } from 'date-fns';
import { DateRangePicker } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const BookingPage = () => {
  // Define blocked dates
  const blockedDates = [
    new Date(2024, 11, 25), // Christmas
    new Date(2024, 11, 31), // New Year's Eve
    new Date(2025, 0, 1),   // New Year's Day
    // Add more dates as needed
  ];

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);

  // Function to check if a date is blocked
  const isDateBlocked = (date) => {
    return blockedDates.some(blockedDate =>
      date.getDate() === blockedDate.getDate() &&
      date.getMonth() === blockedDate.getMonth() &&
      date.getFullYear() === blockedDate.getFullYear()
    );
  };
  const [start, startRef] = React.useState(null);
  const [end, endRef] = React.useState(null);
  return (
    <div className="py-20">
      <h1>Booking Page</h1>

      <DateRangePicker
        onChange={item => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        editableDateInputs={true}
        rangeColors={['#3182ce']}
        disabledDay={isDateBlocked}
        showDateDisplay={false} // Hides the visible date inputs above the calendar
        staticRanges={[]}
        inputRanges={[]}
      />

    </div>
  );
};

export default BookingPage;