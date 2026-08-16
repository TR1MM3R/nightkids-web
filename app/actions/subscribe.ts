"use server";

export async function subscribeAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
        return { message: "Invalid email address", success: false };
    }

    // In a real application, you would save this email to your database
    // or send it to an external service like Mailchimp or Resend.
    // For now, we simulate a successful API request with a small delay.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`[SUBSCRIPTION SUCCESS] Added email: ${email}`);

    return { message: "Subscription successful!", success: true };
}
