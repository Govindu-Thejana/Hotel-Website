import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaWifi, FaSwimmingPool, FaParking, FaCoffee, FaDog,
    FaCalendar, FaStar, FaUser, FaBed, FaBath
} from 'react-icons/fa';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'react-calendar/dist/Calendar.css';
import Loader from '../components/Loader';

const RoomDetails = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const navigate = useNavigate();

    const formatImages = (images) => {
        return images?.map(img => ({
            original: img,
            thumbnail: img,
        })) || [];
    };

    useEffect(() => {
        axios
            .get('http://localhost:5555/rooms')
            .then((response) => setRooms(response.data.data))
            .catch((error) => setError("Failed to load rooms"));
    }, []);

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
    const handleBookNow = () => navigate('/reservation');

    const amenityIcons = {
        Wifi: <FaWifi />,
        Pool: <FaSwimmingPool />,
        Parking: <FaParking />,
        Coffee: <FaCoffee />,
        Pets: <FaDog />,
    };

    if (loading) return <Loader />;
    if (error) return <div className="alert alert-error">{error}</div>;
    if (!room) return <div className="text-center py-10">Room not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <img
                    src={room.images[0]}
                    alt={room.roomType}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40">
                    <div className="container mx-auto px-4 h-full flex items-end pb-20">
                        <div className="text-white">
                            <h1 className="text-4xl md:text-6xl font-serif mb-4">{room.roomType}</h1>
                            <p className="text-xl opacity-90">${room.pricePerNight} per night</p>
                        </div>
                    </div>
                </div>
            </div>

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
                                    <FaBed className="text-scolor" />
                                    <span>{room.bedType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaBath className="text-scolor" />
                                    <span>Private Bathroom</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* Image Gallery */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">
                            <ImageGallery
                                items={formatImages(room.images)}
                                showPlayButton={false}
                                showFullscreenButton={true}
                                showThumbnails={true}
                                thumbnailPosition="bottom"
                            />
                        </section>

                        {/* Amenities */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-serif mb-6">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {Object.entries(amenityIcons).map(([name, icon]) => (
                                    <div key={name} className="flex items-center gap-3">
                                        <div className="text-scolor">{icon}</div>
                                        <span>{name}</span>
                                    </div>
                                ))}
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
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="w-full flex items-center justify-center gap-2 
                                             border border-gray-300 rounded-lg p-3 mb-4
                                             hover:border-scolor transition duration-300"
                                >
                                    <FaCalendar />
                                    Check Availability
                                </button>

                                <AnimatePresence>
                                    {showCalendar && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <Calendar
                                                onChange={setSelectedDate}
                                                value={selectedDate}
                                                className="mb-4"
                                                minDate={new Date()}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.slice(0, 3).map((similarRoom) => (
                            <motion.div
                                key={similarRoom._id}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden"
                            >
                                <img
                                    src={similarRoom.images[0]}
                                    alt={similarRoom.roomType}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-serif mb-2">{similarRoom.roomType}</h3>
                                    <p className="text-gray-600 mb-4">{similarRoom.description}</p>
                                    <button
                                        onClick={() => handleFindOutMore(similarRoom._id)}
                                        className="w-full bg-transparent border border-scolor text-scolor
                                                 py-2 rounded hover:bg-scolor hover:text-white
                                                 transition duration-300"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RoomDetails;