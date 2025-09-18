import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || '';
const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';

export type JwtPayload = {
  sub: string;
  role: 'Principal' | 'HOD' | 'Faculty';
  email: string;
};

export function signJwt(payload: JwtPayload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  const secure = process.env.COOKIE_SECURE === 'true';
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getAuthFromCookie(): JwtPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
}
