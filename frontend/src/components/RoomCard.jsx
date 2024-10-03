import React from 'react';

const RoomCard = ({ rooms, error, handleDelete }) => {
    return (
        <div>
            {/* ROOMS packages cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
                {error ? (
                    <div className="col-span-full text-center text-red-500">
                        {error}
                    </div>
                ) : (
                    rooms.map((room) => (
                        <div key={room._id} className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                            <img
                                className="w-full h-48 object-cover"
                                src={room.images[0]} // Assuming the first image in the array
                                alt={`Room ID: ${room._id}`}
                            />
                            <div className="p-6">
                                <h2 className="text-2xl font-serif text-pcolor mb-2">Room ID: {room.roomId}</h2>

                                <div className="flex justify-between text-gray-800 mb-4">
                                    {/* Room occupancy, size, or other info can go here if needed */}
                                </div>

                                <button
                                    className="font-sans w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(room._id)} // Call delete function
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>
=======
import PropTypes from 'prop-types';
import { Users, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
    const navigate = useNavigate();
    const handleFindOutMore = () => {
        navigate(`/roomDetails/${room._id}`); // Navigate to room details page
    };
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md mx-auto">
            <div className="relative">
                <img
                    className="w-full h-48 object-cover"
                    src={room.images[0] || "/api/placeholder/400/300"}
                    alt={room.roomType}
                />
            </div>
            <div className="p-6">
                <h2 className="text-2xl font-serif mb-2 text-gray-800">{room.roomType}</h2>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="flex justify-between text-gray-800 mb-4">
                    <div className="flex items-center">
                        <Users className="mr-2 text-scolor" size={20} />
                        <span>Capacity: {room.capacity}</span>
                    </div>
                    <div className="flex items-center">
                        <Square className="mr-2 text-scolor" size={20} />
                        <span>Size: {room.capacity} m²</span>
                    </div>
                </div>
                <button
                    className="w-full bg-white border border-scolor hover:border-none hover:text-white text-pcolor py-2 px-4  hover:bg-scolor transition duration-300"
                    onClick={handleFindOutMore} // No need for the arrow function here since you're not passing any arguments
                >
                    Find Out More
                </button>

            </div>
        </div>
    );
};

export default RoomCard;
RoomCard.propTypes = {
    room: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        roomType: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        capacity: PropTypes.number.isRequired,
        pricePerNight: PropTypes.number.isRequired,
    }).isRequired,
};

export default RoomCard;
