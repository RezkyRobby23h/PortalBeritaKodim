import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, STAFF_ROLES } from "@/lib/dal";
import { createPostSchema } from "@/lib/schemas/post";

// GET /api/posts
// Retrieves a paginated list of posts.
// Query params: page, limit, q (search by title), categoryId, status (all|published|draft), isHighlight, dateFrom, dateTo
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      5,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)),
    );
    const search = searchParams.get("q")?.trim() ?? "";
    const categoryId = searchParams.get("categoryId")?.trim() ?? "";
    const status = searchParams.get("status") ?? "all"; // "all" | "published" | "draft"
    const isHighlight = searchParams.get("isHighlight");
    const dateFrom = searchParams.get("dateFrom")?.trim() ?? "";
    const dateTo = searchParams.get("dateTo")?.trim() ?? "";

    const where = {
      ...(search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(status === "published"
        ? { published: true }
        : status === "draft"
          ? { published: false }
          : {}),
      ...(isHighlight === "true"
        ? { isHighlight: true }
        : isHighlight === "false"
          ? { isHighlight: false }
          : {}),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo + "T23:59:59.999Z") } : {}),
            },
          }
        : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          image: true,
          published: true,
          isHighlight: true,
          views: true,
          createdAt: true,
          category: { select: { id: true, name: true, color: true } },
          authors: { select: { id: true, name: true, image: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data postingan" },
      { status: 500 },
    );
  }
}

// POST /api/posts
// Creates a new post. Requires ADMIN or EDITOR role.
// Body: { title, categoryId, additionalAuthorIds, fullContent, summary, published, isHighlight, imageUrl }
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;
    const { session } = authResult;

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
      isHighlight,
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
        isHighlight,
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
