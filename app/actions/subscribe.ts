"use server";

const MESSAGES = {
    it: {
        invalidEmail: "Indirizzo email non valido",
        successDev: "Iscrizione avvenuta con successo (Dev Mode)",
        success: "Iscrizione avvenuta con successo!",
        errorSaving: "Errore nel salvataggio dell'iscrizione",
        internalError: "Errore interno del server",
    },
    en: {
        invalidEmail: "Invalid email address",
        successDev: "Subscription successful (Dev Mode)",
        success: "Subscription successful!",
        errorSaving: "Error saving subscription",
        internalError: "Internal server error",
    },
} as const;

export async function subscribeAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const locale = formData.get("locale") === "it" ? "it" : "en";
    const m = MESSAGES[locale];

    if (!email || !email.includes("@")) {
        return { message: m.invalidEmail, success: false };
    }

    // If environment variables are missing, fallback to console (useful for local dev without keys)
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`[DEV MODE] Newsletter fallback: ${email}`);
        return { message: m.successDev, success: true };
    }

    try {
        const res = await fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                unsubscribed: false
            })
        });

        if (!res.ok) {
            console.error("[RESEND ERROR]", await res.text());
            return { message: m.errorSaving, success: false };
        }

        return { message: m.success, success: true };
    } catch (error) {
        console.error("[SUBSCRIPTION EXCEPTION]", error);
        return { message: m.internalError, success: false };
    }
}
