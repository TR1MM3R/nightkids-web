import type { Metadata } from "next";
import Header from "@/components/Header";
import FadeIn from "@/components/FadeIn";
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { LOCALES } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Rules' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/rules`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/rules`])),
    },
  };
}

export default function RulesPage() {
    const t = useTranslations('Rules');
    const items = t.raw('items') as string[];

    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
            <Header />

            <section className="container mx-auto px-4 py-20 mt-10 max-w-3xl">
                <FadeIn>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                            {t('title')}
                        </span>
                    </h1>
                    <p className="text-gray-400 text-center mb-12 font-light text-lg">
                        {t('subtitle')}
                    </p>

                    <ul className="space-y-4 mb-12">
                        {items.map((item, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-4 bg-neutral-900/50 border border-white/5 rounded-xl p-5"
                            >
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </span>
                                <span className="text-gray-300 font-light">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="text-sm text-gray-500 uppercase tracking-widest text-center border-t border-white/10 pt-8">
                        {t('footer')}
                    </p>
                </FadeIn>
            </section>
        </main>
    );
}
