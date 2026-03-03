import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, STAFF_ROLES } from "@/lib/dal";
import { createCategorySchema } from "@/lib/schemas/category";

// GET /api/categories
// Retrieves a paginated list of categories.
// Query params: page, limit, q (search by name), color
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)),
    );
    const search = searchParams.get("q")?.trim() ?? "";
    const color = searchParams.get("color")?.trim() ?? "";

    const where = {
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
      ...(color ? { color } : {}),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          _count: { select: { posts: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json({
      data: categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 },
    );
  }
}

// POST /api/categories
// Creates a new category. Requires ADMIN or EDITOR role.
// Body: { name: string, color: string }
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const { color } = parsed.data;
    const name = parsed.data.name.toLowerCase();
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await prisma.category.findFirst({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: { name: ["Kategori dengan nama ini sudah ada"] },
        },
        { status: 422 },
      );
    }

    const category = await prisma.category.create({
      data: { name, slug, color },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 },
    );
  }
}
