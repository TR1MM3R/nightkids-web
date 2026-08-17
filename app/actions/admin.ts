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
