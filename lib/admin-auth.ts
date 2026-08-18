// Verifica le credenziali Basic Auth admin. Fallisce chiuso: se ADMIN_USER/ADMIN_PASS
// non sono configurate, nessuna credenziale è valida.
export function isValidAdminAuth(authHeader: string | null): boolean {
    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;

    if (!authHeader || !validUser || !validPass) return false;

    const authValue = authHeader.split(' ')[1];
    if (!authValue) return false;

    const [user, pwd] = atob(authValue).split(':');
    return user === validUser && pwd === validPass;
}

// Difesa in profondità per le Server Action di scrittura in app/actions/admin.ts:
// oggi sono raggiungibili solo perché il middleware blocca l'URL /admin, ma una
// Server Action è comunque un endpoint HTTP a sé (POST con header Next-Action).
// Senza questo controllo, basterebbe che in futuro una di queste funzioni venga
// richiamata da una pagina pubblica per restare esposta senza autenticazione —
// lo stesso tipo di falla già trovata e chiusa su /api/upload il 18/08.
// Il browser riattacca automaticamente l'Authorization Basic già inserita per
// l'origine su ogni richiesta, incluse le Server Action: chi è già loggato in
// /admin non nota differenza.
export async function requireAdmin() {
    const { headers } = await import('next/headers');
    const h = await headers();
    if (!isValidAdminAuth(h.get('authorization'))) {
        throw new Error('Unauthorized');
    }
}
