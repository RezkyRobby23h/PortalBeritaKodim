import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, STAFF_ROLES } from "@/lib/dal";
import {
  breakingNewsSchema,
  updateBreakingNewsSchema,
} from "@/lib/schemas/breaking-news";

// ── GET  /api/breaking-news ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)),
    );
    const search = searchParams.get("q")?.trim() ?? "";
    const active = searchParams.get("active");

    const where = {
      ...(search
        ? { text: { contains: search, mode: "insensitive" as const } }
        : {}),
      ...(active === "true"
        ? { isActive: true }
        : active === "false"
          ? { isActive: false }
          : {}),
    };

    const [items, total] = await Promise.all([
      prisma.breakingNews.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          text: true,
          labelLink: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          postId: true,
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.breakingNews.count({ where }),
    ]);

    return NextResponse.json({
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data breaking news" },
      { status: 500 },
    );
  }
}

// ── POST  /api/breaking-news ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const body = await req.json();
    const parsed = breakingNewsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const { text, labelLink, postId, isActive } = parsed.data;

    // Validate postId if provided
    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      });
      if (!post) {
        return NextResponse.json(
          {
            error: "Post tidak ditemukan",
            details: { postId: ["Post tidak ditemukan"] },
          },
          { status: 422 },
        );
      }
    }

    const item = await prisma.breakingNews.create({
      data: {
        text,
        labelLink: labelLink ?? null,
        postId: postId ?? null,
        isActive,
      },
      select: {
        id: true,
        text: true,
        labelLink: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        postId: true,
        post: { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat breaking news" },
      { status: 500 },
    );
  }
}

// ── PATCH  /api/breaking-news?id={id} ───────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = updateBreakingNewsSchema.safeParse({ ...body, id });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const patchData = parsed.data;

    const existing = await prisma.breakingNews.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Breaking news tidak ditemukan" },
        { status: 404 },
      );
    }

    if (patchData.postId != null) {
      const post = await prisma.post.findUnique({
        where: { id: patchData.postId },
        select: { id: true },
      });
      if (!post) {
        return NextResponse.json(
          {
            error: "Post tidak ditemukan",
            details: { postId: ["Post tidak ditemukan"] },
          },
          { status: 422 },
        );
      }
    }

    const updatePayload: {
      text?: string;
      labelLink?: string | null;
      postId?: string | null;
      isActive?: boolean;
    } = {};
    if (patchData.text !== undefined) updatePayload.text = patchData.text;
    if (patchData.labelLink !== undefined)
      updatePayload.labelLink = patchData.labelLink ?? null;
    if (patchData.postId !== undefined)
      updatePayload.postId = patchData.postId ?? null;
    if (patchData.isActive !== undefined)
      updatePayload.isActive = patchData.isActive;

    const updated = await prisma.breakingNews.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        text: true,
        labelLink: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        postId: true,
        post: { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui breaking news" },
      { status: 500 },
    );
  }
}

// ── DELETE  /api/breaking-news?id={id} ──────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan" },
        { status: 400 },
      );
    }

    const existing = await prisma.breakingNews.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Breaking news tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.breakingNews.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus breaking news" },
      { status: 500 },
    );
  }
}
