"use client";

import { useState } from "react";
import { addPartner, deletePartner } from "@/app/actions/admin";
import { useImageUpload } from "@/lib/useImageUpload";

type Partner = { id: string; name: string; role: string; logoUrl: string };

export default function PartnersManager({ initialPartners }: { initialPartners: Partner[] }) {
    const [partners, setPartners] = useState(initialPartners);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", success: false });
    const [deletingIds, setDeletingIds] = useState<string[]>([]);

    const { uploadFile, isUploading, progress } = useImageUpload("nightkids/partners");

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !role) return;

        setIsSaving(true);
        setMessage({ text: "", success: false });

        try {
            const logoUrl = logoFile ? await uploadFile(logoFile) : "";
            const result = await addPartner({ name, role, logoUrl });

            if (result.success) {
                setPartners(prev => [...prev, { id: Date.now().toString(), name, role, logoUrl }]);
                setName("");
                setRole("");
                setLogoFile(null);
                const fileInput = document.getElementById("partnerLogoInput") as HTMLInputElement;
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
        if (!confirm("Rimuovere questo partner?")) return;

        setDeletingIds(prev => [...prev, id]);
        const result = await deletePartner(id);
        if (result.success) {
            setPartners(prev => prev.filter(p => p.id !== id));
        }
        setDeletingIds(prev => prev.filter(i => i !== id));
    };

    const isBusy = isSaving || isUploading;

    return (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Partners</h2>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 mb-8">
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
                        {isUploading ? `CARICAMENTO ${progress}%` : isSaving ? "..." : "Aggiungi"}
                    </button>
                </div>
                <p className="text-xs text-gray-500">Il logo è opzionale: senza, verrà mostrato un placeholder "LOGO".</p>
                {message.text && (
                    <p className={`text-sm ${message.success ? "text-green-500" : "text-red-500"}`}>{message.text}</p>
                )}
            </form>

            <div className="space-y-2">
                {partners.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Nessun partner ancora.</p>
                ) : (
                    partners.map((p) => (
                        <div key={p.id} className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                {p.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.logoUrl} alt={p.name} className="w-10 h-10 rounded-full object-cover bg-neutral-800" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-600 font-bold uppercase">Logo</div>
                                )}
                                <div>
                                    <p className="text-white font-bold text-sm">{p.name}</p>
                                    <p className="text-red-500 text-xs uppercase tracking-widest">{p.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(p.id)}
                                disabled={deletingIds.includes(p.id)}
                                className="text-xs text-gray-500 hover:text-red-500 uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
                            >
                                {deletingIds.includes(p.id) ? "..." : "Rimuovi"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
