"use client";

import { useState, useEffect } from 'react';
import FadeIn from './FadeIn';
import { useTranslations } from 'next-intl';

interface CountdownProps {
    targetDateStr?: string;
    locationStr?: string;
    titleStr?: string;
}

export default function Countdown({ 
    targetDateStr = "2026-08-28T22:00:00", 
    locationStr = "Porte di Moncalieri, Torino", 
    titleStr = "Midnight Run" 
}: CountdownProps) {
    const t = useTranslations('Countdown');
    const targetDate = new Date(targetDateStr).getTime();
    
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!isMounted) return null; // Avoid hydration mismatch

    return (
        <section className="border-t border-white/5 bg-neutral-950 py-16 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <FadeIn>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-neutral-900/60 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-block px-3 py-1 text-xs font-bold text-red-500 bg-red-500/10 rounded-full uppercase tracking-wider border border-red-500/20 mb-4">
                                {t('upcomingMeet')}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                                {titleStr}
                            </h2>
                            <p className="text-gray-400 font-light mt-2 uppercase tracking-widest text-sm">
                                {locationStr}
                            </p>
                            <a href={`/events`} className="inline-block mt-6 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform duration-300">
                                {t('moreInfo')}
                            </a>
                        </div>

                        <div className="flex gap-4 md:gap-8 justify-center">
                            <div className="flex flex-col items-center">
                                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tabular-nums">
                                    {String(timeLeft.days).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-bold">{t('days')}</div>
                            </div>
                            <div className="text-4xl md:text-6xl font-black text-gray-700">:</div>
                            <div className="flex flex-col items-center">
                                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tabular-nums">
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-bold">{t('hours')}</div>
                            </div>
                            <div className="text-4xl md:text-6xl font-black text-gray-700">:</div>
                            <div className="flex flex-col items-center">
                                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tabular-nums">
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-bold">{t('minutes')}</div>
                            </div>
                            <div className="hidden md:block text-4xl md:text-6xl font-black text-gray-700">:</div>
                            <div className="hidden md:flex flex-col items-center">
                                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tabular-nums">
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-bold">{t('seconds')}</div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
