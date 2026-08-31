import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for auth session cookies
    const sbToken = request.cookies.get('sb-access-token');
    const demoToken = request.cookies.get('damara_auth');

    // In local development/demo if no cookie is set on server,
    // we let the client-side layout guard redirect or handle the redirect here if desired
    // To strictly conform to PRD requirement: redirect unauthenticated admin routes to /admin/login
    const hasAuthCookie = Boolean(sbToken?.value || demoToken?.value);

    // If no cookie is present, redirect to login page with return url
    if (!hasAuthCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
