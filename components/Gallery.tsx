import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Gallery({ photos }: { photos: { url: string }[] }) {
    const t = useTranslations('Home');

    if (!photos || photos.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-20 border-t border-white/10">
            <div className="flex flex-col items-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
                    {t('galleryTitle') || "NightKids Gallery"}
                </h2>
                <div className="w-24 h-1 bg-red-600 mb-6"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group bg-neutral-900 border border-white/10">
                        <Image
                            src={photo.url}
                            alt={`Gallery photo ${i}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-red-500 font-bold uppercase tracking-widest text-xs">
                                NK2.0
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
