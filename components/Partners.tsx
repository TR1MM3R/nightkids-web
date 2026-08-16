import { useTranslations } from 'next-intl';

export default function Partners() {
    const t = useTranslations('Home.Partners');

    const partners = [
        { name: "Autobox", role: "Official Garage" },
        { name: "Teo Noir Studio", role: "Photography & Media" },
        { name: "[ Partner 3 ]", role: "Sponsor" },
        { name: "[ Partner 4 ]", role: "Apparel" }
    ];

    return (
        <section className="border-t border-white/5 bg-neutral-950 py-20 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-red-900/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">
                        {t('title')}
                    </h2>
                    <p className="text-gray-400 font-light mt-2 uppercase tracking-widest text-sm">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {partners.map((partner, idx) => (
                        <div key={idx} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-neutral-900 hover:border-red-500/30 transition-all duration-300 group">
                            {/* Placeholder for Partner Logo */}
                            <div className="w-20 h-20 mb-4 bg-neutral-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-neutral-600 text-xs uppercase font-bold tracking-widest">Logo</span>
                            </div>
                            <h3 className="text-white font-bold uppercase tracking-wider">{partner.name}</h3>
                            <p className="text-red-500 text-xs uppercase tracking-widest mt-1">{partner.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
