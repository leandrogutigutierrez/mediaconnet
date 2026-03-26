import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { AuthPayload, UserRole } from '@/types';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-me'
);

const COOKIE_NAME = 'mc_token';
const TOKEN_TTL  = '7d';

// ─── Token helpers ────────────────────────────────────────────────────────────

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers (Server Components / Route Handlers) ─────────────────────

export async function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: '/',
  });
}

export async function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getAuthCookie(): Promise<string | undefined> {
  return cookies().get(COOKIE_NAME)?.value;
}

/** Returns the decoded payload from the current request's cookie, or null. */
export async function getCurrentUser(): Promise<AuthPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

/** Throws a 401 response if the user is not authenticated. */
export async function requireAuth(): Promise<AuthPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return user;
}

/** Throws a 403 response if the user does not have the required role. */
export async function requireRole(role: UserRole): Promise<AuthPayload> {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return user;
}
