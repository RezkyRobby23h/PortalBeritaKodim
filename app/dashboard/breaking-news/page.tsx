"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Newspaper,
  Link2,
  Check,
  X,
  ChevronsUpDown,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/custom/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface BreakingNewsItem {
  id: string;
  text: string;
  labelLink: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  postId: string | null;
  post: PostOption | null;
}

interface PaginatedResponse {
  data: BreakingNewsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FormState {
  text: string;
  labelLink: string;
  postId: string;
  isActive: boolean;
  mode: "post" | "manual";
}

type FormErrors = Partial<Record<"text" | "labelLink" | "postId", string[]>>;

const LIMIT = 10;
const EMPTY_FORM: FormState = {
  text: "",
  labelLink: "",
  postId: "",
  isActive: true,
  mode: "manual",
};

// ── Row skeleton ──────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-full max-w-xs" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-4 w-24 ml-auto" />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  );
}

// ── Post picker (combobox) ────────────────────────────────────────────────────
function PostPicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (id: string, title: string) => void;
  error?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: "10",
          ...(query ? { q: query } : {}),
        });
        const res = await fetch(`/api/posts?${params}`);
        if (res.ok) {
          const json = (await res.json()) as { data: PostOption[] };
          setPosts(json.data);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query, open]);

  function handleSelect(post: PostOption) {
    setSelectedTitle(post.title);
    onChange(post.id, post.title);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
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
              {value ? selectedTitle || "Post dipilih" : "Pilih post..."}
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
              onChange={(e) => setQuery(e.target.value)}
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
                  onClick={() => handleSelect(post)}
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
                  setSelectedTitle("");
                  onChange("", "");
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

// ── Form section wrapper ──────────────────────────────────────────────────────
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BreakingNewsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BreakingNewsItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const confirmItem = (data?.data ?? []).find((n) => n.id === confirmDeleteId);

  // ── Search debounce ─────────────────────────────────────────────────────────
  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 350);
  }

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
      });
      const res = await fetch(`/api/breaking-news?${params}`);
      if (res.ok) setData((await res.json()) as PaginatedResponse);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── Open edit dialog ────────────────────────────────────────────────────────
  function openEdit(item: BreakingNewsItem) {
    setEditingItem(item);
    setForm({
      text: item.text,
      labelLink: item.labelLink ?? "",
      postId: item.postId ?? "",
      isActive: item.isActive,
      mode: item.postId ? "post" : "manual",
    });
    setFormErrors({});
    setDialogOpen(true);
  }

  // ── Submit form (edit only) ────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !editingItem) return;

    const clientErrors: FormErrors = {};
    if (!form.text.trim()) {
      clientErrors.text = ["Teks ticker diperlukan"];
    }
    if (form.mode === "post" && !form.postId) {
      clientErrors.postId = ["Pilih post yang terkait"];
    }
    if (Object.keys(clientErrors).length > 0) {
      setFormErrors(clientErrors);
      return;
    }
    setFormErrors({});
    setSubmitting(true);

    const payload = {
      text: form.text.trim(),
      labelLink:
        form.mode === "manual" && form.labelLink.trim()
          ? form.labelLink.trim()
          : null,
      postId: form.mode === "post" && form.postId ? form.postId : null,
      isActive: form.isActive,
    };

    try {
      const res = await fetch(`/api/breaking-news?id=${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = (await res.json()) as {
          error: string;
          details?: FormErrors;
        };
        if (json.details) {
          setFormErrors(json.details);
        } else {
          toast.error(json.error ?? "Terjadi kesalahan, coba lagi.");
        }
        return;
      }

      toast.success("Breaking news berhasil diperbarui");
      setDialogOpen(false);
      await fetchItems();
    } catch {
      toast.error("Tidak dapat menghubungi server.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/breaking-news?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConfirmDeleteId(null);
        toast.success("Breaking news berhasil dihapus");
        const isLastOnPage = data?.data.length === 1 && page > 1;
        if (isLastOnPage) setPage((p) => p - 1);
        else await fetchItems();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error ?? "Gagal menghapus breaking news");
        setConfirmDeleteId(null);
      }
    } catch {
      toast.error("Gagal menghapus breaking news");
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  }

  // ── Quick toggle isActive ───────────────────────────────────────────────────
  async function toggleActive(item: BreakingNewsItem) {
    try {
      const res = await fetch(`/api/breaking-news?id=${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        await fetchItems();
        toast.success(
          item.isActive
            ? "Breaking news dinonaktifkan"
            : "Breaking news diaktifkan",
        );
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error ?? "Gagal mengubah status breaking news");
      }
    } catch {
      toast.error("Gagal mengubah status breaking news");
    }
  }

  const items = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Delete confirmation dialog ────────────────────────────────────── */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) setConfirmDeleteId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Breaking News</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus item{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{confirmItem?.text}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              disabled={!!deletingId}
              onClick={() => setConfirmDeleteId(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            >
              {deletingId && (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              )}
              {deletingId ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create / Edit dialog ─────────────────────────────────────────── */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open && !submitting) setDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Breaking News</DialogTitle>
            <DialogDescription>
              Perbarui teks atau tautan breaking news.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            {/* Mode selector */}
            <FormSection label="Sumber Konten">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={form.mode === "post" ? "default" : "outline"}
                  onClick={() =>
                    setForm((f) => ({ ...f, mode: "post", labelLink: "" }))
                  }
                  className="flex-1"
                >
                  <Newspaper className="size-3.5" />
                  Dari Post
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={form.mode === "manual" ? "default" : "outline"}
                  onClick={() =>
                    setForm((f) => ({ ...f, mode: "manual", postId: "" }))
                  }
                  className="flex-1"
                >
                  <Link2 className="size-3.5" />
                  Manual
                </Button>
              </div>
            </FormSection>

            {/* Post picker */}
            {form.mode === "post" && (
              <FormSection
                label="Pilih Post"
                hint="Teks marquee akan menggunakan judul post."
                error={formErrors.postId}
              >
                <PostPicker
                  value={form.postId}
                  onChange={(id, title) =>
                    setForm((f) => ({
                      ...f,
                      postId: id,
                      text: title || f.text,
                    }))
                  }
                  error={formErrors.postId}
                />
              </FormSection>
            )}

            {/* Text */}
            <FormSection
              label="Teks Ticker"
              htmlFor="bn-text"
              hint="Teks yang muncul di marquee breaking news."
              error={formErrors.text}
            >
              <Input
                id="bn-text"
                value={form.text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, text: e.target.value }))
                }
                placeholder="Tulis teks marquee..."
                className={cn(formErrors.text && "border-destructive")}
                maxLength={300}
              />
              <p className="text-right text-xs text-muted-foreground">
                {form.text.length}/300
              </p>
            </FormSection>

            {/* Manual link label */}
            {form.mode === "manual" && (
              <FormSection
                label="Label Tautan (opsional)"
                htmlFor="bn-link"
                hint="URL atau label eksternal opsional untuk item ini."
                error={formErrors.labelLink}
              >
                <Input
                  id="bn-link"
                  value={form.labelLink}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, labelLink: e.target.value }))
                  }
                  placeholder="https://contoh.com atau label singkat"
                  className={cn(formErrors.labelLink && "border-destructive")}
                  maxLength={200}
                />
              </FormSection>
            )}

            {/* isActive toggle */}
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Status</p>
                <p className="text-xs text-muted-foreground">
                  Tampilkan item ini di marquee breaking news
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant={form.isActive ? "default" : "outline"}
                onClick={() =>
                  setForm((f) => ({ ...f, isActive: !f.isActive }))
                }
              >
                {form.isActive ? "Aktif" : "Nonaktif"}
              </Button>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                )}
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Navbar variant="dashboard" />

      {/* ── Sticky top bar ───────────────────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-16 z-40 border-b border-foreground/10 bg-card/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <h1 className="text-sm font-bold text-foreground">
            Manajemen Breaking News
          </h1>
          <Button asChild size="sm">
            <Link href="/dashboard/breaking-news/create">
              <Plus className="size-3.5" />
              Tambah Item
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 pt-36 pb-16">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari teks breaking news..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List card */}
        <Card className="py-0 gap-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-foreground/5 hover:bg-foreground/5">
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-20">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide">
                  Teks Ticker
                </TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wide w-36 text-right sm:table-cell">
                  Sumber
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-24 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                      <Newspaper className="size-8 opacity-30" />
                      <p className="text-sm">
                        {debouncedSearch
                          ? "Tidak ada item yang cocok dengan pencarian"
                          : "Belum ada breaking news"}
                      </p>
                      {!debouncedSearch && (
                        <Button asChild size="sm" variant="outline">
                          <Link href="/dashboard/breaking-news/create">
                            <Plus className="size-3.5" />
                            Tambah Item
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <button
                        type="button"
                        title={
                          item.isActive
                            ? "Klik untuk nonaktifkan"
                            : "Klik untuk aktifkan"
                        }
                        onClick={() => toggleActive(item)}
                        className="cursor-pointer"
                      >
                        <Badge
                          variant={item.isActive ? "default" : "secondary"}
                        >
                          {item.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="max-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.text}
                      </p>
                    </TableCell>
                    <TableCell className="hidden text-right sm:table-cell">
                      {item.post ? (
                        <Badge variant="outline" className="text-xs">
                          <Newspaper className="mr-1 size-3" />
                          Post
                        </Badge>
                      ) : item.labelLink ? (
                        <Badge variant="outline" className="text-xs">
                          <Link2 className="mr-1 size-3" />
                          Manual
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(item)}
                          title="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setConfirmDeleteId(item.id)}
                          title="Hapus"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Halaman {page} dari {totalPages} &bull; {data?.total ?? 0} item
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-3.5" />
                Sebelumnya
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Selanjutnya
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
