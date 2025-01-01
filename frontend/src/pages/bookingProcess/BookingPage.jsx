import React, { useState, useEffect } from "react";
import { IoSearchOutline, IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { DateRangePicker } from "react-date-range";
import { format, addDays, isWithinInterval } from "date-fns";
import axios from "axios";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import RoomBookingComponent from "../../components/roomBookings/datePickerComponent";

const RoomBookingSearchBar = () => {
  // State declarations
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState("Double");
  const [commonBookedDates, setCommonBookedDates] = useState([]);
  const [roomTypes] = useState(['Deluxe Suite', 'Executive Suite', 'Single', 'Double']);  // Example room types

  // Function to fetch booked dates based on room type
  const fetchBookedDates = async (roomType) => {
    if (!roomType) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5555/bookedRoom/bookings/room/${roomType}`);
      const { commonBookedDates } = response.data.data;
      setCommonBookedDates(commonBookedDates.map(date => new Date(date)));
      setLoading(false);
    } catch (err) {
      setError('Error fetching booked dates');
      setLoading(false);
    }
  };

  // Fetch booked dates when package changes
  useEffect(() => {
    fetchBookedDates(selectedPackage);
  }, [selectedPackage]);

  // Function to check if date is blocked (either holiday or booked)
  const isDateBlocked = (date) => {
    // Check for past dates
    if (date < new Date().setHours(0, 0, 0, 0)) return true;

    // Check if date is a common booked date
    const isCommonBooked = commonBookedDates.some(blockedDate =>
      date.getDate() === blockedDate.getDate() &&
      date.getMonth() === blockedDate.getMonth() &&
      date.getFullYear() === blockedDate.getFullYear()
    );

    return isCommonBooked;
  };

  // Function to handle date changes
  const handleDateChange = (ranges) => {
    const newStartDate = ranges.selection.startDate;
    const newEndDate = ranges.selection.endDate;

    // Check if any date in the range is blocked
    let isRangeBlocked = false;
    let currentDate = new Date(newStartDate);

    while (currentDate <= newEndDate) {
      if (isDateBlocked(currentDate)) {
        isRangeBlocked = true;
        break;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (!isRangeBlocked) {
      setDateRange([ranges.selection]);
    }
  };

  // Function to format dates
  const formatDate = (date) => (date ? format(date, "MM/dd/yyyy") : "Select date");

  // Function to get day class name
  const dayClassName = (date) => {
    if (isDateBlocked(date)) {
      return 'blocked-day';
    }
    return '';
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-20">
      <div className="flex absolute pt-20 items-center justify-center">
        {isCalendarOpen && (
          <div className="">
            <DateRangePicker
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={dateRange}
              direction="horizontal"
              editableDateInputs={true}
              rangeColors={["#3182ce"]}
              disabledDay={isDateBlocked}
              showDateDisplay={false}
              minDate={new Date()}
              dayClassName={dayClassName}
              staticRanges={[]}
              inputRanges={[]}

            />
            <style jsx global>{`

                .rdrCalendarWrapper {
                  width: 700px;
                  font-size: 14px;
                  background: white;
                }
                .rdrMonth {
                  width: 100%;
                  padding: 0 0.5rem;
                }
                .rdrDefinedRangesWrapper {
                  display: none;
                }
                .rdrDateRangeWrapper {
                  border-radius: 0.5rem;
                  border: 1px solid #e2e8f0;
                }
                .rdrDayNumber {
                  font-size: 12px;
                }
                .rdrSelected {
                  border-radius: 1.5rem;
                }
                .rdrDay {
                  height: 3rem;
                }
                .rdrDayPassive {
                  opacity: 0 !important;
                  visibility: hidden;
                  pointer-events: none;
                }
                .rdrDayPassive .rdrDayNumber {
                  display: none;
                }
                .blocked-day {
                  background-color: #ff0000 !important;
                  color: white !important;
                  opacity: 0.7 !important;
                  pointer-events: none;
                  text-decoration: line-through;
                }
                .blocked-day .rdrDayNumber span {
                  color: white !important;
                }
                .rdrMonths .rdrMonth {
                  padding: 0 8px;
                }
              }
            `}</style>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full max-w-6xl p-4 bg-white shadow-md rounded-full relative">
        {/* Package Dropdown */}
        <div className="relative w-36">
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => setIsPackageOpen(!isPackageOpen)}
          >
            <label className="text-xs flex items-center justify-center text-center font-medium text-gray-700 uppercase">
              Package
            </label>
            <div className="mt-1 bg-gray-100 p-2 rounded-md flex justify-between">
              {selectedPackage}
              {isPackageOpen ? <IoChevronUpOutline size={16} /> : <IoChevronDownOutline size={16} />}
            </div>
          </div>
          {isPackageOpen && (
            <ul className="absolute top-12 left-0 bg-white shadow-md rounded-md w-32 z-50">
              {roomTypes.map((pkg) => (
                <li
                  key={pkg}
                  className="px-1 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setIsPackageOpen(false);
                    setDateRange([{
                      startDate: new Date(),
                      endDate: addDays(new Date(), 1),
                      key: "selection",
                    }]);
                  }}
                >
                  {pkg}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Check In/Out Display */}
        <div className="flex flex-col items-center">
          <label className="text-xs font-medium text-gray-700 uppercase">Check In</label>
          <div className="mt-1 bg-gray-100 p-2 rounded-md text-center w-full">
            <span>{formatDate(dateRange[0].startDate)}</span>
          </div>
        </div>
        <span>-</span>
        <div className="flex flex-col items-center">
          <label className="text-xs font-medium text-gray-700 uppercase">Check Out</label>
          <div className="mt-1 bg-gray-100 p-2 rounded-md text-center w-full">
            <span>{formatDate(dateRange[0].endDate)}</span>
          </div>
        </div>

        {/* Guests Dropdown */}
        <div className="relative w-44">
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => setIsGuestsOpen(!isGuestsOpen)}
          >
            <label className="text-xs font-medium text-gray-700 uppercase">Guests</label>
            <div className="mt-1 bg-gray-100 p-2 rounded-md flex justify-between">
              {adults} Adults, {children} Children
              {isGuestsOpen ? <IoChevronUpOutline size={16} /> : <IoChevronDownOutline size={16} />}
            </div>
          </div>
          {isGuestsOpen && (
            <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-48 p-4 z-50">
              <div className="flex justify-between items-center mb-2">
                <span>Adults</span>
                <div className="flex items-center">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-md"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  >
                    -
                  </button>
                  <span className="mx-2">{adults}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-md"
                    onClick={() => setAdults(adults + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Children</span>
                <div className="flex items-center">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-md"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  >
                    -
                  </button>
                  <span className="mx-2">{children}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-md"
                    onClick={() => setChildren(children + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="relative w-20 pt-4">
          <button
            className="bg-blue-500 border-2 border-blue-500 text-white rounded-full w-full h-10 flex items-center justify-center shadow-md hover:bg-blue-400"
            aria-label="Search"
          >
            <IoSearchOutline size={18} />
            Search
          </button>
        </div>
      </div>

      <div className="pt-96 p-5 bg-orange-400">
        <RoomBookingComponent />
      </div>
    </div>
  );
};

export default RoomBookingSearchBar;