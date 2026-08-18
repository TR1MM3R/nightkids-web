"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { incrementRsvpCount } from "@/app/actions/admin";

export default function RsvpWidget({
    initialCount,
    eventKey,
}: {
    initialCount: number;
    eventKey: string;
}) {
    const t = useTranslations("Events");
    const storageKey = `nightkids_rsvp_${eventKey}`;
    const [count, setCount] = useState(initialCount);
    const [joined, setJoined] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Un solo "Ci sarò" per evento per visitatore, senza bisogno di login:
    // ricordato in localStorage, non è una dedupe rigorosa ma basta per
    // evitare click ripetuti accidentali.
    useEffect(() => {
        setJoined(typeof window !== "undefined" && localStorage.getItem(storageKey) === "1");
    }, [storageKey]);

    const handleClick = () => {
        if (joined || isPending) return;
        setJoined(true);
        setCount((c) => c + 1);
        localStorage.setItem(storageKey, "1");
        startTransition(async () => {
            await incrementRsvpCount();
        });
    };

    return (
        <div className="flex flex-col gap-1">
            <button
                onClick={handleClick}
                disabled={joined || isPending}
                className={`px-4 py-3 rounded text-sm font-bold uppercase tracking-widest transition-colors ${
                    joined
                        ? "bg-green-600/10 text-green-400 border border-green-600/30 cursor-default"
                        : "bg-white text-black hover:bg-neutral-200"
                }`}
            >
                {joined ? t("rsvpJoined") : t("rsvpCta")}
            </button>
            <span className="text-xs text-gray-500 uppercase tracking-widest text-center">
                {t("rsvpCount", { count })}
            </span>
        </div>
    );
}
