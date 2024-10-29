import React, { useEffect, useState } from "react";
import { getRoomById, updateRoom } from "../components/utils/ApiFunctions";
import { useParams } from "react-router-dom";

function EditRoom() {
    const [room, setRoom] = useState({
        roomId: "",
        roomType: "",
        description: "",
        capacity: "",
        pricePerNight: "",
        availability: "",
        cancellationPolicy: "",
        amenities: [],
        images: []
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { roomId } = useParams();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoom({ ...room, [name]: value });
    };

    const handleAmenitiesChange = (e) => {
        setRoom({ ...room, amenities: e.target.value.split(",").map(item => item.trim()) });
    };

    const handleImagesChange = (e) => {
        setRoom({ ...room, images: e.target.value.split(",").map(item => item.trim()) });
    };

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomData = await getRoomById(roomId);
                setRoom(roomData);
            } catch (error) {
                console.error("Error fetching room:", error);
            }
        };
        fetchRoom();
    }, [roomId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateRoom(roomId, room);
            if (response.status === 200) {
                setSuccessMessage("Room updated successfully!");
                const updatedRoomData = await getRoomById(roomId);
                setRoom(updatedRoomData);
                setErrorMessage("");
            } else {
                setErrorMessage("Error updating room");
            }
        } catch (error) {
            console.error("Error updating room:", error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Edit Room</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Room ID</label>
                    <input
                        name="roomId"
                        value={room.roomId}
                        onChange={handleChange}
                        placeholder="Room ID"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Room Type</label>
                    <select
                        name="roomType"
                        value={room.roomType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Suite">Suite</option>
                        <option value="Deluxe Suite">Deluxe Suite</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={room.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input
                        name="capacity"
                        type="number"
                        value={room.capacity}
                        onChange={handleChange}
                        placeholder="Capacity"
                        required
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Price per Night</label>
                    <input
                        name="pricePerNight"
                        type="number"
                        value={room.pricePerNight}
                        onChange={handleChange}
                        placeholder="Price per Night"
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Availability</label>
                    <select
                        name="availability"
                        value={room.availability}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="false">Unavailable</option>
                        <option value="true">Available</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
                    <textarea
                        name="cancellationPolicy"
                        value={room.cancellationPolicy}
                        onChange={handleChange}
                        placeholder="Cancellation Policy"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    <input
                        name="amenities"
                        value={room.amenities.join(", ")}
                        onChange={handleAmenitiesChange}
                        placeholder="e.g., Free Wi-Fi, Air Conditioning, Pool"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <small className="text-gray-500">Enter amenities separated by commas</small>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Image URLs</label>
                    <input
                        name="images"
                        value={room.images.join(", ")}
                        onChange={handleImagesChange}
                        placeholder="e.g., image1.jpg, image2.jpg"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <small className="text-gray-500">Enter image URLs separated by commas</small>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    Update Room
                </button>

                {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
                {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
            </form>
        </div>
    );
}

export default EditRoom;
