import React from 'react';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';

const BookingForm = ({ room }) => {
    return (
        <section className='Booking Form'>
            <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-lg self-start sticky top-6">
                <h3 className="text-2xl font-serif mb-4 text-gray-800">Reserve Your Stay</h3>
                <form className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
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
                            required
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {/* Check In */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                className="w-full p-2 pr-10 border rounded-lg"
                                placeholder="Select dates"
                            />
                            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    {/* Check Out */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                className="w-full p-2 pr-10 border rounded-lg"
                                placeholder="Select dates"
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
                                className="w-full p-2 pr-10 border rounded-lg"
                                defaultValue={1}
                                min={1}
                                max={room ? room.capacity : 1} // Ensure room is defined
                            />
                            <FaUsers className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    {/* Special Requests Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                        <textarea
                            className="w-full p-2 border rounded-lg"
                            rows={3}
                            placeholder="Any special requests or notes"
                        ></textarea>
                    </div>

                    {/* Booking Summary */}
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">{room ? room.pricePerNight : 0}$</span>
                        <button type="submit" className="bg-scolor text-white px-4 py-2 hover:bg-pcolor transition">
                            Book Now
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default BookingForm;
