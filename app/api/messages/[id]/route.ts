import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, STAFF_ROLES } from "@/lib/dal";

// GET /api/messages/[id]
// Retrieves a single message by id. Requires ADMIN or EDITOR role.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const message = await prisma.message.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Pesan tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(message);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data pesan" },
      { status: 500 },
    );
  }
}

// PATCH /api/messages/[id]
// Toggles isRead status of a message. Requires ADMIN or EDITOR role.
// Body: { isRead: boolean }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const body = await req.json();
    const isRead = body.isRead as boolean;

    if (typeof isRead !== "boolean") {
      return NextResponse.json(
        { error: "Field isRead harus boolean" },
        { status: 422 },
      );
    }

    const existing = await prisma.message.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pesan tidak ditemukan" },
        { status: 404 },
      );
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { isRead },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui status pesan" },
      { status: 500 },
    );
  }
}

// DELETE /api/messages/[id]
// Deletes a message by id. Requires ADMIN or EDITOR role.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const existing = await prisma.message.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pesan tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.message.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pesan" },
      { status: 500 },
    );
  }
}
