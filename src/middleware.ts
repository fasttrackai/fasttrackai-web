import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be accessible without authentication
const publicPaths = [
  '/auth/signin',
  '/auth/signup',
  '/',
  '/about',
  '/contact',
  '/solutions',
  '/packages',
  '/case-studies',
  '/blog',
  '/docs',
  '/client-dashboard',
  '/strategy-report',
  '/training-portal',
  '/schedule-consultation',
  '/roi-calculator',
  '/favicon.ico',
  '/_next',
  '/images',
  '/public'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // In development mode, allow access to all routes
  if (isDevelopment) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
}; 