export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-red-500">
        <header className="border-b border-white/10 bg-black py-4 px-6 sticky top-0 z-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-red-500">NightKids</span>
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-bold border-l border-white/10 pl-4">Admin Dashboard</span>
                </div>
                <a href="/it" className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Torna al sito</a>
            </div>
        </header>
        <main className="p-6 md:p-12">
            {children}
        </main>
    </div>
  );
}
