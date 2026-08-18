import { SITE_URL } from "@/lib/site-config";

type ResendContact = { email: string; unsubscribed: boolean };

// Legge i contatti dell'audience Resend. Ritorna null se Resend non è
// configurato o la chiamata fallisce (chi chiama decide il fallback).
export async function getAudienceContacts(): Promise<ResendContact[] | null> {
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!apiKey || !audienceId) return null;

    try {
        const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!res.ok) {
            console.error("[RESEND CONTACTS] Impossibile leggere i contatti:", await res.text());
            return null;
        }
        const { data } = await res.json();
        return data || [];
    } catch (error) {
        console.error("[RESEND CONTACTS EXCEPTION]", error);
        return null;
    }
}

// Avvisa via email gli iscritti alla newsletter (audience Resend) quando
// l'admin imposta un nuovo raduno o cambia data. Best-effort: logga e si
// ferma su qualunque errore, non deve mai far fallire il salvataggio
// dell'evento lato pannello admin.
export async function notifySubscribersOfNewEvent(params: {
    title: string;
    dateLabel: string;
    location: string;
}) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !process.env.RESEND_AUDIENCE_ID) {
        console.log("[NOTIFY SUBSCRIBERS] Resend non configurato, notifica saltata.");
        return;
    }
    if (!fromEmail) {
        console.warn(
            "[NOTIFY SUBSCRIBERS] RESEND_FROM_EMAIL non impostata (serve un dominio verificato su Resend) — notifica saltata."
        );
        return;
    }

    try {
        const contacts = await getAudienceContacts();
        if (contacts === null) {
            console.error("[NOTIFY SUBSCRIBERS] Impossibile leggere i contatti Resend.");
            return;
        }

        const recipients: string[] = contacts.filter((c) => !c.unsubscribed && c.email).map((c) => c.email);

        if (recipients.length === 0) {
            console.log("[NOTIFY SUBSCRIBERS] Nessun iscritto da notificare.");
            return;
        }

        // Il batch endpoint di Resend accetta al massimo 100 email per richiesta.
        const batch = recipients.slice(0, 100);
        if (recipients.length > batch.length) {
            console.warn(`[NOTIFY SUBSCRIBERS] ${recipients.length} iscritti, notificati solo i primi ${batch.length}.`);
        }

        const subject = `Nuovo raduno NightKids: ${params.title}`;
        const html = `
            <div style="font-family: sans-serif; background:#000; color:#fff; padding:24px;">
                <h1 style="color:#dc2626; text-transform:uppercase; margin-bottom:16px;">${params.title}</h1>
                <p><strong>Quando:</strong> ${params.dateLabel}</p>
                <p><strong>Dove:</strong> ${params.location}</p>
                <p style="margin-top:24px;"><a href="${SITE_URL}/it/events" style="color:#fff;">Tutti i dettagli sul sito →</a></p>
            </div>
        `;

        const res = await fetch("https://api.resend.com/emails/batch", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(batch.map((to) => ({ from: fromEmail, to: [to], subject, html }))),
        });

        if (!res.ok) {
            console.error("[NOTIFY SUBSCRIBERS] Invio batch fallito:", await res.text());
            return;
        }

        console.log(`[NOTIFY SUBSCRIBERS] Notificati ${batch.length} iscritti per l'evento "${params.title}".`);
    } catch (error) {
        console.error("[NOTIFY SUBSCRIBERS EXCEPTION]", error);
    }
}
