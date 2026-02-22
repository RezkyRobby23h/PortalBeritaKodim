import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  additionalAuthorIds: z.array(z.string()).optional().default([]),
  fullContent: z.string().min(10, "Konten wajib diisi"),
  summary: z.string().min(10, "Ringkasan wajib diisi"),
  published: z.boolean().optional().default(false),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreatePostFormErrors = Partial<
  Record<keyof CreatePostInput, string[]>
>;

export const updatePostSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  authorIds: z.array(z.string()).optional().default([]),
  fullContent: z.string().min(10, "Konten wajib diisi"),
  summary: z.string().min(10, "Ringkasan wajib diisi"),
  published: z.boolean().optional().default(false),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type UpdatePostFormErrors = Partial<
  Record<keyof UpdatePostInput, string[]>
>;
