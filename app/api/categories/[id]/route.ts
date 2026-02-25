import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

type SessionUser = typeof auth.$Infer.Session.user;

// DELETE /api/categories/[id]
// Deletes a category by id. Requires ADMIN or EDITOR role.
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
    const userRole = (session.user as SessionUser).role ?? "";
    if (!["ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 },
    );
  }
}
