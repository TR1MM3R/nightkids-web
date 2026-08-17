"use client";

import { useActionState } from 'react';
import { saveEventData } from '@/app/actions/admin';
import FadeIn from '@/components/FadeIn';

const initialState = {
    message: "",
    success: false,
};

export default function AdminDashboard() {
    const [state, formAction, isPending] = useActionState(saveEventData, initialState);

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Pannello di Controllo</h1>
                    <p className="text-gray-400 font-light text-sm tracking-widest uppercase">Gestisci i contenuti dinamici del sito</p>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Modulo Eventi */}
                <FadeIn delay={0.1}>
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-widest">Prossimo Raduno</h2>
                        </div>
                        
                        <form action={formAction} className="space-y-4">
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
                                disabled={isPending}
                                className="w-full mt-4 bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {isPending ? "Salvataggio in corso..." : "Aggiorna Sito"}
                            </button>

                            {state?.message && (
                                <div className={`p-4 rounded-xl text-sm font-bold uppercase tracking-widest text-center mt-4 ${state.success ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                    {state.message}
                                </div>
                            )}
                        </form>
                    </div>
                </FadeIn>

                {/* Modulo Galleria (Coming Soon) */}
                <FadeIn delay={0.2}>
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500">Galleria (Vercel Blob)</h2>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mb-4" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                            <p className="uppercase tracking-widest font-bold text-sm">Modulo in Sviluppo</p>
                            <p className="text-xs mt-2 text-gray-500 max-w-[250px]">L'infrastruttura per caricare e moderare le foto dei raduni sarà attiva nella Fase 2.2.</p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
