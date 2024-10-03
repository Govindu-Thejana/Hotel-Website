import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import Testimonials from "../components/Testimonials";
import AvailabilityCheck from "../components/BookingAvailability";

const Accommodation = () => {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    const handleFindOutMore = (roomId) => {
        navigate(`/roomDetails/${roomId}`); // Navigate to the room details page
    };

    return (
        <div className="bg-gray-100">
            {/* hero section */}
            <section className="relative">
                <img src="/images/bgRooms.jpg" alt="Hotel Exterior" className="w-full h-screen object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className=" justify-center">
                        <img
                            alt="Suneragira Hotel"
                            src="/images/logo.png"
                            className="h-40 px-5 w-auto"
                        />
                    </div>
                </div>
            </section>

            <div className="p">
                <AvailabilityCheck />

            </div>


            <section className="text-left py-14 px-28 mx-5">
                <p className="font-sans italic text-lg text-scolor mb-4">
                    Luxury at your fingertips
                </p>
                <h1 className="font-serif text-4xl md:text-4xl tracking-wide text-gray-800 mb-6">
                    ACCOMMODATION
                </h1>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                    At Hotel Suneragira, we strive to provide a luxurious and comfortable experience for every guest. Our carefully designed accommodations blend elegance and modern comfort, ensuring that you feel at home during your stay. Each room is equipped with high-quality amenities and thoughtful details, allowing you to relax and unwind in style. Whether you’re visiting for leisure or business, our dedicated staff is committed to making your stay exceptional. Discover a serene retreat in the heart of the city, where every moment is tailored to enhance your experience.     </p>
            </section>

            {/* SERVICES SECTION */}
            <section className="bg-gray-100 py-16 px-6">
                <h2 className="text-center text-3xl font-serif text-gray-800 mb-10">OUR SERVICES</h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="relative p-6 rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute inset-0 bg-cover bg-center filter transition duration-300" style={{ backgroundImage: "url('/images/food&bavarages.jpeg')" }}></div>
                        <div className="relative z-10 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center transition-shadow duration-300 group-hover:shadow-xl">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gray-300 p-4 rounded-md">
                                    <i className="fas fa-utensils text-3xl text-gray-700"></i>
                                </div>
                            </div>
                            <h3 className="text-xl text-scolor font-semibold mb-2">Food and Beverage</h3>
                            <p className="text-gray-300">Gravida ullamcorper lectus vitae tristique cursus tempor rutrum.</p>
                        </div>
                    </div>
                    <div className="relative p-6 rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute inset-0 bg-cover bg-center filter blur- transition duration-300" style={{ backgroundImage: "url('/images/roomservice.jpeg')" }}></div>
                        <div className="relative z-10 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center transition-shadow duration-300 group-hover:shadow-xl">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gray-300 p-4 rounded-md">
                                    <i className="fas fa-bed text-3xl text-gray-700"></i>
                                </div>
                            </div>
                            <h3 className="text-xl text-scolor font-semibold mb-2">Room Service</h3>
                            <p className="text-gray-300">Consectetur arcu egestas tortor metus eleifend estacinia quis.</p>
                        </div>
                    </div>
                    <div className="relative p-6 rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute inset-0 bg-cover bg-center filter  transition duration-300" style={{ backgroundImage: "url('/images/bonfire.jpeg')" }}></div>
                        <div className="relative z-10 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center transition-shadow duration-300 group-hover:shadow-xl">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gray-300 p-4 rounded-md">
                                    <i className="fas fa-music text-3xl text-gray-700"></i>
                                </div>
                            </div>
                            <h3 className="text-xl text-scolor font-semibold mb-2">Entertainment</h3>
                            <p className="text-gray-300">Sed pretium quisque tempor ultrices enim nam quisque mattis.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* masive room card */}
            <section>
                <div className="container py-20 scroll-px-px mx-auto p-4">
                    <div className="flex flex-col md:flex-row backdrop-blur-sm shadow-lg overflow-hidden">
                        {/* Image section */}
                        <div className="md:w-2/3 ">
                            <img src="/images/room.jpg" alt="Luxurious hotel room" className="w-full h-full object-cover" />
                        </div>

                        {/* Text section */}
                        <div className="md:w-1/3 p-6 flex flex-col justify-center">
                            <h2 className="text-3xl font-serif mb-4 text-gray-800">A Slice of Heaven!</h2>
                            <p className="text-gray-600 mb-6">
                                At The Hotel Nirvana in our region, Hotel Somewhere offers a variety of accommodation
                                options to cater to both leisure travelers and business professionals alike.
                                Whether you seek the comforts of a well-appointed deluxe room or the grandeur
                                of an executive suite, our hotel provides a range of luxurious living spaces to ensure
                                a memorable stay.
                            </p>
                            <p className="text-gray-600 mb-6">
                                While we may not offer sea views, you can still enjoy the tranquility of our elegantly
                                designed rooms and suites, perfect for unwinding after a day of business meetings
                                or exploring the local attractions.
                            </p>
                            <button className="bg-scolor text-white py-2 px-4  hover:bg-pcolor transition duration-300">
                                BOOK NOW
                            </button>
                        </div>
                    </div>
                </div>

            </section>

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
            <Testimonials />
        </div>
    );
};

export default Accommodation;