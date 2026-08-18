"use client";

import { useState } from "react";
import { addPastEvent, deletePastEvent } from "@/app/actions/admin";
import { useImageUpload } from "@/lib/useImageUpload";

type PastEvent = { id: string; title: string; thumbnailUrl: string };

export default function PastEventsManager({ initialEvents }: { initialEvents: PastEvent[] }) {
    const [events, setEvents] = useState(initialEvents);
    const [title, setTitle] = useState("");
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", success: false });
    const [deletingIds, setDeletingIds] = useState<string[]>([]);

    const { uploadFile, isUploading, progress } = useImageUpload("nightkids/events");

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title) return;

        setIsSaving(true);
        setMessage({ text: "", success: false });

        try {
            const thumbnailUrl = thumbFile ? await uploadFile(thumbFile) : "";
            const result = await addPastEvent({ title, thumbnailUrl });

            if (result.success) {
                setEvents(prev => [{ id: Date.now().toString(), title, thumbnailUrl }, ...prev]);
                setTitle("");
                setThumbFile(null);
                const fileInput = document.getElementById("pastEventThumbInput") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            }
            setMessage({ text: result.message, success: result.success });
        } catch (error: any) {
            setMessage({ text: `Errore: ${error?.message || "sconosciuto"}`, success: false });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Rimuovere questo evento dall'archivio?")) return;

        setDeletingIds(prev => [...prev, id]);
        const result = await deletePastEvent(id);
        if (result.success) {
            setEvents(prev => prev.filter(ev => ev.id !== id));
        }
        setDeletingIds(prev => prev.filter(i => i !== id));
    };

    const isBusy = isSaving || isUploading;

    return (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Archivio Eventi</h2>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 mb-8">
                <input
                    type="text"
                    placeholder="Titolo (es: Midnight Run Vol. 5)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isBusy}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                />
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                        type="file"
                        id="pastEventThumbInput"
                        accept="image/*"
                        onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                        disabled={isBusy}
                        className="flex-1 w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-gray-200 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isBusy}
                        className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50 text-sm whitespace-nowrap min-w-[140px]"
                    >
                        {isUploading ? `CARICAMENTO ${progress}%` : isSaving ? "..." : "Aggiungi"}
                    </button>
                </div>
                <p className="text-xs text-gray-500">La thumbnail è opzionale: senza, verrà mostrato un placeholder. Il nuovo evento va in cima all&apos;archivio.</p>
                {message.text && (
                    <p className={`text-sm ${message.success ? "text-green-500" : "text-red-500"}`}>{message.text}</p>
                )}
            </form>

            <div className="space-y-2">
                {events.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Nessun evento in archivio.</p>
                ) : (
                    events.map((ev) => (
                        <div key={ev.id} className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                {ev.thumbnailUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={ev.thumbnailUrl} alt={ev.title} className="w-16 h-10 rounded-lg object-cover bg-neutral-800" />
                                ) : (
                                    <div className="w-16 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-[9px] text-neutral-600 font-bold uppercase text-center px-1">No thumb</div>
                                )}
                                <p className="text-white font-bold text-sm">{ev.title}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(ev.id)}
                                disabled={deletingIds.includes(ev.id)}
                                className="text-xs text-gray-500 hover:text-red-500 uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
                            >
                                {deletingIds.includes(ev.id) ? "..." : "Rimuovi"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
