import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const routeGroups = {
    authRequired: [
        '/basket',
        '/rooms',
        '/orders',
        '/messenger',
        '/favourites',
        '/ws',
        '/api/basket',
        '/api/checkout/CreateCheckout',
        '/api/favourites',
        '/api/messenger',
        '/api/orders',
        '/api/rooms',
    ],
    adminRequired: [
        '/iom',
        '/api/iom',
    ]
};

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    if (routeGroups.authRequired.some(route => pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL('/category', req.url));
    }

    if (routeGroups.adminRequired.some(route => pathname.startsWith(route)) && (!token || (token.role as number) < 2)) {
        return NextResponse.redirect(new URL('/category', req.url));
    }

    return NextResponse.next();
}