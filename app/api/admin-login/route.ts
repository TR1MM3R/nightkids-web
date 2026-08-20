import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, checkCredentials, createSessionCookieValue } from '@/lib/admin-session';

export async function POST(request: Request): Promise<NextResponse> {
    let body: { username?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, message: 'Richiesta non valida.' }, { status: 400 });
    }

    const { username, password } = body;
    if (!username || !password || !checkCredentials(username, password)) {
        return NextResponse.json({ success: false, message: 'Credenziali non valide.' }, { status: 401 });
    }

    const value = await createSessionCookieValue();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, value, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 giorni, in secondi
    });
    return response;
}
