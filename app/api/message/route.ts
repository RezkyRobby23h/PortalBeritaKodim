import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type SessionUser = typeof auth.$Infer.Session.user;

async function requireAdminOrEditor() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const userRole = (session.user as SessionUser).role ?? "";
  if (!["ADMIN", "EDITOR"].includes(userRole)) return null;
  return session;
}

// GET /api/message?id=... — get single message and mark as read
export async function GET(req: NextRequest) {
  try {
    const session = await requireAdminOrEditor();
    if (!session) {
      return NextResponse.json(
        { error: "Tidak terautentikasi atau tidak diizinkan" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan" },
        { status: 400 },
      );
    }

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

// PATCH /api/message?id=... — toggle isRead
export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdminOrEditor();
    if (!session) {
      return NextResponse.json(
        { error: "Tidak terautentikasi atau tidak diizinkan" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan" },
        { status: 400 },
      );
    }

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

// DELETE /api/message?id=... — delete message
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAdminOrEditor();
    if (!session) {
      return NextResponse.json(
        { error: "Tidak terautentikasi atau tidak diizinkan" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan" },
        { status: 400 },
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

    await prisma.message.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pesan" },
      { status: 500 },
    );
  }
}
