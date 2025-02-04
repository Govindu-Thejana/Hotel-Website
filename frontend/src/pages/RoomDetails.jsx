import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    FaWifi, FaSwimmingPool, FaParking, FaCoffee, FaDog,
    FaStar, FaUser, FaBath, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import Loader from '../components/Loader';
import RoomCardHome from '../components/roomCardHome';

const RoomDetails = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarRoomsLoading, setSimilarRoomsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const navigate = useNavigate();
    const modalRef = useRef(null); // Create a ref for the modal
    // Handle clicks outside the modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowAllPhotos(false); // Close the modal
            }
        };

        // Add event listener when the modal is open
        if (showAllPhotos) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAllPhotos]);
    useEffect(() => {
        axios
            .get('https://hotel-website-backend-drab.vercel.app/rooms')
            .then((response) => {
                setRooms(response.data.data);
                setSimilarRoomsLoading(false);
            })
            .catch((error) => {
                setError("Failed to load rooms");
                setSimilarRoomsLoading(false);
            });
    }, []);

    useEffect(() => {
        const fetchRoomData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://hotel-website-backend-drab.vercel.app/rooms/${roomId}`);
                setRoom(response.data);
            } catch {
                setError('Failed to fetch room data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchRoomData();
    }, [roomId]);

    const handleFindOutMore = (id) => navigate(`/roomDetails/${id}`);
    const handleBookNow = () => navigate('/reservation');

    const amenityIcons = {
        Wifi: <FaWifi />,
        Pool: <FaSwimmingPool />,
        Parking: <FaParking />,
        Coffee: <FaCoffee />,
        Pets: <FaDog />,
    };

    const handleImageNavigation = (direction) => {
        if (room && room.images.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                direction === 'next'
                    ? (prevIndex + 1) % room.images.length
                    : (prevIndex - 1 + room.images.length) % room.images.length
            );
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="alert alert-error">{error}</div>;
    if (!room) return <div className="text-center py-10">Room not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                {room.images && room.images.length > 0 && room.images[currentImageIndex] ? (
                    <img
                        src={`https://hotel-website-backend-drab.vercel.app/${room.images[currentImageIndex].replace(/\\/g, '/')}`}
                        alt={room.roomType}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}
                <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
                >
                    <FaChevronLeft size={24} />
                </button>
                <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
                >
                    <FaChevronRight size={24} />
                </button>
                <button
                    onClick={() => setShowAllPhotos(true)}
                    className="absolute bottom-4 right-4 bg-scolor text-white px-4 py-2 rounded-full shadow-md z-10"
                >
                    View all photos
                </button>
                <div className="absolute inset-0 bg-black bg-opacity-40 z-0">
                    <div className="container mx-auto px-4 h-full flex items-end pb-20">
                        <div className="text-white">
                            <h1 className="text-4xl md:text-6xl font-serif mb-4">{room.roomType}</h1>
                            <p className="text-xl opacity-90">${room.pricePerNight} per night</p>
                        </div>
                    </div>
                </div>
            </div>
            {showAllPhotos && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="grid grid-cols-2 gap-4">
                            {room.images.map((img, index) => (
                                img && (
                                    <img
                                        key={index}
                                        src={`https://hotel-website-backend-drab.vercel.app/${img.replace(/\\/g, '/')}`}
                                        alt={`Room view ${index + 1}`}
                                        className="w-full h-64 object-cover"
                                    />
                                )
                            ))}
                        </div>
                        <button
                            onClick={() => setShowAllPhotos(false)}
                            className="mt-4 bg-scolor text-white px-4 py-2 rounded-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Room Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Room Description */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-6 shadow-sm"
                        >
                            <h2 className="text-2xl font-serif mb-4">Room Overview</h2>
                            <p className="text-gray-600 leading-relaxed">{room.description}</p>

                            {/* Room Features */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-scolor" />
                                    <span>{room.capacity} Guests</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaBath className="text-scolor" />
                                    <span>Private Bathroom</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* Amenities */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-serif mb-6">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        </section>
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <h3 className="text-3xl font-serif text-pcolor mb-2">
                                    ${room.pricePerNight}
                                    <span className="text-sm text-gray-500">/night</span>
                                </h3>

                                <div className="flex items-center gap-1 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar key={star} className="text-yellow-400" />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-2">
                                        (4.8 average)
                                    </span>
                                </div>

                                <button
                                    onClick={handleBookNow}
                                    className="w-full bg-scolor text-white py-4 rounded-lg
                                             hover:bg-pcolor transition duration-300
                                             text-lg font-semibold"
                                >
                                    Book Now
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Similar Rooms */}
                <section className="mt-16">
                    <h2 className="text-3xl font-serif text-center mb-10">Similar Rooms</h2>
                    <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 px-20">
                        {error ? (
                            <div className="col-span-full text-center text-red-500">
                                {error}
                            </div>
                        ) : (
                            rooms.length > 0 ? (
                                // Filter rooms to only include one room per room type
                                rooms.filter((room, index, self) =>
                                    index === self.findIndex(r => r.roomType === room.roomType)
                                ).map((room) => (
                                    <RoomCardHome
                                        key={room._id} // Unique key for each room
                                        room={room} // Pass the room object
                                        handleFindOutMore={handleFindOutMore} // Pass the handleFindOutMore function
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500">
                                    No rooms available.
                                </div>
                            )
                        )}
                    </section>
                </section>
            </div>
        </div>
    );
};

export default RoomDetails;
