import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import AdminRoomPaginator from "../components/room/AdminRoomPaginator";
import RoomFilter from "../components/room/RoomFilter";

const RoomManagement = () => {
    // State variables
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchRoomId, setSearchRoomId] = useState(""); // Add state for search input

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            if (searchRoomId) {
                // Fetch a specific room by roomId
                const result = await axios.get(`http://localhost:5555/rooms/search/${searchRoomId}`);
                setRooms([result.data]); // Set the result as an array to maintain consistency
                setFilteredRooms([result.data]);
            } else {
                // Fetch all rooms
                const result = await axios.get('http://localhost:5555/rooms');
                setRooms(result.data.data);
                setFilteredRooms(result.data.data); // Initialize filteredRooms
            }
            setIsLoading(false);
        } catch (error) {
            setErrorMessage(error.message);
            setRooms([]);
            setFilteredRooms([]);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRoomType === "") {
            setFilteredRooms(rooms);
        } else {
            const filteredRooms = rooms.filter((room) => room.roomType === selectedRoomType);
            setFilteredRooms(filteredRooms);
        }
        setCurrentPage(1);
    }, [rooms, selectedRoomType]);

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (roomId) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this room?");

        if (confirmDelete) { // If user confirms
            try {
                const result = await axios.delete(`http://localhost:5555/rooms/${roomId}`);
                if (result.status === 200) {
                    setSuccessMessage(`Room No ${roomId} was deleted.`);
                    setRooms(rooms.filter(room => room._id !== roomId));
                    fetchRooms(); // Refresh room list if needed
                } else {
                    setErrorMessage(`Error deleting room: ${result.data.message}`);
                }
            } catch (error) {
                setErrorMessage(error.response ? error.response.data.message : error.message);
            }
            setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 3000);
        }
    };


    const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) => {
        const totalRooms = filteredRooms.length > 0 ? filteredRooms.length : rooms.length;
        return Math.ceil(totalRooms / roomsPerPage);
    };

    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const navigate = useNavigate();

    const handleNavigateAddRoom = () => {
        navigate('/add-rooms');
    };

    // Handle Enter key press in the search input
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchRooms(); // Trigger fetchRooms on Enter key press
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Room Management</h1>
                        <button
                            onClick={handleNavigateAddRoom}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus size={16} />
                            <span>Add New Room</span>
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div>
                            <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search rooms by RoomID..."
                                value={searchRoomId}
                                onChange={(e) => setSearchRoomId(e.target.value)}
                                onKeyDown={handleKeyDown} // Trigger search on Enter key
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Rooms Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Room ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Room Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price Per Night</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Availability</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentRooms.map((room) => (
                                    <tr key={room.roomId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{room.roomId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{room.roomType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{room.pricePerNight}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{room.availability ? "Available" : "Not Available"}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-3">
                                                <Link to={`/edit-room/${room._id}`} className="gap-2">
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="text-yellow-600 hover:text-yellow-800">
                                                        <Edit size={16} />
                                                    </button>
                                                </Link>
                                                <button className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDelete(room._id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <AdminRoomPaginator
                    currentPage={currentPage}
                    totalPages={calculateTotalPages(filteredRooms, roomsPerPage, rooms)}
                    onPageChange={handlePaginationClick}
                />
            </div>
        </div>
    );
};

export default RoomManagement;
