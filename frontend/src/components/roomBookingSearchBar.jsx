import React, { useState } from 'react';
import { Search, Users, CalendarDays, Plus, Minus } from 'lucide-react';

const SearchBar = () => {
    const [roomType, setRoomType] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [showGuestPopover, setShowGuestPopover] = useState(false);
    const [guests, setGuests] = useState({ adults: 1, children: 0 });

    const handleSearch = () => {
        const searchParams = new URLSearchParams({
            roomType,
            checkIn,
            checkOut,
            adults: guests.adults,
            children: guests.children
        });
        window.location.href = `/reservation?${searchParams.toString()}`;
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-5xl mx-auto rounded-lg shadow-lg p-2">
            {/* Room Type */}
            <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="flex-1 h-12 px-4 rounded-md border bg-transparent text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-scolor"
            >
                <option value="" className="text-black">Room Type</option>
                <option value="standard" className="text-black">Standard Room</option>
                <option value="deluxe" className="text-black">Deluxe Room</option>
                <option value="suite" className="text-black">Suite Room</option>
                <option value="family" className="text-black">Family Room</option>
            </select>

            {/* Check-in Date */}
            <div
                className="relative flex-1 cursor-pointer"
                onClick={() => document.getElementById('checkInInput').focus()} // Trigger input focus on click
            >
                <div className="absolute left-3 top-3 text-gray-400">
                    <CalendarDays size={20} className="text-white" />
                </div>
                <input
                    id="checkInInput" // Give the input an ID to target
                    type="date"
                    className="w-full h-12 pl-12 rounded-md border text-white bg-transparent border-gray-300 focus:outline-none focus:ring-2 focus:ring-scolor"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            {/* Check-out Date */}
            <div
                className="relative flex-1 cursor-pointer"
                onClick={() => document.getElementById('checkOutInput').focus()} // Trigger input focus on click
            >
                <div className="absolute left-3 top-3 text-gray-400">
                    <CalendarDays size={20} className="text-white" />
                </div>
                <input
                    id="checkOutInput" // Give the input an ID to target
                    type="date"
                    className="w-full h-12 pl-12 rounded-md border bg-transparent text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-scolor"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                />
            </div>

            {/* Guests */}
            <div className="relative">
                <button
                    onClick={() => setShowGuestPopover(!showGuestPopover)}
                    className="h-12 px-4 rounded-md border border-gray-300 flex items-center gap-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Users size={20} />
                    <span>{guests.adults} Adults, {guests.children} Children</span> {/* Show adults and children */}
                </button>

                {showGuestPopover && (
                    <div className="absolute top-14 right-0 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50">
                        <div className="space-y-4">
                            {/* Adults */}
                            <div className="flex justify-between items-center">
                                <span>Adults</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                                        className="p-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center">{guests.adults}</span>
                                    <button
                                        onClick={() => setGuests(prev => ({ ...prev, adults: Math.min(4, prev.adults + 1) }))}
                                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                            {/* Children */}
                            <div className="flex justify-between items-center">
                                <span>Children</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center">{guests.children}</span>
                                    <button
                                        onClick={() => setGuests(prev => ({ ...prev, children: Math.min(4, prev.children + 1) }))}
                                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Search Button */}
            <button
                onClick={handleSearch}
                className="h-12 px-6 bg-scolor text-white rounded-md focus:outline-none focus:ring-offset-2"
            >
                <Search size={20} />
            </button>
        </div>
    );
};

export default SearchBar;
