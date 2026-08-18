import Image from 'next/image';
import { useTranslations } from 'next-intl';

type Partner = { id: string; name: string; role: string; logoUrl: string };

export default function Partners({ partners }: { partners: Partner[] }) {
    const t = useTranslations('Home.Partners');

    if (!partners || partners.length === 0) return null;

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
                    {partners.map((partner) => (
                        <div key={partner.id} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-neutral-900 hover:border-red-500/30 transition-all duration-300 group">
                            <div className="relative w-20 h-20 mb-4 bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                {partner.logoUrl ? (
                                    <Image src={partner.logoUrl} alt={partner.name} fill className="object-cover" sizes="80px" />
                                ) : (
                                    <span className="text-neutral-600 text-xs uppercase font-bold tracking-widest">Logo</span>
                                )}
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
