import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-pcolor text-white py-12">
            <div className="container mx-auto px-6">
                <div className="md:flex justify-between">
                    {/* Left Section: Logo and Description */}
                    <div className="mb-8 md:mb-0">
                        <div className="flex items-center space-x-2">
                            <img src="/images/logo.png" alt="Logo" className="h-12" />
                            <h3 className="text-lg font-bold">
                                SUNERAGIRA <br /> GRAND HOTEL
                            </h3>
                        </div>
                        <p className="mt-4 text-gray-400 text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Middle Section: Useful Links */}
                    <div className="mb-8 md:mb-0">
                        <h4 className="text-scolor font-semibold mb-4">USEFUL LINKS</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                            <li><a href="/accommodation" className="text-gray-400 hover:text-white">Accommodation</a></li>
                            <li><a href="/weddings" className="text-gray-400 hover:text-white">Weddings</a></li>
                            <li><a href="/rooms" className="text-gray-400 hover:text-white">Rooms</a></li>
                        </ul>
                    </div>

                    {/* Right Section: Subscription */}
                    <div className="md:w-1/3">
                        <h4 className="text-scolor font-semibold mb-4">SUBSCRIBE</h4>
                        <p className="mb-4 text-gray-400 text-sm">
                            Don't miss to subscribe to our news, kindly fill the form below.
                        </p>
                        <form className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Your Email Here"
                                className="w-full px-4 py-2 text-gray-900 rounded"
                            />
                            <button className="bg-scolor hover:bg-yellow-600 px-4 py-2 text-white rounded">
                                &gt;
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex-col items-center justify-center">
                    {/* Social Media Icons */}
                    <div className="space-x-4 mb-4">
                        {['Twitter', 'Facebook', 'Instagram', 'YouTube', 'Pinterest'].map((platform) => (
                            <a key={platform} href="#" className="text-gray-400 hover:text-white" title={platform}>
                                <i className={`fab fa-${platform.toLowerCase()}`}></i>
                            </a>
                        ))}
                    </div>

                    {/* Privacy and Terms Links */}
                    <div className="space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white">Terms of Use</a>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="mt-6 text-center text-gray-400 text-sm">
                    &copy; 2023 Suneragira Grand Hotel. All Rights Reserved.
                </div>

            </div>
        </footer>
    );
};

export default Footer;
