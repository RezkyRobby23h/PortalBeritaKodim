import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, ADMIN_ROLES } from "@/lib/dal";
import { updateUserRoleSchema } from "@/lib/schemas/role";
import type { Role } from "@/lib/schemas/role";

// PATCH /api/users/[id]
// Updates a user's role. Requires ADMIN role.
// Body: { role: Role }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(ADMIN_ROLES);
    if (!authResult.ok) return authResult.response;

    const body = await req.json();
    const parsed = updateUserRoleSchema.safeParse({ id, ...body });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 400 },
      );
    }

    const { role } = parsed.data;

    // Update role directly via Prisma; the admin plugin's custom roles
    // (ADMIN/EDITOR/USER) use the same column but aren't in its built-in types.
    const user = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui pengguna" },
      { status: 500 },
    );
  }
}

// DELETE /api/users/[id]
// Deletes a user by id. Requires ADMIN role. Cannot delete own account.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(ADMIN_ROLES);
    if (!authResult.ok) return authResult.response;
    const { session } = authResult;

    // Prevent self-deletion
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus akun sendiri" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    // Delete directly via Prisma; cascades to sessions and accounts
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pengguna" },
      { status: 500 },
    );
  }
}
