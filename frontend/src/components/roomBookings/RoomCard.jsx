import React, { useState, useContext } from 'react';
import {
    FaWifi, FaCoffee, FaParking, FaSwimmingPool,
    FaMapMarkerAlt, FaDog, FaUsers, FaChevronLeft,
    FaChevronRight, FaRegHeart, FaHeart,
    FaStar,
    FaRegStar
} from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext'; // Import the CartContext

const RoomCard = ({ room, onAddToCart }) => {
    const { addToCart } = useContext(CartContext); // Use the CartContext
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const amenityIcons = {
        Wifi: <FaWifi />,
        Pool: <FaSwimmingPool />,
        Parking: <FaParking />,
        Coffee: <FaCoffee />,
        Pets: <FaDog />,
    };

    // Default image if none provided
    const defaultImage = '/images/roomImage.jpeg';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden my-4 mx-auto max-w-5xl 
                hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative md:w-2/5 h-56 md:h-auto">
                    <img
                        src={
                            room.images && room.images[currentImageIndex]
                                ? `https://hotel-website-backend-drab.vercel.app/${room.images[currentImageIndex].replace(/\\/g, '/')}`
                                : '/default-image.jpg' // Fallback image if images array is undefined or empty
                        }
                        alt={`Room ${room.roomId}`}
                        className="w-full h-full object-cover"
                    />

                    {/* Image Navigation */}
                    {room.images?.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentImageIndex(prev =>
                                    prev === 0 ? room.images.length - 1 : prev - 1
                                )}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 
                 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={() => setCurrentImageIndex(prev =>
                                    prev === room.images.length - 1 ? 0 : prev + 1
                                )}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 
                 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}

                    {/* Favorite Button */}
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="absolute top-4 right-4 p-2 text-yellow rounded-full"
                    >
                        {isFavorite ? (
                            <FaStar className="text-yellow-300 text-xl" />
                        ) : (
                            <FaRegStar className="text-yellow-300 text-xl" />

                        )}
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-4 w-full md:w-4/5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{room.roomType}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <FaMapMarkerAlt className="text-scolor" />
                                <span className="text-sm text-gray-600">Room {room.roomId}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-scolor">
                                ${room.pricePerNight}
                                <span className="text-sm text-gray-500">/night</span>
                            </p>
                        </div>
                    </div>

                    {/* Room Features */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-gray-500" />
                            <span className="text-sm">Max: {room.capacity} guests</span>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                            {room.amenities && Array.isArray(JSON.parse(room.amenities)) && JSON.parse(room.amenities).length > 0 ? (
                                JSON.parse(room.amenities).map((amenity, index) => (
                                    <div key={index} className="flex items-center p-4 bg-acolor rounded-lg shadow-sm">
                                        {amenityIcons[amenity] && <span className="mr-2">{amenityIcons[amenity]}</span>}
                                        <span className="text-gray-700">{amenity}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-gray-400">No amenities specified</div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-2">
                        {room.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => onAddToCart(room)} // Add to cart on click
                            disabled={!room.availability}
                            className={`flex-1 py-2 px-4 rounded-lg text-white font-semibold 
                     ${room.availability
                                    ? 'bg-scolor hover:bg-pcolor'
                                    : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {room.availability ? 'Add Room' : 'Not Available'}
                        </button>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="px-3 py-1 border-2 border-scolor text-pcolor
                     rounded-lg hover:bg-blue-50"
                        >
                            Details
                        </button>
                    </div>

                    {/* Cancellation Policy */}
                    <p className="text-xs text-gray-500 mt-2">
                        {room.cancellationPolicy}
                    </p>
                </div>
            </div>

            {/* Expanded Details Section */}
            {showDetails && (
                <div className="border-t border-gray-200 p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Room Features</h3>
                            <ul className="space-y-1">
                                {room.amenities && Array.isArray(JSON.parse(room.amenities)) && JSON.parse(room.amenities).length > 0 ? (
                                    JSON.parse(room.amenities).map((amenity, index) => (
                                        <div key={index} className="flex items-center p-4 bg-acolor rounded-lg shadow-sm">
                                            {amenityIcons[amenity] && <span className="mr-2">{amenityIcons[amenity]}</span>}
                                            <span className="text-gray-700">{amenity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-gray-400">No amenities specified</div>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Additional Information</h3>
                            <p className="text-gray-600 text-sm">{room.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomCard;