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
            .then((response) => {
                setRooms(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                setError("Failed to load rooms");
            });
    }, []);


    // Fetch details of the selected room
    useEffect(() => {
        const fetchRoomData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5555/rooms/${roomId}`);
                setRoom(response.data);
            } catch (err) {
                setError('Failed to fetch room data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
    }, [roomId]);
    const handleFindOutMore = (roomId) => {
        navigate(`/roomDetails/${roomId}`); // Navigate to the room details page
    };

    const amenityIcons = {
        Wifi: <FaWifi />,
        Pool: <FaSwimmingPool />,
        Parking: <FaParking />,
        Coffee: <FaCoffee />,
        Pets: <FaDog />,
    };

    const handleImageNavigation = (direction) => {
        if (room && room.images.length > 0) {
            setCurrentImageIndex((prevIndex) => {
                const newIndex = direction === 'next'
                    ? (prevIndex + 1) % room.images.length
                    : (prevIndex - 1 + room.images.length) % room.images.length;
                return newIndex;
            });
        }
    };

    // Show loader while fetching data
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return (
            <div className="border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }
    if (!room) return <div className="text-center py-10">Room not found</div>;

    return (
        <div className="bg-gray-100">

            {/* hero section */}
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
                <p className="font-sans italic text-lg text-scolor mb-4">
                    Luxury at your fingertips
                </p>
                <h1 className="font-serif text-4xl md:text-4xl tracking-wide text-gray-800 mb-6">
                    ROOMS AND RATES
                </h1>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                    Each room at Hotel Suneragira is bright and airy, offering all the essentials for a comfortable stay.
                    Our focus extends beyond comfort to include sleek, contemporary design, complemented by rich, natural tones visible from your window or terrace</p>
            </section>

            <div className="max-w-7xl mx-auto p-6 bg-gray-50">
                <h1 className="font-serif text-4xl md:text-4xl tracking-wide text-gray-800 mb-6">
                    {room.roomType}</h1>

                {/* Image carousel */}
                {room.images && room.images.length > 0 ? (
                    <div className="relative mb-8 group">
                        <img
                            src={room.images[currentImageIndex]}
                            alt={`Room view ${currentImageIndex + 1}`}
                            className="w-full h-[70vh] object-cover rounded-lg shadow-lg"
                        />
                        <button
                            onClick={() => handleImageNavigation('prev')}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => handleImageNavigation('next')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaChevronRight size={24} />
                        </button>
                        <button
                            onClick={() => setShowAllPhotos(true)}
                            className="absolute bottom-4 right-4 bg-scolor text-white px-4 py-2 rounded-full shadow-md hover:bg-pcolor transition"
                        >
                            View all photos
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-600">No images available</div>
                )}

                {/* All Photos Modal */}
                {showAllPhotos && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                            <div className="grid grid-cols-2 gap-4">
                                {room.images.map((img, index) => (
                                    <img key={index} src={img} alt={`Room view ${index + 1}`} className="w-full h-64 object-cover " />
                                ))}
                            </div>
                            <button
                                onClick={() => setShowAllPhotos(false)}
                                className="mt-4 bg-scolor text-white px-4 py-2 rounded-full hover:bg-pcolor transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Room details */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center bg-acolor px-3 py-1 rounded-full">
                                <FaStar className="text-yellow-500" size={20} />
                                <span className="ml-1 font-semibold">4.9</span>
                                <span className="ml-1 text-sm text-gray-600">(12 reviews)</span>
                            </div>
                        </div>

                        <div className="p-6 bg-white shadow-md rounded-lg">
                            {/* Room Overview */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-serif text-pcolor mb-3">Overview</h2>
                                <p className="text-gray-600 mb-5">{room.description}</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li><strong>Occupancy:</strong> {room.capacity} persons</li>
                                    <li><strong>Size:</strong> {room.size} sqm</li>
                                    <li><strong>Bed Type:</strong> {room.bedType}</li>
                                    <li><strong>Availability:</strong> {room.availability}</li>
                                    <li><strong>Price Per Night($):</strong> {room.pricePerNight}</li>

                                </ul>
                            </div>

                            {/* Room Amenities */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-serif text-pcolor mb-3">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {room.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center p-4 bg-acolor rounded-lg shadow-sm">
                                            {amenityIcons[amenity] && (
                                                <span className="mr-2">{amenityIcons[amenity]}</span>
                                            )}
                                            <span className="text-gray-700">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Room Policies */}
                            <div>
                                <h2 className="text-2xl font-serif text-pcolor mb-3">Policies</h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li><strong>Check-in:</strong> {room.checkInTime}, <strong>Check-out:</strong> {room.checkOutTime}</li>
                                    <li><MdSmokeFree className="inline mr-2" /> 100% smoke-free property</li>
                                    <li><MdOutlinePets className="inline mr-2" /> Pets allowed (dogs only, max 1 per room, additional fees apply)</li>
                                    <li><strong>Cancellation Policy:</strong> {room.cancellationPolicy}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <section className='Booking Form'>
                        {rooms && rooms.length > 0 ? (
                            <BookingForm room={rooms[0]} />
                        ) : (
                            <p>Loading booking information...</p>
                        )}
                    </section>
                </div>


            </div>

            {/* ROOMS packages cards */}
            <h2 className="text-center text-4xl font-serif text-gray-800 mb-10">ROOMS & RATES</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-20">
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
                                alt={room.roomType}
                            />
                            <div className="p-6">
                                <h2 className="text-2xl font-serif text-pcolor mb-2">{room.roomType}</h2>
                                <p className="text-gray-600 mb-6">{room.description}</p>
                                <div className="flex justify-between text-gray-800 mb-4">
                                    {/* ... [occupancy and size info code] ... */}
                                </div>
                                <button
                                    className="font-sans w-full bg-transparent border border-gray-500 text-scolor py-2 px-4 rounded hover:bg-scolor hover:text-white hover:border-white"
                                    onClick={() => handleFindOutMore(room._id)} // Call function on button click
                                >
                                    Find Out More
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            <section className='py-20'>

                <h2 className="text-left px-24 text-3xl font-serif text-gray-800 mb-10">CUSTOMIZE YOUR OWN PACKAGE HERE</h2>
                <StepCarousel />

            </section>


        </div>

    );
};

export default RoomDetails;