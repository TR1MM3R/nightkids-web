import { useTranslations } from 'next-intl';

export default function InstagramFeed() {
    const t = useTranslations('Home.Instagram');

    return (
        <section className="container mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                        {t('title')}
                    </h2>
                    <p className="text-gray-400 font-light mt-2 uppercase tracking-widest text-sm">
                        {t('subtitle')}
                    </p>
                </div>
                <a
                    href="https://www.instagram.com/nightkids2.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(219,39,119,0.3)]"
                >
                    {t('followBtn')}
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <a
                        key={item}
                        href="https://www.instagram.com/nightkids2.0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square bg-neutral-900 overflow-hidden rounded-xl block border border-white/5 hover:border-pink-500/50 transition-colors"
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 group-hover:scale-110 transition-transform duration-700">
                            <span className="text-neutral-600 font-bold text-xs uppercase tracking-widest">{t('photoPlaceholder')} {item}</span>
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-8 h-8">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
