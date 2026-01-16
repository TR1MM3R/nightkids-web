import Header from "@/components/Header";
import FadeIn from "@/components/FadeIn";
import { useTranslations } from 'next-intl';

export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
            <Header />

            <section className="container mx-auto px-4 py-20 mt-10">
                <FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left: Image Placeholder */}
                        <div className="relative aspect-[3/4] md:aspect-square bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-neutral-600 font-bold text-xl uppercase tracking-widest">{t('photoPlaceholder')}</span>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[50px] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/20 blur-[50px] pointer-events-none"></div>
                        </div>

                        {/* Right: Text Content */}
                        <div className="space-y-8">
                            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
                                {t('whoWe')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                                    {t('are')}
                                </span>
                            </h1>

                            <div className="space-y-6 text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                                <p dangerouslySetInnerHTML={{ __html: t.raw('p1') }} />
                                <p>
                                    {t('p2')}
                                </p>
                                <p>
                                    {t('p3')}
                                </p>
                            </div>

                            <div className="pt-4">
                                <div className="inline-block px-6 py-3 border border-red-600 text-red-500 font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer">
                                    {t('cta')}
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>
        </main>
    );
}
