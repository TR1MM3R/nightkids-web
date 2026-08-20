// Difesa in profondità per le Server Action di scrittura in app/actions/admin.ts:
// oggi sono raggiungibili solo perché il middleware blocca /admin, ma una
// Server Action è comunque un endpoint HTTP a sé (POST con header Next-Action).
// Senza questo controllo, basterebbe che in futuro una di queste funzioni venga
// richiamata da una pagina pubblica per restare esposta senza autenticazione —
// lo stesso tipo di falla già trovata e chiusa su /api/upload il 18/08.
//
// Verifica tramite cookie di sessione (vedi admin-session.ts), non più header
// Authorization: Basic Auth non veniva reinviato in modo affidabile dal browser
// sulle fetch/Server Action lato client (scoperto il 21/08/2026), un cookie sì.
export async function requireAdmin() {
    const { cookies } = await import('next/headers');
    const { ADMIN_SESSION_COOKIE, isValidSessionCookie } = await import('./admin-session');
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await isValidSessionCookie(session))) {
        throw new Error('Unauthorized');
    }
}
