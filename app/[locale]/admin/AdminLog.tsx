import type { AdminLogEntry } from "@/lib/admin-log";

export default function AdminLog({ entries }: { entries: AdminLogEntry[] }) {
    return (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-4 pb-4 border-b border-white/5">
                Registro Attività
            </h2>
            {entries.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nessuna attività registrata ancora.</p>
            ) : (
                <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {entries.map((e, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center justify-between gap-4">
                            <span>{e.message}</span>
                            <span className="text-xs text-gray-600 whitespace-nowrap">
                                {new Date(e.timestamp).toLocaleString('it-IT', {
                                    timeZone: 'Europe/Rome',
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
