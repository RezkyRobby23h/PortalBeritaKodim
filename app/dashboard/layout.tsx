/**
 * Dashboard Layout — Server Component Guard
 *
 * Enforces authentication AND staff-role access for every page under
 * /dashboard/*. Two layers of protection are at work:
 *
 *   1. middleware.ts  — fast edge redirect when the session cookie is absent.
 *   2. This layout   — full server-side session validation via the DAL,
 *                      plus role enforcement (ADMIN | EDITOR only).
 *
 * Because this is a Server Component it runs before any client code is
 * hydrated, so even a tampered cookie cannot expose protected UI.
 */
import { redirect } from "next/navigation";
import { verifySession, STAFF_ROLES, type SessionUser } from "@/lib/dal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validates the session cryptographically; redirects to /auth/signin on
  // failure so we never reach the role check while unauthenticated.
  const session = await verifySession();

  const role = (session.user as SessionUser).role ?? "";
  if (!STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number])) {
    // Authenticated but not a staff member — send them to the public homepage.
    redirect("/");
  }

  return <>{children}</>;
}
