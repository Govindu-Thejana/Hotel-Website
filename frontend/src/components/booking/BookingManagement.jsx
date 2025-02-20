import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import axios from "axios";

const RoomBookingCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch room data
        const fetchRooms = async () => {
            try {
                const result = await axios.get("https://hotel-website-backend-drab.vercel.app/rooms");
                setRooms(result.data.data); // Assuming data is in result.data.data
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        // Fetch booking data
        const fetchBookings = async () => {
            try {
                const result = await axios.get(
                    "https://hotel-website-backend-drab.vercel.app/bookedRoom/bookings"
                );
                setBookings(result.data); // Assuming the API returns an array of bookings
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchRooms();
        fetchBookings();
    }, []);

    const getDatesForHeader = () => {
        const dates = [];
        const startDate = new Date(selectedDate);

        for (let i = 0; i < 8; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push({
                fullDate: date,
                day: date.getDate(),
                month: date.toLocaleString("default", { month: "short" }),
                weekday: date.toLocaleString("default", { weekday: "short" }),
            });
        }
        return dates;
    };

    const isDateWithinRange = (date, startDate, endDate) => {
        const targetDate = new Date(date).setHours(0, 0, 0, 0);
        return (
            targetDate >= new Date(startDate).setHours(0, 0, 0, 0) &&
            targetDate <= new Date(endDate).setHours(0, 0, 0, 0)
        );
    };

    const renderBookings = (roomId, date) => {
        const booking = bookings.find(
            (b) =>
                b.roomId?.roomId === roomId &&
                isDateWithinRange(date, b.checkIn, b.checkOut)
        );

        if (booking) {
            return (
                <><div className="absolute top-1 right-1 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">
                    ${booking.totalAmount}
                </div>
                    <div

                        className=" absolute bottom-0 left-0 right-0 bg-green-300 text-gray text-xs p-1 rounded cursor-pointer"
                        onClick={() => {
                            setSelectedBooking(booking);
                            setIsModalOpen(true);
                        }}
                    >
                        {booking.fullName}
                    </div></>
            );
        }
        return null;
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Top date picker bar */}
            <div className="bg-gray-50 p-4 flex items-center gap-4 border-b">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={() =>
                            setSelectedDate(
                                new Date(selectedDate.setDate(selectedDate.getDate() - 7))
                            )
                        }
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={() =>
                            setSelectedDate(
                                new Date(selectedDate.setDate(selectedDate.getDate() + 7))
                            )
                        }
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                    {/* Header row with dates */}
                    <div className="grid grid-cols-[250px_repeat(8,1fr)]">
                        <div className="p-3 font-medium border-r border-b">Room ID</div>
                        {getDatesForHeader().map((date, idx) => (
                            <div
                                key={idx}
                                className="p-2 text-center border-r border-b bg-gray-50"
                            >
                                <div className="font-medium">{date.weekday}</div>
                                <div className="text-sm">{date.day}</div>
                                <div className="text-xs text-gray-500">{date.month}</div>
                            </div>
                        ))}
                    </div>

                    {/* Room rows */}
                    {rooms.map((room) => (
                        <div
                            key={room.roomId}
                            className="grid grid-cols-[250px_repeat(8,1fr)]"
                        >
                            <div className="p-3 border-r border-b flex items-center">
                                <div>
                                    <div className="font-medium text-gray-800">
                                        {room.roomId}
                                    </div>
                                </div>
                            </div>
                            {getDatesForHeader().map((date, idx) => (
                                <div
                                    key={idx}
                                    className="h-16 border-r border-b p-1 relative"
                                >
                                    {renderBookings(room.roomId, date.fullDate)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking details modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                        <div className="space-y-2 text-sm">
                            <p>
                                <strong>Booking ID:</strong> {selectedBooking.bookingId}
                            </p>
                            <p>
                                <strong>Room ID:</strong> {selectedBooking.roomId.roomId}
                            </p>
                            <p>
                                <strong>Room Type:</strong> {selectedBooking.roomId.roomType}
                            </p>
                            <p>
                                <strong>Full Name:</strong> {selectedBooking.fullName}
                            </p>
                            <p>
                                <strong>No of Guests:</strong> {selectedBooking.guests}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedBooking.email}
                            </p>
                            <p>
                                <strong>Phone Number:</strong> {selectedBooking.phone}
                            </p>
                            <p>
                                <strong>Special Requests:</strong> {selectedBooking.specialRequests}
                            </p>
                            <p>
                                <strong>Total Amount:</strong> {selectedBooking.totalAmount}
                            </p>
                            <p>
                                <strong>Booking Confirmation Code:</strong> {selectedBooking.bookingConfirmationCode}
                            </p>
                            <p>
                                <strong>Check-In:</strong>{" "}
                                {new Date(selectedBooking.checkIn).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Check-Out:</strong>{" "}
                                {new Date(selectedBooking.checkOut).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RoomBookingCalendar;
