import React from 'react';

const RoomCard = ({ rooms = [], error, handleDelete }) => { // Set default value for rooms
    return (
        <div>
            {/* ROOMS packages cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {error ? (
                    <div className="col-span-full text-center text-red-500">
                        {error}
                    </div>
                ) : (
                    rooms.length > 0 ? ( // Check if rooms array has items
                        rooms.map((room) => (
                            <div key={room._id} className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                                <img
                                    className="w-full h-48 object-cover"
                                    src={room.images[0]}
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
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No rooms available.
                        </div>
                    )
                )}
            </section>
        </div>
    );
};

export default RoomCard;
