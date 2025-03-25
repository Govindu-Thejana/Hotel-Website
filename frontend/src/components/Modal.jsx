import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, packageDetails }) => {
    if (!isOpen || !packageDetails) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden transform transition-all">
                <div className="relative">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                        >
                            <X className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        <img
                            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
                            alt={packageDetails.packagename}
                            className="w-full h-64 object-cover"
                        />
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {packageDetails.packagename}
                    </h3>
                    <p className="text-2xl text-pink-600 font-semibold mb-6">
                        Rs.{packageDetails.price.toLocaleString()}
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {packageDetails.longDescription || 'No detailed description available.'}
                    </p>

                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Included Features:</h4>
                    <ul className="space-y-3">
                        {(packageDetails.Description || "").split(',').map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                                <span className="inline-block w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                {feature.trim()}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-scolor text-white rounded-lg font-semibold hover:bg-pcolor transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
