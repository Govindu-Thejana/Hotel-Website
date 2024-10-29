import React, { useState } from 'react';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { createBooking } from '../components/utils/ApiFunctions.js'; // Adjust this import based on your file structure

const BookingForm = ({ roomId, room }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookingData = {
            roomId,
            ...formData,
        };

        try {
            const response = await createBooking(bookingData);
            console.log("Booking created successfully:", response);
            alert('Booking created successfully!');
        } catch (error) {
            console.error("Error creating booking:", error);
            alert(error.message);
        }
    };

    return (
        <div>
            <section className="Booking Form">
                <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-lg self-start sticky top-6">
                    <h3 className="text-2xl font-serif mb-4 text-gray-800">Reserve Your Stay</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border rounded-lg"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border rounded-lg"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border rounded-lg"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* Check In Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="checkIn"
                                    value={formData.checkIn}
                                    onChange={handleInputChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]} // Ensure check-in is today or later
                                    className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-scolor focus:border-transparent"
                                />
                                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Check Out Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="checkOut"
                                    value={formData.checkOut}
                                    onChange={handleInputChange}
                                    required
                                    min={formData.checkIn || new Date().toISOString().split('T')[0]} // Check-out must be after check-in
                                    className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-scolor focus:border-transparent"
                                />
                                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Guests Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleInputChange}
                                    className="w-full p-2 pr-10 border rounded-lg"
                                    min={1}
                                    max={room ? room.capacity : 1}
                                />
                                <FaUsers className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Special Requests Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                            <textarea
                                name="specialRequests"
                                value={formData.specialRequests}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-lg"
                                rows={3}
                                placeholder="Any special requests or notes"
                            ></textarea>
                        </div>

                        {/* Booking Summary */}
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">${room.pricePerNight} per night</span>
                            <button type="submit" className="bg-scolor text-white px-4 py-2 hover:bg-pcolor transition">
                                Book Now
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default BookingForm;
