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
  // Only redirect when the session cookie is completely absent. The real
  // cryptographic validation (and any role checks) happen in the server-side
  // DashboardLayout via verifySession() from the DAL.
  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      const signIn = new URL("/auth/signin", request.url);
      signIn.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signIn);
    }
  }

  // NOTE: We intentionally do NOT redirect authenticated users away from
  // /auth/* here. A cookie can be present but cryptographically stale/invalid,
  // which would cause an infinite redirect loop:
  //   proxy: /auth/signin → /dashboard (sees cookie)
  //   server: /dashboard  → /auth/signin (session invalid)
  // The app/auth/layout.tsx server component already handles this redirect
  // correctly using real session validation via getSession() from the DAL.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match only /dashboard and all sub-paths.
     * /auth/* is intentionally excluded — redirect for authenticated users is
     * handled server-side in app/auth/layout.tsx with proper session validation.
     */
    "/dashboard/:path*",
  ],
};
