import React from "react";

const WeddingServices = () => {
  return (
    <div>
      <div className="relative bg-gradient-to-r from-gray-200 to-gray-400 py-12 px-8">
        <div className="container mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/Camera.png"
                alt="Camera & Video"
                className="mx-auto mb-4"
              />

              <h3 className="text-2xl text-scolor font-semibold mb-2">Camera & Video</h3>
              <p className="text-gray-600">
                Gravida ullamcorper lectus vitae tristique cursus tempor rutrum.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/Cake.png"
                alt="Wedding Cake"
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl text-scolor font-semibold mb-2">Wedding Cake</h3>
              <p className="text-gray-600">
                Consectetur arcu egestas tortor metus eleifend estacinia quis.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/Floral.png"
                alt="Floral Design"
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl text-scolor font-semibold mb-2">Floral Design</h3>
              <p className="text-gray-600">
                Sed pretium quisque tempor ultricies enim nam quisque mattis.
              </p>
            </div>
            <div className="bg-white text-scolor p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/Location.png"
                alt="Stunning Locations"
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl text-scolor font-semibold mb-2">
                Stunning Locations
              </h3>
              <p className="text-gray-600">
                Eget netus ultricies scelerisque nunc id tempor lacinia tempor.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/Music.png"
                alt="Music Party"
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl text-scolor font-semibold mb-2">Music Party</h3>
              <p className="text-gray-600">
                Nulla diam mattis fringilla massa ac duis facilisi consequat
                mauris.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src="/images/Frock.png"
                alt="Wedding Dress"
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl text-scolor font-semibold mb-2">Wedding Dress</h3>
              <p className="text-gray-600">
                Tristique in porttitor nunc massa a sit neque lectus feugiat.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl py-6 md:py-10 font-serif">Our Partners</h2>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12">
        <img
          src="/images/FloralStudio.png"
          alt="Floral Studio"
          className="w-full max-w-[200px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px] transition-transform hover:scale-105"
        />
        <img
          src="/images/WeddingStudio.png"
          alt="Wedding Studio"
          className="w-full max-w-[200px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px] transition-transform hover:scale-105"
        />
        <img
          src="/images/FloralStudio1.png"
          alt="Floral Studio 2"
          className="w-full max-w-[200px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px] transition-transform hover:scale-105"
        />
        <img
          src="/images/WeddingStudio1.png"
          alt="Other Studio"
          className="w-full max-w-[200px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px] transition-transform hover:scale-105"
        />
      </div>
    </div>
  );
};

export default WeddingServices;
