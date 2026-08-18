"use server";

import Redis from 'ioredis';
import { revalidatePath } from 'next/cache';

const getRedis = () => {
    // Check for the specific variable from the screenshot, or standard REDIS_URL
    const redisUrl = process.env.KV_REST_API_REDIS_URL || process.env.REDIS_URL;
    if (!redisUrl) {
        return null;
    }
    return new Redis(redisUrl);
};

export async function saveEventData(prevState: any, formData: FormData) {
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
        await redis.set('nightkids_event_title', title);
        await redis.set('nightkids_event_location', location);
        await redis.set('nightkids_event_date', date);

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

import { put, del, list } from '@vercel/blob';

export async function uploadGalleryPhoto(prevState: any, formData: FormData) {
    const file = formData.get("file") as File;
    
    if (!file || file.size === 0) {
        return { message: "Nessun file selezionato.", success: false };
    }

    try {
        const blob = await put(`nightkids/gallery/${file.name}`, file, {
            access: 'public',
        });
        
        revalidatePath('/[locale]/admin', 'page');
        return { message: "Foto caricata con successo!", success: true, url: blob.url };
    } catch (error: any) {
        console.error("[BLOB UPLOAD EXCEPTION]", error);
        return { message: `Errore: ${error?.message || "sconosciuto"}`, success: false };
    }
}

export async function deleteGalleryPhoto(url: string) {
    try {
        await del(url);
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
    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_partners');
        const list: Partner[] = raw ? JSON.parse(raw) : DEFAULT_PARTNERS;
        list.push({ id: Date.now().toString(), ...partner });
        await redis.set('nightkids_partners', JSON.stringify(list));

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

export async function deletePartner(id: string) {
    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_partners');
        const list: Partner[] = raw ? JSON.parse(raw) : DEFAULT_PARTNERS;
        await redis.set('nightkids_partners', JSON.stringify(list.filter(p => p.id !== id)));

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
    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_past_events');
        const list: PastEvent[] = raw ? JSON.parse(raw) : DEFAULT_PAST_EVENTS;
        // Il più recente in cima all'archivio
        list.unshift({ id: Date.now().toString(), ...event });
        await redis.set('nightkids_past_events', JSON.stringify(list));

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

export async function deletePastEvent(id: string) {
    const redis = getRedis();
    if (!redis) return { success: false, message: "Database non configurato." };

    try {
        const raw = await redis.get('nightkids_past_events');
        const list: PastEvent[] = raw ? JSON.parse(raw) : DEFAULT_PAST_EVENTS;
        await redis.set('nightkids_past_events', JSON.stringify(list.filter(e => e.id !== id)));

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
