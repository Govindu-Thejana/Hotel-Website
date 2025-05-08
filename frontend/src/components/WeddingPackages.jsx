import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal";

const WeddingPackages = () => {
  const [wedding, setWedding] = useState([]);
  const [error, setError] = useState("");
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
    <section className="py-16 bg-gray-100">
      <h2 className="text-center text-4xl font-serif text-gray-800 mb-10">
        WEDDING PACKAGES
      </h2>
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {error ? (
            <div className="col-span-full text-center text-red-500">
              {error}
            </div>
          ) : wedding.length > 0 ? (
            wedding.map((item, index) => (
              <div
                key={item._id}
                className="relative group rounded-lg overflow-hidden shadow-lg h-[400px] transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Background Image (Fixed to the card) */}
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
                  {/* Overlay for better readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <h3 className="font-serif text-xl font-medium mb-2">
                    {item.packagename}
                  </h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {item.Description ? item.Description.split(",")[0] : ""}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">
                      Rs.{item.price ? item.price.toLocaleString() : "0"}{" "}
                      <span className="text-xs font-normal text-white/70">
                        per event
                      </span>
                    </div>
                    <button
                      onClick={() => openModal(item)}
                      className="bg-scolor hover:bg-pcolor text-white text-sm py-2 px-4 rounded transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No wedding packages available.
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
