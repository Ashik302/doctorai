"use client";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen((prevState) => !prevState);
    };

    return (
        <header className="w-full fixed top-0 z-50">
            {/* Navbar Container */}

            <br />

            <div className="w-[90%] z-50 mx-auto py-4 px-6 flex items-center justify-between border-4 border-white rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-pink-500 text-white animate-slow-bounce">
                {/* Logo Section */}
                <div className="text-3xl font-extrabold font-poppins">
                    <Link href="/">
                        <span className="hover:text-gray-200 transition duration-300 cursor-pointer">
                            takecare.ai
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex space-x-8 text-lg font-medium font-poppins">
                    <Link href="#features">
                        <span className="hover:text-gray-200 transition duration-200 cursor-pointer">
                            Features
                        </span>
                    </Link>
                    <Link href="#about">
                        <span className="hover:text-gray-200 transition duration-200 cursor-pointer">
                            About Us
                        </span>
                    </Link>
                    <Link href="#contact">
                        <span className="hover:text-gray-200 transition duration-200 cursor-pointer">
                            Contact
                        </span>
                    </Link>
                </nav>

                {/* Mobile Hamburger Menu */}
                <div className="lg:hidden">
                    <button onClick={toggleMenu} className="text-3xl focus:outline-none">
                        {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </button>
                </div>
            </div>

            {/* Sidebar for Mobile Navigation */}
            <div
                className={`fixed inset-y-0 right-0 bg-gradient-to-b from-blue-600 to-pink-500 w-64 transform transition-transform duration-300 ease-in-out shadow-lg border-l-4 border-white ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full py-8 px-6 space-y-6">
                    <h2 className="text-2xl font-bold text-white ">Menu</h2>
                    <nav className="flex text-white  flex-col space-y-4 text-lg font-medium font-poppins">
                        <Link href="#features">
                            <span
                                className="hover:text-gray-200 transition duration-200 cursor-pointer"
                                onClick={toggleMenu}
                            >
                                Features
                            </span>
                        </Link>
                        <Link href="#about">
                            <span
                                className="hover:text-gray-200 transition duration-200 cursor-pointer"
                                onClick={toggleMenu}
                            >
                                About Us
                            </span>
                        </Link>
                        <Link href="#contact">
                            <span
                                className="hover:text-gray-200 transition duration-200 cursor-pointer"
                                onClick={toggleMenu}
                            >
                                Contact
                            </span>
                        </Link>
                    </nav>
                    <button
                        className="mt-auto py-2 px-4 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition duration-200"
                        onClick={toggleMenu}
                    >
                        Close Menu
                    </button>
                </div>
            </div>
        </header>
    );
}
