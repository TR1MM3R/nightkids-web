"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { addPastEvent, updatePastEvent, deletePastEvent, reorderPastEvents } from "@/app/actions/admin";
import { useImageUpload } from "@/lib/useImageUpload";

type PastEvent = { id: string; title: string; thumbnailUrl: string };

function PastEventRow({
    event,
    onEdit,
    onDelete,
    deleting,
}: {
    event: PastEvent;
    onEdit: (e: PastEvent) => void;
    onDelete: (id: string) => void;
    deleting: boolean;
}) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={event}
            id={event.id}
            dragListener={false}
            dragControls={controls}
            className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-3"
        >
            <div className="flex items-center gap-3">
                <div
                    onPointerDown={(e) => controls.start(e)}
                    className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 touch-none select-none px-1"
                    title="Trascina per riordinare"
                >
                    ⠿
                </div>
                {event.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={event.thumbnailUrl} alt={event.title} className="w-16 h-10 rounded-lg object-cover bg-neutral-800" />
                ) : (
                    <div className="w-16 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-[9px] text-neutral-600 font-bold uppercase text-center px-1">No thumb</div>
                )}
                <p className="text-white font-bold text-sm">{event.title}</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onEdit(event)}
                    className="text-xs text-gray-500 hover:text-white uppercase tracking-widest font-bold transition-colors"
                >
                    Modifica
                </button>
                <button
                    onClick={() => onDelete(event.id)}
                    disabled={deleting}
                    className="text-xs text-gray-500 hover:text-red-500 uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
                >
                    {deleting ? "..." : "Rimuovi"}
                </button>
            </div>
        </Reorder.Item>
    );
}

export default function PastEventsManager({ initialEvents }: { initialEvents: PastEvent[] }) {
    const [events, setEvents] = useState(initialEvents);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [existingThumbUrl, setExistingThumbUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", success: false });
    const [deletingIds, setDeletingIds] = useState<string[]>([]);
    const [orderDirty, setOrderDirty] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const { uploadFile, isUploading, progress } = useImageUpload("nightkids/events");

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setThumbFile(null);
        setExistingThumbUrl("");
        const fileInput = document.getElementById("pastEventThumbInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const startEdit = (ev: PastEvent) => {
        setEditingId(ev.id);
        setTitle(ev.title);
        setExistingThumbUrl(ev.thumbnailUrl);
        setThumbFile(null);
        setMessage({ text: "", success: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title) return;

        setIsSaving(true);
        setMessage({ text: "", success: false });

        try {
            const thumbnailUrl = thumbFile ? await uploadFile(thumbFile) : existingThumbUrl;

            if (editingId) {
                const result = await updatePastEvent(editingId, { title, thumbnailUrl });
                if (result.success) {
                    setEvents((prev) => prev.map((ev) => (ev.id === editingId ? { ...ev, title, thumbnailUrl } : ev)));
                    resetForm();
                }
                setMessage({ text: result.message, success: result.success });
            } else {
                const result = await addPastEvent({ title, thumbnailUrl });
                if (result.success) {
                    setEvents((prev) => [{ id: Date.now().toString(), title, thumbnailUrl }, ...prev]);
                    resetForm();
                }
                setMessage({ text: result.message, success: result.success });
            }
        } catch (error: any) {
            setMessage({ text: `Errore: ${error?.message || "sconosciuto"}`, success: false });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Rimuovere questo evento dall'archivio?")) return;

        setDeletingIds((prev) => [...prev, id]);
        const result = await deletePastEvent(id);
        if (result.success) {
            setEvents((prev) => prev.filter((ev) => ev.id !== id));
            if (editingId === id) resetForm();
        }
        setDeletingIds((prev) => prev.filter((i) => i !== id));
    };

    const handleReorder = (newOrder: PastEvent[]) => {
        setEvents(newOrder);
        setOrderDirty(true);
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        const result = await reorderPastEvents(events.map((ev) => ev.id));
        if (result.success) setOrderDirty(false);
        setMessage({ text: result.message, success: result.success });
        setIsSavingOrder(false);
    };

    const isBusy = isSaving || isUploading;

    return (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Archivio Eventi</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                {editingId && (
                    <p className="text-xs text-red-500 uppercase tracking-widest font-bold">Modifica evento</p>
                )}
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
                        {isUploading ? `CARICAMENTO ${progress}%` : isSaving ? "..." : editingId ? "Salva Modifiche" : "Aggiungi"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={isBusy}
                            className="w-full sm:w-auto px-6 py-3 border border-white/20 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 text-sm"
                        >
                            Annulla
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500">
                    {editingId
                        ? "Lascia il campo file vuoto per mantenere la thumbnail attuale."
                        : "La thumbnail è opzionale: senza, verrà mostrato un placeholder. Il nuovo evento va in cima all'archivio."}
                </p>
                {message.text && (
                    <p className={`text-sm ${message.success ? "text-green-500" : "text-red-500"}`}>{message.text}</p>
                )}
            </form>

            {events.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nessun evento in archivio.</p>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500">Trascina l&apos;icona ⠿ per riordinare.</p>
                        {orderDirty && (
                            <button
                                onClick={handleSaveOrder}
                                disabled={isSavingOrder}
                                className="text-xs bg-white text-black font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {isSavingOrder ? "Salvataggio..." : "Salva Ordine"}
                            </button>
                        )}
                    </div>
                    <Reorder.Group as="div" axis="y" values={events} onReorder={handleReorder} className="space-y-2">
                        {events.map((ev) => (
                            <PastEventRow
                                key={ev.id}
                                event={ev}
                                onEdit={startEdit}
                                onDelete={handleDelete}
                                deleting={deletingIds.includes(ev.id)}
                            />
                        ))}
                    </Reorder.Group>
                </>
            )}
        </div>
    );
}
