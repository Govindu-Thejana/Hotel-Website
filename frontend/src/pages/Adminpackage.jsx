import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
                // Update existing package
                const response = await axios.put(`http://localhost:5555/wedding/${currentPackage._id}`, currentPackage);
                if (response.status === 200) {
                    alert('Wedding package edited successfully');
                    setWedding(
                        wedding.map((item) =>
                            item._id === currentPackage._id ? { ...item, ...currentPackage } : item
                        )
                    );
                }
            } else {
                // Add new package
                const response = await axios.post(`http://localhost:5555/wedding`, currentPackage);
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
        <div className="bg-white p-8 rounded-lg shadow-lg text-center border">
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded mb-6"
                onClick={() => openModal(false)}>
                Add New Wedding Package
            </button>

            {error && <p className="text-red-500">{error}</p>}

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
                alt="Floral Studio"
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
                                className="border border-black text-black py-2 px-4 rounded mr-4"
                                onClick={() => openModal(true, item)}>
                                Edit
                            </button>
                            <button
                                className="border border-black text-black py-2 px-4 rounded"
                                onClick={() => handleDelete(item._id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal for Add/Edit Package */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Package' : 'Add Package'}</h2>
                        <input
                            type="text"
                            placeholder="Package Name"
                            value={currentPackage.packagename}
                            onChange={(e) => setCurrentPackage({ ...currentPackage, packagename: e.target.value })}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={currentPackage.price}
                            onChange={(e) => setCurrentPackage({ ...currentPackage, price: e.target.value })}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <textarea
                            placeholder="Description"
                            value={currentPackage.Description}
                            onChange={(e) => setCurrentPackage({ ...currentPackage, Description: e.target.value })}
                            className="mb-4 p-2 border rounded w-full"
                        ></textarea>
                        <div>
                            <button className="bg-green-500 text-white py-2 px-4 rounded mr-2" onClick={handleSave}>
                                Save
                            </button>
                            <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Adminpackage;
