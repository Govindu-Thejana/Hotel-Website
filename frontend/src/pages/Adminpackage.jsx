import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, ChevronRight } from 'lucide-react';

const Adminpackage = () => {
    const [wedding, setWedding] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPackage, setCurrentPackage] = useState({
        packagename: '',
        price: '',
        Description: ''
    });

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

    const openModal = (isEdit = false, packageData = {}) => {
        setIsEditing(isEdit);
        setCurrentPackage(packageData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPackage({ packagename: '', price: '', Description: '' });
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                const response = await axios.put(`http://localhost:5555/wedding/${currentPackage._id}`, currentPackage);
                if (response.status === 200) {
                    alert('Wedding package updated successfully');
                    setWedding(
                        wedding.map((item) =>
                            item._id === currentPackage._id ? { ...item, ...currentPackage } : item
                        )
                    );
                }
            } else {
                const response = await axios.post('http://localhost:5555/wedding', currentPackage);
                if (response.status === 201) {
                    alert('Wedding package added successfully');
                    setWedding([...wedding, response.data]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving wedding package:', error);
            alert('An error occurred while saving the wedding package.');
        }
    };

    const handleDelete = async (weddingId) => {
        try {
            const response = await axios.delete(`http://localhost:5555/wedding/${weddingId}`);
            if (response.status === 200) {
                alert('Wedding package deleted successfully');
                setWedding(wedding.filter((item) => item._id !== weddingId));
            }
        } catch (error) {
            console.error('Error deleting wedding package:', error);
            alert('An error occurred while deleting the wedding package.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-serif text-gray-900">Admin Wedding Packages</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Manage wedding packages effortlessly with our admin panel
                    </p>
                </div>

                <button
                    className="bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl mb-8"
                    onClick={() => openModal(false)}
                >
                    Add New Wedding Package
                </button>

                {error && <p className="text-red-500 text-center mb-8">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {wedding.map((item) => (
                        <div
                            key={item._id}
                            className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                    <Heart className="w-6 h-6 text-blue-900" />
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    {item.packagename}
                                </h3>

                                <p className="text-3xl font-bold text-blue-900 mb-6">
                                    Rs.{item.price.toLocaleString()}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {(item.Description || '').split(',').map((desc, index) => (
                                        <div key={`${item._id}-${index}`} className="flex items-center text-gray-600">
                                            <ChevronRight className="w-5 h-5 text-blue-900 mr-2" />
                                            <span>{desc.trim()}</span>
                                        </div>
                                    ))}
                                </div>


                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl mr-4"
                                    onClick={() => openModal(true, item)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                        <div className="bg-white p-8 rounded shadow-lg text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                {isEditing ? 'Edit Wedding Package' : 'Add Wedding Package'}
                            </h2>
                            <input
                                type="text"
                                placeholder="Package Name"
                                value={currentPackage.packagename}
                                onChange={(e) => setCurrentPackage({ ...currentPackage, packagename: e.target.value })}
                                className="mb-4 p-2 border rounded w-full"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={currentPackage.price}
                                onChange={(e) => setCurrentPackage({ ...currentPackage, price: e.target.value })}
                                className="mb-4 p-2 border rounded w-full"
                            />
                            <textarea
                                placeholder="Description"
                                value={currentPackage.Description}
                                onChange={(e) => setCurrentPackage({ ...currentPackage, Description: e.target.value })}
                                className="mb-6 p-2 border rounded w-full"
                            ></textarea>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Adminpackage;
