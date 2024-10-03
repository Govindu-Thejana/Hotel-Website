import React, { useState, useEffect } from 'react';
import AddRoomCard from '../components/AddRoomCard';
import RoomCard from '../components/RoomCard'; // Import RoomCard
import axios from 'axios';

const AdminRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);

    // Fetch room data from the backend API
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:5555/rooms'); // Fetch all rooms

                if (response.status === 200) {
                    setRooms(response.data.data); // Set the rooms data in the state
                } else {
                    setError('Failed to fetch rooms');
                }
            } catch (err) {
                setError('Failed to fetch rooms');
            }
        };

        fetchRooms();
    }, []); // Empty dependency array ensures it runs once when the component mounts

    // Function to handle room deletion
    const handleDelete = async (roomId) => {
        try {
            const response = await axios.delete(`http://localhost:5555/rooms/${roomId}`);

            if (response.status === 200) {
                alert('Room deleted successfully');
                // Remove the deleted room from the state
                setRooms(rooms.filter(room => room._id !== roomId));
            } else {
                alert('Failed to delete the room');
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            alert('An error occurred while deleting the room.');
        }
    };

    return (
        <div >
            <div className='px-12'>
                {/* Add Room Component */}
                <AddRoomCard />
            </div>
            <div className='py-20 '>
                {/* Render RoomCard component and pass rooms, error, and handleDelete */}
                <RoomCard rooms={rooms} error={error} handleDelete={handleDelete} />
            </div>
        </div>
    );
};

export default AdminRoom;
