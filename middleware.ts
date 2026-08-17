import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

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
        const basicAuth = req.headers.get('authorization');
        
        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            const validUser = process.env.ADMIN_USER || 'admin';
            const validPass = process.env.ADMIN_PASS || 'nightkids2026';

            if (user === validUser && pwd === validPass) {
                // If authenticated, let next-intl handle the routing
                return intlMiddleware(req);
            }
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
