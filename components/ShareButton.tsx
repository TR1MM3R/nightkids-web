"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ShareButton({ title }: { title: string }) {
    const t = useTranslations("Events");
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // Utente ha annullato la condivisione: nessuna azione.
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard non disponibile: nessuna azione.
        }
    };

    return (
        <button
            onClick={handleShare}
            className="block text-center w-full border border-white/20 text-white font-bold uppercase tracking-widest px-6 py-3 rounded hover:bg-white/10 transition-colors"
        >
            {copied ? t("linkCopied") : t("share")}
        </button>
    );
}
