"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/string";

export interface SelectableUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface UserMultiSelectProps {
  users: SelectableUser[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  /** IDs that are fixed / non-removable (e.g. current session user) */
  lockedIds?: string[];
  placeholder?: string;
  className?: string;
}

export function UserMultiSelect({
  users,
  selectedIds,
  onChange,
  lockedIds = [],
  placeholder = "Tambah penulis...",
  className,
}: UserMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggle = (id: string) => {
    if (lockedIds.includes(id)) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const remove = (id: string) => {
    if (lockedIds.includes(id)) return;
    onChange(selectedIds.filter((s) => s !== id));
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedUsers = users.filter((u) => selectedIds.includes(u.id));

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Selected tags */}
      {selectedUsers.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedUsers.map((u) => {
            const locked = lockedIds.includes(u.id);
            return (
              <span
                key={u.id}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  locked
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-foreground/20 bg-foreground/10 text-foreground/70",
                )}
              >
                <Avatar className="size-4">
                  <AvatarImage src={u.image ?? undefined} />
                  <AvatarFallback className="text-[8px]">
                    {getInitials(u.name)}
                  </AvatarFallback>
                </Avatar>
                {u.name}
                {locked ? (
                  <span className="ml-0.5 text-[10px] opacity-60">(kamu)</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => remove(u.id)}
                    className="ml-0.5 rounded-full hover:text-red-500"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Trigger */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((o) => !o)}
        className="w-full justify-between font-normal"
      >
        <span className="text-muted-foreground">{placeholder}</span>
        <ChevronsUpDown className="size-4 opacity-50" />
      </Button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-foreground/10 bg-card shadow-lg">
          <div className="p-2">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pengguna..."
              className="w-full rounded-sm border border-foreground/20 bg-transparent px-2 py-1.5 text-sm outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto pb-1">
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                Tidak ada pengguna ditemukan
              </li>
            )}
            {filtered.map((u) => {
              const selected = selectedIds.includes(u.id);
              const locked = lockedIds.includes(u.id);
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => toggle(u.id)}
                    disabled={locked}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                      locked
                        ? "cursor-default opacity-60"
                        : "hover:bg-foreground/10",
                    )}
                  >
                    <Avatar className="size-6 shrink-0">
                      <AvatarImage src={u.image ?? undefined} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(u.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {u.email}
                      </p>
                    </div>
                    {selected && (
                      <Check className="ml-auto size-4 shrink-0 text-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
