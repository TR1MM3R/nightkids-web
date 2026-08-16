import Header from "@/components/Header";
import BentoGrid from "@/components/BentoGrid";
import FadeIn from "@/components/FadeIn";
import ParallaxText from "@/components/ParallaxText";
import InstagramFeed from "@/components/InstagramFeed";
import Partners from "@/components/Partners";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Home');

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

      <FadeIn delay={0.2}>
        <InstagramFeed />
      </FadeIn>

      <FadeIn delay={0.2}>
        <Partners />
      </FadeIn>
    </main>
  );
}
