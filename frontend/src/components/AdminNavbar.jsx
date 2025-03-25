import React from 'react';
import { BedDouble, LayoutDashboard, Search, LogOut } from 'lucide-react';
import { TbPackages, TbMessage2Down } from "react-icons/tb";
import { BsBuildingFillCheck } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const currentPath = window.location.pathname;
    const navigate = useNavigate(); // To handle navigation programmatically

    // Define handleLogout function
    const handleLogout = () => {
        // Remove the admin token from localStorage
        localStorage.removeItem("adminToken");

        // Navigate to the login page
        navigate("/login");
    };

    const navItems = [
        {
            href: "/admin-dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="w-5 h-5" />
        },
        {
            href: "/room-management",
            label: "Rooms",
            icon: <BedDouble className="w-5 h-5" />
        },
        {
            href: "/admin-bookings",
            label: "Bookings",
            icon: <BsBuildingFillCheck className="w-5 h-5" />
        },
        {
            href: "/admin-appointment",
            label: "Appointments",
            icon: <TbMessage2Down className="w-5 h-5" />
        },
        {
            href: "/admin-package",
            label: "Wedding Packages",
            icon: <TbPackages className="w-5 h-5" />
        },
        {
            href: "/gallery-test",
            label: "Gallery",
            icon: <TbPackages className="w-5 h-5" />
        },
        {
            href: "/overview",
            label: "Overview",
            icon: <Search className="w-5 h-5" />
        },
        {
            // Use the handleLogout function for the logout button
            label: "Logout",
            icon: <LogOut className="w-5 h-5" />,
            className: "text-red-500 hover:text-red-600",
            onClick: handleLogout // Attach onClick for logout item
        }
    ];

    return (
        <div>
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-800 shadow-lg sm:translate-x-0">
                <div className="h-full px-4 py-6 overflow-y-auto">
                    {/* Logo and Hotel Name */}
                    <div className="flex flex-col items-center mb-8 space-y-4">
                        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="/images/logo.png"
                                className="w-full h-full object-contain p-2"
                                alt="Suneragira Hotel"
                            />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800 text-center dark:text-white font-serif">
                            Admin Dashboard
                        </h1>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = currentPath === item.href;
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={item.onClick || undefined} // Attach onClick for logout item
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 
                                    ${isActive
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                        } ${item.className || 'text-gray-700 dark:text-gray-200'}`}
                                >
                                    <span className={`mr-3 ${isActive ? 'text-blue-600 dark:text-blue-200' : ''}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                </a>
                            )
                        })}
                    </nav>
                </div>
            </aside>
        </div>
    );
};

export default Navbar;
