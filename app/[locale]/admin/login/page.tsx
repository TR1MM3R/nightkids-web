'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'it';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (data.success) {
                router.push(`/${locale}/admin`);
                router.refresh();
            } else {
                setError(data.message || 'Credenziali non valide.');
            }
        } catch {
            setError('Errore di connessione. Riprova.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-24">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-center">
                Accesso Admin
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                        Utente
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        autoComplete="username"
                        autoFocus
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        autoComplete="current-password"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold uppercase tracking-widest text-sm py-2.5 rounded transition-colors"
                >
                    {loading ? 'Accesso in corso…' : 'Entra'}
                </button>
            </form>
        </div>
    );
}
