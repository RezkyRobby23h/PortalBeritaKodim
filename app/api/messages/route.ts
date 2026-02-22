import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type SessionUser = typeof auth.$Infer.Session.user;

// GET /api/messages — paginated list (admin/editor only)
export async function GET(req: NextRequest) {
  try {
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

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)),
    );
    const search = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status") ?? "all"; // "all" | "read" | "unread"

    const where = {
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(status === "read"
        ? { isRead: true }
        : status === "unread"
          ? { isRead: false }
          : {}),
    };

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          content: true,
          isRead: true,
          createdAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    return NextResponse.json({
      data: messages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data pesan" },
      { status: 500 },
    );
  }
}

// POST /api/messages — create new message (public, from contact form)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = (body.fullName as string | null)?.trim() ?? "";
    const email = (body.email as string | null)?.trim() ?? "";
    const phoneNumber = (body.phoneNumber as string | null)?.trim() || null;
    const content = (body.content as string | null)?.trim() ?? "";

    if (!fullName || !email || !content) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib diisi" },
        { status: 422 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 422 },
      );
    }

    const message = await prisma.message.create({
      data: { fullName, email, phoneNumber, content },
      select: { id: true, fullName: true, email: true, createdAt: true },
    });

    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 },
    );
  }
}
