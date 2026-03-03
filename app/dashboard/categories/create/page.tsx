"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/custom/navbar";
import { ColorPicker } from "@/components/custom/color-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  createCategorySchema,
  CreateCategoryFormErrors,
} from "@/lib/schemas/category";

// ── Reusable form-section wrapper ─────────────────────────────────────────────
function FormSection({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string[];
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
      {error?.map((e) => (
        <p key={e} className="text-xs text-destructive">
          {e}
        </p>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CreateCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");

  const [errors, setErrors] = useState<CreateCategoryFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const submitRef = useRef(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitRef.current) return;

    const parsed = createCategorySchema.safeParse({ name, color });

    if (!parsed.success) {
      setErrors(
        z.flattenError(parsed.error).fieldErrors as CreateCategoryFormErrors,
      );
      return;
    }
    setErrors({});

    submitRef.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const json = await res.json();
        if (json.details) {
          setErrors(json.details as CreateCategoryFormErrors);
        } else {
          toast.error(json.error ?? "Terjadi kesalahan, coba lagi.");
        }
        return;
      }

      router.push("/dashboard/categories");
    } catch {
      toast.error("Tidak dapat menghubungi server.");
    } finally {
      submitRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="dashboard" />

      {/* Sticky top bar */}
      <div className="fixed left-0 right-0 top-16 z-40 border-b border-foreground/10 bg-card/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/dashboard/categories">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-sm font-bold text-foreground">
                Buat Kategori Baru
              </h1>
              <p className="text-xs text-muted-foreground">
                Kategori digunakan untuk mengelompokkan postingan
              </p>
            </div>
          </div>

          <Button
            form="create-category-form"
            type="submit"
            disabled={submitting}
            size="sm"
          >
            {submitting && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <main className="pt-36 pb-16">
        <form
          id="create-category-form"
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-xl flex-col gap-8 px-4"
        >
          {/* ── Name ── */}
          <FormSection label="Nama Kategori" htmlFor="name" error={errors.name}>
            <Input
              id="name"
              placeholder="Contoh: Operasi, Sosial, Pendidikan..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(errors.name && "border-destructive")}
            />
          </FormSection>

          {/* ── Color ── */}
          <FormSection
            label="Warna"
            error={errors.color}
            hint="Warna ini akan ditampilkan pada label kategori di setiap postingan."
          >
            <div className="flex items-center gap-4">
              <ColorPicker
                value={color}
                onChange={setColor}
                className="flex-1"
              />

              {/* Live badge preview */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Preview:</span>
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: `${color}22`,
                    color: color,
                    border: `1px solid ${color}44`,
                  }}
                >
                  {name || "Kategori"}
                </span>
              </div>
            </div>
          </FormSection>
        </form>
      </main>
    </div>
  );
}
