import Header from "@/components/Header";
import FadeIn from "@/components/FadeIn";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
            <Header />

            <section className="container mx-auto px-4 py-20 mt-10">
                <FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left: Image Placeholder */}
                        <div className="relative aspect-[3/4] md:aspect-square bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-neutral-600 font-bold text-xl uppercase tracking-widest">[ Team Portrait ]</span>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[50px] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/20 blur-[50px] pointer-events-none"></div>
                        </div>

                        {/* Right: Text Content */}
                        <div className="space-y-8">
                            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
                                Who We <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                                    Are
                                </span>
                            </h1>

                            <div className="space-y-6 text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                                <p>
                                    <strong className="text-white font-bold uppercase racking-wider">Nightkids</strong> was born on the streets, fueled by a passion for speed, precision, and the art of the drift.
                                </p>
                                <p>
                                    We are not just a racing team; we are a collective of creators, mechanics, and drivers united by the underground car culture. From the mountain passes to the digital screen, we bridge the gap between raw automotive performance and high-octane content creation.
                                </p>
                                <p>
                                    Every member brings a unique skill to the table, but we all share the same drive: to push the limits and leave our mark on the asphalt.
                                </p>
                            </div>

                            <div className="pt-4">
                                <div className="inline-block px-6 py-3 border border-red-600 text-red-500 font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer">
                                    Join the Movement
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>
        </main>
    );
}
