export default function BentoGrid() {
    return (
        <section className="container mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                {/* Card 1: Latest Drop (Large Video) */}
                <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
                    {/* Placeholder for Video */}
                    <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-700 transition-colors duration-500">
                        <span className="text-neutral-500 font-bold text-2xl uppercase tracking-widest">[ Video Placeholder ]</span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-black bg-red-500 rounded-full uppercase tracking-wider">
                            Latest Drop
                        </span>
                        <h3 className="text-3xl md:text-5xl font-bold text-white uppercase italic tracking-tighter mb-2">
                            Night Run Vol. 4
                        </h3>
                        <p className="text-gray-300 max-w-lg">
                            The team hits the mountain pass at midnight. Pure sound, no filters.
                        </p>
                    </div>
                </div>

                {/* Card 2: About Us (Medium) */}
                <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
                    {/* Placeholder for Image */}
                    <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                        <span className="text-neutral-600 font-bold text-lg uppercase tracking-widest">[ Team Photo ]</span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

                    <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter mb-1">
                            The Team
                        </h3>
                        <p className="text-sm text-gray-300">
                            Learn about our history and philosophy.
                        </p>
                    </div>
                </div>

                {/* Card 3: Shop (Coming Soon) */}
                <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 flex flex-col items-center justify-center text-center p-6">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-black to-black"></div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-white uppercase italic tracking-tighter mb-2 opacity-50">
                            Shop
                        </h3>
                        <span className="inline-block px-4 py-2 border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-[0.2em] backdrop-blur-sm">
                            Coming Soon
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
