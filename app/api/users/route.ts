import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, STAFF_ROLES, SessionUser } from "@/lib/dal";
import { ROLES } from "@/lib/schemas/role";
import type { Role } from "@/lib/schemas/role";

// GET /api/users
// Retrieves a paginated list of users. Requires ADMIN or EDITOR role.
// Query params: page, limit, q (search by name or email), role
// ADMIN: can filter by any role. EDITOR: restricted to ADMIN and EDITOR roles only.
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;
    const { session } = authResult;

    const isAdmin = (session.user as SessionUser).role === "ADMIN";

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)),
    );
    const search = searchParams.get("q")?.trim() ?? "";
    // Admins can filter by any role; editors are always restricted to ADMIN|EDITOR
    const roleParam = searchParams.get("role")?.trim() ?? "";

    const allowedRoles: Role[] = isAdmin ? [...ROLES] : ["ADMIN", "EDITOR"];

    // When the caller requests a specific role, intersect with allowedRoles
    const resolvedRole =
      roleParam && allowedRoles.includes(roleParam as Role)
        ? (roleParam as Role)
        : undefined;

    const where = {
      // Non-admins are always restricted to privileged roles
      ...(!isAdmin ? { role: { in: allowedRoles } } : {}),
      // Apply caller-supplied role filter on top (admin only, or intersected above)
      ...(resolvedRole ? { role: resolvedRole } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data pengguna" },
      { status: 500 },
    );
  }
}
