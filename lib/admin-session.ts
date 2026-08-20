// Sessione admin basata su cookie firmato. Prima si usava solo HTTP Basic
// Auth: funziona per la navigazione di pagina, ma il browser non lo reinvia
// in modo affidabile sulle fetch/Server Action lato client — causa di 401
// intermittenti scoperta il 21/08/2026 testando l'upload in galleria (e che
// probabilmente colpiva anche le altre azioni admin, non solo l'upload).
// Un cookie httpOnly non ha questo problema: il browser lo allega sempre
// alle richieste same-origin, comprese fetch e Server Action.

export const ADMIN_SESSION_COOKIE = 'nk_admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 giorni

function toHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

async function hmac(value: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
    return toHex(signature);
}

function getSecret(): string | undefined {
    // Riusa ADMIN_PASS come chiave di firma: nessuna nuova variabile
    // d'ambiente da configurare su Vercel, ed è comunque un segreto già
    // noto solo al server.
    return process.env.ADMIN_PASS;
}

export function checkCredentials(user: string, pass: string): boolean {
    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;
    if (!validUser || !validPass) return false;
    return user === validUser && pass === validPass;
}

export async function createSessionCookieValue(): Promise<string> {
    const secret = getSecret();
    if (!secret) throw new Error('ADMIN_PASS non configurata');

    const expires = Date.now() + SESSION_DURATION_MS;
    const payload = String(expires);
    const signature = await hmac(payload, secret);
    return `${payload}.${signature}`;
}

export async function isValidSessionCookie(value: string | undefined | null): Promise<boolean> {
    if (!value) return false;
    const secret = getSecret();
    if (!secret) return false;

    const [payload, signature] = value.split('.');
    if (!payload || !signature) return false;

    const expected = await hmac(payload, secret);
    if (expected !== signature) return false;

    const expires = Number(payload);
    if (!Number.isFinite(expires) || Date.now() > expires) return false;

    return true;
}
