import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
