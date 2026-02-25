/**
 * Next.js Proxy (formerly Middleware) — Optimistic Route Protection
 *
 * Next.js 16 renamed middleware.ts → proxy.ts and `export function middleware`
 * → `export function proxy`. Functionality is identical.
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * This file performs lightweight, edge-compatible optimistic checks only:
 *
 *   - /dashboard/* → redirects to /auth/signin when the session cookie is absent.
 *   - /auth/*      → redirects to /dashboard when a session cookie is present.
 *
 * Cookie presence is a fast heuristic; the real cryptographic session
 * validation (including role checks) is done server-side in layout guards
 * (app/dashboard/layout.tsx, app/dashboard/users/layout.tsx) via
 * `verifySession()` from the DAL, which has full Prisma / DB access.
 *
 * Per Next.js docs, Proxy should NOT do slow data fetching or full session
 * management — that belongs in the DAL.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Cookie name set by better-auth on successful sign-in. */
const SESSION_COOKIE = "better-auth.session_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  // ── Protect /dashboard/* ──────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      const signIn = new URL("/auth/signin", request.url);
      signIn.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signIn);
    }
  }

  // ── Prevent authenticated users from reaching /auth/* ─────────────────────
  if (pathname.startsWith("/auth/")) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match /dashboard and all sub-paths, and /auth and all sub-paths.
     * Exclude Next.js internals and static files.
     */
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
