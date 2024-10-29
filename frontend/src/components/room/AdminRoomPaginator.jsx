import React from "react";

const AdminRoomPaginator = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav aria-label="Page navigation" className="flex justify-center mt-4">
            <ul className="flex space-x-2">
                {pageNumbers.map((pageNumber) => (
                    <li key={pageNumber}>
                        <button
                            onClick={() => onPageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg font-semibold ${currentPage === pageNumber
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                                }`}
                        >
                            {pageNumber}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default AdminRoomPaginator;
