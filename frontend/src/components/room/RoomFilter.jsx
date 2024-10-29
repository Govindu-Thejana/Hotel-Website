import React, { useState } from "react";

const RoomFilter = ({ data, setFilteredData }) => {
    const [filter, setFilter] = useState("");

    const handleSelectChange = (e) => {
        const selectedType = e.target.value;
        setFilter(selectedType);

        const filteredRooms = data.filter((room) =>
            room.roomType.toLowerCase().includes(selectedType.toLowerCase())
        );
        setFilteredData(filteredRooms);
    };

    const clearFilter = () => {
        setFilter("");
        setFilteredData(data);
    };

    const roomTypes = ["", ...new Set(data.map((room) => room.roomType))];

    return (
        <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="room-type-filter" className="font-semibold text-gray-700">
                Filter rooms by type:
            </label>
            <select
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="room type filter"
                value={filter}
                onChange={handleSelectChange}
            >
                <option value="">Select a room type to filter...</option>
                {roomTypes.map((type, index) => (
                    <option key={index} value={String(type)}>
                        {String(type)}
                    </option>
                ))}
            </select>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                type="button"
                onClick={clearFilter}
            >
                Clear Filter
            </button>
        </div>
    );
};

export default RoomFilter;
