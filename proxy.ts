/**
 * Next.js Proxy (formerly Middleware)
 *
 * Authentication and authorisation are handled entirely in Server Component
 * layouts using the DAL, which performs real cryptographic session validation:
 *
 *   - app/dashboard/layout.tsx → verifySession() + role check (ADMIN | EDITOR)
 *   - app/auth/layout.tsx      → getSession() redirect for authenticated users
 *
 * Doing route protection here with cookie-presence heuristics is unreliable:
 * on HTTPS the cookie name gets a __Secure- prefix that a simple name-check
 * misses, causing infinite redirect loops. The layout approach is simpler,
 * correct in all environments, and requires no maintenance here.
 */
import { NextResponse } from "next/server";

export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
