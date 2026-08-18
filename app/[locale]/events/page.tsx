import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import FadeIn from "@/components/FadeIn";
import { getTranslations } from 'next-intl/server';
import { getPastEvents, getRsvpCount } from "@/app/actions/admin";
import Redis from 'ioredis';
import { LOCALES } from "@/lib/site-config";
import { parseRomeLocalDate, toGoogleCalendarUTC } from "@/lib/event-date";
import RsvpWidget from "@/components/RsvpWidget";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Events' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/events`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/events`])),
    },
  };
}

const getRedis = () => {
    const redisUrl = process.env.KV_REST_API_REDIS_URL || process.env.REDIS_URL;
    if (!redisUrl) return null;
    return new Redis(redisUrl);
};

export default async function EventsPage() {
    const t = await getTranslations('Events');
    const redis = getRedis();
    const pastEvents = await getPastEvents();
    const rsvpCount = await getRsvpCount();

    let targetDateStr = t('upcomingMeetDate'); // fallback
    let locationStr = t('upcomingMeetLocation'); // fallback
    let titleStr = t('upcomingMeetTitle'); // fallback
    // Usati per lo schema.org JSON-LD sotto: devono restare in sync con l'evento impostato dall'admin
    let startDateISO = "2026-08-28T22:00:00+02:00";
    let endDateISO = "2026-08-29T02:00:00+02:00";

    if (redis) {
        try {
            const fetchedDate = await redis.get('nightkids_event_date');
            const fetchedLoc = await redis.get('nightkids_event_location');
            const fetchedTitle = await redis.get('nightkids_event_title');

            if (fetchedDate) {
                // La data salvata dall'admin è "locale" (ora di Roma, senza fuso):
                // va interpretata sempre come Europe/Rome, non con il fuso del
                // server o del browser, altrimenti JSON-LD e countdown sfasano.
                const d = parseRomeLocalDate(fetchedDate);
                targetDateStr = d.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome' }) + ' ' + d.toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit' });
                startDateISO = d.toISOString();
                endDateISO = new Date(d.getTime() + 4 * 60 * 60 * 1000).toISOString();
            }
            if (fetchedLoc) locationStr = fetchedLoc;
            if (fetchedTitle) titleStr = fetchedTitle;
        } catch (e) {
            console.error("Failed to fetch from Redis", e);
        } finally {
            redis.quit();
        }
    }

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titleStr)}&dates=${toGoogleCalendarUTC(new Date(startDateISO))}/${toGoogleCalendarUTC(new Date(endDateISO))}&details=${encodeURIComponent(t('upcomingMeetDesc'))}&location=${encodeURIComponent(locationStr)}`;
    const rsvpEventKey = `${titleStr}::${startDateISO}`;

    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
            <Header />

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Event",
                        "name": titleStr,
                        "startDate": startDateISO,
                        "endDate": endDateISO,
                        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                        "eventStatus": "https://schema.org/EventScheduled",
                        "location": {
                            "@type": "Place",
                            "name": locationStr,
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Torino",
                                "addressCountry": "IT"
                            }
                        },
                        "image": [
                            "https://www.instagram.com/nightkids2.0/profilepic"
                        ],
                        "description": t('upcomingMeetDesc'),
                        "organizer": {
                            "@type": "Organization",
                            "name": "NightKids 2.0",
                            "url": "https://www.instagram.com/nightkids2.0/"
                        }
                    })
                }}
            />

            <section className="container mx-auto px-4 py-20 mt-10">
                <FadeIn>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-12 text-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                            {t('titleSeason')}
                        </span>
                        <span className="text-white ml-4">{t('titleArchive')}</span>
                    </h1>
                </FadeIn>
                <div className="mb-20">
                    <FadeIn delay={0.2}>
                        <div className="relative rounded-3xl overflow-hidden border border-red-900/50 bg-neutral-900/50 backdrop-blur-sm p-8 md:p-12">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] pointer-events-none"></div>
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
                                <div className="space-y-4 flex-1">
                                    <span className="inline-block px-3 py-1 text-xs font-bold text-red-500 bg-red-500/10 rounded-full uppercase tracking-wider border border-red-500/20">
                                        {t('upcomingMeet')}
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                                        {titleStr}
                                    </h2>
                                    <p className="text-gray-400 font-light text-lg">
                                        {t('upcomingMeetDesc')}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 flex flex-col gap-4 text-left w-full md:w-auto bg-black/40 p-6 rounded-2xl border border-white/5">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('when')}</p>
                                        <p className="font-bold text-white uppercase">{targetDateStr}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('where')}</p>
                                        <p className="font-bold text-white uppercase">{locationStr}</p>
                                    </div>

                                    <RsvpWidget initialCount={rsvpCount} eventKey={rsvpEventKey} />

                                    <a href="https://www.instagram.com/nightkids2.0/" target="_blank" rel="noopener noreferrer" className="mt-2 block text-center w-full bg-red-600 text-white font-bold uppercase tracking-widest px-6 py-3 rounded hover:bg-red-700 transition-colors">
                                        {t('infoIg')}
                                    </a>
                                    <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="block text-center w-full border border-white/20 text-white font-bold uppercase tracking-widest px-6 py-3 rounded hover:bg-white/10 transition-colors">
                                        {t('addToCalendar')}
                                    </a>
                                </div>
                            </div>

                            <div className="mt-8 relative z-10 rounded-2xl overflow-hidden border border-white/10 h-64">
                                <iframe
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(locationStr)}&output=embed`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={t('mapTitle')}
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {pastEvents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pastEvents.map((ev) => (
                            <div key={ev.id} className="group relative aspect-video bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors">
                                {ev.thumbnailUrl ? (
                                    <Image
                                        src={ev.thumbnailUrl}
                                        alt={ev.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-neutral-600 font-bold uppercase tracking-widest">{t('videoPlaceholder')}</span>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                                    <h3 className="text-xl font-bold uppercase italic">{ev.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
