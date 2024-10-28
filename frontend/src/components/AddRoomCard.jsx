import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddRoomCard = () => {
    const navigate = useNavigate(); // Hook to navigate

    // Function to handle button click
    const handleAddRoomClick = () => {
        navigate('/add-rooms'); // Navigate to the AddRooms page
    };

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="px-5 py-5">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    Add New Room
                </h5>
                <div className="flex items-center justify-center mt-5">
                    <button
                        type="button"
                        onClick={handleAddRoomClick} // Call the function on click
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Add New Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoomCard;
