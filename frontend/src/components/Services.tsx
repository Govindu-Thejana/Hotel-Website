import React from "react";

const WeddingServices = () => {
  return (
    <div>
      {/* Services Grid with updated styling */}
      <div className="relative bg-gradient-to-r from-white to-gray-100 py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Camera & Video */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
              <div className="bg-gray-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/images/Camera.png"
                  alt="Camera & Video"
                  className="mx-auto h-12"
                />
              </div>
              <h3 className="text-2xl text-scolor font-serif mb-3">
                Photography & Videography
              </h3>
              <div className="w-12 h-0.5 bg-scolor mx-auto mb-4"></div>
              <p className="text-gray-600">
                Professional photography and videography services to capture
                every precious moment of your special day.
              </p>
            </div>

            {/* Wedding Cake */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
              <div className="bg-gray-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/images/Cake.png"
                  alt="Wedding Cake"
                  className="mx-auto h-12"
                />
              </div>
              <h3 className="text-2xl text-scolor font-serif mb-3">
                Gourmet Wedding Cakes
              </h3>
              <div className="w-12 h-0.5 bg-scolor mx-auto mb-4"></div>
              <p className="text-gray-600">
                Exquisitely designed custom wedding cakes created by our master
                pastry chefs to delight your guests.
              </p>
            </div>

            {/* Floral Design */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
              <div className="bg-gray-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/images/Floral.png"
                  alt="Floral Design"
                  className="mx-auto h-12"
                />
              </div>
              <h3 className="text-2xl text-scolor font-serif mb-3">
                Floral Artistry
              </h3>
              <div className="w-12 h-0.5 bg-scolor mx-auto mb-4"></div>
              <p className="text-gray-600">
                Stunning floral arrangements and decorations tailored to your
                wedding theme and personal preferences.
              </p>
            </div>

            {/* Stunning Locations */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
              <div className="bg-gray-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/images/Location.png"
                  alt="Stunning Locations"
                  className="mx-auto h-12"
                />
              </div>
              <h3 className="text-2xl text-scolor font-serif mb-3">
                Elegant Venues
              </h3>
              <div className="w-12 h-0.5 bg-scolor mx-auto mb-4"></div>
              <p className="text-gray-600">
                Choose from our selection of beautifully appointed indoor and
                outdoor venues perfect for ceremonies and receptions.
              </p>
            </div>

            {/* Music Party */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
              <div className="bg-gray-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/images/Music.png"
                  alt="Music Party"
                  className="mx-auto h-12"
                />
              </div>
              <h3 className="text-2xl text-scolor font-serif mb-3">
                Premium Entertainment
              </h3>
              <div className="w-12 h-0.5 bg-scolor mx-auto mb-4"></div>
              <p className="text-gray-600">
                Professional DJs, live bands, and entertainment options to
                create the perfect atmosphere for your celebration.
              </p>
            </div>

            {/* Wedding Dress */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
              <div className="bg-gray-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/images/Frock.png"
                  alt="Wedding Dress"
                  className="mx-auto h-12"
                />
              </div>
              <h3 className="text-2xl text-scolor font-serif mb-3">
                Bridal Services
              </h3>
              <div className="w-12 h-0.5 bg-scolor mx-auto mb-4"></div>
              <p className="text-gray-600">
                Bridal suite amenities, styling services, and personal
                attendants to ensure you look and feel your best.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section with improved styling */}
      <div className="bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
              Our Trusted Partners
            </h2>
            <div className="w-24 h-1 bg-scolor mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We collaborate with the finest vendors in the industry to ensure
              your wedding day exceeds all expectations.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
            {[
              { src: "/images/FloralStudio.png", alt: "Floral Studio" },
              { src: "/images/WeddingStudio.png", alt: "Wedding Studio" },
              { src: "/images/FloralStudio1.png", alt: "Floral Studio 2" },
              { src: "/images/WeddingStudio1.png", alt: "Other Studio" },
            ].map((partner, index) => (
              <div
                key={index}
                className="filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
              >
                <img
                  src={partner.src}
                  alt={partner.alt}
                  className="w-auto h-16 md:h-20"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingServices;
