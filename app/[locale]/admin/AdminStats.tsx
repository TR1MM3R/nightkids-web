"use client";

import { useState, useTransition } from "react";
import { resetRsvpCount } from "@/app/actions/admin";

export default function AdminStats({
    rsvpCount: initialRsvpCount,
    newsletterCount,
}: {
    rsvpCount: number;
    newsletterCount: number | null;
}) {
    const [rsvpCount, setRsvpCount] = useState(initialRsvpCount);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    const handleReset = () => {
        if (!confirm('Azzerare il contatore "Ci sarò"?')) return;
        startTransition(async () => {
            const result = await resetRsvpCount();
            setMessage(result.message);
            if (result.success) setRsvpCount(0);
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Ci Sarò</p>
                    <p className="text-3xl font-black text-white">{rsvpCount}</p>
                </div>
                <button
                    onClick={handleReset}
                    disabled={isPending}
                    className="text-xs uppercase tracking-widest text-gray-500 hover:text-red-500 font-bold transition-colors disabled:opacity-50"
                >
                    {isPending ? "..." : "Azzera"}
                </button>
            </div>

            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Iscritti Newsletter</p>
                <p className="text-3xl font-black text-white">{newsletterCount === null ? "N/D" : newsletterCount}</p>
            </div>

            {message && <p className="text-xs text-gray-400 sm:col-span-2">{message}</p>}
        </div>
    );
}
