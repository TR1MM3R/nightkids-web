"use client";

import { useActionState, useState, useEffect } from 'react';
import { saveEventData, uploadGalleryPhoto, deleteGalleryPhoto } from '@/app/actions/admin';
import FadeIn from '@/components/FadeIn';

const initialEventState = { message: "", success: false };
const initialBlobState = { message: "", success: false, url: "" };

export default function AdminForms({ initialPhotos }: { initialPhotos: any[] }) {
    const [eventState, eventFormAction, isEventPending] = useActionState(saveEventData, initialEventState);
    const [blobState, blobFormAction, isBlobPending] = useActionState(uploadGalleryPhoto, initialBlobState);
    
    const [photos, setPhotos] = useState(initialPhotos);
    const [deletingUrls, setDeletingUrls] = useState<string[]>([]);
    
    // Update photos list when a new upload succeeds
    useEffect(() => {
        if (blobState.success && blobState.url) {
            setPhotos(prev => {
                if (prev.some(p => p.url === blobState.url)) return prev;
                return [{ url: blobState.url }, ...prev];
            });
        }
    }, [blobState]);

    const handleDelete = async (url: string) => {
        if (!confirm("Sei sicuro di voler eliminare questa foto?")) return;
        setDeletingUrls(prev => [...prev, url]);
        
        const res = await deleteGalleryPhoto(url);
        if (res.success) {
            setPhotos(prev => prev.filter(p => p.url !== url));
        }
        setDeletingUrls(prev => prev.filter(u => u !== url));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Modulo Eventi */}
            <FadeIn delay={0.1}>
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Prossimo Raduno</h2>
                    </div>
                    
                    <form action={eventFormAction} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Titolo Evento</label>
                            <input 
                                type="text" 
                                name="title" 
                                required
                                placeholder="Es: Midnight Run" 
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                required
                                placeholder="Es: Porte di Moncalieri, Torino" 
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Data e Ora</label>
                            <input 
                                type="datetime-local" 
                                name="date" 
                                required
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isEventPending}
                            className="w-full mt-4 bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {isEventPending ? "Salvataggio in corso..." : "Aggiorna Sito"}
                        </button>

                        {eventState?.message && (
                            <div className={`p-4 rounded-xl text-sm font-bold uppercase tracking-widest text-center mt-4 ${eventState.success ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                {eventState.message}
                            </div>
                        )}
                    </form>
                </div>
            </FadeIn>

            {/* Modulo Galleria (Vercel Blob) */}
            <FadeIn delay={0.2}>
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white">Galleria (Vercel Blob)</h2>
                    </div>
                    
                    <form action={blobFormAction} className="mb-6">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Carica Nuova Foto</label>
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <input 
                                type="file" 
                                name="file" 
                                required
                                accept="image/*"
                                className="flex-1 w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-gray-200"
                            />
                            <button 
                                type="submit" 
                                disabled={isBlobPending}
                                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                            >
                                {isBlobPending ? "..." : "Upload"}
                            </button>
                        </div>
                        {blobState?.message && (
                            <div className={`p-3 rounded-xl text-xs font-bold uppercase tracking-widest mt-2 ${blobState.success ? 'text-green-500' : 'text-red-500'}`}>
                                {blobState.message}
                            </div>
                        )}
                    </form>

                    <div className="flex-1">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 border-b border-white/5 pb-2">Foto Caricate ({photos.length})</label>
                        {photos.length === 0 ? (
                            <p className="text-sm text-gray-500 italic text-center py-8">Nessuna foto caricata.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                {photos.map(p => (
                                    <div key={p.url} className="relative aspect-square rounded-lg overflow-hidden group bg-black border border-white/10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.url} alt="Gallery image" className="object-cover w-full h-full group-hover:opacity-50 transition-opacity" />
                                        
                                        <button 
                                            onClick={() => handleDelete(p.url)}
                                            disabled={deletingUrls.includes(p.url)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                                            title="Elimina Foto"
                                        >
                                            {deletingUrls.includes(p.url) ? (
                                                <span className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-red-500" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
