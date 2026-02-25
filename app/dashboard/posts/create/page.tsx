"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/custom/navbar";
import { ImageUpload } from "@/components/custom/image-upload";
import {
  UserMultiSelect,
  SelectableUser,
} from "@/components/custom/user-multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { createPostSchema, CreatePostFormErrors } from "@/lib/schemas/post";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

// ── Reusable form-section wrapper ─────────────────────────────────────────────
function FormSection({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  error?: string[];
  children: React.ReactNode;
  hint?: string;
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
export default function CreatePostPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<SelectableUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [fullContent, setFullContent] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [errors, setErrors] = useState<CreatePostFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const publishIntent = useRef(false);

  // Seed current user into authorIds once session is available
  useEffect(() => {
    if (session?.user?.id) {
      setAuthorIds((prev) =>
        prev.includes(session.user.id) ? prev : [session.user.id, ...prev],
      );
    }
  }, [session?.user?.id]);

  // Fetch categories + users on mount
  useEffect(() => {
    async function load() {
      try {
        const [catRes, userRes] = await Promise.all([
          fetch("/api/categories?limit=10"),
          fetch("/api/users"),
        ]);
        if (catRes.ok) {
          const json = await catRes.json();
          setCategories(json.data ?? json);
        }
        if (userRes.ok) {
          const json = await userRes.json();
          setUsers(json.data ?? json);
        }
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, []);

  // ── Additional author IDs (exclude current user — handled by API) ──────────
  const additionalAuthorIds = authorIds.filter(
    (id) => id !== session?.user?.id,
  );

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = createPostSchema.safeParse({
      title,
      categoryId,
      additionalAuthorIds,
      fullContent,
      summary,
      published: publishIntent.current,
      isHighlight: publishIntent.current,
      imageUrl: imageUrl || "",
    });

    if (!parsed.success) {
      setErrors(
        z.flattenError(parsed.error).fieldErrors as CreatePostFormErrors,
      );
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error ?? "Terjadi kesalahan, coba lagi.");
        return;
      }

      router.push("/dashboard/posts");
    } catch {
      toast.error("Tidak dapat menghubungi server.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="dashboard" />

      {/* Sticky top bar */}
      <div className="fixed left-0 right-0 top-16 z-40 border-b border-foreground/10 bg-card/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/dashboard/posts">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-sm font-bold text-foreground">
                Buat Postingan Baru
              </h1>
              <p className="text-xs text-muted-foreground">
                Isi semua kolom yang diperlukan sebelum menerbitkan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              form="create-post-form"
              type="submit"
              variant="outline"
              disabled={submitting || loadingData}
              size="sm"
              onClick={() => {
                publishIntent.current = false;
              }}
            >
              {submitting && !publishIntent.current && (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              )}
              Simpan Draft
            </Button>
            <Button
              form="create-post-form"
              type="submit"
              disabled={submitting || loadingData}
              size="sm"
              onClick={() => {
                publishIntent.current = true;
              }}
            >
              {submitting && publishIntent.current && (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              )}
              Terbitkan
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <main className="pt-36 pb-16">
        <form
          id="create-post-form"
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl flex-col gap-8 px-4"
        >
          {/* ── Title ── */}
          <FormSection label="Judul" htmlFor="title" error={errors.title}>
            <Input
              id="title"
              placeholder="Masukkan judul berita..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn("text-base", errors.title && "border-destructive")}
            />
          </FormSection>

          {/* ── Image ── */}
          <FormSection label="Gambar Utama" error={errors.imageUrl}>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              folder="portal-berita/posts"
              aspectRatio="video"
              disabled={submitting}
            />
          </FormSection>

          {/* ── Category ── */}
          <FormSection
            label="Kategori"
            htmlFor="categoryId"
            error={errors.categoryId}
          >
            <Select
              value={categoryId || "NONE"}
              onValueChange={(val) => setCategoryId(val === "NONE" ? "" : val)}
              disabled={loadingData}
            >
              <SelectTrigger
                id="categoryId"
                className={cn(errors.categoryId && "border-destructive")}
              >
                <SelectValue
                  placeholder={
                    loadingData ? "Memuat kategori..." : "Pilih kategori"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">
                  {loadingData ? "Memuat kategori..." : "Pilih kategori"}
                </SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormSection>

          {/* ── Authors ── */}
          <FormSection
            label="Penulis"
            error={errors.additionalAuthorIds}
            hint="Kamu otomatis menjadi penulis. Tambahkan penulis lain jika diperlukan."
          >
            <UserMultiSelect
              users={users}
              selectedIds={authorIds}
              onChange={setAuthorIds}
              lockedIds={session?.user?.id ? [session.user.id] : []}
              placeholder={
                loadingData ? "Memuat pengguna..." : "Tambah penulis lain..."
              }
            />
          </FormSection>

          {/* ── Full Content ── */}
          <FormSection label="Isi Konten" error={errors.fullContent}>
            <div
              className={cn(
                "rounded-md border",
                errors.fullContent ? "border-destructive" : "border-input",
              )}
            >
              <SimpleEditor value={fullContent} onChange={setFullContent} />
            </div>
          </FormSection>

          {/* ── Summary ── */}
          <FormSection
            label="Ringkasan"
            htmlFor="summary"
            error={errors.summary}
          >
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tulis ringkasan singkat berita (tampil di kartu berita)..."
              rows={4}
              className={cn(
                "border-input bg-background w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow]",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "resize-none placeholder:text-muted-foreground",
                errors.summary && "border-destructive",
              )}
            />
            <p className="text-right text-xs text-muted-foreground">
              {summary.length} karakter
            </p>
          </FormSection>
        </form>
      </main>
    </div>
  );
}
