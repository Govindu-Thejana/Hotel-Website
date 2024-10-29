import React from 'react';
import { BedDouble, LayoutDashboard, Search, LogOut } from 'lucide-react';

const Navbar = () => {
    const currentPath = window.location.pathname;

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
            href: "/overview",
            label: "Overview",
            icon: <Search className="w-5 h-5" />
        },
        {
            href: "/logout",
            label: "Logout",
            icon: <LogOut className="w-5 h-5" />,
            className: "text-red-500 hover:text-red-600"
        }
    ];

    return (
        <div>
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-800 shadow-lg sm:translate-x-0">
                <div className="h-full px-4 py-6 overflow-y-auto">
                    {/* Logo and Hotel Name */}
                    <div className="flex flex-col items-center mb-8 space-y-4">
                        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg bg-teal-900">
                            <img
                                src="/images/Logo.jpg"
                                className="w-full h-full object-contain p-2"
                                alt="Suneragira Hotel"
                            />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white font-serif">
                            Suneragira Hotel
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