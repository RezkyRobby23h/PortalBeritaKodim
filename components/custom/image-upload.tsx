"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  /** Currently stored image URL (empty string = no image). */
  value: string;
  /** Called with the new Cloudinary URL after a successful upload, or "" when cleared. */
  onChange: (url: string) => void;
  /** Cloudinary sub-folder to upload into. */
  folder?: string;
  /** Controls the preview container shape. */
  aspectRatio?: "square" | "video";
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "portal-berita",
  aspectRatio = "video",
  disabled = false,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openPicker() {
    if (!disabled && !uploading) inputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        setError(json.error ?? "Gagal mengunggah gambar.");
        return;
      }
      if (json.url) onChange(json.url);
    } catch {
      setError("Tidak dapat menghubungi server.");
    } finally {
      setUploading(false);
      // reset so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {value ? (
        /* ── Preview ── */
        <div
          className={cn(
            "group relative w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700",
            aspectRatio === "square" ? "aspect-square" : "aspect-video",
          )}
        >
          <Image
            src={value}
            alt="Pratinjau gambar"
            fill
            className="object-cover"
          />

          {/* Overlay on hover */}
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={openPicker}
                disabled={uploading}
                className="gap-1.5 shadow"
              >
                {uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <ImageUp className="size-3.5" />
                )}
                Ganti
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onChange("")}
                disabled={uploading}
                className="gap-1.5 shadow"
              >
                <X className="size-3.5" />
                Hapus
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* ── Drop-zone / click-to-upload ── */
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled || uploading}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-100 text-zinc-400 transition dark:border-zinc-700 dark:bg-zinc-800/50",
            aspectRatio === "square" ? "aspect-square" : "h-44",
            !disabled &&
              !uploading &&
              "cursor-pointer hover:border-zinc-400 hover:text-zinc-500 dark:hover:border-zinc-500",
            (disabled || uploading) && "cursor-not-allowed opacity-60",
          )}
        >
          {uploading ? (
            <Loader2 className="size-8 animate-spin opacity-60" />
          ) : (
            <ImageUp className="size-8 opacity-50" />
          )}
          <p className="text-sm font-medium">
            {uploading ? "Mengunggah…" : "Klik untuk pilih gambar"}
          </p>
          {!uploading && (
            <p className="text-xs opacity-70">
              JPG, PNG, GIF, WebP · maks 2 MB
            </p>
          )}
        </button>
      )}

      {/* Error message */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
