import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
    const t = await getTranslations('Footer');

    return (
        <footer className="border-t border-white/10 bg-neutral-950 pt-16 pb-8 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                            Night<span className="text-red-600">Kids</span>
                        </h2>
                        <p className="text-gray-400 font-light tracking-widest uppercase text-sm max-w-sm">
                            ᴛᴏ ᴛʜᴇ ʜɪʟʟs ᴀɴᴅ ʙᴀᴄᴋ. <br/>
                            {t('tagline')}
                        </p>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest mb-4">{t('social')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://www.instagram.com/nightkids2.0/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider text-sm">
                                    Instagram
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest mb-4">{t('contact')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="mailto:info.nightkids2.0@gmail.com" className="text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider text-sm">
                                    info.nightkids2.0@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-neutral-600 text-xs uppercase tracking-widest">
                        © {new Date().getFullYear()} Nightkids 2.0. {t('rights')}
                    </p>
                    <p className="text-neutral-600 text-xs uppercase tracking-widest">
                        No Lives Matter • Mount Akina • Red Suns
                    </p>
                </div>
            </div>
        </footer>
    );
}
