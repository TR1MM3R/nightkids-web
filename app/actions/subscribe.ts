"use server";

export async function subscribeAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
        return { message: "Invalid email address", success: false };
    }

    // If environment variables are missing, fallback to console (useful for local dev without keys)
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`[DEV MODE] Newsletter fallback: ${email}`);
        return { message: "Subscription successful (Dev Mode)", success: true };
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
            return { message: "Error saving subscription", success: false };
        }

        return { message: "Subscription successful!", success: true };
    } catch (error) {
        console.error("[SUBSCRIPTION EXCEPTION]", error);
        return { message: "Internal server error", success: false };
    }
}
