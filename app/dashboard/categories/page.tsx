"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Loader2,
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
import { toPascalCase } from "@/utils/string";
import { CategoryBadge } from "@/components/custom/category-badge";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  _count: { posts: number };
}

interface PaginatedResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 10;

// ── Helpers ──────────────────────────────────────────────────────────────────

// ── Row skeleton ──────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-28 rounded-full" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-12 ml-auto" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-md" />
      </TableCell>
    </TableRow>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirmCategory = (data?.data ?? []).find((c) => c.id === confirmId);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 350);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
      });
      const res = await fetch(`/api/categories?${params}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/category?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmId(null);
        // Refetch; if last item on page > 1, go back
        const isLastOnPage = data?.data.length === 1 && page > 1;
        if (isLastOnPage) setPage((p) => p - 1);
        else await fetchCategories();
      }
    } finally {
      setDeletingId(null);
    }
  }

  const categories = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={confirmId !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) setConfirmId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus kategori{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{toPascalCase(confirmCategory?.name ?? "")}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan dan semua postingan yang
              terkait dengan kategori ini akan kehilangan kategorinya.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              disabled={!!deletingId}
              onClick={() => setConfirmId(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => confirmId && handleDelete(confirmId)}
            >
              {deletingId ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : null}
              {deletingId ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Navbar variant="dashboard" />

      {/* Sticky top bar */}
      <div className="fixed left-0 right-0 top-16 z-40 border-b border-foreground/10 bg-card/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-bold text-foreground">
              Manajemen Kategori
            </h1>
          </div>

          <Button asChild size="sm">
            <Link href="/dashboard/categories/create">
              <Plus className="size-3.5" />
              Kategori Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 pt-36 pb-16">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama kategori..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table card */}
        <Card className="py-0 gap-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-foreground/5 hover:bg-foreground/5">
                <TableHead className="text-xs font-semibold uppercase tracking-wide">
                  Nama
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wide w-24">
                  Postingan
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                      <Tag className="size-10 opacity-30" />
                      <p className="text-sm font-medium">
                        {debouncedSearch
                          ? `Tidak ada kategori yang cocok dengan "${debouncedSearch}"`
                          : "Belum ada kategori. Buat yang pertama!"}
                      </p>
                      {!debouncedSearch && (
                        <Button asChild size="sm" variant="outline">
                          <Link href="/dashboard/categories/create">
                            <Plus className="mr-1.5 size-3.5" />
                            Buat Kategori
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <CategoryBadge name={cat.name} color={cat.color} />
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {cat._count.posts} <span className="text-xs">post</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setConfirmId(cat.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
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

              {/* Page number pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1),
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                    acc.push("...");
                  }
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
