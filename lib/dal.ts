/**
 * Data Access Layer (DAL)
 *
 * Centralises all session-retrieval and authorisation logic following the
 * Next.js "Creating a Data Access Layer" pattern:
 * https://nextjs.org/docs/app/guides/authentication#creating-a-data-access-layer-dal
 *
 * Two call-sites are served:
 *
 *   - Server Components / Layouts / Pages → `verifySession()`
 *     Redirects to /auth/signin when the user is unauthenticated.
 *
 *   - Route Handlers → `requireAuth()` / `requireAnyRole()`
 *     Returns a typed discriminated-union so the handler can return the
 *     embedded `Response` immediately without touching auth internals.
 *
 * `server-only` ensures this module can never be bundled into client code.
 */
import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SessionUser = typeof auth.$Infer.Session.user;
type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

/**
 * Discriminated union returned by route-handler helpers so callers can do:
 *
 * ```ts
 * const result = await requireAnyRole(STAFF_ROLES);
 * if (!result.ok) return result.response;
 * const { session } = result;
 * ```
 */
export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

// ── Role constants ────────────────────────────────────────────────────────────

/** Roles that can manage content (posts, categories, breaking news, messages). */
export const STAFF_ROLES = ["ADMIN", "EDITOR"] as const;

/** Roles that can manage users. */
export const ADMIN_ROLES = ["ADMIN"] as const;

// ── Session helpers ───────────────────────────────────────────────────────────

/**
 * Fetches the current session, memoised with React `cache()` so duplicate
 * calls within the same render/request are deduplicated.
 *
 * Returns `null` when the user is unauthenticated.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * For **Server Components / Pages / Layouts**.
 *
 * Returns the active session or redirects to `/auth/signin`.
 * Uses React `cache()` to avoid redundant DB/cookie reads per render pass.
 */
export const verifySession = cache(async (): Promise<Session> => {
  const session = await getSession();
  if (!session) redirect("/auth/signin");
  return session;
});

// ── Route Handler guards ──────────────────────────────────────────────────────

/**
 * Asserts the request is authenticated.
 * Returns `{ ok: true, session }` or `{ ok: false, response: 401 }`.
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      ),
    };
  }
  return { ok: true, session };
}

/**
 * Asserts the request is authenticated **and** the user holds one of the
 * supplied `roles`.
 *
 * Returns `{ ok: true, session }`, `{ ok: false, response: 401 }`, or
 * `{ ok: false, response: 403 }`.
 */
export async function requireAnyRole(
  roles: readonly string[],
): Promise<AuthResult> {
  const result = await requireAuth();
  if (!result.ok) return result;

  const role = (result.session.user as SessionUser).role ?? "";
  if (!roles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Tidak diizinkan" },
        { status: 403 },
      ),
    };
  }

  return result;
}
