"use server";

import { Redis } from '@upstash/redis';
import { revalidatePath } from 'next/cache';

// Initialize Redis. If keys are missing (local dev), this will mock silently or throw depending on how we handle it.
// To avoid crashing if env vars are missing, we use try/catch in the action.
const getRedis = () => {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        return null;
    }
    return new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });
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
        await redis.set('event_title', title);
        await redis.set('event_location', location);
        await redis.set('event_date', date);

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
