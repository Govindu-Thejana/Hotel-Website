import React, { useState, useEffect, useContext, useRef } from "react";
import { IoSearchOutline, IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { DateRangePicker } from "react-date-range";
import { format, addDays, differenceInDays } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import RoomCard from "../../components/roomBookings/RoomCard";
import { CartContext } from "../../contexts/CartContext";
import Cart from "../../components/roomBookings/Cart";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

const RoomBookingSearchBar = () => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const [tempDateRange, setTempDateRange] = useState(dateRange); // Temporary state for date range
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [adults, setAdults] = useState(1);
  const [tempAdults, setTempAdults] = useState(adults); // Temporary state for adults
  const [children, setChildren] = useState(0);
  const [tempChildren, setTempChildren] = useState(children); // Temporary state for children
  const [selectedPackage, setSelectedPackage] = useState("Double Room");
  const [tempSelectedPackage, setTempSelectedPackage] = useState(selectedPackage); // Temporary state for package
  const [commonBookedDates, setCommonBookedDates] = useState([]);
  const [roomTypes] = useState(['Deluxe Suite', 'Executive Suite', 'Single Room', 'Double Room']);
  const { cart, addToCart } = useContext(CartContext); // Use CartContext
  const navigate = useNavigate(); // Initialize useNavigate
  const packageRef = useRef(null);
  const guestsRef = useRef(null);

  // Helper function to calculate nights
  const calculateNights = (start, end) => {
    return differenceInDays(end, start);
  };

  // Add booking details to the cart
  const handleAddToCart = (room) => {
    const numberOfNights = calculateNights(
      dateRange[0].startDate,
      dateRange[0].endDate
    );
    const totalAmount = numberOfNights * room.pricePerNight;

    const bookingDetails = {
      roomType: room.roomType, // Use room's roomType
      checkIn: format(dateRange[0].startDate, "MM/dd/yyyy"),
      checkOut: format(dateRange[0].endDate, "MM/dd/yyyy"),
      guests: { adults, children },
      numberOfNights,
      totalAmount,
      room, // Include full room details
    };

    addToCart(bookingDetails);
    // Navigate to addons page after adding to cart
    navigate('/addons');
  };

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

  useEffect(() => {
    fetchBookedDates(selectedPackage);
  }, [selectedPackage]);

  const isDateBlocked = (date) => {
    if (date < new Date().setHours(0, 0, 0, 0)) return true;

    const isCommonBooked = commonBookedDates.some(blockedDate =>
      date.getDate() === blockedDate.getDate() &&
      date.getMonth() === blockedDate.getMonth() &&
      date.getFullYear() === blockedDate.getFullYear()
    );

    return isCommonBooked;
  };

  const handleDateChange = (ranges) => {
    const newStartDate = ranges.selection.startDate;
    const newEndDate = ranges.selection.endDate;

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
      setTempDateRange([ranges.selection]);
    }
  };

  const formatDate = (date) => (date ? format(date, "MM/dd/yyyy") : "Select date");

  const dayClassName = (date) => {
    if (isDateBlocked(date)) {
      return 'blocked-day';
    }
    return '';
  };

  const handleDropdownToggle = (dropdown) => {
    switch (dropdown) {
      case 'calendar':
        setIsCalendarOpen(!isCalendarOpen);
        setIsPackageOpen(false);
        setIsGuestsOpen(false);
        break;
      case 'package':
        setIsPackageOpen(!isPackageOpen);
        setIsCalendarOpen(false);
        setIsGuestsOpen(false);
        break;
      case 'guests':
        setIsGuestsOpen(!isGuestsOpen);
        setIsCalendarOpen(false);
        setIsPackageOpen(false);
        break;
    }
    setIsOverlayActive(!isCalendarOpen || !isPackageOpen || !isGuestsOpen);
  };

  const closeDropdowns = (e) => {
    if (packageRef.current && !packageRef.current.contains(e.target)) {
      setIsPackageOpen(false);
    }
    if (guestsRef.current && !guestsRef.current.contains(e.target)) {
      setIsGuestsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdowns);
    return () => {
      document.removeEventListener('mousedown', closeDropdowns);
    };
  }, []);

  const isValidDateRange = () => {
    const startDate = tempDateRange[0].startDate;
    const endDate = tempDateRange[0].endDate;
    return startDate < endDate;
  };

  const [availableRooms, setAvailableRooms] = useState([]);

  const handleSearch = async () => {
    if (!isValidDateRange()) {
      console.log("Invalid date range");
      return;
    }

    setDateRange(tempDateRange);
    setAdults(tempAdults);
    setChildren(tempChildren);
    setSelectedPackage(tempSelectedPackage); // Save the selected package
    setIsOverlayActive(false);
    setLoading(true);
    setError(null);

    try {
      const params = {
        startDate: format(tempDateRange[0].startDate, "yyyy-MM-dd"),
        endDate: format(tempDateRange[0].endDate, "yyyy-MM-dd"),
        roomType: tempSelectedPackage, // Use tempSelectedPackage for search
        guests: tempAdults + tempChildren,
      };
      const response = await axios.get("http://localhost:5555/bookedRoom/availableRooms", { params });
      const availableRooms = response.data.availableRooms;
      setAvailableRooms(availableRooms);
      setLoading(false);
    } catch (err) {
      // Handle errors
      if (error.response) {
        // Server responded with a status outside the 2xx range
        console.error('Error fetching available rooms:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // Request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Other errors during request setup
        console.error('Error setting up request:', error.message);
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOverlayActive(false);
    setTempDateRange(dateRange);
    setTempAdults(adults);
    setTempChildren(children);
    setTempSelectedPackage(selectedPackage);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
    display: isOverlayActive ? 'block' : 'none'
  };

  // Filter available rooms to exclude those already in the cart
  const filteredAvailableRooms = availableRooms.filter(
    room => !cart.some(cartItem => cartItem.room._id === room._id)
  );

  // Ensure only one room of each type is displayed
  const displayedRooms = [];
  const roomTypesDisplayed = new Set();

  for (const room of filteredAvailableRooms) {
    if (!roomTypesDisplayed.has(room.roomType)) {
      displayedRooms.push(room);
      roomTypesDisplayed.add(room.roomType);
    }
  }

  const handlePackageChange = async (pkg) => {
    setTempSelectedPackage(pkg);
    await fetchBookedDates(pkg); // Fetch booked dates for the selected package
    const selectedRoom = displayedRooms.find(room => room.roomType === pkg);
    if (selectedRoom) {
      setTempAdults(Math.min(selectedRoom.capacity, tempAdults));
    }
    setIsPackageOpen(false);
  }

  // Find the maximum adults capacity for the selected room type
  const maxAdults = displayedRooms.find(room => room.roomType === tempSelectedPackage)?.capacity || 2;
  const maxChildren = 3;

  return (
    <div className="flex flex-col md:flex-row mx-auto max-w-7xl min-h-screen py-20">
      {/* Main content */}
      <div className="flex flex-col mx-auto max-w-6xl p-4 w-full md:w-2/3 min-h-screen">
        <div
          style={overlayStyle}
          onClick={handleCancel}
        />

        <div className="flex flex-col md:flex-row items-center justify-between w-full p-4 bg-white shadow-md rounded-md top-0 z-50">
          <div className="relative w-36" ref={packageRef}>
            <div className="flex flex-col cursor-pointer" onClick={() => handleDropdownToggle("package")}>
              <label className="text-xs text-center font-medium text-gray-700 uppercase">Package</label>
              <div className="mt-1 bg-gray-100 p-2 rounded-md flex justify-between">
                {tempSelectedPackage}
                {isPackageOpen ? <IoChevronUpOutline size={16} /> : <IoChevronDownOutline size={16} />}
              </div>
            </div>
            {isPackageOpen && (
              <ul className="absolute top-12 left-0 bg-white shadow-md rounded-md w-32 z-50">
                {roomTypes.map((pkg) => (
                  <li
                    key={pkg}
                    className="px-1 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePackageChange(pkg)}
                  >
                    {pkg}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <div className="flex flex-col items-center cursor-pointer" onClick={() => handleDropdownToggle("calendar")}>
              <label className="text-xs font-medium text-gray-700 uppercase">Check In</label>
              <div className="mt-1 bg-gray-100 p-2 rounded-md text-center w-full">
                <span>{formatDate(tempDateRange[0].startDate)}</span>
              </div>
            </div>
            <span className="px-2">-</span>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => handleDropdownToggle("calendar")}>
              <label className="text-xs font-medium text-gray-700 uppercase">Check Out</label>
              <div className="mt-1 bg-gray-100 p-2 rounded-md text-center w-full">
                <span>{formatDate(tempDateRange[0].endDate)}</span>
              </div>
            </div>
          </div>

          <div className="relative w-44" ref={guestsRef}>
            <div className="flex flex-col cursor-pointer" onClick={() => handleDropdownToggle("guests")}>
              <label className="text-xs font-medium text-gray-700 uppercase">Guests</label>
              <div className="mt-1 bg-gray-100 p-2 rounded-md flex justify-between">
                {tempAdults} Adults, {tempChildren} Children
                {isGuestsOpen ? <IoChevronUpOutline size={16} /> : <IoChevronDownOutline size={16} />}
              </div>
            </div>
            {isGuestsOpen && (
              <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-48 p-4 z-50">
                <div className="flex justify-between items-center mb-2">
                  <span>Adults</span>
                  <div className="flex items-center">
                    <button className="px-2 py-1 bg-gray-200 rounded-md" onClick={() => setTempAdults(Math.max(1, tempAdults - 1))}>
                      -
                    </button>
                    <span className="mx-2">{tempAdults}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded-md" onClick={() => setTempAdults(Math.min(maxAdults, tempAdults + 1))}>
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Children</span>
                  <div className="flex items-center">
                    <button className="px-2 py-1 bg-gray-200 rounded-md" onClick={() => setTempChildren(Math.max(0, tempChildren - 1))}>
                      -
                    </button>
                    <span className="mx-2">{tempChildren}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded-md" onClick={() => setTempChildren(Math.min(maxChildren, tempChildren + 1))}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative w-20 pt-4">
            {!isOverlayActive && (
              <button
                className={` w-full h-10 flex items-center justify-center shadow-md transition-all
                  ${isValidDateRange()
                    ? 'bg-scolor text-white hover:bg-pcolor cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                onClick={handleSearch}
                disabled={!isValidDateRange()}
                aria-label="Search"
              >
                <IoSearchOutline size={18} />
                Search
              </button>
            )}
          </div>
        </div>

        {isOverlayActive && (
          <div className="top-20 z-40 bg-white rounded-lg shadow-lg p-4">
            <DateRangePicker
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={tempDateRange}
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
            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-gray-600">Select check-in and check-out dates on the calendar</p>
              <div className="flex">
                <button
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>

          </div>
        )}

        <div className="mt-10 w-full">
          {loading ? (
            <div className="flex justify-center  min-h-screen">
              <ClipLoader size={100} color={"#3182ce"} loading={loading} />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : displayedRooms.length > 0 ? (
            <div className="container mx-auto p-4">
              <div className="flex flex-col gap-4">
                {displayedRooms.map(room => (
                  <div key={room._id}>
                    <RoomCard room={room} onAddToCart={() => handleAddToCart(room)} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className=" bg-blue-300">"No rooms available for the selected dates"</div>
          )}
        </div>
      </div>

      {/* Cart component */}
      <div className="w-full md:w-1/3 p-4 bg-gray-50">
        <Cart />
      </div>
    </div>
  );
};

export default RoomBookingSearchBar;