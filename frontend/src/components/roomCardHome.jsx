import React, { useState } from 'react';
import {
    FaUsers, FaMapMarkerAlt, FaWifi, FaCoffee,
    FaParking, FaSwimmingPool, FaDog, FaStar
} from 'react-icons/fa';

const RoomCard = ({ room, handleFindOutMore, onFavorite, isFavorite }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const amenityIcons = {
        Wifi: <FaWifi />,
        Pool: <FaSwimmingPool />,
        Parking: <FaParking />,
        Coffee: <FaCoffee />,
        Pets: <FaDog />
    };

    const getRoomImage = (roomType) => {
        return `/images/${roomType}.jpeg`;
    };

    const renderAmenities = (amenities) => {
        try {
            return JSON.parse(amenities).slice(0, 3).map((amenity, index) => (
                <div
                    key={index}
                    className="flex items-center p-2 bg-acolor rounded-lg transform transition-transform hover:scale-105"
                    title={amenity}
                >
                    {amenityIcons[amenity] && (
                        <span className="mr-2 text-lg sm:text-xl text-gray-700">
                            {amenityIcons[amenity]}
                        </span>
                    )}
                    <span className="hidden sm:inline text-sm">{amenity}</span>
                </div>
            ));
        } catch {
            return <div className="text-gray-400 text-sm italic">No amenities available</div>;
        }
    };

    return (
        <div
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden rounded-t-xl">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <img
                    src={getRoomImage(room.roomType)}
                    alt={`${room.roomType} - Room ${room.roomId}`}
                    className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Price Tag */}
                <div className="absolute top-3 right-3 bg-white/95 px-3 py-2 rounded-full shadow-md transform transition-transform duration-300 hover:scale-105">
                    <p className="text-sm sm:text-base font-bold text-scolor">
                        ${room.pricePerNight}
                        <span className="text-xs sm:text-sm text-gray-500 ml-1">/night</span>
                    </p>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavorite?.(room._id);
                    }}
                    className="absolute top-3 left-3 p-2 rounded-full shadow-md transition-all duration-300 hover:bg-white hover:scale-110"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <FaStar className={`text-lg text-yellow-300`} /><FaStar className={`text-lg text-yellow-300`} />

                    
                </button>
            </div>

            <div className="p-4 sm:p-5 md:p-6">
                <div className="space-y-4">
                    {/* Room Type */}
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 line-clamp-2">
                        {room.roomType}
                    </h2>

                    {/* Room Details */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-scolor" />
                            <span className="text-sm">Room {room.roomId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-gray-500" />
                            <span className="text-sm">{room.capacity} Guests</span>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-700">
                            Popular Amenities
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {room.amenities && renderAmenities(room.amenities)}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => handleFindOutMore(room._id)}
                        className="w-full py-3 px-4 bg-scolor text-white rounded-lg 
                            transform transition-all duration-300
                            hover:bg-pcolor hover:shadow-lg 
                            focus:outline-none focus:ring-2 focus:ring-scolor focus:ring-opacity-50
                            active:scale-95"
                    >
                        <span className="text-sm sm:text-base font-semibold">View Details</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;