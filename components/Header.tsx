"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const t = useTranslations('Navigation');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const currentLang = pathname.startsWith('/en') ? 'EN' : 'IT';
    const newLocale = currentLang === 'EN' ? 'it' : 'en';
    const newPath = pathname.startsWith('/en') || pathname.startsWith('/it') 
        ? pathname.replace(/^\/(en|it)/, `/${newLocale}`) 
        : `/${newLocale}${pathname}`;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const localePrefix = pathname.startsWith('/en') ? '/en' : '/it';

    const getLink = (path: string) => {
        if (path === '/') return `${localePrefix}`;
        return `${localePrefix}${path}`;
    }

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/50 border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link href={getLink('/')} className="text-2xl font-bold tracking-tighter text-white hover:text-red-500 transition-colors duration-300 uppercase italic">
                        Nightkids
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href={getLink('/events')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
                        {t('events')}
                    </Link>
                    <Link href={getLink('/about')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
                        {t('about')}
                    </Link>
                    <Link href={getLink('/rules')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
                        {t('rules')}
                    </Link>
                    <Link href={getLink('/shop')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
                        {t('shop')}
                    </Link>

                    <a href={newPath} className="bg-white/10 px-3 py-1 rounded text-xs font-bold text-white uppercase hover:bg-white/20 transition">
                        {currentLang}
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <a href={newPath} className="bg-white/10 px-3 py-1 rounded text-xs font-bold text-white uppercase hover:bg-white/20 transition">
                        {currentLang}
                    </a>

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
                        href={getLink('/')}
                        className="text-lg font-bold text-white uppercase tracking-widest hover:text-red-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('home')}
                    </Link>
                    <Link
                        href={getLink('/events')}
                        className="text-lg font-bold text-gray-300 uppercase tracking-widest hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('events')}
                    </Link>
                    <Link
                        href={getLink('/about')}
                        className="text-lg font-bold text-gray-300 uppercase tracking-widest hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('about')}
                    </Link>
                    <Link
                        href={getLink('/rules')}
                        className="text-lg font-bold text-gray-300 uppercase tracking-widest hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('rules')}
                    </Link>
                    <Link
                        href={getLink('/shop')}
                        className="text-lg font-bold text-gray-300 uppercase tracking-widest hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t('shop')}
                    </Link>
                </div>
            )}
        </header>
    );
}
