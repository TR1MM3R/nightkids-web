import type { Metadata } from "next";
import Header from "@/components/Header";
import BentoGrid from "@/components/BentoGrid";
import FadeIn from "@/components/FadeIn";
import ParallaxText from "@/components/ParallaxText";
import InstagramFeed from "@/components/InstagramFeed";
import Partners from "@/components/Partners";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import { getTranslations } from 'next-intl/server';
import Redis from 'ioredis';
import { getGalleryPhotos, getPartners } from "@/app/actions/admin";
import { parseRomeLocalDate } from "@/lib/event-date";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Home' });
  return { title: t('title'), description: t('description') };
}

const getRedis = () => {
    const redisUrl = process.env.KV_REST_API_REDIS_URL || process.env.REDIS_URL;
    if (!redisUrl) return null;
    return new Redis(redisUrl);
};

export default async function Home() {
  const t = await getTranslations('Home');
  const redis = getRedis();

  let targetDateStr = parseRomeLocalDate("2026-08-28T22:00:00").toISOString();
  let locationStr = "Porte di Moncalieri, Torino";
  let titleStr = "Midnight Run";
  
  let photos: any[] = [];

  if (redis) {
      try {
          const fetchedDate = await redis.get('nightkids_event_date');
          const fetchedLoc = await redis.get('nightkids_event_location');
          const fetchedTitle = await redis.get('nightkids_event_title');

          // La data salvata dall'admin è "locale" (ora di Roma, senza fuso):
          // convertita subito in un istante UTC assoluto, così il countdown
          // è corretto per qualunque visitatore, non solo per chi è in Italia.
          if (fetchedDate) targetDateStr = parseRomeLocalDate(fetchedDate).toISOString();
          if (fetchedLoc) locationStr = fetchedLoc;
          if (fetchedTitle) titleStr = fetchedTitle;
      } catch (e) {
          console.error("Failed to fetch from Redis", e);
      } finally {
          redis.quit();
      }
  }

  try {
      photos = await getGalleryPhotos();
  } catch (e) {
      console.error("Failed to fetch gallery photos", e);
  }

  const partners = await getPartners();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Header />

      {/* Temporary Hero Section for visualization */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Abstract Background Gradient to show off Glassmorphism */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-red-900/20 z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                Night
              </span>
              <span className="text-white">Kids</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto uppercase tracking-widest font-light">
              {t('Hero.subtitle')}
            </p>
          </FadeIn>
        </div>
      </section>

      <ParallaxText baseVelocity={-5}>NIGHTKIDS • TOUGE • STREET RACING • DRIFT • CAR CULTURE •</ParallaxText>
      <ParallaxText baseVelocity={5}>NO LIVES MATTER • MOUNT AKINA • RED SUNS •</ParallaxText>

      <FadeIn delay={0.3}>
        <BentoGrid />
      </FadeIn>

      <Countdown 
          targetDateStr={targetDateStr}
          locationStr={locationStr}
          titleStr={titleStr}
      />

      <FadeIn delay={0.2}>
        <Gallery photos={photos} />
      </FadeIn>

      <FadeIn delay={0.2}>
        <InstagramFeed />
      </FadeIn>

      <FadeIn delay={0.2}>
        <Partners partners={partners} />
      </FadeIn>
    </main>
  );
}
