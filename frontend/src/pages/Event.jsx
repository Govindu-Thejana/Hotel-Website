import { useEffect } from "react";
import { CalendarDays, Users } from "lucide-react";
import AppointmentForm from "../components/AppointmentForm";
import SearchBar from "../components/roomBookingSearchBar";

export default function EventPage() {
  // Scroll animation effect
  useEffect(() => {
    const handleScrollAnimation = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add("opacity-100");
          el.classList.remove("opacity-0");
        }
      });
    };
 
    handleScrollAnimation(); // Run initially
    window.addEventListener("scroll", handleScrollAnimation);
    return () => window.removeEventListener("scroll", handleScrollAnimation);
  }, []);

  return (
    <div className="bg-gray-100">
      {/* hero section */}
      <section className="relative">
        {/* Background image */}
        <img
          src="/images/gardenAtNight.jpg"
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

      {/* Featured Events Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center mb-16 animate-on-scroll opacity-0 transition-opacity duration-700">
          <h2 className="text-4xl md:text-5xl mb-4 font-serif">Featured Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We want your event at Hotel Suneragira to be truly unforgettable. That’s why we focus on every detail to
            ensure a unique and memorable experience. Whether it’s a wedding, corporate gathering, or special
            celebration, we provide the ideal setting to make your event extraordinary.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Birthdays",
              description: "Create your perfect day in our elegant venues",
              image: "/images/Birthday2.jpeg",
            },
            {
              title: "Corporate Functions",
              description: "Professional spaces for your business needs",
              image: "/images/cfunction2.jpeg",
            },
            {
              title: "Social Celebrations",
              description: "Perfect settings for life's special moments",
              image: "/images/Cofunction.jpeg",
            },
          ].map((event, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md animate-on-scroll opacity-0 transition-opacity duration-700"
            >
              <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }} />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <button className="mt-4 text-scolor hover:text-pcolor transition-colors">
                  Find Out More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Our Venues Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16 animate-on-scroll opacity-0 transition-opacity duration-700">
          <h2 className="text-4xl md:text-5xl mb-4 font-serif">Our Venues</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of elegant spaces designed to make your event truly special.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { title: "Hall", description: "An opulent space perfect for grand celebrations and corporate galas.", capacity: "Up to 300 guests", image: "/images/halle2.jpeg" },
            { title: "Outdoor", description: "A stunning outdoor venue surrounded by manicured gardens.", capacity: "Up to 150 guests", image: "/images/Outdoor1.jpg" },
          ].map((venue, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl bg-gray-50 animate-on-scroll opacity-0 transition-opacity duration-700">
              <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${venue.image})` }} />
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-2">{venue.title}</h3>
                <p className="text-gray-600 mb-4">{venue.description}</p>
                <p className="text-sm text-scolor">{venue.capacity}</p>
                <button className="bg-scolor text-white px-6 py-2 rounded-md hover:bg-pcolor transition-transform transform hover:scale-105">
                  Appoiment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0 transition-opacity duration-700">

          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}
