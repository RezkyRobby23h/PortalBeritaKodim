import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { createCategorySchema } from "@/lib/schemas/category";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

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

    const { name, color } = parsed.data;
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
