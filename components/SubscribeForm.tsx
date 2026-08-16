"use client";

import { useActionState, useEffect } from "react";
import { subscribeAction } from "@/app/actions/subscribe";

export default function SubscribeForm({ 
    emailPlaceholder, 
    notifyMeText 
}: { 
    emailPlaceholder: string; 
    notifyMeText: string;
}) {
    const [state, formAction, isPending] = useActionState(subscribeAction, { message: "", success: false });

    return (
        <form action={formAction} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                    type="email"
                    name="email"
                    required
                    disabled={isPending || state.success}
                    placeholder={emailPlaceholder}
                    className="flex-grow bg-neutral-900 border border-neutral-800 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-red-600 transition-colors uppercase tracking-widest placeholder:text-neutral-600 disabled:opacity-50"
                />
                <button 
                    type="submit" 
                    disabled={isPending || state.success}
                    className="bg-white text-black font-bold uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                >
                    {isPending ? "..." : (state.success ? "✔" : notifyMeText)}
                </button>
            </div>
            {state.message && (
                <p className={`text-sm text-left px-2 ${state.success ? "text-green-500" : "text-red-500"}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}
