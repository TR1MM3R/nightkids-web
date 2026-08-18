import FadeIn from '@/components/FadeIn';
import {
    getGalleryPhotos,
    getPartners,
    getPastEvents,
    getRsvpCount,
    getNewsletterSubscriberCount,
    getAdminLog,
} from '@/app/actions/admin';
import AdminForms from './AdminForms';
import AdminStats from './AdminStats';
import AdminLog from './AdminLog';
import PartnersManager from './PartnersManager';
import PastEventsManager from './PastEventsManager';

export default async function AdminDashboard() {
    const [photos, partners, pastEvents, rsvpCount, newsletterCount, adminLog] = await Promise.all([
        getGalleryPhotos(),
        getPartners(),
        getPastEvents(),
        getRsvpCount(),
        getNewsletterSubscriberCount(),
        getAdminLog(),
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Pannello di Controllo</h1>
                    <p className="text-gray-400 font-light text-sm tracking-widest uppercase">Gestisci i contenuti dinamici del sito</p>
                </div>
            </FadeIn>

            <FadeIn delay={0.05}>
                <AdminStats rsvpCount={rsvpCount} newsletterCount={newsletterCount} />
            </FadeIn>

            <AdminForms initialPhotos={photos} />

            <FadeIn>
                <PartnersManager initialPartners={partners} />
            </FadeIn>

            <FadeIn>
                <PastEventsManager initialEvents={pastEvents} />
            </FadeIn>

            <FadeIn>
                <AdminLog entries={adminLog} />
            </FadeIn>
        </div>
    );
}
