import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, ChevronRight, Star } from 'lucide-react';
import Modal from '../components/Modal';

const WeddingPackages = () => {
    const [wedding, setWedding] = useState([]);
    const [error, setError] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-pcolor mr-2" />
                        <h2 className="text-5xl font-serif text-gray-900">Wedding Packages</h2>
                    </div>
                </div>

                {error && (
                    <div className="text-red-600 text-center mb-8">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {wedding.map((item) => (
                        <div
                            key={item._id}
                            className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                    <Heart className="w-6 h-6 text-pcolor" />
                                </div>
                            </div>

                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                <img
                                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
                                    alt={item.packagename}
                                    className="w-full h-64 object-cover"
                                />
                            </div>

                            <div className="p-8">
                                <div className="flex items-center mb-4">
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    {item.packagename}
                                </h3>

                                <p className="text-3xl font-bold text-scolor mb-6">
                                    Rs.{item.price.toLocaleString()}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {(item.Description || "").split(',').map((desc, index) => (
                                        <div key={index} className="flex items-center text-gray-600">
                                            <ChevronRight className="w-5 h-5 text-pcolor mr-2" />
                                            <span>{desc.trim()}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => openModal(item)}
                                    className="w-full bg-scolor text-white py-3 px-6 rounded-lg font-semibold hover:bg-pcolor transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                packageDetails={selectedPackage}
            />
        </div>
    );
};

export default WeddingPackages;
