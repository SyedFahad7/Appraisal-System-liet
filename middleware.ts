import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

function destinationForRole(role?: string) {
  if (role === 'Faculty') return '/faculty';
  if (role === 'HOD') return '/hod';
  if (role === 'Principal') return '/principal';
  return '/login';
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  // If authenticated and visiting /login, redirect to role dashboard
  if (pathname === '/login' && token) {
    try {
      const payload = verify(token, JWT_SECRET) as { role?: string };
      return NextResponse.redirect(new URL(destinationForRole(payload.role), req.url));
    } catch {}
  }

  const protectedMatch = ['/faculty', '/hod', '/principal'].some((p) => pathname.startsWith(p));
  if (!protectedMatch) return NextResponse.next();

  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const payload = verify(token, JWT_SECRET) as { role?: string };
    if (pathname.startsWith('/faculty') && payload.role !== 'Faculty') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (pathname.startsWith('/hod') && payload.role !== 'HOD') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (pathname.startsWith('/principal') && payload.role !== 'Principal') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/faculty/:path*', '/hod/:path*', '/principal/:path*'],
};
