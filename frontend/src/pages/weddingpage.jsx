import Header from "../components/Header";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import WeddingPackages from "../components/WeddingPackages";
import WeddingServices from "../components/Services";
import WeddingPlanners from "../components/Planners";
import PastWeddings from "../components/PastWeddings";
import AppointmentForm from "../components/AppointmentForm";

const WeddingPage = () => {
  return (
    <div className="bg-gray-100">
      <Header />

      <section className="relative">
        <img
          src="/images/bg.jpg"
          alt="Hotel Exterior"
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4"></h2>
            <p className="text-lg"></p>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-2 text-pcolor">OUR STORY</h2>
          <p className="mt-4 text-gray-600 max-w-7xl mx-auto">
            Your perfect event starts here. We are leading event and wedding
            planner in Sri Lanka, or wherever else your special day is taking
            place. Oue team designs, plans and creates Budget as well as
            luxurious weddings and events for clients. We’ve honed our skills to
            offer a range of services to accommodate the diversity of our
            clients. We are the team and wedding planner that people trusts with
            their most exclusive affairs, offering comprehensive planning
          </p>
        </div>

        {/* masive room card */}
        <section>
          <div className="container py-20 scroll-px-px mx-auto p-4">
            <div className="flex flex-col md:flex-row backdrop-blur-sm shadow-lg overflow-hidden">
              {/* Image section */}
              <div className="md:w-2/3 ">
                <img
                  src="https://banuphotography.com/wp-content/uploads/2021/06/mannar-wedding-77.jpg"
                  alt="Luxurious hotel room"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text section */}
              <div className="md:w-1/3 p-6 flex flex-col justify-center">
                <h2 className="text-3xl font-serif mb-4 text-gray-800">
                  WE MAKE YOUR DREAM DAY COME TRUE
                </h2>
                <p className="text-gray-600 mb-6">
                  At The Hotel Nirvana in our region, Hotel Somewhere offers a
                  variety of accommodation options to cater to both leisure
                  travelers and business professionals alike. Whether you seek
                  the comforts of a well-appointed deluxe room or the grandeur
                  of an executive suite, our hotel provides a range of luxurious
                  living spaces to ensure a memorable stay.
                </p>
                <p className="text-gray-600 mb-6">
                  While we may not offer sea views, you can still enjoy the
                  tranquility of our elegantly designed rooms and suites,
                  perfect for unwinding after a day of business meetings or
                  exploring the local attractions.
                </p>
                <button className="bg-scolor text-white py-2 px-4  hover:bg-pcolor transition duration-300">
                  FIND OUT MORE{" "}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center mb-12">
          <h2 className="text-sm uppercase text-scolor italic tracking-widest">
            QUALITY SERVICES ARE KEY TO OUR SUCCESS
          </h2>
          <h2 className="text-4xl font-serif">Our Services</h2>
        </div>

        <WeddingServices />

        <WeddingPackages />

        <section className="container mx-auto py-12">
          <div className="text-center mb-12">
            <h2 className="text-sm uppercase text-scolor italic tracking-widest">
              OUR TEAM
            </h2>
            <h2 className="text-4xl font-serif">Meet Our Planners</h2>
          </div>

          <WeddingPlanners />
        </section>

        {/* Past Weddings Section */}
        <section className="container mx-auto py-16 px-4 md:px-0">
          <div className="text-center mb-12">
            <h2 className="text-sm uppercase text-scolor italic tracking-widest">
              PAST WEDDINGS
            </h2>
            <h2 className="text-4xl font-serif">Visit Our Gallery</h2>
          </div>

          <PastWeddings />

          <div className="text-center mt-12">
            <a
              href="/gallery"
              className="bg-scolor text-white py-3 px-6 rounded-md shadow-lg hover:bg-gradient-to-l transition duration-300"
            >
              View Full Gallery
            </a>
          </div>
        </section>

        <section className="bg-[#f8f3ed] py-16">
          <div className="container mx-auto text-center">
            <h3 className="text-sm uppercase tracking-widest text-[#d7bfa3] mb-2">
              Our Customer Review
            </h3>
            <h2 className="text-4xl font-serif text-[#333] mb-6">
              What Our Client Says
            </h2>

            <div className="flex justify-center mb-4">
              <div className="flex">
                {/* Star Ratings */}
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#fbbf24"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73-1.64 7.03L12 17.27z"
                    />
                  </svg>
                ))}
              </div>
            </div>

            <p className="text-gray-600 max-w-2xl mx-auto italic mb-12"></p>

            {/* Client Info */}
            <div className="flex justify-center items-center">
              <img
                src="https://img.freepik.com/free-photo/portrait-masculinity-portrait-handsome-young-bearded-man-while-standing-against-grey-wall_231208-7770.jpg?t=st=1727781593~exp=1727785193~hmac=f8e1894e2f82c5f0bdde25c0da774039ea57924d831c6fca9cbcdc92d108f68d&w=360"
                alt="Jackson Dean"
                className="w-12 h-12 rounded-full border-2 border-gray-300"
              />
              <div className="ml-4">
                <h4 className="text-xl font-medium text-gray-800">
                  Jackson Dean
                </h4>
                <span className="text-sm text-gray-500">Guest</span>
              </div>
            </div>
          </div>

          {/* Dots for Slide Indicators */}
          <div className="mt-8 flex justify-center space-x-2">
            <span className="block w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="block w-2 h-2 rounded-full bg-gray-600"></span>
            <span className="block w-2 h-2 rounded-full bg-gray-400"></span>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto text-center">
            <div className="text-center mb-12">
              <h2 className="text-sm uppercase text-scolor italic tracking-widest">
                LET SET A DATE AND START PLANNING YOUR DREAM EVENT.BOOK A
                MEETING WITH US <div className="B"></div>
              </h2>
              <h2 className="text-4xl font-serif">Schedule & Appointments</h2>
            </div>

            {/* Appointment Scheduling Form */}
            <AppointmentForm />

            <div className="mt-8 text-gray-600">
              
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-serif mb-6">
              Handling Stress for Event Success
            </h2>
            <p className="text-lg text-scolor-700 mb-12">
              Planning an event can be stressful, but were here to make the
              process as smooth and stress-free as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Stress Handling Tips */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-scolor-600 mb-4">
                  Professional Coordination
                </h3>
                <p className="text-gray-600 mb-4">
                  Our expert team coordinates all the logistics, so you can
                  focus on enjoying your special day. From timeline management
                  to vendor coordination, we handle it all.
                </p>
                <a
                  href="/contact"
                  className="text-scolor-600 font-semibold hover:underline"
                >
                  Contact us for more details
                </a>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-scolor-600 mb-4">
                  Stress-Free Packages
                </h3>
                <p className="text-gray-600 mb-4">
                  We offer a range of customizable packages to fit your needs.
                  Whether you need a full-service package or just day-of
                  coordination, we ensure a seamless event.
                </p>
                <a
                  href="/packages"
                  className="text-scolor-600 font-semibold hover:underline"
                >
                  Explore our packages
                </a>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-scolor-600 mb-4">
                  Mindfulness & Relaxation
                </h3>
                <p className="text-gray-600 mb-4">
                  Our team offers mindfulness and relaxation techniques to keep
                  you calm and focused leading up to your event. Meditation
                  sessions and breathing exercises are available.
                </p>
                <a
                  href="/mindfulness"
                  className="text-scolor-600 font-semibold hover:underline"
                >
                  Learn more
                </a>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-scolor-600 mb-4">
                  Emergency Backup Plans
                </h3>
                <p className="text-gray-600 mb-4">
                  In case something doesnt go according to plan, we always have
                  a backup plan in place. From weather issues to unexpected
                  changes, weve got you covered.
                </p>
                <a
                  href="/emergency-plan"
                  className="text-scolor-600 font-semibold hover:underline"
                >
                  Read about our contingency plans
                </a>
              </div>
            </div>

            {/* Contact Information with Icons */}
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-scolor-600 mb-4">
                Get in Touch
              </h3>
              <div className="flex flex-col items-center">
                <p className="text-gray-600 mb-2 flex items-center">
                  <FaPhoneAlt className="text-scolor-600 mr-2" />
                  Phone:{" "}
                  <a
                    href="tel:+1234567890"
                    className="text-scolor-600 font-semibold hover:underline"
                  >
                    +1 (234) 567-890
                  </a>
                </p>
                <p className="text-gray-600 mb-2 flex items-center">
                  <FaEnvelope className="text-scolor-600 mr-2" />
                  Email:{" "}
                  <a
                    href="mailto:info@example.com"
                    className="text-scolor-600 font-semibold hover:underline"
                  >
                    info@example.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 px-4 md:px-8 lg:px-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-serif mb-12">What Our Clients Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                <div className="mb-4">
                  <img
                    src="https://img.freepik.com/free-photo/people-smiling-men-handsome-cheerful_1187-6057.jpg?t=st=1727781311~exp=1727784911~hmac=18cc1c8bc5fd0766e4fd635bd6ccc962b5af6821def69ebeface4f0925209ff7&w=740"
                    alt="Client 1"
                    className="w-16 h-16 rounded-full mx-auto"
                  />
                </div>
                <h3 className="text-xl font-semibold text-scolor-600 mb-2">
                  John Doe
                </h3>
                <p className="text-gray-600 mb-4">
                  The team made my event stress-free and an absolute success.
                  Their attention to detail and professionalism were top-notch!
                </p>
                <div className="text-yellow-400">★★★★☆</div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                <div className="mb-4">
                  <img
                    src="https://img.freepik.com/free-photo/confident-young-man-walking-european-city-street_158595-4692.jpg?t=st=1727781396~exp=1727784996~hmac=fb68aaa6999be81a11e88663e39980c4768fe96d91a0642a4212695f6b8c0714&w=360"
                    alt="Client 2"
                    className="w-16 h-16 rounded-full mx-auto"
                  />
                </div>
                <h3 className="text-xl font-semibold text-scolor-600 mb-2">
                  Jane Smith
                </h3>
                <p className="text-gray-600 mb-4">
                  From start to finish, the coordination was flawless. I couldnt
                  have asked for a better event planning experience.
                </p>
                <div className="text-yellow-400">★★★★★</div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                <div className="mb-4">
                  <img
                    src="https://img.freepik.com/free-photo/happy-handsome-brutal-bearder-man-wearing-warm-red-winter-trendy-fleece-hoodie_343596-2716.jpg?t=st=1727781422~exp=1727785022~hmac=f3c933072ecc685c5a7c10e80dbc3ad66bd2dd946bacb7ffc9df8d672e7011b2&w=996"
                    alt="Client 3"
                    className="w-16 h-16 rounded-full mx-auto"
                  />
                </div>
                <h3 className="text-xl font-semibold text-scolor-600 mb-2">
                  Michael Lee
                </h3>
                <p className="text-sclor-600 mb-4">
                  The team was exceptional! Their packages were perfect for my
                  needs and they delivered beyond my expectations.
                </p>
                <div className="text-yellow-400">★★★★★</div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default WeddingPage;