"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Newspaper,
  Link2,
  Search,
  Check,
  X,
  ChevronsUpDown,
} from "lucide-react";
import Navbar from "@/components/custom/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PostOption {
  id: string;
  title: string;
  slug: string;
}

interface PostsResponse {
  data: PostOption[];
}

type Mode = "post" | "manual";

type FormErrors = Partial<Record<"text" | "labelLink" | "postId", string[]>>;

// ── Reusable form section ──────────────────────────────────────────────────────
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

// ── Post combobox picker ───────────────────────────────────────────────────────
function PostPicker({
  value,
  selectedTitle,
  onSelect,
  onClear,
  error,
}: {
  value: string;
  selectedTitle: string;
  onSelect: (post: PostOption) => void;
  onClear: () => void;
  error?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next && posts.length === 0) fetchPosts("");
  }

  function fetchPosts(q: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: "10",
          ...(q ? { q } : {}),
        });
        const res = await fetch(`/api/posts?${params}`);
        if (res.ok) {
          const json = (await res.json()) as PostsResponse;
          setPosts(json.data);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleQueryChange(val: string) {
    setQuery(val);
    fetchPosts(val);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-sm font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive",
            )}
          >
            <span className="truncate">
              {value ? selectedTitle : "Pilih post..."}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 size-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Cari judul post..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Tidak ada post ditemukan
              </p>
            ) : (
              posts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => {
                    onSelect(post);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      value === post.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="line-clamp-2">{post.title}</span>
                </button>
              ))
            )}
          </div>
          {value && (
            <>
              <Separator />
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
              >
                <X className="size-4" />
                Hapus pilihan
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>
      {error?.map((e) => (
        <p key={e} className="text-xs text-destructive">
          {e}
        </p>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CreateBreakingNewsPage() {
  const router = useRouter();
  const submitRef = useRef(false);

  const [mode, setMode] = useState<Mode>("manual");
  const [text, setText] = useState("");
  const [labelLink, setLabelLink] = useState("");
  const [postId, setPostId] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handlePostSelect(post: PostOption) {
    setPostId(post.id);
    setPostTitle(post.title);
    setText(post.title);
    setErrors((prev) => ({ ...prev, postId: undefined }));
  }

  function handlePostClear() {
    setPostId("");
    setPostTitle("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitRef.current) return;
    setServerError("");

    const clientErrors: FormErrors = {};
    if (!text.trim()) clientErrors.text = ["Teks ticker diperlukan"];
    if (mode === "post" && !postId)
      clientErrors.postId = ["Pilih post yang terkait"];
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});

    const payload = {
      text: text.trim(),
      labelLink:
        mode === "manual" && labelLink.trim() ? labelLink.trim() : null,
      postId: mode === "post" && postId ? postId : null,
      isActive,
    };

    submitRef.current = true;
    setSubmitting(true);
    try {
      const res = await fetch("/api/breaking-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = (await res.json()) as {
          error: string;
          details?: FormErrors;
        };
        if (json.details) {
          setErrors(json.details);
        } else {
          setServerError(json.error ?? "Terjadi kesalahan, coba lagi.");
        }
        return;
      }

      router.push("/dashboard/breaking-news");
    } catch {
      setServerError("Tidak dapat menghubungi server.");
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
              <Link href="/dashboard/breaking-news">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-sm font-bold text-foreground">
                Tambah Breaking News
              </h1>
              <p className="text-xs text-muted-foreground">
                Teks yang ditampilkan di marquee halaman utama
              </p>
            </div>
          </div>

          <Button
            form="create-breaking-news-form"
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
          id="create-breaking-news-form"
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-xl flex-col gap-8 px-4"
        >
          {/* Server error */}
          {serverError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {/* ── Source mode ── */}
          <FormSection label="Sumber Konten">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={mode === "post" ? "default" : "outline"}
                onClick={() => {
                  setMode("post");
                  setLabelLink("");
                }}
                className="flex-1"
              >
                <Newspaper className="size-3.5" />
                Dari Post
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "manual" ? "default" : "outline"}
                onClick={() => {
                  setMode("manual");
                  setPostId("");
                  setPostTitle("");
                }}
                className="flex-1"
              >
                <Link2 className="size-3.5" />
                Manual
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {mode === "post"
                ? "Pilih post yang sudah ada. Judul post akan digunakan sebagai teks ticker."
                : "Tulis teks ticker secara manual dengan tautan opsional."}
            </p>
          </FormSection>

          {/* ── Post picker (mode: post) ── */}
          {mode === "post" && (
            <FormSection
              label="Pilih Post"
              hint="Teks marquee akan menggunakan judul post yang dipilih."
              error={errors.postId}
            >
              <PostPicker
                value={postId}
                selectedTitle={postTitle}
                onSelect={handlePostSelect}
                onClear={handlePostClear}
                error={errors.postId}
              />
            </FormSection>
          )}

          {/* ── Ticker text ── */}
          <FormSection
            label="Teks Ticker"
            htmlFor="bn-text"
            hint="Teks yang akan muncul bergulir di marquee breaking news."
            error={errors.text}
          >
            <Input
              id="bn-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Contoh: Kodim 1422 Makassar gelar bakti sosial..."
              className={cn(errors.text && "border-destructive")}
              maxLength={300}
            />
            <p className="text-right text-xs text-muted-foreground">
              {text.length}/300
            </p>
          </FormSection>

          {/* ── Manual link (mode: manual) ── */}
          {mode === "manual" && (
            <FormSection
              label="Tautan (opsional)"
              htmlFor="bn-link"
              hint="URL atau label tautan eksternal yang dapat diklik."
              error={errors.labelLink}
            >
              <Input
                id="bn-link"
                value={labelLink}
                onChange={(e) => setLabelLink(e.target.value)}
                placeholder="https://contoh.com atau label singkat"
                className={cn(errors.labelLink && "border-destructive")}
                maxLength={200}
              />
            </FormSection>
          )}

          {/* ── Status ── */}
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Status</p>
              <p className="text-xs text-muted-foreground">
                Tampilkan item ini di marquee breaking news saat disimpan
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => setIsActive((v) => !v)}
            >
              {isActive ? "Aktif" : "Nonaktif"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
