import Header from "../components/Header";
import { FaPhoneAlt, FaEnvelope, FaStar } from "react-icons/fa";
import WeddingPackages from "../components/WeddingPackages";
import WeddingServices from "../components/Services";
import WeddingPlanners from "../components/Planners";
import PastWeddings from "../components/PastWeddings";
import AppointmentForm from "../components/AppointmentForm";
import SearchBar from "../components/roomBookingSearchBar";

const WeddingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section - Enhanced with better overlay */}
      <section className="relative">
        {/* Background image */}
        <img
          src="/images/bgWedding.png"
          alt="Hotel Exterior"
          className="w-full h-screen object-cover"
        />

        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 flex flex-col items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center">
            <img
              alt="Suneragira Hotel"
              src="/images/logo.png"
              className="h-24 md:h-40 lg:h-48 w-auto px-5"
            />
            <h1 className="text-white font-serif italic text-2xl md:text-3xl lg:text-4xl mt-6 max-w-3xl mx-auto px-4">
              Create Your Perfect Wedding Day at Hotel Suneragira
            </h1>
          </div>
        </div>

        {/* Search Bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-80 px-4 sm:px-10">
          <SearchBar />
        </div>
      </section>

      {/* Main content wrapper */}
      <section className="container mx-auto py-16 px-4">
        {/* Our Story Section - Enhanced */}
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase text-scolor italic tracking-widest mb-2">
            Experience Excellence
          </h2>
          <h2 className="text-4xl font-serif mb-4 text-gray-800">OUR STORY</h2>
          <div className="w-24 h-1 bg-scolor mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
            Your perfect event starts here. We are the leading event and wedding
            planner in Sri Lanka, or wherever else your special day is taking
            place. Our team designs, plans, and creates both budget-friendly and
            luxurious weddings and events for clients. We've honed our skills to
            offer a range of services to accommodate the diversity of our
            clients. We are the team and wedding planner that people trust with
            their most exclusive affairs, offering comprehensive planning.
          </p>
        </div>

        {/* Dream Day Section - Enhanced */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row shadow-xl overflow-hidden rounded-xl border border-gray-100">
            {/* Image section with improved styling */}
            <div className="md:w-2/3 relative overflow-hidden">
              <img
                src="https://banuphotography.com/wp-content/uploads/2021/06/mannar-wedding-77.jpg"
                alt="Luxurious wedding venue"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm py-1 px-3 rounded-full shadow-md">
                <span className="text-xs font-medium text-scolor">
                  Featured Venue
                </span>
              </div>
            </div>

            {/* Text section with improved styling */}
            <div className="md:w-1/3 p-6 md:p-10 flex flex-col justify-center bg-white">
              <h2 className="text-3xl font-serif mb-6 text-gray-800">
                WE MAKE YOUR DREAM DAY COME TRUE
              </h2>
              <div className="w-16 h-1 bg-scolor mb-6"></div>
              <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
                At Hotel Suneragira, we offer a variety of wedding options to
                cater to both intimate celebrations and grand affairs. Whether
                you seek the comforts of a classic ceremony or the grandeur of
                an executive reception, our hotel provides a range of luxurious
                settings to ensure a memorable celebration.
              </p>
              <button className="bg-scolor text-white py-3 px-6 rounded-md hover:bg-pcolor transition duration-300 transform hover:shadow-lg flex items-center justify-center gap-2">
                <span>DISCOVER MORE</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <div className="text-center mb-12">
          <h2 className="text-sm uppercase text-scolor italic tracking-widest mb-2">
            QUALITY SERVICES ARE KEY TO OUR SUCCESS
          </h2>
          <h2 className="text-4xl font-serif mb-4">Our Services</h2>
          <div className="w-24 h-1 bg-scolor mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover our range of exceptional wedding services designed to
            create your perfect celebration at Hotel Suneragira.
          </p>
        </div>

        <WeddingServices />

        {/* Packages Section */}
        <WeddingPackages />

        {/* Planners Section - Enhanced */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase text-scolor italic tracking-widest mb-2">
              OUR TEAM
            </h2>
            <h2 className="text-4xl font-serif mb-4">
              Meet Our Wedding Specialists
            </h2>
            <div className="w-24 h-1 bg-scolor mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our expert wedding planners bring years of experience and a
              passion for perfection to every celebration they organize.
            </p>
          </div>

          <WeddingPlanners />
        </section>

        {/* Past Weddings Section - Enhanced */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase text-scolor italic tracking-widest mb-2">
              PAST WEDDINGS
            </h2>
            <h2 className="text-4xl font-serif mb-4">Visit Our Gallery</h2>
            <div className="w-24 h-1 bg-scolor mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Browse our collection of beautiful weddings that showcase the
              artistry and attention to detail that define Hotel Suneragira's
              celebrations.
            </p>
          </div>

          <PastWeddings />

          <div className="text-center mt-16">
            <a
              href="/gallery"
              className="bg-scolor text-white py-3 px-8 rounded-md shadow-lg hover:bg-pcolor transition duration-300 transform hover:shadow-xl flex items-center justify-center gap-2 mx-auto inline-flex"
            >
              <span>Gallery</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </section>

        {/* Customer Reviews Section - Enhanced */}
        <section className="bg-white py-20 px-4 border-t border-b border-gray-100">
          <div className="container mx-auto text-center">
            <h2 className="text-sm uppercase text-scolor italic tracking-widest mb-2">
              TESTIMONIALS
            </h2>
            <h2 className="text-4xl font-serif mb-4">What Our Client Says</h2>
            <div className="w-24 h-1 bg-scolor mx-auto mb-8"></div>

            <div className="max-w-4xl mx-auto bg-gray-50 p-10 rounded-xl shadow-lg relative mt-16 mb-16">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
                  <img
                    src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t1.6435-9/127866405_1425232394352214_6703902721038537610_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_ohc=VPJpo2r-AS0Q7kNvwHfS3x_&_nc_oc=AdlnDC4kW54Hmrzy8UCtapVUFD6_TH8JYoXZQoWip5Q9T-kp072Z3NNHQWiBtaZPh2k&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=4FUI893Z0A9h_9IKTa0RfA&oh=00_AfKh2Whd3lb4jrACpQxltlDB6y3ZHXDQ7N6r14wXteWxgw&oe=6843AA11"
                    alt="Jackson Dean"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex justify-center mb-6 mt-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="text-yellow-400 w-5 h-5 mx-0.5"
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 text-lg font-light italic mb-8 relative">
                <span className="text-4xl text-scolor/20 absolute -top-4 -left-2">
                  "
                </span>
                The team made my wedding day absolutely magical. Their attention
                to detail and professionalism were unmatched!
                <span className="text-4xl text-scolor/20 absolute -bottom-8 -right-2">
                  "
                </span>
              </p>

              <h4 className="text-xl font-medium text-gray-800">
                Namal Abeynayaka
              </h4>
              <span className="text-sm text-scolor">Wedding Client</span>

              {/* Elegant Dots for Slide Indicators */}
              <div className="mt-8 flex justify-center gap-2">
                <span className="block w-8 h-1 rounded-full bg-scolor"></span>
                <span className="block w-2 h-1 rounded-full bg-gray-300"></span>
                <span className="block w-2 h-1 rounded-full bg-gray-300"></span>
              </div>
            </div>
          </div>
        </section>

        {/* Appointment Form Section - Enhanced and Highlighted */}
        <section className="bg-gradient-to-b from-white via-gray-50 to-white py-20 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-scolor/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-pcolor/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>

          <div className="container mx-auto text-center mb-12 relative">
            <div className="inline-block bg-scolor text-white px-6 py-2 rounded-full mb-6 shadow-md">
              <h2 className="text-sm uppercase tracking-widest font-medium">
                LIMITED AVAILABILITY
              </h2>
            </div>

            <h2 className="text-4xl font-serif mb-4 text-gray-800">
              Book Your Wedding Consultation
            </h2>
            <div className="w-24 h-1 bg-scolor mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-3xl mx-auto mb-10">
              Secure your special day by scheduling a personalized consultation
              with our expert wedding planners. Begin your journey to a perfect
              celebration today.
            </p>

            {/* Highlight border */}
            <div className="max-w-5xl mx-auto border-2 border-scolor/20 p-1 rounded-2xl shadow-lg">
              <div className="bg-white p-6 md:p-10 rounded-xl relative">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-scolor/40 rounded-tl-lg"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-scolor/40 rounded-br-lg"></div>

                <AppointmentForm />

                {/* Added call-to-action */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-500 mb-2">
                    Prefer to speak with someone directly?
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-lg font-medium text-scolor hover:underline"
                  >
                    Call us: 0377 223 224
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stress Handling Section - Enhanced */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-sm uppercase text-scolor italic tracking-widest mb-2">
              STRESS-FREE PLANNING
            </h2>
            <h2 className="text-4xl font-serif mb-4">
              Creating Your Perfect Day
            </h2>
            <div className="w-24 h-1 bg-scolor mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-3xl mx-auto mb-16">
              Planning a wedding can be overwhelming, but our experienced team
              is here to make the process enjoyable and stress-free.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {[
                {
                  title: "Professional Coordination",
                  description:
                    "Our expert team coordinates all the logistics, so you can focus on enjoying your special day.",
                  link: "/contact",
                },
                {
                  title: "Stress-Free Packages",
                  description:
                    "We offer customizable packages to fit your needs, ensuring a seamless event.",
                  link: "/packages",
                },
                {
                  title: "Mindfulness & Relaxation",
                  description:
                    "We provide mindfulness techniques to keep you calm and focused.",
                  link: "/mindfulness",
                },
                {
                  title: "Emergency Backup Plans",
                  description:
                    "We always have a backup plan in place for unexpected changes.",
                  link: "/emergency-plan",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                >
                  <h3 className="text-2xl font-semibold text-scolor-600 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <a
                    href={item.link}
                    className="text-scolor-600 font-semibold hover:underline"
                  >
                    Learn More
                  </a>
                </div>
              ))}
            </div>

            {/* Contact Information - Enhanced */}
            <div className="mt-20 bg-white p-10 rounded-xl shadow-lg max-w-4xl mx-auto">
              <h3 className="text-2xl font-serif text-gray-800 mb-6">
                Connect With Our Wedding Team
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="bg-gray-50 p-6 rounded-lg flex items-center gap-4">
                  <div className="bg-scolor/10 p-3 rounded-full">
                    <FaPhoneAlt className="text-scolor w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500 mb-1">
                      Call Us Directly
                    </p>
                    <a
                      href="tel:+1234567890"
                      className="text-lg font-medium text-gray-800 hover:text-scolor"
                    >
                      +94 0377 223 22
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg flex items-center gap-4">
                  <div className="bg-scolor/10 p-3 rounded-full">
                    <FaEnvelope className="text-scolor w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500 mb-1">Email Us</p>
                    <a
                      href="mailto:weddings@suneragira.com"
                      className="text-lg font-medium text-gray-800 hover:text-scolor"
                    >
                      suneragirahotel@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Updated to match the above style */}
        <section className="bg-white py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-sm uppercase text-scolor italic tracking-widest mb-2">
              CLIENT EXPERIENCES
            </h2>
            <h2 className="text-4xl font-serif mb-4">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-scolor mx-auto mb-12"></div>

            <div className="max-w-4xl mx-auto">
              {/* Featured testimonial in spotlight style */}
              <div className="bg-gray-50 p-10 rounded-xl shadow-lg relative mb-16">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKwI-k5fJidvvfMxQX63jiTxY9bHuLp33-eQ&s"
                      alt="Jane Smith"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex justify-center mb-6 mt-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className="text-yellow-400 w-5 h-5 mx-0.5"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-lg font-light italic mb-8 relative">
                  <span className="text-4xl text-scolor/20 absolute -top-4 -left-2">
                    "
                  </span>
                  From start to finish, the coordination was flawless. I
                  couldn't have asked for a better event planning experience.
                  <span className="text-4xl text-scolor/20 absolute -bottom-8 -right-2">
                    "
                  </span>
                </p>

                <h4 className="text-xl font-medium text-gray-800">
                  Kasun Gangadara
                </h4>
                <span className="text-sm text-scolor">Wedding Client</span>

                {/* Elegant Dots for Slide Indicators */}
                <div className="mt-8 flex justify-center gap-2">
                  <span className="block w-2 h-1 rounded-full bg-gray-300"></span>
                  <span className="block w-8 h-1 rounded-full bg-scolor"></span>
                  <span className="block w-2 h-1 rounded-full bg-gray-300"></span>
                </div>
              </div>

              {/* Hidden testimonials (you could add a carousel functionality later) */}
              <div className="hidden">
                {/* ...existing code with the array mapping... */}
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default WeddingPage;
