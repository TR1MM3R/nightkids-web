"use server";

import Redis from 'ioredis';
import { revalidatePath } from 'next/cache';
import { parseRomeLocalDate } from '@/lib/event-date';
import { notifySubscribersOfNewEvent, getAudienceContacts } from '@/lib/notify-subscribers';
import { requireAdmin } from '@/lib/admin-auth';
import { logAdminAction, getAdminLog as getAdminLogEntries } from '@/lib/admin-log';

const getRedis = () => {
    // Check for the specific variable from the screenshot, or standard REDIS_URL
    const redisUrl = process.env.KV_REST_API_REDIS_URL || process.env.REDIS_URL;
    if (!redisUrl) {
        return null;
    }
    return new Redis(redisUrl);
};

export async function saveEventData(prevState: any, formData: FormData) {
    await requireAdmin();

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;

    const redis = getRedis();

    if (!redis) {
        console.warn("[DEV MODE] Vercel KV non configurato. Dati fittizi salvati (solo log):", { title, location, date });
        // MOCK successful save
        return { message: "Dati salvati (Dev Mode)", success: true };
    }

    try {
        const [prevTitle, prevDate] = await Promise.all([
            redis.get('nightkids_event_title'),
            redis.get('nightkids_event_date'),
        ]);
        const isNewEvent = prevTitle !== title || prevDate !== date;

        await redis.set('nightkids_event_title', title);
        await redis.set('nightkids_event_location', location);
        await redis.set('nightkids_event_date', date);

        if (isNewEvent) {
            // Nuovo evento o data cambiata: azzera il contatore "Ci sarò" e
            // avvisa gli iscritti alla newsletter (entrambe best-effort, non
            // devono far fallire il salvataggio se qualcosa va storto).
            await redis.set('nightkids_event_rsvp_count', '0');

            const dateLabel = date
                ? parseRomeLocalDate(date).toLocaleDateString('it-IT', {
                      timeZone: 'Europe/Rome',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                  })
                : '';
            await notifySubscribersOfNewEvent({ title, dateLabel, location });
            await logAdminAction(`Nuovo raduno impostato: "${title}"`);
        } else {
            await logAdminAction(`Dettagli raduno aggiornati: "${title}"`);
        }

        // Revalidate the home page so the new countdown date shows up instantly
        revalidatePath('/');
        revalidatePath('/[locale]', 'page');
        revalidatePath('/[locale]/events', 'page');

        return { message: "Evento aggiornato con successo sul Cloud!", success: true };
    } catch (error) {
        console.error("[KV EXCEPTION]", error);
        return { message: "Errore durante il salvataggio sul database.", success: false };
    } finally {
        redis.quit();
    }
}

// ---- RSVP ("Ci sarò") ----

export async function getRsvpCount(): Promise<number> {
    const redis = getRedis();
    if (!redis) return 0;

    try {
        const raw = await redis.get('nightkids_event_rsvp_count');
        return raw ? parseInt(raw, 10) : 0;
    } catch (error) {
        console.error("[RSVP COUNT FETCH EXCEPTION]", error);
        return 0;
    } finally {
        redis.quit();
    }
}

export async function incrementRsvpCount(): Promise<{ count: number }> {
    const redis = getRedis();
    if (!redis) return { count: 0 };

    try {
        const count = await redis.incr('nightkids_event_rsvp_count');
        revalidatePath('/[locale]/events', 'page');
        return { count };
    } catch (error) {
        console.error("[RSVP INCREMENT EXCEPTION]", error);
        return { count: 0 };
    } finally {
        redis.quit();
    }
}

export async function resetRsvpCount(): Promise<{ success: boolean; message: string }> {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        await redis.set('nightkids_event_rsvp_count', '0');
        await logAdminAction('Contatore "Ci sarò" azzerato manualmente');
        revalidatePath('/[locale]/events', 'page');
        revalidatePath('/[locale]/admin', 'page');
        return { success: true, message: "Contatore azzerato." };
    } catch (error) {
        console.error("[RSVP RESET EXCEPTION]", error);
        return { success: false, message: "Errore durante l'azzeramento." };
    } finally {
        redis.quit();
    }
}

// ---- Newsletter ----

// Ritorna null se Resend non è configurato o la chiamata fallisce, così la UI
// può mostrare "N/D" invece di 0 (che sembrerebbe "zero iscritti reali").
export async function getNewsletterSubscriberCount(): Promise<number | null> {
    await requireAdmin();

    const contacts = await getAudienceContacts();
    if (contacts === null) return null;
    return contacts.filter((c) => !c.unsubscribed).length;
}

// ---- Changelog admin ----

export async function getAdminLog() {
    await requireAdmin();
    return getAdminLogEntries();
}

