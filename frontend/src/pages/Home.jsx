import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import WeddingPackages from '../components/WeddingPackages';
import RoomCardHome from '../components/roomCardHome';
import SearchBar from '../components/roomBookingSearchBar';
import { ChevronRight, Clock, MapPin, Star } from 'lucide-react';


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://hotel-website-backend-drab.vercel.app/rooms')
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
  const handleBooking = () => navigate('/reservation');

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


      {/* hero section */}
      <section className="relative">
        {/* Background image */}
        <img
          src="/images/bg.jpg"
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
            {/* Optional: Add a responsive heading or subtitle */}
            <h1 className="text-gray-100 font-serif italic text-xl md:text-2xl lg:text-3xl font-extrabold mt-6 text-center tracking-wide drop-shadow-lg">
              Welcome to Hotel Suneragira
            </h1>

          </div>
        </div>

        {/* Search Bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-80 px-10">
          <SearchBar />
        </div>
      </section>


      <section className="text-center py-14 px-28 mx-5">

        <h1 className="font-serif italic text-4xl md:text-4xl tracking-wide text-gray-800 mb-6">
          Your lavish home away from home
        </h1>
        <p className="text-gray-500 text-base md:text-lg leading-relaxed">
          Nestled in the vibrant city of Nikaweratiya, Hotel Suneragira is your gateway to a world of comfort and elegance. While we may not offer
          a sea view, our exceptional service and luxurious amenities ensure that your stay with us will be nothing short of extraordinary.
          Located just moments away from the city&apos;s bustling attractions, Hotel Suneragira offers a peaceful oasis where you can relax and unwind
          whether you&apos;re traveling for business or leisure.
        </p>

      </section>

      {/* Bride card */}
      <section className="container mx-auto py-2 w-full px-4">
        <div className="relative group">
          {/* Main Card Container */}
          <div className="flex flex-col md:flex-row bg-white backdrop-blur-sm shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
            {/* Image Section */}
            <div className="relative md:w-2/3 overflow-hidden">
              <img
                src="/images/bride (2).jpg"
                alt="Luxurious hotel room"
                className="w-full h-[300px] md:h-[600px] object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-500 group-hover:bg-opacity-10"></div>
            </div>

            {/* Content Section */}
            <div className="md:w-1/3 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
              {/* Decorative Element */}
              <div className="w-20 h-1"></div>

              <h2 className="text-4xl font-serif mb-6 text-gray-800 leading-tight">
                Movement of <span className="italic text-scolor">elegance!</span>
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed font-light text-lg">
                At Hotel Somewhere, we offer a variety of accommodation options to cater to both leisure travelers and business professionals alike.
              </p>

              {/* CTA Button */}
              <button
                className="group relative overflow-hidden bg-scolor text-white py-3 px-6 rounded-md transition-all duration-300 transform hover:shadow-xl"
              >
                <span className="relative z-10 text-sm tracking-wider font-medium">
                  BOOK NOW
                </span>
                <div className="absolute inset-0 bg-pcolor transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-50 rounded-tl-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Package Section */}
      <WeddingPackages />

      {/* Room Card Section */}
      <div className="max-w-6xl mx-auto">
        <div className="relative flex flex-col lg:flex-row bg-[#F8F5F0] rounded-lg shadow-lg overflow-hidden transform transition-transform duration-500 hover:scale-105">
          {/* Left Section - Image Container */}
          <div className="absolute top-0 left-0 w-full lg:w-1/2 h-96 lg:h-full">
            <div className="relative w-full h-full overflow-hidden">
              <img
                src="/images/hotel-room.jpg"
                alt="Executive Room"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 hover:bg-opacity-0 transition duration-500"></div>
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="w-full lg:w-1/2 lg:ml-auto p-8 bg-white rounded-lg shadow-lg">
            <div className="lg:ml-4">
              <h2 className="text-3xl font-serif text-gray-900 uppercase mb-4">
                Executive Room
              </h2>

              {/* Occupancy & Size */}
              <div className="flex items-center gap-6 mt-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  <span className="text-sm">2 Adults</span>
                </div>
                <div className="w-px h-6 bg-gray-400"></div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📏</span>
                  <span className="text-sm">315 ft²</span>
                </div>
              </div>

              {/* Room Description */}
              <p className="text-gray-600 mt-4 font-serif leading-relaxed">
                Designed with the needs of business travelers in mind. Offering exclusive access to the Business Lounge, guests can enjoy 24-hour coffee and tea service, complimentary breakfast, and evening cocktails in a private and comfortable setting.
              </p>

              {/* Amenities Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { icon: "☕", text: "Coffee & Tea" },
                  { icon: "🍳", text: "Complimentary Breakfast" },
                  { icon: "🍸", text: "Evening Cocktails" },
                  { icon: "💼", text: "Business Lounge Access" },
                ].map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <span className="text-lg">{amenity.icon}</span>
                    <span className="text-sm">{amenity.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <a
                  href="/accommodation"
                  className="inline-block bg-scolor text-sm uppercase tracking-wider px-6 py-3 text-white hover:bg-pcolor hover:shadow-lg transition-all duration-300"
                >
                  Find Out More
                </a>
              </div>

              {/* Pagination */}
              <div className="mt-8 text-gray-500 text-sm italic">
                <span className="font-bold text-gray-900">01</span> / <span>11</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <section className="container mx-auto py-12">
        <div className="relative">
          <div className="h-128 overflow-hidden ">
            <img src={`/images/${currentSlide === 0 ? 'weddinggroup.png' : currentSlide === 1 ? 'all.jpg' : 'bridal.png'}`} alt="Hotel" className="w-full h-full object-cover" />
          </div>

          {/* Carousel Navigation */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full">
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full">
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>



      <h2 className="text-center text-4xl font-serif text-gray-800 mb-10">ROOMS & RATES</h2>
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


      {/* Menu
      <div className="min-h-screen flex flex-col p-8 sm:p-16 md:p-24 justify-center bg-white">
        <div data-theme="teal" className="mx-auto max-w-6xl">
          <h2 className="sr-only">Featured case study</h2>
          <section className="font-sans text-black">
            <div className="[ lg:flex lg:items-center ] [ fancy-corners fancy-corners--large fancy-corners--top-left fancy-corners--bottom-right ]">
              <div className="flex-shrink-0 self-stretch sm:flex-basis-40 md:flex-basis-50 xl:flex-basis-60">
                <div className="h-full">
                  <article className="h-full">
                    <div className="h-full">
                      <img className="h-full object-cover" src="/images/OIP.jpg" width="733" height="412" alt='""' />
                    </div>
                  </article>
                </div>
              </div>
              <div className="p-6 bg-grey">
                <div className="leading-relaxed">
                  <h1 className="text-4xl font-serif">Menu</h1>
                  <h2 className="leading-tight text-4xl font">Satisfy your cravings</h2>
                  <p className="text-base text-gray-500 leading-relaxed">Embark on a culinary journey and discover a world of delectable dishes from Sri Lanka and beyond.
                    Immerse yourself in the exquisite flavours and let your taste buds explode with every bite.
                    Head to our cosy restaurants and indulge in a wide range of freshly prepared dishes or beverages of your choice.</p>
                  <p><a href="#" className="text-white bg-scolor hover:bg-pcolor focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-scolor dark:hover:bg-pcolor focus:outline-none dark:focus:ring-scolor">Find out more</a></p>
                </div>
              </div>
            </div>

            <section className="container mx-auto py-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font">Featued Foods</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img src="/images/chiken.jpg" alt="Single Room" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">CHIKEN FLAVOURS</h3>
                    <a href="#" className="text-white bg-scolor hover:bg-pcolor focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-scolor dark:hover:bg-pcolor focus:outline-none dark:focus:ring-pcolor">$2 P/PORTION</a>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img src="/images/italiyan.jpg" alt="Single Room" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">Italiyan Food</h3>
                    <a href="#" className="text-white bg-scolor hover:bg-pcolor focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-scolor dark:hover:bg-pcolor focus:outline-none dark:focus:ring-pcolor">$2 P/PORTION</a>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img src="/images/kiribath.jpg" alt="Single Room" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">Milk Rice</h3>
                    <a href="#" className="text-white bg-scolor hover:bg-pcolor focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-scolor dark:hover:bg-pcolor focus:outline-none dark:focus:ring-pcolor">$2 P/PORTION</a>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </div>
      </div> */}


      {/* Places to Visit Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif mb-4">
            Explore Nearby Attractions
          </h2>
          <p className="text-scolor font-serif max-w-2xl mx-auto">
            Discover these magnificent landmarks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sigiriya Card */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative overflow-hidden">
              <img
                src="/images/sigiria.jpg"
                alt="Sigiriya"
                className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3">Sigiriya</h3>
              <p className="text-gray-600 mb-4">Ancient palace and fortress complex with stunning views</p>
              <div className="flex items-center gap-4 text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">2.5 km</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">3-4 hours</span>
                </div>
              </div>
              <button className="w-full bg-scolor text-white py-3 rounded-lg flex items-center justify-center gap-2 transform transition-colors duration-300 hover:bg-pcolor">
                Learn More
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Temple of the Tooth Card */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative overflow-hidden">
              <img
                src="/images/kandy.jpg"
                alt="Temple of the Tooth"
                className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-sm font-medium">4.9</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3">Temple of the Tooth</h3>
              <p className="text-gray-600 mb-4">Sacred Buddhist temple housing the relic of Buddha's tooth</p>
              <div className="flex items-center gap-4 text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">1.8 km</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">2-3 hours</span>
                </div>
              </div>
              <button className="w-full bg-scolor text-white py-3 rounded-lg flex items-center justify-center gap-2 transform transition-colors duration-300 hover:pcolor">
                Learn More
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dambulla Cave Temple Card */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative overflow-hidden">
              <img
                src="/images/dambulla.jpg"
                alt="Dambulla Cave Temple"
                className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-sm font-medium">4.7</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3">Dambulla Cave Temple</h3>
              <p className="text-gray-600 mb-4">Ancient cave monastery with beautiful wall paintings</p>
              <div className="flex items-center gap-4 text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">3.2 km</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">2-3 hours</span>
                </div>
              </div>
              <button className="w-full bg-scolor text-white py-3 rounded-lg flex items-center justify-center gap-2 transform transition-colors duration-300 hover:bg-pcolor">
                Learn More
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* google map */}
      <section className="w-screen px-4">
        <div className="w-full relative overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15362.633136406359!2d80.10702796495386!3d7.7688024577783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afcd610a5b4ea93%3A0xefc5f088590da77d!2sSuneragira%20Reception%20Hall!5e0!3m2!1sen!2slk!4v1727886479261!5m2!1sen!2slk"
            className="w-full h-[600px]"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>


    </div>

  );
};

export default Home;
