"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/50 border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-red-500 transition-colors duration-300 uppercase italic">
                        Nightkids
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/events" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
                        Latest Events
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
                        About Us
                    </Link>
                    <Link href="/shop" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
                        Shop
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        className="text-white focus:outline-none"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? (
                            /* X Icon */
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            /* Hamburger Icon */
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-neutral-950 border-b border-white/10 p-4 flex flex-col space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
                    <Link
                        href="/"
                        className="text-lg font-bold text-white uppercase tracking-widest hover:text-red-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/events"
                        className="text-lg font-bold text-gray-300 uppercase tracking-widest hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Latest Events
                    </Link>
                    <Link
                        href="/about"
                        className="text-lg font-bold text-gray-300 uppercase tracking-widest hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        About Us
                    </Link>
                    <Link
                        href="/shop"
                        className="text-lg font-bold text-gray-300 uppercase tracking-widest hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Shop
                    </Link>
                </div>
            )}
        </header>
    );
}
