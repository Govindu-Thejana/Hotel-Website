import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal";

const WeddingPackages = () => {
  const [wedding, setWedding] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Wedding images array as fallbacks
  const weddingImages = [
    "/images/weddinggroup.png",
    "/images/bridal.png",
    "/images/weddinggroup.png",
  ];

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://hotel-website-backend-drab.vercel.app/wedding"
        );
        if (response.status === 200) {
          setWedding(response.data.data || response.data);
        } else {
          setError("Failed to fetch wedding packages");
        }
      } catch (err) {
        setError("Failed to fetch wedding packages");
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, []);

  const openModal = (item) => {
    setSelectedPackage(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-gray-800 mb-4">
            WEDDING PACKAGES
          </h2>
          <div className="w-24 h-1 bg-scolor mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover our thoughtfully curated wedding packages designed to create an unforgettable celebration for your special day.
          </p>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {loading ? (
            // Elegant loading state
            [...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className="relative rounded-lg overflow-hidden shadow-lg h-[400px] bg-gray-100 animate-pulse"
              >
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-10">
              <div className="inline-block p-4 rounded-full bg-red-50 mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-red-500 font-medium">{error}</p>
              <button 
                className="mt-4 text-sm text-scolor hover:text-pcolor underline"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : wedding.length > 0 ? (
            wedding.map((item, index) => (
              <div
                key={item._id}
                className="relative group rounded-lg overflow-hidden shadow-xl h-[450px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                    <span className="text-xs font-medium text-scolor">
                      {index === 0 ? "Popular" : index === 1 ? "Best Value" : "Exclusive"}
                    </span>
                  </div>
                </div>
                
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${
                      weddingImages[index % weddingImages.length]
                    })`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  {/* Improved Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20"></div>
                </div>

                {/* Content - Enhanced */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                  <h3 className="font-serif text-2xl font-medium mb-2">
                    {item.packagename}
                  </h3>
                  <div className="w-12 h-0.5 bg-scolor mb-4"></div>
                  <p className="text-white/90 mb-6 line-clamp-2">
                    {item.Description ? item.Description.split(",")[0] : ""}
                  </p>

                  {/* Features List */}
                  <div className="mb-6 space-y-1">
                    {item.Features && item.Features.split(',').slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <svg className="w-4 h-4 text-scolor mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-white/80">{feature.trim()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-serif font-semibold text-white">
                        Rs. {item.price ? item.price.toLocaleString() : "0"}
                      </div>
                      <span className="text-xs text-white/70">
                        per event
                      </span>
                    </div>
                    <button
                      onClick={() => openModal(item)}
                      className="bg-scolor/90 hover:bg-scolor text-white py-3 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm inline-block">
                <p className="text-gray-500">No wedding packages available at this time.</p>
                <p className="text-gray-400 mt-2 text-sm">Please check back later or contact us directly.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        packageDetails={selectedPackage}
      />
    </section>
  );
};

export default WeddingPackages;
