import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaWifi, FaSwimmingPool, FaParking, FaCoffee, FaDog, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdSmokeFree, MdOutlinePets } from 'react-icons/md';
import StepCarousel from '../components/PackageCarousel';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';

const RoomDetails = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const navigate = useNavigate();

    // Fetch list of rooms
    useEffect(() => {
        axios
            .get('http://localhost:5555/rooms')
            .then((response) => setRooms(response.data.data))
            .catch((error) => setError("Failed to load rooms"));
    }, []);

    // Fetch details of the selected room
    useEffect(() => {
        const fetchRoomData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5555/rooms/${roomId}`);
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
        <div className="bg-gray-100">
            {/* Hero Section */}
            <section className="relative">
                <img src="/images/bgRooms.jpg" alt="Hotel Exterior" className="w-full h-screen object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Your Lavish Home Away From Home</h2>
                        <p className="text-lg">Experience the best of comfort and luxury in the heart of the city.</p>
                    </div>
                </div>
            </section>

            <section className="text-left py-14 px-28 mx-5">
                <p className="font-sans italic text-lg text-scolor mb-4">Luxury at your fingertips</p>
                <h1 className="font-serif text-4xl text-gray-800 mb-6">ROOMS AND RATES</h1>
                <p className="text-gray-500">Each room at Hotel Suneragira offers sleek design and rich, natural tones for a relaxing experience.</p>
            </section>

            {/* Room Details */}
            <div className="max-w-7xl mx-auto p-6 bg-gray-50">
                <h1 className="font-serif text-4xl text-gray-800 mb-6">{room.roomType}</h1>

                {/* Image Carousel */}
                {room.images && room.images.length > 0 && (
                    <div className="relative mb-8 group">
                        <img
                            src={
                                room.images[currentImageIndex]
                                    ? `http://localhost:5555/${room.images[currentImageIndex].replace(/\\/g, '/')}`
                                    : '/default-image.jpg' // Fallback image if the current image path is invalid
                            }
                            alt={`Room view ${currentImageIndex + 1}`}
                            className="w-full h-[70vh] object-cover rounded-lg shadow-lg"
                        />
                        <button
                            onClick={() => handleImageNavigation('prev')}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => handleImageNavigation('next')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                            <FaChevronRight size={24} />
                        </button>
                        <button
                            onClick={() => setShowAllPhotos(true)}
                            className="absolute bottom-4 right-4 bg-scolor text-white px-4 py-2 rounded-full shadow-md"
                        >
                            View all photos
                        </button>
                    </div>
                )}


                {showAllPhotos && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                            <div className="grid grid-cols-2 gap-4">
                                {room.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={
                                            img
                                                ? `http://localhost:5555/${img.replace(/\\/g, '/')}`
                                                : '/default-image.jpg' // Fallback image if the image path is not available
                                        }
                                        alt={`Room view ${index + 1}`}
                                        className="w-full h-64 object-cover"
                                    />
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


                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Room Overview and Amenities */}
                    <div className="flex-grow">
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            <h2 className="text-2xl font-serif text-pcolor mb-3">Overview</h2>
                            <p className="text-gray-600 mb-5">{room.description}</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li><strong>Occupancy:</strong> {room.capacity} persons</li>
                                <li><strong>Price Per Night($):</strong> {room.pricePerNight}</li>
                                <li><strong>Cancellation Policy:</strong> {room.cancellationPolicy} persons</li>
                            </ul>

                            <h2 className="text-2xl font-serif text-pcolor mt-6 mb-3">Amenities</h2>
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

                            <div className="flex flex-col justify-between h-full">

                                <div className="text-right my-4">
                                    <button
                                        className="bg-scolor text-white py-2 px-4 hover:bg-pcolor transition duration-300"
                                    >
                                        BOOK NOW
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>


                </div>
            </div>

            {/* Room Packages and Carousel */}
            <h2 className="text-center text-4xl font-serif text-gray-800 mb-10">ROOMS & RATES</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-20">
                {rooms.map((room) => (
                    <div key={room._id} className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                        <img
                            className="w-full h-48 object-cover"
                            src={
                                room.images && room.images[0]
                                    ? `http://localhost:5555/${room.images[0].replace(/\\/g, '/')}`
                                    : '/default-image.jpg' // Fallback image if images array is undefined or empty
                            }
                            alt={room.roomType || 'Room'}
                        />
                        <div className="p-6">
                            <h2 className="text-2xl font-serif text-pcolor mb-2">{room.roomType}</h2>
                            <p className="text-gray-600 mb-6">{room.description}</p>
                            <button
                                className="font-sans w-full bg-transparent border border-gray-500 text-scolor py-2 px-4 rounded hover:bg-scolor hover:text-white"
                                onClick={() => handleFindOutMore(room._id)}
                            >
                                Find out more
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Additional Package Carousel */}
            <StepCarousel />
        </div>
    );
};

export default RoomDetails;
