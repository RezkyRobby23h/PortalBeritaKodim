import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { updateUserRoleSchema } from "@/lib/schemas/role";
import type { Role } from "@/lib/schemas/role";

type SessionUser = typeof auth.$Infer.Session.user;

// PATCH /api/users/[id]
// Updates a user's role. Requires ADMIN role.
// Body: { role: Role }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }
    const userRole = (session.user as SessionUser).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

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

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }
    const userRole = (session.user as SessionUser).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    // Prevent self-deletion
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus akun sendiri" },
        { status: 400 },
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pengguna" },
      { status: 500 },
    );
  }
}
