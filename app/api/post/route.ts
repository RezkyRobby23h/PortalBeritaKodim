import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { createPostSchema, updatePostSchema } from "@/lib/schemas/post";
export type { CreatePostInput } from "@/lib/schemas/post";

type SessionUser = typeof auth.$Infer.Session.user;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan" },
        { status: 400 },
      );
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        fullContent: true,
        image: true,
        published: true,
        categoryId: true,
        category: { select: { id: true, name: true, color: true } },
        authors: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Postingan tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data postingan" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = updatePostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const {
      title,
      categoryId,
      authorIds,
      fullContent,
      summary,
      published,
      imageUrl,
    } = parsed.data;

    // Regenerate slug only if title changed
    const existing = await prisma.post.findUnique({
      where: { id },
      select: { title: true, slug: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Postingan tidak ditemukan" },
        { status: 404 },
      );
    }

    let slug = existing.slug;
    if (title !== existing.title) {
      const baseSlug = slugify(title, { lower: true, strict: true });
      const conflicts = await prisma.post.findMany({
        where: { slug: { startsWith: baseSlug }, NOT: { id } },
        select: { slug: true },
      });
      const slugSet = new Set(conflicts.map((p) => p.slug));
      slug = baseSlug;
      let counter = 1;
      while (slugSet.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    // Ensure current user is always an author
    const allAuthorIds = Array.from(new Set([session.user.id, ...authorIds]));

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        summary,
        fullContent,
        image: imageUrl !== undefined ? imageUrl || null : undefined,
        categoryId,
        published,
        authors: {
          set: allAuthorIds.map((aid) => ({ id: aid })),
        },
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        authors: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui postingan" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const {
      title,
      categoryId,
      additionalAuthorIds,
      fullContent,
      summary,
      published,
      imageUrl,
    } = parsed.data;

    // Generate a unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    const existing = await prisma.post.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    });
    const slugSet = new Set(existing.map((p) => p.slug));
    let slug = baseSlug;
    let counter = 1;
    while (slugSet.has(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Collect all author IDs: session user + additional (deduped)
    const authorIds = Array.from(
      new Set([session.user.id, ...additionalAuthorIds]),
    );

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        summary,
        fullContent,
        image: imageUrl || null,
        categoryId,
        published,
        authors: {
          connect: authorIds.map((id) => ({ id })),
        },
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        authors: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat postingan" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan" },
        { status: 400 },
      );
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus postingan" },
      { status: 500 },
    );
  }
}