import { del, list } from '@vercel/blob';

export async function deleteGalleryPhoto(url: string) {
    await requireAdmin();

    try {
        await del(url);
        await logAdminAction('Foto rimossa dalla galleria');
        revalidatePath('/[locale]/admin', 'page');
        return { success: true, message: "Foto eliminata." };
    } catch (error) {
        console.error("[BLOB DELETE EXCEPTION]", error);
        return { success: false, message: "Errore durante l'eliminazione della foto." };
    }
}

export async function getGalleryPhotos() {
    try {
        const { blobs } = await list({ prefix: 'nightkids/gallery/' });
        return blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function revalidateGallery() {
    await requireAdmin();
    revalidatePath('/', 'layout');
}

// ---- Partners ----

type Partner = { id: string; name: string; role: string; logoUrl: string };

const DEFAULT_PARTNERS: Partner[] = [
    { id: 'autobox', name: 'Autobox', role: 'Official Garage', logoUrl: '' },
    { id: 'teo-noir-studio', name: 'Teo Noir Studio', role: 'Photography & Media', logoUrl: '' },
];

export async function getPartners(): Promise<Partner[]> {
    const redis = getRedis();
    if (!redis) return DEFAULT_PARTNERS;

    try {
        const raw = await redis.get('nightkids_partners');
        return raw ? JSON.parse(raw) : DEFAULT_PARTNERS;
    } catch (error) {
        console.error("[PARTNERS FETCH EXCEPTION]", error);
        return DEFAULT_PARTNERS;
    } finally {
        redis.quit();
    }
}

export async function addPartner(partner: { name: string; role: string; logoUrl: string }) {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_partners');
        const list: Partner[] = raw ? JSON.parse(raw) : DEFAULT_PARTNERS;
        list.push({ id: Date.now().toString(), ...partner });
        await redis.set('nightkids_partners', JSON.stringify(list));

        await logAdminAction(`Partner aggiunto: "${partner.name}"`);
        revalidatePath('/[locale]', 'page');
        revalidatePath('/[locale]/admin', 'page');
        return { success: true, message: "Partner aggiunto." };
    } catch (error) {
        console.error("[PARTNER ADD EXCEPTION]", error);
        return { success: false, message: "Errore durante il salvataggio." };
    } finally {
        redis.quit();
    }
}

export async function updatePartner(id: string, partner: { name: string; role: string; logoUrl: string }) {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_partners');
        const list: Partner[] = raw ? JSON.parse(raw) : DEFAULT_PARTNERS;
        const updated = list.map((p) => (p.id === id ? { ...p, ...partner } : p));
        await redis.set('nightkids_partners', JSON.stringify(updated));

        await logAdminAction(`Partner modificato: "${partner.name}"`);
        revalidatePath('/[locale]', 'page');
        revalidatePath('/[locale]/admin', 'page');
        return { success: true, message: "Partner aggiornato." };
    } catch (error) {
        console.error("[PARTNER UPDATE EXCEPTION]", error);
        return { success: false, message: "Errore durante l'aggiornamento." };
    } finally {
        redis.quit();
    }
}

export async function deletePartner(id: string) {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_partners');
        const list: Partner[] = raw ? JSON.parse(raw) : DEFAULT_PARTNERS;
        const removed = list.find((p) => p.id === id);
        await redis.set('nightkids_partners', JSON.stringify(list.filter(p => p.id !== id)));

        if (removed) await logAdminAction(`Partner rimosso: "${removed.name}"`);
        revalidatePath('/[locale]', 'page');
        revalidatePath('/[locale]/admin', 'page');
        return { success: true, message: "Partner rimosso." };
    } catch (error) {
        console.error("[PARTNER DELETE EXCEPTION]", error);
        return { success: false, message: "Errore durante la rimozione." };
    } finally {
        redis.quit();
    }
}

export async function reorderPartners(orderedIds: string[]) {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_partners');
        const list: Partner[] = raw ? JSON.parse(raw) : DEFAULT_PARTNERS;
        const byId = new Map(list.map((p) => [p.id, p]));
        const reordered = orderedIds.map((id) => byId.get(id)).filter((p): p is Partner => Boolean(p));
        // Eventuali id non presenti nell'ordinamento ricevuto restano in coda,
        // così non si perdono partner per un ordinamento incompleto.
        const missing = list.filter((p) => !orderedIds.includes(p.id));
        await redis.set('nightkids_partners', JSON.stringify([...reordered, ...missing]));

        await logAdminAction('Ordine dei partner aggiornato');
        revalidatePath('/[locale]', 'page');
        return { success: true, message: "Ordine salvato." };
    } catch (error) {
        console.error("[PARTNERS REORDER EXCEPTION]", error);
        return { success: false, message: "Errore durante il salvataggio dell'ordine." };
    } finally {
        redis.quit();
    }
}

