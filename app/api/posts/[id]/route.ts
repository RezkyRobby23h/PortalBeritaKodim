import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, STAFF_ROLES } from "@/lib/dal";
import { updatePostSchema } from "@/lib/schemas/post";

// GET /api/posts/[id]
// Retrieves a single post by id.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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
        isHighlight: true,
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

// PUT /api/posts/[id]
// Fully updates a post by id. Requires ADMIN or EDITOR role.
// Body: { title, categoryId, authorIds, fullContent, summary, published, isHighlight, imageUrl }
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;
    const { session } = authResult;

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
      isHighlight,
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
        isHighlight,
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

// PATCH /api/posts/[id]
// Partially updates the isHighlight flag of a post. Requires ADMIN or EDITOR role.
// Body: { isHighlight: boolean }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const body = await req.json();
    const parsed = z.object({ isHighlight: z.boolean() }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const post = await prisma.post.update({
      where: { id },
      data: { isHighlight: parsed.data.isHighlight },
      select: { id: true, isHighlight: true },
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui postingan" },
      { status: 500 },
    );
  }
}

// DELETE /api/posts/[id]
// Deletes a post by id. Requires ADMIN or EDITOR role.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const existing = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Postingan tidak ditemukan" },
        { status: 404 },
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
