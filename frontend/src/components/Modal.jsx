// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, packageDetails }) => {
    if (!isOpen) return null; // Return nothing if modal is not open

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">{packageDetails.packagename}</h2>
                <p className="text-lg mb-2">Price: Rs. {packageDetails.price}</p>
                <p className="mb-4">{packageDetails.Description}</p>
                <button onClick={onClose} className="border border-black text-black py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
