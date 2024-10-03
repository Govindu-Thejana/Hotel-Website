import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import WeddingPackages from '../components/WeddingPackages';


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

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


      {/* Hero Section */}
      <section className="relative">
        <img src="/images/bg.jpg" alt="Hotel Exterior" className="w-full h-128 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Your lavish home away from home</h2>
            <p className="text-lg">Experience the best of comfort and luxury in the heart of the city.</p>
          </div>
        </div>
      </section>

      <section className="text-center py-14 px-28 mx-5">

        <h1 className="font-serif italic text-4xl md:text-4xl tracking-wide text-gray-800 mb-6">
          Your lavish home away from home
        </h1>
        <p className="text-gray-500 text-base md:text-lg leading-relaxed">
          Nestled in the vibrant city of [Your City], Hotel Suneragira is your gateway to a world of comfort and elegance. While we may not offer
          a sea view, our exceptional service and luxurious amenities ensure that your stay with us will be nothing short of extraordinary.
          Located just moments away from the city&apos;s bustling attractions, Hotel Suneragira offers a peaceful oasis where you can relax and unwind
          whether you&apos;re traveling for business or leisure.
        </p>

      </section>

      {/* Featured Room Section */}
      <section className="container py-20 mx-auto p-4">
        <div className="flex flex-col md:flex-row backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="md:w-2/3">
            <img src="/images/bride.jpg" alt="Luxurious hotel room" className="w-full h-full object-cover" />
          </div>
          <div className="md:w-1/3 p-6 flex flex-col justify-center">
            <h2 className="text-3xl font-serif mb-4 text-gray-800">Movement of elegance!</h2>
            <p className="text-gray-600 mb-6">At Hotel Somewhere, we offer a variety of accommodation options to cater to both leisure travelers and business professionals alike.</p>
            <button className="bg-scolor text-white py-2 px-4 hover:bg-pcolor transition duration-300">BOOK NOW</button>
          </div>
        </div>
      </section>

      {/* Wedding Package Section */}
      <section className="container mx-auto py-12">
        <WeddingPackages />
      </section>
      {/* Carousel */}
      <section className="container mx-auto py-12">
        <div className="relative">
          <div className="h-128 overflow-hidden rounded-lg">
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



      {/* Room Types Section */}

      <div className="relative flex flex-col items-center mx-auto lg:flex-row-reverse lg:max-w-5xl lg:mt-12 xl:max-w-6xl">


        <div className="w-full h-80 lg:w-3/4 lg:h-auto">
          <img className="h-full w-full object-cover" src="/images/hotel-room.jpg" alt="our rooms" />
        </div>
        <div
          className="max-w-lg bg-white md:max-w-2xl md:z-10 md:shadow-lg md:absolute md:top-0 md:mt-48 lg:w-3/5 lg:left-0 lg:mt-20 lg:ml-20 xl:mt-24 xl:ml-12">

          <div className="flex flex-col p-12 md:px-16">
            <h2 className="text-2xl font-medium uppercase text-pcolor lg:text-4xl">our room & Suite choices</h2>
            <p className="mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat.
            </p>

            <div className="mt-8">
              <a href="#"
                className="inline-block w-full text-center text-lg font-medium text-gray-100 bg-scolor border-solid border-2 border-gray-600 py-4 px-10 hover:bg-pcolor hover:shadow-md md:w-48">Read
                More</a>
            </div>
          </div>

        </div>


      </div>
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

      {/*Menu */}
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
      </div>



      {/* Places to Visit Section */}
      <section className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif">Places You Can Visit Near Our Hotel</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/images/sigiria.jpg" alt="Kandy Lake" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font mb-2">Sigiriya</h3>

            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/images/kandy.jpg" alt="Temple of the Tooth" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font mb-2">Temple of the Tooth</h3>

            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="/images/dambulla.jpg" alt="Botanical Garden" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font mb-2">Dambulla Cave Temple</h3>
            </div>
          </div>
        </div>
      </section>
      <p className="flex justify-center items-center min-h-screen">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15362.633136406359!2d80.10702796495386!3d7.7688024577783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afcd610a5b4ea93%3A0xefc5f088590da77d!2sSuneragira%20Reception%20Hall!5e0!3m2!1sen!2slk!4v1727886479261!5m2!1sen!2slk"
          width="1280"
          height="600"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </p>

    </div>

  );
};

export default Home;
