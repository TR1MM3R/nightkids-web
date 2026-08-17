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
    } catch (error) {
        console.error("[BLOB UPLOAD EXCEPTION]", error);
        return { message: "Errore durante il caricamento della foto.", success: false };
    }
}

export async function deleteGalleryPhoto(url: string) {
    try {
        await del(url);
        revalidatePath('/[locale]/admin', 'page');
        return { success: true };
    } catch (error) {
        console.error("[BLOB DELETE EXCEPTION]", error);
        return { success: false };
    }
}

export async function getGalleryPhotos() {
    try {
        // Only fetch blobs with our specific prefix
        const { blobs } = await list({ prefix: 'nightkids/gallery/' });
        return blobs;
    } catch (error) {
        console.error("[BLOB LIST EXCEPTION]", error);
        return [];
    }
}
