import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const cookie = getSessionCookie(req);
  const url = new URL(req.url);

  const needsAuth = ['/movimientos', '/usuarios', '/reportes'].some((p) =>
    url.pathname.startsWith(p)
  );

  if (needsAuth && !cookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/movimientos/:path*', '/usuarios/:path*', '/reportes/:path*'] };
