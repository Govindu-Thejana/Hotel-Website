import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Testimonials from "../components/Testimonials";
import AvailabilityCheck from "../components/BookingAvailability";
import RoomCardHome from "../components/roomCardHome";
import SearchBar from "../components/roomBookingSearchBar";

const Accommodation = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://hotel-website-backend-drab.vercel.app/rooms")
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
        {/* Background image */}
        <img
          src="/images/Building.jpg"
          alt="Hotel Exterior"
          className="w-full h-screen object-cover"
        />

        {/* Overlay with logo */}
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center">
            <img
              alt="Suneragira Hotel"
              src="/images/logo.png"
              className="h-24 md:h-40 lg:h-48 w-auto px-5" // Responsive logo size
            />
          </div>
        </div>

        {/* Search Bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-80 px-10">
          <SearchBar />
        </div>
      </section>

      {/* Centered introduction section */}
      <section className="text-center py-14 px-4 sm:px-6 md:px-16 lg:px-28 max-w-5xl mx-auto">
        <p className="font-sans italic text-lg md:text-xl text-scolor mb-4">
          Luxury at your fingertips
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl tracking-wide text-gray-800 mb-6">
          ACCOMMODATION
        </h1>
        <div className="w-24 h-1 bg-scolor mx-auto mb-8"></div>
        <p className="text-gray-500 text-base md:text-lg leading-relaxed mx-auto max-w-4xl">
          At Hotel Suneragira, we strive to provide a luxurious and comfortable
          experience for every guest. Our carefully designed accommodations
          blend elegance and modern comfort, ensuring that you feel at home
          during your stay. Each room is equipped with high-quality amenities
          and thoughtful details, allowing you to relax and unwind in style.
          Whether you're visiting for leisure or business, our dedicated staff
          is committed to making your stay exceptional. Discover a serene
          retreat in the heart of the city, where every moment is tailored to
          enhance your experience.
        </p>
      </section>

      {/* SERVICES SECTION - Updated to match theme */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl font-serif text-gray-800 mb-4">
            OUR SERVICES
          </h2>
          <div className="w-24 h-1 bg-scolor mx-auto mb-10"></div>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Experience the pinnacle of hospitality with our carefully curated
            services designed to elevate your stay at Hotel Suneragira.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Food and Beverage Card */}
            <div className="relative rounded-xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-110"
                style={{
                  backgroundImage: "url('/images/food&bavarages.jpeg')",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
              <div className="relative z-10 p-6 sm:p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-center mb-6">
                    <div className="bg-scolor/90 p-4 rounded-full shadow-lg">
                      <i className="fas fa-utensils text-2xl text-white"></i>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl text-white font-serif mb-3">
                    Food and Beverage
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base">
                    Savor exquisite dining options prepared by our master chefs
                    using the finest local ingredients for a memorable culinary
                    experience.
                  </p>
                </div>
                <div className="mt-6">
                  
                </div>
              </div>
            </div>

            {/* Room Service Card */}
            <div className="relative rounded-xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-110"
                style={{ backgroundImage: "url('/images/roomservice.jpeg')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
              <div className="relative z-10 p-6 sm:p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-center mb-6">
                    <div className="bg-scolor/90 p-4 rounded-full shadow-lg">
                      <i className="fas fa-concierge-bell text-2xl text-white"></i>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl text-white font-serif mb-3">
                    Premium Room Service
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base">
                    Experience exceptional in-room dining and personalized
                    services delivered directly to your accommodation at your
                    convenience.
                  </p>
                </div>
                <div className="mt-6">
                  
                </div>
              </div>
            </div>

            {/* Entertainment Card */}
            <div className="relative rounded-xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-110"
                style={{ backgroundImage: "url('/images/bonfire.jpeg')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
              <div className="relative z-10 p-6 sm:p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-center mb-6">
                    <div className="bg-scolor/90 p-4 rounded-full shadow-lg">
                      <i className="fas fa-music text-2xl text-white"></i>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl text-white font-serif mb-3">
                    Entertainment
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base">
                    Experience magical evenings with live performances, cultural
                    shows, and specially curated entertainment options for all
                    ages.
                  </p>
                </div>
                <div className="mt-6">
                  
                </div>
              </div>
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
              <img
                src="/images/room.jpg"
                alt="Luxurious hotel room"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text section */}
            <div className="md:w-1/3 p-6 flex flex-col justify-center">
              <h2 className="text-3xl font-serif mb-4 text-gray-800">
                A Slice of Heaven!
              </h2>
              <p className="text-gray-600 mb-6">
                At The Hotel Nirvana in our region, Hotel Somewhere offers a
                variety of accommodation options to cater to both leisure
                travelers and business professionals alike. Whether you seek the
                comforts of a well-appointed deluxe room or the grandeur of an
                executive suite, our hotel provides a range of luxurious living
                spaces to ensure a memorable stay.
              </p>
              <p className="text-gray-600 mb-6">
                While we may not offer sea views, you can still enjoy the
                tranquility of our elegantly designed rooms and suites, perfect
                for unwinding after a day of business meetings or exploring the
                local attractions.
              </p>
              <button className="bg-scolor text-white py-2 px-4  hover:bg-pcolor transition duration-300">
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS packages cards */}
      <h2 className="text-center text-4xl font-serif text-gray-800 mb-10">
        ROOMS & RATES
      </h2>
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 px-20">
        {error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : (
          rooms.map((room) => (
            <div
              key={room._id}
              className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                className="w-full h-48 object-cover"
                src={
                  room.images && room.images[0]
                    ? room.images[0] // Use the Cloudinary URL directly
                    : "/default-image.jpg" // Fallback image if images array is undefined or empty
                }
                alt={room.roomType || "Room"}
              />
              <div className="p-6">
                <h2 className="text-2xl font-serif text-pcolor mb-2">
                  {room.roomType}
                </h2>
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
