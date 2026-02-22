import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
