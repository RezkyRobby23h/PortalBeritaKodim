/**
 * Dashboard → Users Layout — Server Component Guard
 *
 * Adds an extra role gate on top of the parent DashboardLayout so that only
 * ADMIN users can reach /dashboard/users.
 *
 * Execution order:
 *   middleware.ts          → cookie presence check (edge)
 *   app/dashboard/layout   → authentication + STAFF role check
 *   app/dashboard/users/layout → ADMIN role check  ← this file
 *   app/dashboard/users/page   → rendered
 */
import { redirect } from "next/navigation";
import { verifySession, ADMIN_ROLES, type SessionUser } from "@/lib/dal";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // verifySession() is memoised with React cache() so the DB is not hit again
  // if it was already called by the parent DashboardLayout in the same render.
  const session = await verifySession();

  const role = (session.user as SessionUser).role ?? "";
  if (!ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
    // Staff member but not an admin — redirect back to the dashboard home.
    redirect("/dashboard");
  }

  return <>{children}</>;
}
