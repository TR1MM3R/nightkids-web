"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { addPartner, updatePartner, deletePartner, reorderPartners } from "@/app/actions/admin";
import { useImageUpload } from "@/lib/useImageUpload";

type Partner = { id: string; name: string; role: string; logoUrl: string };

function PartnerRow({
    partner,
    onEdit,
    onDelete,
    deleting,
}: {
    partner: Partner;
    onEdit: (p: Partner) => void;
    onDelete: (id: string) => void;
    deleting: boolean;
}) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={partner}
            id={partner.id}
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
                {partner.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={partner.logoUrl} alt={partner.name} className="w-10 h-10 rounded-full object-cover bg-neutral-800" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-600 font-bold uppercase">Logo</div>
                )}
                <div>
                    <p className="text-white font-bold text-sm">{partner.name}</p>
                    <p className="text-red-500 text-xs uppercase tracking-widest">{partner.role}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onEdit(partner)}
                    className="text-xs text-gray-500 hover:text-white uppercase tracking-widest font-bold transition-colors"
                >
                    Modifica
                </button>
                <button
                    onClick={() => onDelete(partner.id)}
                    disabled={deleting}
                    className="text-xs text-gray-500 hover:text-red-500 uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
                >
                    {deleting ? "..." : "Rimuovi"}
                </button>
            </div>
        </Reorder.Item>
    );
}

export default function PartnersManager({ initialPartners }: { initialPartners: Partner[] }) {
    const [partners, setPartners] = useState(initialPartners);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [existingLogoUrl, setExistingLogoUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", success: false });
    const [deletingIds, setDeletingIds] = useState<string[]>([]);
    const [orderDirty, setOrderDirty] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const { uploadFile, isUploading, progress } = useImageUpload("nightkids/partners");

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setRole("");
        setLogoFile(null);
        setExistingLogoUrl("");
        const fileInput = document.getElementById("partnerLogoInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const startEdit = (p: Partner) => {
        setEditingId(p.id);
        setName(p.name);
        setRole(p.role);
        setExistingLogoUrl(p.logoUrl);
        setLogoFile(null);
        setMessage({ text: "", success: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !role) return;

        setIsSaving(true);
        setMessage({ text: "", success: false });

        try {
            const logoUrl = logoFile ? await uploadFile(logoFile) : existingLogoUrl;

            if (editingId) {
                const result = await updatePartner(editingId, { name, role, logoUrl });
                if (result.success) {
                    setPartners((prev) => prev.map((p) => (p.id === editingId ? { ...p, name, role, logoUrl } : p)));
                    resetForm();
                }
                setMessage({ text: result.message, success: result.success });
            } else {
                const result = await addPartner({ name, role, logoUrl });
                if (result.success) {
                    setPartners((prev) => [...prev, { id: Date.now().toString(), name, role, logoUrl }]);
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
        if (!confirm("Rimuovere questo partner?")) return;

        setDeletingIds((prev) => [...prev, id]);
        const result = await deletePartner(id);
        if (result.success) {
            setPartners((prev) => prev.filter((p) => p.id !== id));
            if (editingId === id) resetForm();
        }
        setDeletingIds((prev) => prev.filter((i) => i !== id));
    };

    const handleReorder = (newOrder: Partner[]) => {
        setPartners(newOrder);
        setOrderDirty(true);
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        const result = await reorderPartners(partners.map((p) => p.id));
        if (result.success) setOrderDirty(false);
        setMessage({ text: result.message, success: result.success });
        setIsSavingOrder(false);
    };

    const isBusy = isSaving || isUploading;

    return (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Partners</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                {editingId && (
                    <p className="text-xs text-red-500 uppercase tracking-widest font-bold">Modifica partner</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nome (es: Autobox)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isBusy}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                    />
                    <input
                        type="text"
                        placeholder="Ruolo (es: Official Garage)"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        disabled={isBusy}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                        type="file"
                        id="partnerLogoInput"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
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
                        ? "Lascia il campo file vuoto per mantenere il logo attuale."
                        : 'Il logo è opzionale: senza, verrà mostrato un placeholder "LOGO".'}
                </p>
                {message.text && (
                    <p className={`text-sm ${message.success ? "text-green-500" : "text-red-500"}`}>{message.text}</p>
                )}
            </form>

            {partners.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nessun partner ancora.</p>
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
                    <Reorder.Group as="div" axis="y" values={partners} onReorder={handleReorder} className="space-y-2">
                        {partners.map((p) => (
                            <PartnerRow
                                key={p.id}
                                partner={p}
                                onEdit={startEdit}
                                onDelete={handleDelete}
                                deleting={deletingIds.includes(p.id)}
                            />
                        ))}
                    </Reorder.Group>
                </>
            )}
        </div>
    );
}
