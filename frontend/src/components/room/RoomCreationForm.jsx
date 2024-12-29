import React, { useState } from 'react';
import { addRooms } from './RoomCrudApi'; // Import addRooms function

const RoomCreationForm = () => {
    const [roomData, setRoomData] = useState({
        roomId: '',
        roomType: '',
        description: '',
        capacity: '',
        pricePerNight: '',
        availability: false,
        amenities: [],
        cancellationPolicy: '',
        images: []
    });

    const [roomTypes, setRoomTypes] = useState(['Standard', 'Deluxe', 'Suite']);
    const [amenities, setAmenities] = useState(['Wi-Fi', 'Air Conditioning', 'TV', 'Minibar']);
    const [newRoomType, setNewRoomType] = useState('');
    const [newAmenity, setNewAmenity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoomData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAmenityChange = (amenity) => {
        setRoomData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const addNewRoomType = () => {
        if (newRoomType.trim() && !roomTypes.includes(newRoomType.trim())) {
            setRoomTypes(prev => [...prev, newRoomType.trim()]);
            setNewRoomType('');
        }
    };

    const addNewAmenity = () => {
        if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
            setAmenities(prev => [...prev, newAmenity.trim()]);
            setNewAmenity('');
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            alert("You can upload a maximum of 5 images.");
            return;
        }

        const filePreviews = files.map(file => URL.createObjectURL(file));

        setRoomData(prev => ({
            ...prev,
            images: files
        }));

        setPreviewImages(filePreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['roomId', 'roomType', 'description', 'capacity', 'pricePerNight', 'cancellationPolicy'];
        const missingFields = requiredFields.filter(field => !roomData[field]);
        if (missingFields.length > 0) {
            alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            setIsSubmitting(true);
            const success = await addRooms(
                roomData.roomId,
                roomData.roomType,
                roomData.description,
                roomData.capacity,
                roomData.pricePerNight,
                roomData.availability,
                roomData.cancellationPolicy,
                roomData.amenities,
                roomData.images
            );
            if (success) {
                alert('Room Created Successfully!');
                setRoomData({
                    roomId: '',
                    roomType: '',
                    description: '',
                    capacity: '',
                    pricePerNight: '',
                    availability: false,
                    amenities: [],
                    cancellationPolicy: '',
                    images: []
                });
                setPreviewImages([]);
            }
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Failed to create the room. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Room</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Room ID and Room Type */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="roomId" className="block mb-2 text-gray-700">Room ID</label>
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            value={roomData.roomId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Enter Room ID"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="roomType" className="block mb-2 text-gray-700">Room Type</label>
                        <select
                            id="roomType"
                            name="roomType"
                            value={roomData.roomType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="">Select Room Type</option>
                            {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <div className="mt-2 flex space-x-2">
                            <input
                                type="text"
                                value={newRoomType}
                                onChange={(e) => setNewRoomType(e.target.value)}
                                placeholder="New Room Type"
                                className="flex-grow px-2 py-1 border rounded-md"
                            />
                            <button type="button" onClick={addNewRoomType} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block mb-2 text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={roomData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        rows="3"
                        required
                    />
                </div>

                {/* Capacity, Price, and Availability */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="capacity" className="block mb-2 text-gray-700">Capacity</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={roomData.capacity}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="pricePerNight" className="block mb-2 text-gray-700">Price per Night</label>
                        <input
                            type="number"
                            id="pricePerNight"
                            name="pricePerNight"
                            value={roomData.pricePerNight}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700">Availability</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="availability"
                                name="availability"
                                checked={roomData.availability}
                                onChange={handleInputChange}
                                className="mr-2 h-4 w-4"
                            />
                            <span>{roomData.availability ? 'Available' : 'Unavailable'}</span>
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div>
                    <label className="block mb-2 text-gray-700">Amenities</label>
                    <div className="grid md:grid-cols-4 gap-4">
                        {amenities.map(amenity => (
                            <div key={amenity} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={amenity}
                                    checked={roomData.amenities.includes(amenity)}
                                    onChange={() => handleAmenityChange(amenity)}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor={amenity}>{amenity}</label>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex space-x-2">
                        <input
                            type="text"
                            value={newAmenity}
                            onChange={(e) => setNewAmenity(e.target.value)}
                            placeholder="New Amenity"
                            className="flex-grow px-2 py-1 border rounded-md"
                        />
                        <button type="button" onClick={addNewAmenity} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                            Add
                        </button>
                    </div>
                </div>

                {/* Cancellation Policy */}
                <div>
                    <label htmlFor="cancellationPolicy" className="block mb-2 text-gray-700">Cancellation Policy</label>
                    <textarea
                        id="cancellationPolicy"
                        name="cancellationPolicy"
                        value={roomData.cancellationPolicy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        rows="3"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="images" className="block mb-2 text-gray-700">Room Images</label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border rounded-md"
                        accept="image/*"
                    />
                    <div className="mt-4 flex space-x-4">
                        {previewImages.map((src, index) => (
                            <div key={index} className="w-20 h-20 border rounded overflow-hidden">
                                <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Room'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoomCreationForm;
