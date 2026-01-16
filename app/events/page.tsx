import Header from "@/components/Header";
import FadeIn from "@/components/FadeIn";

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
            <Header />

            <section className="container mx-auto px-4 py-20 mt-10">
                <FadeIn>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-12 text-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                            Season 2025
                        </span>
                        <span className="text-white ml-4">Archive</span>
                    </h1>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Placeholder Card 1 */}
                    <div className="group relative aspect-video bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-neutral-600 font-bold uppercase tracking-widest">[ Video Placeholder ]</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                            <h3 className="text-xl font-bold uppercase italic">Midnight Run Vol. 3</h3>
                        </div>
                    </div>

                    {/* Placeholder Card 2 */}
                    <div className="group relative aspect-video bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-neutral-600 font-bold uppercase tracking-widest">[ Video Placeholder ]</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                            <h3 className="text-xl font-bold uppercase italic">Drift Practice #04</h3>
                        </div>
                    </div>

                    {/* Placeholder Card 3 */}
                    <div className="group relative aspect-video bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-neutral-600 font-bold uppercase tracking-widest">[ Video Placeholder ]</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                            <h3 className="text-xl font-bold uppercase italic">Touge Battle: Red vs Blue</h3>
                        </div>
                    </div>

                    {/* Placeholder Card 4 */}
                    <div className="group relative aspect-video bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-neutral-600 font-bold uppercase tracking-widest">[ Video Placeholder ]</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                            <h3 className="text-xl font-bold uppercase italic">Behind the Scenes</h3>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
