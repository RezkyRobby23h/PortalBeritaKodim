"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  User,
} from "lucide-react";
import Navbar from "@/components/custom/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ─────────────────────────────────────────────────────────────────────
type Role = "USER" | "EDITOR" | "ADMIN";

interface UserItem {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  createdAt: string;
}

interface PaginatedResponse {
  data: UserItem[];
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

// ── Role badge ─────────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<
  Role,
  { label: string; className: string; icon: React.ReactNode }
> = {
  ADMIN: {
    label: "Admin",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
    icon: <ShieldAlert className="size-3" />,
  },
  EDITOR: {
    label: "Editor",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
    icon: <ShieldCheck className="size-3" />,
  },
  USER: {
    label: "User",
    className:
      "bg-foreground/10 text-foreground/60 border border-foreground/20",
    icon: <User className="size-3" />,
  },
};

function RoleBadge({ role }: { role: Role }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.USER;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        cfg.className,
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Row skeleton ──────────────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-8 w-28 rounded-md" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(debouncedSearch ? { q: debouncedSearch } : {}),
        ...(roleFilter ? { role: roleFilter } : {}),
      });
      const res = await fetch(`/api/users?${params}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleFilter = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  async function handleRoleChange(user: UserItem, newRole: Role) {
    if (user.role === newRole) return;
    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role: newRole }),
      });
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: prev.data.map((u) =>
              u.id === user.id ? { ...u, role: newRole } : u,
            ),
          };
        });
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/user?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmUser(null);
        const isLastOnPage = data?.data.length === 1 && page > 1;
        if (isLastOnPage) setPage((p) => p - 1);
        else await fetchUsers();
      }
    } finally {
      setDeletingId(null);
    }
  }

  const users = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={confirmUser !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) setConfirmUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus pengguna{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{confirmUser?.name}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              disabled={!!deletingId}
              onClick={() => setConfirmUser(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => confirmUser && handleDelete(confirmUser.id)}
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
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <h1 className="text-sm font-bold text-foreground">
            Manajemen Pengguna
          </h1>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 pt-36 pb-16">
        {/* Filters row */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Role filter */}
          <Select
            value={roleFilter || "ALL"}
            onValueChange={(val) => handleRoleFilter(val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Role</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="EDITOR">Editor</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table card */}
        <Card className="overflow-hidden gap-0 py-0">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 bg-foreground/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Pengguna</span>
            <span className="w-16">Role</span>
            <span className="w-28 text-center">Ubah Role</span>
            <span className="w-24">Bergabung</span>
            <span className="w-8" />
          </div>

          <Separator />

          {/* Rows */}
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <RowSkeleton />
                {i < 4 && <Separator />}
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
              <Users className="size-10 opacity-30" />
              <p className="text-sm font-medium">
                {debouncedSearch
                  ? `Tidak ada pengguna yang cocok dengan "${debouncedSearch}"`
                  : roleFilter
                    ? `Tidak ada pengguna dengan role tersebut`
                    : "Belum ada pengguna."}
              </p>
            </div>
          ) : (
            users.map((user, i) => (
              <div key={user.id}>
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-4 py-3">
                  {/* Name + email */}
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>

                  {/* Current role badge */}
                  <div className="w-16">
                    <RoleBadge role={user.role} />
                  </div>

                  {/* Role change select */}
                  <div className="w-28 flex items-center gap-1.5">
                    <Select
                      value={user.role}
                      disabled={updatingId === user.id}
                      onValueChange={(val) =>
                        handleRoleChange(user, val as Role)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="EDITOR">Editor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingId === user.id && (
                      <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  {/* Join date */}
                  <span className="w-24 text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </span>

                  {/* Delete */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setConfirmUser(user)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                {i < users.length - 1 && <Separator />}
              </div>
            ))
          )}
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
