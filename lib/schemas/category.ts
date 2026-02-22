import { z } from "zod";

const hexColor = z
  .string()
  .regex(
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    "Warna harus berupa kode HEX yang valid (contoh: #3b82f6)",
  );

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  color: hexColor.optional().default("#3b82f6"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateCategoryFormErrors = Partial<
  Record<keyof CreateCategoryInput, string[]>
>;
