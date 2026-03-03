"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Eye,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/custom/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { toast } from "sonner";
import { toPascalCase } from "@/utils/string";
import { CategoryBadge } from "@/components/custom/category-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Author {
  id: string;
  name: string;
  image: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  isHighlight: boolean;
  views: number;
  createdAt: string;
  category: { id: string; name: string; color: string | null };
  authors: Author[];
}

interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface PaginatedResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        published
          ? "bg-primary/10 text-primary"
          : "bg-foreground/10 text-foreground/50",
      )}
    >
      {published ? "Terbit" : "Draft"}
    </span>
  );
}

// ── Row skeleton ──────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-14 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-6 rounded" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-6" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-16 rounded-md" />
      </TableCell>
    </TableRow>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PostsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmPost, setConfirmPost] = useState<Post | null>(null);
  const [togglingHighlightId, setTogglingHighlightId] = useState<string | null>(
    null,
  );
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 350);
  };

  // Fetch categories for filter dropdown (once)
  useEffect(() => {
    fetch("/api/categories?limit=100")
      .then((r) => r.json())
      .then((json) => setCategories(json.data ?? []));
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
        ...(categoryFilter ? { categoryId: categoryFilter } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      });
      const res = await fetch(`/api/posts?${params}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset to page 1 when filters change
  const handleCategoryFilter = (val: string) => {
    setCategoryFilter(val);
    setPage(1);
  };
  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmPost(null);
        toast.success("Postingan berhasil dihapus");
        const isLastOnPage = data?.data.length === 1 && page > 1;
        if (isLastOnPage) setPage((p) => p - 1);
        else await fetchPosts();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error ?? "Gagal menghapus postingan");
        setConfirmPost(null);
      }
    } catch {
      toast.error("Gagal menghapus postingan");
      setConfirmPost(null);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleHighlight(post: Post) {
    setTogglingHighlightId(post.id);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHighlight: !post.isHighlight }),
      });
      if (res.ok) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                data: prev.data.map((p) =>
                  p.id === post.id
                    ? { ...p, isHighlight: !post.isHighlight }
                    : p,
                ),
              }
            : prev,
        );
        toast.success(
          post.isHighlight
            ? "Postingan dihapus dari sorotan"
            : "Postingan ditandai sebagai sorotan",
        );
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error ?? "Gagal memperbarui sorotan");
      }
    } catch {
      toast.error("Gagal memperbarui sorotan");
    } finally {
      setTogglingHighlightId(null);
    }
  }

  const posts = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={confirmPost !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) setConfirmPost(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Postingan</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus postingan{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{confirmPost?.title}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              disabled={!!deletingId}
              onClick={() => setConfirmPost(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => confirmPost && handleDelete(confirmPost.id)}
            >
              {deletingId && (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              )}
              {deletingId ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Navbar variant="dashboard" />

      {/* Sticky top bar */}
      <div className="fixed left-0 right-0 top-16 z-40 border-b border-foreground/10 bg-card/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-bold text-foreground">
              Manajemen Postingan
            </h1>
          </div>

          <Button asChild size="sm">
            <Link href="/dashboard/posts/create">
              <Plus className="size-3.5" />
              Postingan Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 pt-36 pb-16">
        {/* Filters row */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari judul postingan..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category filter */}
          <Select
            value={categoryFilter || "ALL"}
            onValueChange={(val) =>
              handleCategoryFilter(val === "ALL" ? "" : val)
            }
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {toPascalCase(c.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => handleStatusFilter(val)}
          >
            <SelectTrigger className="sm:w-36">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="published">Terbit</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table card */}
        <Card className="gap-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-foreground/5 hover:bg-foreground/5">
                <TableHead className="text-xs font-semibold uppercase tracking-wide">
                  Judul
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-28">
                  Kategori
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-20 text-center">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-10 text-center">
                  <Sparkles className="size-3.5 mx-auto" />
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-10 text-center">
                  <Eye className="size-3.5 mx-auto" />
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-28">
                  Tanggal
                </TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                      <FileText className="size-10 opacity-30" />
                      <p className="text-sm font-medium">
                        {debouncedSearch ||
                        categoryFilter ||
                        statusFilter !== "all"
                          ? "Tidak ada postingan yang cocok dengan filter."
                          : "Belum ada postingan. Buat yang pertama!"}
                      </p>
                      {!debouncedSearch &&
                        !categoryFilter &&
                        statusFilter === "all" && (
                          <Button asChild size="sm" variant="outline">
                            <Link href="/dashboard/posts/create">
                              <Plus className="mr-1.5 size-3.5" />
                              Buat Postingan
                            </Link>
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm font-medium text-foreground">
                          {post.title}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {post.authors.map((a) => a.name).join(", ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CategoryBadge
                        name={post.category.name}
                        color={post.category.color}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge published={post.published} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "size-7",
                          post.isHighlight
                            ? "text-amber-400 hover:text-amber-500"
                            : "text-muted-foreground hover:text-amber-400",
                        )}
                        disabled={togglingHighlightId === post.id}
                        onClick={() => handleToggleHighlight(post)}
                        aria-label={
                          post.isHighlight
                            ? "Hapus highlight"
                            : "Jadikan highlight"
                        }
                      >
                        {togglingHighlightId === post.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Sparkles
                            className="size-3.5"
                            fill={post.isHighlight ? "currentColor" : "none"}
                          />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {post.views}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-foreground"
                        >
                          <Link href={`/dashboard/posts/${post.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setConfirmPost(post)}
                        >
                          <Trash2 className="size-4" />
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
        {!loading && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1),
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                    acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-1">
                      …
                    </span>
                  ) : (
                    <Button
                      key={item}
                      size="icon"
                      variant={item === page ? "default" : "outline"}
                      className="size-8 text-xs"
                      onClick={() => setPage(item as number)}
                    >
                      {item}
                    </Button>
                  ),
                )}

              <Button
                size="icon"
                variant="outline"
                className="size-8"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
