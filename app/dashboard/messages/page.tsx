"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Trash2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  MailOpen,
  Mail,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  data: Message[];
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

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Read badge ────────────────────────────────────────────────────────────────

function ReadBadge({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        isRead
          ? "bg-foreground/10 text-foreground/50"
          : "bg-primary/10 text-primary",
      )}
    >
      {isRead ? (
        <>
          <MailOpen className="size-3" />
          Dibaca
        </>
      ) : (
        <>
          <Mail className="size-3" />
          Baru
        </>
      )}
    </span>
  );
}

// ── Row skeleton ──────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16 rounded-full mx-auto" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-24" />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // View dialog
  const [viewMessage, setViewMessage] = useState<Message | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete dialog
  const [confirmMessage, setConfirmMessage] = useState<Message | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toggle read loading
  const [togglingId, setTogglingId] = useState<string | null>(null);

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

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      });
      const res = await fetch(`/api/messages?${params}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  // Open view dialog — fetch full message then mark as read
  async function handleView(id: string) {
    setViewLoading(true);
    try {
      const res = await fetch(`/api/messages/${id}`);
      if (res.ok) {
        const msg: Message = await res.json();
        setViewMessage(msg);
        // If unread → mark as read
        if (!msg.isRead) {
          await fetch(`/api/messages/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true }),
          });
          // Update local list optimistically
          setData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              data: prev.data.map((m) =>
                m.id === id ? { ...m, isRead: true } : m,
              ),
            };
          });
          setViewMessage((prev) => (prev ? { ...prev, isRead: true } : prev));
        }
      }
    } finally {
      setViewLoading(false);
    }
  }

  // Toggle isRead
  async function handleToggleRead(msg: Message) {
    setTogglingId(msg.id);
    try {
      const res = await fetch(`/api/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !msg.isRead }),
      });
      if (res.ok) {
        const updated: Message = await res.json();
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: prev.data.map((m) => (m.id === updated.id ? updated : m)),
          };
        });
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error ?? "Gagal memperbarui status pesan");
      }
    } catch {
      toast.error("Gagal memperbarui status pesan");
    } finally {
      setTogglingId(null);
    }
  }

  // Delete
  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmMessage(null);
        toast.success("Pesan berhasil dihapus");
        const isLastOnPage = data?.data.length === 1 && page > 1;
        if (isLastOnPage) setPage((p) => p - 1);
        else await fetchMessages();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error ?? "Gagal menghapus pesan");
        setConfirmMessage(null);
      }
    } catch {
      toast.error("Gagal menghapus pesan");
      setConfirmMessage(null);
    } finally {
      setDeletingId(null);
    }
  }

  const messages = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background">
      {/* ── View message dialog ── */}
      <Dialog
        open={viewMessage !== null}
        onOpenChange={(open) => {
          if (!open) setViewMessage(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pesan</DialogTitle>
            {viewMessage && (
              <DialogDescription asChild>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">
                      {viewMessage.fullName}
                    </span>{" "}
                    &middot; {viewMessage.email}
                  </p>
                  {viewMessage.phoneNumber && (
                    <p>Telepon: {viewMessage.phoneNumber}</p>
                  )}
                  <p>{formatDateTime(viewMessage.createdAt)}</p>
                </div>
              </DialogDescription>
            )}
          </DialogHeader>
          {viewMessage && (
            <div className="rounded-lg bg-foreground/5 p-4 text-sm leading-relaxed text-foreground/80">
              {viewMessage.content}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewMessage(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={confirmMessage !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) setConfirmMessage(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pesan</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus pesan dari{" "}
              <span className="font-semibold text-foreground">
                {confirmMessage?.fullName}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              disabled={!!deletingId}
              onClick={() => setConfirmMessage(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => confirmMessage && handleDelete(confirmMessage.id)}
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
              Manajemen Pesan
            </h1>
          </div>
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
              placeholder="Cari nama atau email pengirim..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pesan</SelectItem>
              <SelectItem value="unread">Belum Dibaca</SelectItem>
              <SelectItem value="read">Sudah Dibaca</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table card */}
        <Card className="gap-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-foreground/5 hover:bg-foreground/5">
                <TableHead className="text-xs font-semibold uppercase tracking-wide">
                  Pengirim
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-24 text-center">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-32">
                  Tanggal
                </TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                      <MessageSquare className="size-10 opacity-30" />
                      <p className="text-sm font-medium">
                        {debouncedSearch || statusFilter !== "all"
                          ? "Tidak ada pesan yang cocok dengan filter."
                          : "Belum ada pesan masuk."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span
                          className={cn(
                            "truncate text-sm",
                            msg.isRead
                              ? "font-medium text-foreground/70"
                              : "font-bold text-foreground",
                          )}
                        >
                          {msg.fullName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {msg.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <ReadBadge isRead={msg.isRead} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(msg.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          disabled={viewLoading}
                          onClick={() => handleView(msg.id)}
                          title="Lihat pesan"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          disabled={togglingId === msg.id}
                          onClick={() => handleToggleRead(msg)}
                          title={
                            msg.isRead
                              ? "Tandai belum dibaca"
                              : "Tandai sudah dibaca"
                          }
                        >
                          {togglingId === msg.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : msg.isRead ? (
                            <Mail className="size-4" />
                          ) : (
                            <MailOpen className="size-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setConfirmMessage(msg)}
                          title="Hapus pesan"
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
