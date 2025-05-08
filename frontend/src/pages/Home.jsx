import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WeddingPackages from "../components/WeddingPackages";
import RoomCardHome from "../components/roomCardHome";
import SearchBar from "../components/roomBookingSearchBar";
import { ChevronRight, Clock, MapPin, Star } from "lucide-react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

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
  const handleWeddingBooking = () => navigate("/weddings");

  const nextSlide = () => {
    setCurrentSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="bg-gray-100">
      {/* hero section - improved mobile responsiveness */}
      <section className="relative">
        {/* Background image */}
        <img
          src="/images/bg.jpg"
          alt="Hotel Exterior"
          className="w-full h-[90vh] sm:h-screen object-cover"
        />

        {/* Overlay with logo - improved text visibility on mobile */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center px-4">
            <img
              alt="Suneragira Hotel"
              src="/images/logo.png"
              className="h-20 sm:h-24 md:h-40 lg:h-48 w-auto" // Adjusted for smaller screens
            />
            <h1 className="text-white font-serif italic text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold mt-4 sm:mt-6 text-center tracking-wide drop-shadow-lg">
              Welcome to Hotel Suneragira
            </h1>
          </div>
        </div>

        {/* Search Bar at the bottom - adjusted padding for mobile */}
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-80 px-2 sm:px-4 md:px-10">
          <SearchBar />
        </div>
      </section>

      {/* Intro section - improved padding for mobile */}
      <section className="text-center py-10 sm:py-14 px-4 md:px-28 mx-0 sm:mx-5">
        <h1 className="font-serif italic text-2xl sm:text-3xl md:text-4xl tracking-wide text-gray-800 mb-4 sm:mb-6">
          Your lavish home away from home
        </h1>
        <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed">
          Nestled in the vibrant city of Nikaweratiya, Hotel Suneragira is your
          gateway to a world of comfort and elegance. While we may not offer a
          sea view, our exceptional service and luxurious amenities ensure that
          your stay with us will be nothing short of extraordinary. Located just
          moments away from the city&apos;s bustling attractions, Hotel
          Suneragira offers a peaceful oasis where you can relax and unwind
          whether you&apos;re traveling for business or leisure.
        </p>
      </section>

      {/* Bride card - improved mobile layout */}
      <section className="container mx-auto py-2 w-full px-3 sm:px-4">
        <div className="relative group">
          {/* Main Card Container */}
          <div className="flex flex-col md:flex-row bg-white backdrop-blur-sm shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
            {/* Image Section - adjusted height for mobile */}
            <div className="relative md:w-2/3 overflow-hidden">
              <img
                src="/images/bride (2).jpg"
                alt="Luxurious hotel room"
                className="w-full h-[250px] sm:h-[300px] md:h-[600px] object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 sm:bg-opacity-20 transition-opacity duration-500 group-hover:bg-opacity-10"></div>
            </div>

            {/* Content Section - improved text spacing for mobile */}
            <div className="md:w-1/3 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
              {/* Decorative Element */}
              <div className="w-16 sm:w-20 h-1"></div>

              <h2 className="text-3xl sm:text-4xl font-serif mb-4 sm:mb-6 text-gray-800 leading-tight">
                Movement of{" "}
                <span className="italic text-scolor">elegance!</span>
              </h2>

              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed font-light text-base sm:text-lg">
                At Hotel Suneragira, we offer a variety of accommodation options
                to cater to both leisure travelers and business professionals
                alike.
              </p>

              {/* CTA Button */}
              <button
                onClick={handleWeddingBooking}
                className="group relative overflow-hidden bg-scolor text-white py-2.5 sm:py-3 px-5 sm:px-6 rounded-md transition-all duration-300 transform hover:shadow-xl"
              >
                <span className="relative z-10 text-xs sm:text-sm tracking-wider font-medium">
                  BOOK NOW
                </span>
                <div className="absolute inset-0 bg-pcolor transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-blue-50 rounded-tl-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Package Section */}
      <WeddingPackages />

      {/* Room Card Section - Enhanced for mobile */}
      <div className="max-w-6xl mx-auto my-12 sm:my-16 px-3 sm:px-4">
        <div className="relative flex flex-col lg:flex-row bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl overflow-hidden transform transition-transform duration-500 hover:scale-105 border border-gray-100">
          {/* Left Section - Image Container - fixed mobile layout */}
          <div className="relative w-full lg:absolute lg:top-0 lg:left-0 lg:w-1/2 h-56 sm:h-72 md:h-80 lg:h-full">
            <div className="relative w-full h-full overflow-hidden">
              <img
                src="/images/hotel-room.jpg"
                alt="Executive Room"
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent hover:from-black/20 transition-all duration-500"></div>

              {/* Room Feature Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="bg-scolor text-white text-xs uppercase font-bold py-1 px-2 sm:px-3 rounded-full shadow-lg">
                  Featured Room
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Content with Enhanced Styling for mobile */}
          <div className="w-full lg:w-1/2 lg:ml-auto p-6 sm:p-8 lg:p-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="lg:ml-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 uppercase">
                  <span className="text-scolor">Executive</span> Room
                </h2>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-scolor fill-scolor"
                    />
                  ))}
                </div>
              </div>

              <div className="w-12 sm:w-16 h-1 bg-scolor mb-4 sm:mb-6"></div>

              {/* Occupancy & Size - made responsive for mobile */}
              <div className="flex items-center gap-3 sm:gap-8 mt-4 text-gray-700">
                <div className="flex items-center gap-2 sm:gap-3 bg-scolor/5 p-2 sm:p-3 rounded-lg shadow-sm">
                  <span className="text-base sm:text-lg bg-scolor/10 p-1.5 sm:p-2 rounded-full">
                    👤
                  </span>
                  <span className="text-xs sm:text-sm font-medium">
                    2 Adults
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-scolor/5 p-2 sm:p-3 rounded-lg shadow-sm">
                  <span className="text-base sm:text-lg bg-scolor/10 p-1.5 sm:p-2 rounded-full">
                    📏
                  </span>
                  <span className="text-xs sm:text-sm font-medium">
                    315 ft²
                  </span>
                </div>
              </div>

              {/* Room Description - adjusted for mobile */}
              <p className="text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base font-serif leading-relaxed border-l-2 border-scolor pl-4">
                Designed with the needs of business travelers in mind. Offering
                exclusive access to the Business Lounge, guests can enjoy
                24-hour coffee and tea service, complimentary breakfast, and
                evening cocktails in a private and comfortable setting.
              </p>

              {/* Amenities Grid - improved for small screens */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4 mt-6 sm:mt-8">
                {[
                  { icon: "☕", text: "Coffee & Tea" },
                  { icon: "🍳", text: "Complimentary Breakfast" },
                  { icon: "🍸", text: "Evening Cocktails" },
                  { icon: "💼", text: "Business Lounge Access" },
                ].map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 bg-scolor/5 p-2 sm:p-3 rounded-lg transition-transform hover:scale-105 duration-300"
                  >
                    <span className="text-base sm:text-lg bg-white p-1.5 sm:p-2 rounded-full shadow-sm text-scolor">
                      {amenity.icon}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {amenity.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button and Price - adjusted for mobile */}
              <div className="mt-6 sm:mt-8 flex items-center justify-between">
                <div className="text-gray-800">
                  <span className="text-xl sm:text-2xl font-bold text-scolor">
                    $149
                  </span>
                  <span className="text-xs sm:text-sm ml-1 text-gray-500">
                    per night
                  </span>
                </div>
                <a
                  href="/accommodation"
                  className="inline-block bg-scolor text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white hover:bg-pcolor hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Find Out More
                </a>
              </div>

              {/* Enhanced Room Navigation - adjusted for mobile */}
              <div className="mt-6 sm:mt-8 flex items-center justify-between border-t pt-3 sm:pt-4 border-scolor/10">
                <div className="text-gray-500 text-xs sm:text-sm italic">
                  <span className="font-bold text-scolor">01</span> /{" "}
                  <span>11</span> rooms
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button className="p-1.5 sm:p-2 rounded-full bg-scolor/10 hover:bg-scolor/20 transition-colors">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180 text-scolor" />
                  </button>
                  <button className="p-1.5 sm:p-2 rounded-full bg-scolor hover:bg-pcolor transition-colors">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Carousel Section - improved controls for mobile */}
      <section className="py-12 sm:py-20 bg-gray-100">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-3 sm:mb-4">
              MEMORABLE MOMENTS
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-scolor mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto px-2">
              Discover the experiences that await you at Hotel Suneragira
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Main Image Container */}
            <div className="rounded-xl overflow-hidden shadow-2xl">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 z-20">
                <div
                  className="h-1 bg-scolor transition-all duration-5000"
                  style={{
                    width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Image - adjusted height for mobile */}
              <div className="h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden">
                <img
                  src={`/images/${
                    currentSlide === 0
                      ? "weddinggroup.png"
                      : currentSlide === 1
                      ? "all.jpg"
                      : "bridal.png"
                  }`}
                  alt="Hotel Experience"
                  className="w-full h-full object-cover transform transition-transform duration-1000"
                />

                {/* Overlay with Content - improved text legibility on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-8 md:p-12">
                  <div className="max-w-2xl">
                    {/* Slide-specific content - adjusted text size for mobile */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-2 sm:mb-4 transform transition-all duration-500">
                      {currentSlide === 0
                        ? "Elegant Celebrations"
                        : currentSlide === 1
                        ? "Exquisite Dining Experience"
                        : "Memorable Weddings"}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 transform transition-all duration-500">
                      {currentSlide === 0
                        ? "Create unforgettable moments in our luxurious event spaces."
                        : currentSlide === 1
                        ? "Savor the finest cuisine prepared by our master chefs."
                        : "Your dream wedding brought to life with every detail perfected."}
                    </p>
                    <button className="bg-scolor hover:bg-pcolor text-white py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base">
                      Explore More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Carousel Navigation - improved touch targets for mobile */}
            <div className="absolute top-1/2 transform -translate-y-1/2 left-1 right-1 sm:left-4 sm:right-4 flex justify-between z-10">
              <button
                onClick={prevSlide}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-white/30 hover:scale-110"
                aria-label="Previous slide"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-white/30 hover:scale-110"
                aria-label="Next slide"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Slide Indicators - improved for touch on mobile */}
            <div className="mt-4 sm:mt-8 flex justify-center gap-2 sm:gap-3">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-scolor w-6 sm:w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className="sr-only">Slide {index + 1}</span>
                </button>
              ))}
            </div>

            {/* Slide Counter - adjusted for mobile */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/80 backdrop-blur-sm text-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Rooms & Rates Section - adjusted spacing for mobile */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-3 sm:mb-4">
              ROOMS & RATES
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-scolor mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto px-2">
              Experience luxury and comfort in our beautifully designed
              accommodations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-4 lg:px-10">
            {error ? (
              <div className="col-span-full text-center p-8 bg-red-50 rounded-lg border border-red-100">
                <p className="text-red-500 font-medium">{error}</p>
                <button className="mt-4 text-sm text-gray-600 hover:text-scolor underline">
                  Retry
                </button>
              </div>
            ) : rooms.length > 0 ? (
              // Filter rooms to only include one room per room type
              rooms
                .filter(
                  (room, index, self) =>
                    index ===
                    self.findIndex((r) => r.roomType === room.roomType)
                )
                .map((room) => (
                  <RoomCardHome
                    key={room._id}
                    room={room}
                    handleFindOutMore={handleFindOutMore}
                  />
                ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <div className="animate-pulse mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-200"></div>
                </div>
                <p className="text-gray-500">Loading room options...</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8 sm:mt-12">
            <a
              href="/accommodation"
              className="bg-scolor hover:bg-pcolor text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              View All Accommodations
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Places to Visit Section - improved for mobile */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-3 sm:mb-4">
              NEARBY ATTRACTIONS
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-scolor mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto px-2">
              Discover these magnificent landmarks just moments away from Hotel
              Suneragira
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-2">
            {/* Sigiriya Card */}
            <div className="group bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
              <div className="relative overflow-hidden">
                <img
                  src="/images/sigiria.jpg"
                  alt="Sigiriya"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 stroke-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">4.8</span>
                  </div>
                </div>
                {/* Distance Indicator */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-scolor/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <span className="text-xs sm:text-sm font-medium text-white">
                      2.5 km
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-3">
                  Sigiriya
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2">
                  Ancient palace and fortress complex with stunning views and
                  rich historical significance
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-500 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-scolor" />
                    <span className="text-xs sm:text-sm">3-4 hours</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-scolor" />
                    <span className="text-xs sm:text-sm">Must Visit</span>
                  </div>
                </div>
                <button className="w-full bg-scolor text-white py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 hover:bg-pcolor shadow-md hover:shadow-lg text-xs sm:text-sm">
                  Explore Location
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Temple of the Tooth and Dambulla Cave Temple cards follow the same pattern */}
            <div className="group bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
              <div className="relative overflow-hidden">
                <img
                  src="/images/kandy.jpg"
                  alt="Temple of the Tooth"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 stroke-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">4.9</span>
                  </div>
                </div>
                {/* Distance Indicator */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-scolor/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <span className="text-xs sm:text-sm font-medium text-white">
                      1.8 km
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-3">
                  Temple of the Tooth
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2">
                  Sacred Buddhist temple housing the relic of Buddha's tooth, an
                  important pilgrimage site
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-500 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-scolor" />
                    <span className="text-xs sm:text-sm">2-3 hours</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-scolor" />
                    <span className="text-xs sm:text-sm">Cultural</span>
                  </div>
                </div>
                <button className="w-full bg-scolor text-white py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 hover:bg-pcolor shadow-md hover:shadow-lg text-xs sm:text-sm">
                  Explore Location
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100">
              <div className="relative overflow-hidden">
                <img
                  src="/images/dambulla.jpg"
                  alt="Dambulla Cave Temple"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 stroke-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">4.7</span>
                  </div>
                </div>
                {/* Distance Indicator */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-scolor/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <span className="text-xs sm:text-sm font-medium text-white">
                      3.2 km
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-3">
                  Dambulla Cave Temple
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2">
                  Ancient cave monastery with beautiful wall paintings and
                  incredible spiritual atmosphere
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-500 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-scolor" />
                    <span className="text-xs sm:text-sm">2-3 hours</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-scolor" />
                    <span className="text-xs sm:text-sm">Historical</span>
                  </div>
                </div>
                <button className="w-full bg-scolor text-white py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 hover:bg-pcolor shadow-md hover:shadow-lg text-xs sm:text-sm">
                  Explore Location
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Google Map Section - more mobile-friendly info overlay */}
      <section className="bg-gray-100">
        {/* Section heading with container for proper alignment */}
        <div className="container mx-auto px-3 sm:px-6 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-3 sm:mb-4">
              FIND US
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-scolor mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto px-2">
              Perfectly situated for your convenience in the heart of
              Nikaweratiya
            </p>
          </div>
        </div>

        {/* Edge-to-edge map container with no margins or padding */}
        <div className="w-full relative">
          <div className="relative">
            {/* Map Overlay Information - adjusted for mobile */}
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-lg max-w-[calc(100%-24px)] sm:max-w-sm">
              <h3 className="text-lg sm:text-xl font-serif text-gray-800 mb-1 sm:mb-2">
                Hotel Suneragira
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                No. 123, Main Street, Nikaweratiya, Sri Lanka
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href="tel:+94123456789"
                  className="text-scolor hover:text-pcolor text-xs sm:text-sm flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                  Call Us
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-scolor hover:text-pcolor text-xs sm:text-sm flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                    />
                  </svg>
                  Directions
                </a>
              </div>
            </div>

            {/* Full-width iframe - adjusted height for mobile */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15362.633136406359!2d80.10702796495386!3d7.7688024577783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afcd610a5b4ea93%3A0xefc5f088590da77d!2sSuneragira%20Reception%20Hall!5e0!3m2!1sen!2slk!4v1727886479261!5m2!1sen!2slk"
              className="w-full h-[400px] sm:h-[500px] md:h-[600px]"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
