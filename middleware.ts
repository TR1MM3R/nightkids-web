import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminAuth } from '@/lib/admin-auth';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'it'],

    // Used when no locale matches
    defaultLocale: 'it'
});

export default function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Protect /admin routes
    if (url.pathname.includes('/admin')) {
        if (isValidAdminAuth(req.headers.get('authorization'))) {
            // If authenticated, let next-intl handle the routing
            return intlMiddleware(req);
        }

        // If no auth or invalid auth, prompt for password
        return new NextResponse('Auth Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        });
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
