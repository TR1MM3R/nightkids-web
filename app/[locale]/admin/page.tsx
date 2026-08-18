import FadeIn from '@/components/FadeIn';
import { getGalleryPhotos, getPartners, getPastEvents } from '@/app/actions/admin';
import AdminForms from './AdminForms';
import PartnersManager from './PartnersManager';
import PastEventsManager from './PastEventsManager';

export default async function AdminDashboard() {
    const [photos, partners, pastEvents] = await Promise.all([
        getGalleryPhotos(),
        getPartners(),
        getPastEvents(),
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Pannello di Controllo</h1>
                    <p className="text-gray-400 font-light text-sm tracking-widest uppercase">Gestisci i contenuti dinamici del sito</p>
                </div>
            </FadeIn>

            <AdminForms initialPhotos={photos} />

            <FadeIn>
                <PartnersManager initialPartners={partners} />
            </FadeIn>

            <FadeIn>
                <PastEventsManager initialEvents={pastEvents} />
            </FadeIn>
        </div>
    );
}
