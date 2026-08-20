'use client';

import { useRouter, useParams } from 'next/navigation';

export default function AdminLogoutButton() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'it';

    async function handleLogout() {
        await fetch('/api/admin-logout', { method: 'POST' });
        router.push(`/${locale}/admin/login`);
        router.refresh();
    }

    return (
        <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
        >
            Esci
        </button>
    );
}
