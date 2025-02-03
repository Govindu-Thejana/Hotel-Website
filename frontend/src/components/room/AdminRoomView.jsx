import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { getRoomDetails, updateRoom } from './RoomCrudApi'; // Import your backend API functions
import Alert from '@mui/material/Alert'; // Import the Alert component from Material UI

function AdminRoomView() {
    const { roomId } = useParams(); // Get roomId from the URL
    const navigate = useNavigate(); // For navigation
    const [isEditing, setIsEditing] = useState(false);
    const [roomData, setRoomData] = useState(null); // Room data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // For image preview modal
    const [amenities, setAmenities] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null); // State for the alert message

    // Fetch room details from the backend
    useEffect(() => {
        const fetchRoom = async () => {
            if (!roomId) {
                setError('Room ID is missing from the URL.');
                setLoading(false);
                return;
            }

            try {
                console.log(`Fetching room details for Room ID: ${roomId}`);
                const data = await getRoomDetails(roomId);
                console.log("Fetched room data:", data);
                setRoomData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch room details:", err);
                setError('Invalid Room ID or failed to fetch data.');
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId]);

    // Fetch amenities from the backend
    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await axios.get('https://hotel-website-backend-drab.vercel.app/rooms'); // Use the same endpoint
                const allAmenities = response.data.data
                    .flatMap((room) => {
                        try {
                            return JSON.parse(room.amenities[0]); // Parse JSON string
                        } catch (error) {
                            console.error('Failed to parse amenities for room:', room.roomId, error);
                            return []; // Skip this room's amenities if parsing fails
                        }
                    })
                    .filter((value, index, self) => self.indexOf(value) === index); // Deduplicate
                setAmenities(allAmenities);
            } catch (error) {
                console.error('Error fetching amenities:', error);
                setAmenities([]); // Fallback to empty list if API call fails
            }
        };

        fetchAmenities();
    }, []);

    const handleInputChange = (field, value) => {
        setRoomData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddAmenity = () => {
        setRoomData((prev) => ({
            ...prev,
            amenities: [...(prev.amenities || []), ''],
        }));
    };

    const handleRemoveAmenity = (index) => {
        setRoomData((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index),
        }));
    };

    const handleAmenityChange = (index, value) => {
        setRoomData((prev) => {
            const updatedAmenities = [...prev.amenities];
            updatedAmenities[index] = value;
            return { ...prev, amenities: updatedAmenities };
        });
    };

    const handleAddImage = (file) => {
        setRoomData((prev) => ({
            ...prev,
            images: [...(prev.images || []), file], // Add File object directly
        }));
    };

    const handleRemoveImage = (index) => {
        setRoomData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        try {
            await updateRoom(roomData._id, {
                roomId: roomData.roomId,
                roomType: roomData.roomType,
                description: roomData.description,
                capacity: roomData.capacity,
                pricePerNight: roomData.pricePerNight,
                availability: (roomData.availability).toString(),
                cancellationPolicy: roomData.cancellationPolicy,
                amenities: roomData.amenities,
                images: roomData.images.filter((img) => img instanceof File)
            });

            setIsEditing(false);
            setAlertMessage({ type: 'success', message: 'Room updated successfully!' }); // Success message
        } catch (err) {
            console.error("Error updating room:", err.response || err);
            setAlertMessage({ type: 'error', message: `Error updating room: ${err.response?.data?.message || "Please try again."}` });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    useEffect(() => {
        if (alertMessage) {
            // Set a timer to hide the alert after 3 seconds (3000 milliseconds)
            const timer = setTimeout(() => {
                setAlertMessage(null); // This will clear the alert after 3 seconds
            }, 3000);

            // Cleanup function to clear the timer if the component unmounts or if alertMessage changes
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    if (loading) return <div>Loading room details...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            {/* Alert Message */}
            {alertMessage && (
                <div className="mb-4">
                    <Alert severity={alertMessage.type}>
                        {alertMessage.message}
                    </Alert>
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => navigate(-1)} // Go back to the previous page
                        className="flex items-center text-blue-500 hover:text-blue-600"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Room List
                    </button>

                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Room
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Room - {roomData.roomId}</h1>
                        {isEditing ? (
                            <select
                                value={roomData.availability}
                                onChange={(e) => handleInputChange('availability', e.target.value === 'true')}
                                className="px-3 py-1 border rounded-lg"
                            >
                                <option value="true">Available</option>
                                <option value="false">Unavailable</option>
                            </select>
                        ) : (
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${roomData.availability
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {roomData.availability ? 'Available' : 'Unavailable'}
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        {isEditing ? (
                            <input
                                type="number"
                                value={roomData.pricePerNight}
                                onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
                                className="w-32 px-3 py-2 border rounded-lg text-right text-2xl font-bold text-blue-600"
                            />
                        ) : (
                            <div className="text-2xl font-bold text-blue-600">${roomData.pricePerNight}</div>
                        )}
                        <div className="text-gray-500">per night</div>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold mb-3">Description</h2>
                        {isEditing ? (
                            <textarea
                                value={roomData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full h-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-600">{roomData.description}</p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-3">Room Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-gray-500">Room Type</div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={roomData.roomType}
                                    onChange={(e) => handleInputChange('roomType', e.target.value)}
                                    className="px-3 py-2 border rounded-lg"
                                />
                            ) : (
                                <div>{roomData.roomType}</div>
                            )}

                            <div className="text-gray-500">Capacity</div>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={roomData.capacity}
                                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                                    className="px-3 py-2 border rounded-lg"
                                />
                            ) : (
                                <div>{roomData.capacity}</div>
                            )}

                            <div className="text-gray-500">Cancellation Policy</div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={roomData.cancellationPolicy}
                                    onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                                    className="px-3 py-2 border rounded-lg"
                                />
                            ) : (
                                <div>{roomData.cancellationPolicy || 'Not specified'}</div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                        {isEditing ? (
                            <div className="space-y-2">
                                {roomData.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={amenity}
                                            onChange={(e) => handleAmenityChange(index, e.target.value)}
                                            className="flex-1 px-3 py-2 border rounded-lg"
                                        />
                                        <button
                                            onClick={() => handleRemoveAmenity(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={handleAddAmenity}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Add Amenity
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {roomData.amenities.length > 0 ? (
                                    roomData.amenities.map((amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-center bg-gray-100 px-4 py-2 rounded-md shadow-sm border border-gray-300"
                                        >
                                            <span className="text-gray-800 font-medium">{amenity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-gray-400">No amenities specified</div>
                                )}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-3">Images</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {roomData.images && roomData.images.map((image, index) => {
                                const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;
                                return (

                                    <div
                                        key={index}
                                        className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden shadow"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Room image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {isEditing && (
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {isEditing && (
                            <input
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleAddImage(e.target.files[0]); // Pass the File object
                                    }
                                }}
                                className="mt-4"
                            />
                        )}
                    </section>
                </div>
            </div>

            {/* Modal for Image Preview */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-auto max-h-screen object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminRoomView;
