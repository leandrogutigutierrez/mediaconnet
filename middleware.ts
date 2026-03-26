import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-me'
);

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile/edit',
  '/opportunities/new',
  '/messages',
  '/applications',
];

// Routes only accessible when NOT logged in
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('mc_token')?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // Verify token validity
  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !isValid) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register
  if (isAuthRoute && isValid) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/edit/:path*',
    '/opportunities/new/:path*',
    '/messages/:path*',
    '/applications/:path*',
    '/login',
    '/register',
  ],
};