// ---- Past Events (Archivio) ----

type PastEvent = { id: string; title: string; thumbnailUrl: string };

const DEFAULT_PAST_EVENTS: PastEvent[] = [
    { id: 'midnight-run-3', title: 'Midnight Run Vol. 3', thumbnailUrl: '' },
    { id: 'drift-practice-4', title: 'Drift Practice #04', thumbnailUrl: '' },
    { id: 'touge-battle', title: 'Touge Battle: Red vs Blue', thumbnailUrl: '' },
    { id: 'behind-scenes', title: 'Dietro le Quinte', thumbnailUrl: '' },
];

export async function getPastEvents(): Promise<PastEvent[]> {
    const redis = getRedis();
    if (!redis) return DEFAULT_PAST_EVENTS;

    try {
        const raw = await redis.get('nightkids_past_events');
        return raw ? JSON.parse(raw) : DEFAULT_PAST_EVENTS;
    } catch (error) {
        console.error("[PAST EVENTS FETCH EXCEPTION]", error);
        return DEFAULT_PAST_EVENTS;
    } finally {
        redis.quit();
    }
}

export async function addPastEvent(event: { title: string; thumbnailUrl: string }) {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_past_events');
        const list: PastEvent[] = raw ? JSON.parse(raw) : DEFAULT_PAST_EVENTS;
        // Il più recente in cima all'archivio
        list.unshift({ id: Date.now().toString(), ...event });
        await redis.set('nightkids_past_events', JSON.stringify(list));

        await logAdminAction(`Evento archiviato: "${event.title}"`);
        revalidatePath('/[locale]/events', 'page');
        revalidatePath('/[locale]/admin', 'page');
        return { success: true, message: "Evento aggiunto all'archivio." };
    } catch (error) {
        console.error("[PAST EVENT ADD EXCEPTION]", error);
        return { success: false, message: "Errore durante il salvataggio." };
    } finally {
        redis.quit();
    }
}

export async function updatePastEvent(id: string, event: { title: string; thumbnailUrl: string }) {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_past_events');
        const list: PastEvent[] = raw ? JSON.parse(raw) : DEFAULT_PAST_EVENTS;
        const updated = list.map((e) => (e.id === id ? { ...e, ...event } : e));
        await redis.set('nightkids_past_events', JSON.stringify(updated));

        await logAdminAction(`Evento archivio modificato: "${event.title}"`);
        revalidatePath('/[locale]/events', 'page');
        revalidatePath('/[locale]/admin', 'page');
        return { success: true, message: "Evento aggiornato." };
    } catch (error) {
        console.error("[PAST EVENT UPDATE EXCEPTION]", error);
        return { success: false, message: "Errore durante l'aggiornamento." };
    } finally {
        redis.quit();
    }
}

export async function deletePastEvent(id: string) {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_past_events');
        const list: PastEvent[] = raw ? JSON.parse(raw) : DEFAULT_PAST_EVENTS;
        const removed = list.find((e) => e.id === id);
        await redis.set('nightkids_past_events', JSON.stringify(list.filter(e => e.id !== id)));

        if (removed) await logAdminAction(`Evento archivio rimosso: "${removed.title}"`);
        revalidatePath('/[locale]/events', 'page');
        revalidatePath('/[locale]/admin', 'page');
        return { success: true, message: "Evento rimosso dall'archivio." };
    } catch (error) {
        console.error("[PAST EVENT DELETE EXCEPTION]", error);
        return { success: false, message: "Errore durante la rimozione." };
    } finally {
        redis.quit();
    }
}

export async function reorderPastEvents(orderedIds: string[]) {
    await requireAdmin();

    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_past_events');
        const list: PastEvent[] = raw ? JSON.parse(raw) : DEFAULT_PAST_EVENTS;
        const byId = new Map(list.map((e) => [e.id, e]));
        const reordered = orderedIds.map((id) => byId.get(id)).filter((e): e is PastEvent => Boolean(e));
        const missing = list.filter((e) => !orderedIds.includes(e.id));
        await redis.set('nightkids_past_events', JSON.stringify([...reordered, ...missing]));

        await logAdminAction("Ordine dell'archivio eventi aggiornato");
        revalidatePath('/[locale]/events', 'page');
        return { success: true, message: "Ordine salvato." };
    } catch (error) {
        console.error("[PAST EVENTS REORDER EXCEPTION]", error);
        return { success: false, message: "Errore durante il salvataggio dell'ordine." };
    } finally {
        redis.quit();
    }
}
