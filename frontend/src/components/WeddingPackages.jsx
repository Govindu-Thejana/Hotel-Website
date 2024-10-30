import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal'; // Import the Modal component

const WeddingPackages = () => {
    const [wedding, setWedding] = useState([]); // State for wedding packages
    const [error, setError] = useState(''); // State for error messages
    const [selectedPackage, setSelectedPackage] = useState(null); // State for selected package
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        const fetchWedding = async () => {
            try {
                const response = await axios.get('http://localhost:5555/wedding');
                if (response.status === 200) {
                    setWedding(response.data.data || response.data);
                } else {
                    setError('Failed to fetch wedding packages');
                }
            } catch (err) {
                setError('Failed to fetch wedding packages');
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
        <div className="bg-white p-8 rounded-lg shadow-lg text-center border">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-serif">Featured Wedding Packages</h2>
            </div>

            <section className="container mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {wedding.map((item) => (
                        <div key={item._id} className="bg-white p-8 rounded-lg shadow-lg text-center border">
                            <div className="flex justify-center space-x-8">
                                <img
                                    src="/images/Standard.png"
                                    alt="Package"
                                    className="max-w-xs"
                                />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">{item.packagename}</h3>
                            <p className="text-3xl text-gray-700 mb-4">Rs.{item.price}</p>
                            <ul className="text-gray-600 space-y-2 mb-6">
                                {(item.Description || "").split(',').map((desc, index) => (
                                    <li key={index}>{desc.trim()}</li>
                                ))}
                            </ul>
                            <button
                                onClick={() => openModal(item)} // Open modal with selected package
                                className="border border-black text-black py-2 px-4 rounded mr-4"
                            >
                                Detail
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal for showing package details */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                packageDetails={selectedPackage} 
            />
        </div>
    );
};

export default WeddingPackages;
