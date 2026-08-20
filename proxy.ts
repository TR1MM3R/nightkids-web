import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidSessionCookie } from '@/lib/admin-session';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'it'],

    // Used when no locale matches
    defaultLocale: 'it'
});

export default async function proxy(req: NextRequest) {
    const url = req.nextUrl;
    const isAdminRoute = url.pathname.includes('/admin');
    const isLoginRoute = url.pathname.includes('/admin/login');

    // Protect /admin routes (tranne il login stesso, altrimenti nessuno potrebbe
    // raggiungerlo per autenticarsi)
    if (isAdminRoute && !isLoginRoute) {
        const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
        if (await isValidSessionCookie(session)) {
            // If authenticated, let next-intl handle the routing
            return intlMiddleware(req);
        }

        // Nessuna sessione valida: redirect al login. Non più un prompt Basic
        // Auth via WWW-Authenticate — vedi admin-session.ts per il perché.
        const locale = url.pathname.startsWith('/en') ? 'en' : 'it';
        return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
    }

    // For all other routes, let next-intl handle it
    return intlMiddleware(req);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
