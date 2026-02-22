import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/profile/[id]
// Returns public profile data. If the requester is the same user, also returns email.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({ headers: await headers() });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
        email: true,
        emailVerified: true,
        accounts: {
          select: { providerId: true },
        },
        _count: { select: { posts: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    const isOwner = session?.user?.id === user.id;

    // Derive linked providers
    const providers = user.accounts.map((a) => a.providerId);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      postCount: user._count.posts,
      // sensitive — only exposed to the owner
      email: isOwner ? user.email : null,
      emailVerified: isOwner ? user.emailVerified : null,
      providers: isOwner ? providers : [],
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil profil pengguna" },
      { status: 500 },
    );
  }
}

// PATCH /api/profile/[id]
// Only the account owner can update their own name.
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

    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Tidak diizinkan mengubah profil pengguna lain" },
        { status: 403 },
      );
    }

    const body = (await req.json()) as { name?: string; image?: string };

    const name = body.name?.trim();
    const image = body.image;

    if (name === undefined && image === undefined) {
      return NextResponse.json(
        { error: "Tidak ada perubahan yang diminta" },
        { status: 400 },
      );
    }

    if (name !== undefined && name.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter" },
        { status: 400 },
      );
    }

    const updateData: { name?: string; image?: string | null } = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image || null;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, image: true, role: true, email: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 },
    );
  }
}
