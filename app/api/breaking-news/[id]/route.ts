import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, STAFF_ROLES } from "@/lib/dal";
import { updateBreakingNewsSchema } from "@/lib/schemas/breaking-news";

// PATCH /api/breaking-news/[id]
// Partially updates a breaking news item. Requires ADMIN or EDITOR role.
// Body: { text?, labelLink?, postId?, isActive? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

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

// DELETE /api/breaking-news/[id]
// Deletes a breaking news item. Requires ADMIN or EDITOR role.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await requireAnyRole(STAFF_ROLES);
    if (!authResult.ok) return authResult.response;

    await prisma.breakingNews.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus breaking news" },
      { status: 500 },
    );
  }
}
