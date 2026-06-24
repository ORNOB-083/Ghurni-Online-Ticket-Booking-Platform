import { NextResponse } from 'next/server'
import { auth } from '.app/lib/auth'
import { headers } from 'next/headers'

export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    const { pathname } = request.nextUrl;

    // If not logged in, redirect to signin
    if (!session) {
        const signinUrl = new URL('/auth/signin', request.url);
        signinUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signinUrl);
    }

    const role = session.user?.role;

    // Role-based protection
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/vendor') && role !== 'vendor') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/user') && role !== 'user') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/tickets/:id/apply',
    ],
}