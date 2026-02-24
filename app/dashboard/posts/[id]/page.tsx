"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/custom/navbar";
import { ImageUpload } from "@/components/custom/image-upload";
import {
  UserMultiSelect,
  SelectableUser,
} from "@/components/custom/user-multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { updatePostSchema, UpdatePostFormErrors } from "@/lib/schemas/post";
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

// ── Field skeleton ─────────────────────────────────────────────────────────────
function FieldSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-24" />
      <Skeleton
        className="w-full rounded-md"
        style={{ height: rows === 1 ? 36 : rows * 24 + 16 }}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<SelectableUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [fullContent, setFullContent] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isHighlight, setIsHighlight] = useState(false);

  const [errors, setErrors] = useState<UpdatePostFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const publishIntent = useRef(false);

  // Fetch post + categories + users on mount
  useEffect(() => {
    async function load() {
      try {
        const [postRes, catRes, userRes] = await Promise.all([
          fetch(`/api/post?id=${id}`),
          fetch("/api/categories?limit=100"),
          fetch("/api/users"),
        ]);

        if (postRes.status === 404) {
          setNotFound(true);
          return;
        }

        if (postRes.ok) {
          const post = (await postRes.json()) as {
            title: string;
            categoryId: string;
            fullContent: string;
            summary: string;
            image: string | null;
            isHighlight: boolean;
            authors: Array<{ id: string }>;
          };
          setTitle(post.title);
          setCategoryId(post.categoryId);
          setFullContent(post.fullContent);
          setSummary(post.summary);
          setImageUrl(post.image ?? "");
          setIsHighlight(post.isHighlight);
          setAuthorIds(post.authors.map((a) => a.id));
        }

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
  }, [id]);

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const parsed = updatePostSchema.safeParse({
      title,
      categoryId,
      authorIds,
      fullContent,
      summary,
      published: publishIntent.current,
      isHighlight,
      imageUrl: imageUrl || "",
    });

    if (!parsed.success) {
      setErrors(
        z.flattenError(parsed.error).fieldErrors as UpdatePostFormErrors,
      );
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const res = await fetch(`/api/post?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const json = await res.json();
        setServerError(json.error ?? "Terjadi kesalahan, coba lagi.");
        return;
      }

      router.push("/dashboard/posts");
    } catch {
      setServerError("Tidak dapat menghubungi server.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="dashboard" />
        <main className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 pt-40 text-center">
          <p className="text-4xl font-bold text-foreground/20">404</p>
          <p className="text-sm text-muted-foreground">
            Postingan tidak ditemukan.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/posts">
              <ArrowLeft className="mr-1.5 size-3.5" />
              Kembali ke Daftar
            </Link>
          </Button>
        </main>
      </div>
    );
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
                Edit Postingan
              </h1>
              <p className="text-xs text-muted-foreground">
                Perbarui konten dan pengaturan postingan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              form="edit-post-form"
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
              form="edit-post-form"
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
          id="edit-post-form"
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl flex-col gap-8 px-4"
        >
          {/* Server error */}
          {serverError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {loadingData ? (
            <>
              <FieldSkeleton />
              <FieldSkeleton rows={6} />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton rows={18} />
              <FieldSkeleton rows={4} />
            </>
          ) : (
            <>
              {/* ── Title ── */}
              <FormSection label="Judul" htmlFor="title" error={errors.title}>
                <Input
                  id="title"
                  placeholder="Masukkan judul berita..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(
                    "text-base",
                    errors.title && "border-destructive",
                  )}
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

              {/* ── Category + Highlight ── */}
              <FormSection
                label="Kategori"
                htmlFor="categoryId"
                error={errors.categoryId}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select
                      value={categoryId || "NONE"}
                      onValueChange={(val) =>
                        setCategoryId(val === "NONE" ? "" : val)
                      }
                    >
                      <SelectTrigger
                        id="categoryId"
                        className={cn(
                          "w-full",
                          errors.categoryId && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Pilih kategori</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Toggle
                    pressed={isHighlight}
                    onPressedChange={setIsHighlight}
                    variant="outline"
                    aria-label="Tandai sebagai highlight"
                    className="shrink-0"
                  >
                    Highlight
                  </Toggle>
                </div>
              </FormSection>

              {/* ── Authors ── */}
              <FormSection
                label="Penulis"
                error={errors.authorIds}
                hint="Tambahkan atau hapus penulis postingan ini."
              >
                <UserMultiSelect
                  users={users}
                  selectedIds={authorIds}
                  onChange={setAuthorIds}
                  lockedIds={session?.user?.id ? [session.user.id] : []}
                  placeholder="Tambah penulis lain..."
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
            </>
          )}
        </form>
      </main>
    </div>
  );
}
