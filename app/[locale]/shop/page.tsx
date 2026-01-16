import Header from "@/components/Header";
import FadeIn from "@/components/FadeIn";
import { useTranslations } from 'next-intl';

export default function ShopPage() {
    const t = useTranslations('Shop');

    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white flex flex-col">
            <Header />

            <section className="flex-grow flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <FadeIn className="text-center relative z-10 max-w-lg w-full">
                    {/* Icon / Big Text */}
                    <div className="mb-8 flex justify-center">
                        <div className="text-6xl md:text-8xl text-neutral-800 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-32 h-32 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
                        {t('drop')} <span className="text-red-600">{t('incoming')}</span>
                    </h1>

                    <p className="text-gray-400 text-lg uppercase tracking-widest mb-8 font-light">
                        {t('description')}
                    </p>

                    {/* Newsletter Form */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <input
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            className="flex-grow bg-neutral-900 border border-neutral-800 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-red-600 transition-colors uppercase tracking-widest placeholder:text-neutral-600"
                        />
                        <button className="bg-white text-black font-bold uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-neutral-200 transition-colors">
                            {t('notifyMe')}
                        </button>
                    </div>
                </FadeIn>
            </section>
        </main>
    );
}
