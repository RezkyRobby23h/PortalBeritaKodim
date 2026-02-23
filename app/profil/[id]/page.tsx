"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  Edit2,
  FileText,
  Loader2,
  Mail,
  Save,
  Shield,
  X,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/custom/navbar";
import { getInitials } from "@/utils/string";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileData {
  id: string;
  name: string;
  image: string | null;
  role: "USER" | "EDITOR" | "ADMIN";
  createdAt: string;
  postCount: number;
  // only present for own profile
  email: string | null;
  emailVerified: boolean | null;
  providers: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  EDITOR: "Editor",
  USER: "Pengguna",
};

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  EDITOR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  USER: "bg-foreground/10 text-foreground/60",
};

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  credential: "Email & Password",
};

const PROVIDER_ICONS: Record<string, string> = {
  google: "/icons/google.svg",
  github: "/icons/github.svg",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export default function ProfilPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  // start loading=true so the spinner shows immediately on mount
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  // track which id was last fetched to avoid stale closure issues
  const lastFetchedId = useRef<string | null>(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Avatar upload state
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const isOwner = !sessionLoading && session?.user?.id === id;

  // ── Fetch profile ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    // Skip if already fetched for this id
    if (lastFetchedId.current === id) return;
    lastFetchedId.current = id;

    fetch(`/api/profile/${id}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data: ProfileData = await res.json();
        setProfile(data);
        setNameInput(data.name);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // focus input when entering edit mode
  useEffect(() => {
    if (editing) setTimeout(() => nameRef.current?.focus(), 50);
  }, [editing]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleAvatarFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    if (!profile) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setAvatarUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "portal-berita/avatars");

      const uploadRes = await fetch("/api/upload", { method: "POST", body });
      const uploadJson = (await uploadRes.json()) as {
        url?: string;
        error?: string;
      };

      if (!uploadRes.ok) {
        setAvatarError(uploadJson.error ?? "Gagal mengunggah gambar.");
        return;
      }

      const newImageUrl = uploadJson.url ?? "";

      // Persist to database
      const patchRes = await fetch(`/api/profile/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: newImageUrl }),
      });

      if (!patchRes.ok) {
        const err = (await patchRes.json()) as { error?: string };
        setAvatarError(err.error ?? "Gagal menyimpan gambar.");
        return;
      }

      // Keep better-auth session image in sync
      await authClient.updateUser({ image: newImageUrl });

      setProfile((prev) => (prev ? { ...prev, image: newImageUrl } : prev));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      setAvatarError("Tidak dapat menghubungi server.");
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  function handleCancelEdit() {
    setEditing(false);
    setNameInput(profile?.name ?? "");
    setSaveError(null);
    setSaveSuccess(false);
  }

  async function handleSave() {
    if (!profile) return;
    const trimmed = nameInput.trim();
    if (trimmed.length < 2) {
      setSaveError("Nama minimal 2 karakter.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    // Use better-auth's built-in updateUser to keep session in sync
    const result = await authClient.updateUser({ name: trimmed });

    if (result.error) {
      setSaveError(result.error.message ?? "Gagal menyimpan perubahan.");
      setSaving(false);
      return;
    }

    // Also hit our own API to be consistent
    const res = await fetch(`/api/profile/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });

    if (!res.ok) {
      const err = await res.json();
      setSaveError(err.error ?? "Gagal menyimpan perubahan.");
      setSaving(false);
      return;
    }

    const updated: Pick<ProfileData, "name"> = await res.json();
    setProfile((prev) => (prev ? { ...prev, name: updated.name } : prev));
    setEditing(false);
    setSaveSuccess(true);
    setSaving(false);
    setTimeout(() => setSaveSuccess(false), 4000);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
            <p className="text-sm text-foreground/50">Memuat profil…</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="size-12 text-foreground/40" />
          <h2 className="text-2xl font-bold text-foreground/70">
            Pengguna tidak ditemukan
          </h2>
          <p className="text-sm text-foreground/50">
            Profil yang kamu cari tidak ada atau sudah dihapus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-24 md:px-8">
        {/* ── Hero / Avatar Section ───────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          {/* Avatar with coming-soon overlay for owners */}
          <div className="group relative">
            <Avatar className="size-28 ring-4 ring-background shadow-lg">
              <AvatarImage
                src={profile.image ?? undefined}
                alt={profile.name}
              />
              <AvatarFallback className="bg-foreground/20 text-2xl font-bold text-foreground">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>

            {isOwner && (
              <button
                type="button"
                title="Ganti foto profil"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
              >
                {avatarUploading ? (
                  <Loader2 className="size-5 animate-spin text-background" />
                ) : (
                  <Camera className="size-5 text-background" />
                )}
                <span className="mt-1 text-[10px] font-semibold text-background/90">
                  {avatarUploading ? "Mengunggah…" : "Ubah Foto"}
                </span>
              </button>
            )}
          </div>

          {/* Name */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {profile.name}
            </h1>

            {/* Role badge */}
            <span
              className={cn(
                "mt-1 rounded-full px-3 py-0.5 text-xs font-semibold",
                ROLE_STYLES[profile.role],
              )}
            >
              <Shield className="mr-1 inline-block size-3" />
              {ROLE_LABELS[profile.role] ?? profile.role}
            </span>
          </div>

          {/* Stats row */}
          <div className="mt-2 flex items-center gap-6 text-sm text-foreground/50">
            <span className="flex items-center gap-1.5">
              <FileText className="size-4" />
              {profile.postCount} postingan
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              Bergabung {formatDate(profile.createdAt)}
            </span>
          </div>

          {/* Success banner */}
          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <CheckCircle2 className="size-4 shrink-0" />
              Profil berhasil diperbarui.
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {/* ── Profile Info Card ──────────────────────────────────────────── */}
          <Card>
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription className="mt-1">
                    {isOwner
                      ? "Kelola informasi akun Anda."
                      : "Informasi publik pengguna ini."}
                  </CardDescription>
                </div>
                {isOwner && !editing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(true)}
                    className="gap-1.5"
                  >
                    <Edit2 className="size-3.5" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 pt-4">
              {/* Name field */}
              <div className="grid gap-1.5">
                <Label htmlFor="name">Nama Lengkap</Label>
                {editing ? (
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      ref={nameRef}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      placeholder="Nama lengkap"
                      aria-invalid={!!saveError}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                      className="gap-1.5"
                    >
                      {saving ? (
                        <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        <Save className="size-3.5" />
                      )}
                      Simpan
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {profile.name}
                  </p>
                )}
                {saveError && (
                  <p className="text-xs text-red-500">{saveError}</p>
                )}
              </div>

              {/* Email (owner only) */}
              {isOwner && profile.email && (
                <>
                  <Separator />
                  <div className="grid gap-1.5">
                    <Label className="flex items-center gap-1.5">
                      <Mail className="size-3.5 text-foreground/40" />
                      Email
                    </Label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {profile.email}
                      </p>
                      {profile.emailVerified ? (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <CheckCircle2 className="size-3" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                          <Clock className="size-3" />
                          Belum terverifikasi
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* ── Profile Picture Card (coming soon – owner only) ─────────── */}
          {isOwner && (
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle>Foto Profil</CardTitle>
                <CardDescription>
                  Ganti foto profil Anda untuk personalisasi akun.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-4 pt-4 sm:flex-row sm:items-center">
                {/* Hidden file input shared across triggers */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                  disabled={avatarUploading}
                />

                <Avatar className="size-16 ring-2 ring-foreground/20">
                  <AvatarImage
                    src={profile.image ?? undefined}
                    alt={profile.name}
                  />
                  <AvatarFallback className="bg-foreground/20 text-lg font-bold text-foreground">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm text-foreground/60">
                    Format yang didukung: JPG, PNG, GIF, WebP (maks 2 MB).
                  </p>
                  <p className="mt-1 text-xs text-foreground/40">
                    Foto akan disimpan ke Cloudinary dan langsung diperbarui di
                    semua halaman.
                  </p>
                  {avatarError && (
                    <p className="mt-1 text-xs text-destructive">
                      {avatarError}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="gap-1.5 shrink-0"
                >
                  {avatarUploading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Camera className="size-3.5" />
                  )}
                  {avatarUploading ? "Mengunggah…" : "Ganti Foto"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── Linked Accounts Card (owner only) ───────────────────────── */}
          {isOwner && profile.providers.length > 0 && (
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle>Metode Login</CardTitle>
                <CardDescription>
                  Akun yang terhubung dengan profil Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-4">
                {profile.providers.map((provider) => (
                  <div
                    key={provider}
                    className="flex items-center gap-3 rounded-lg border bg-foreground/5 px-4 py-3"
                  >
                    {PROVIDER_ICONS[provider] ? (
                      <Image
                        src={PROVIDER_ICONS[provider]}
                        alt={PROVIDER_LABELS[provider] ?? provider}
                        width={20}
                        height={20}
                        className="shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="size-5 rounded-full bg-foreground/20" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {PROVIDER_LABELS[provider] ?? provider}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs text-primary">
                      <CheckCircle2 className="size-3.5" />
                      Terhubung
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Recent Activity Placeholder ─────────────────────────────── */}
          <Card>
            <CardHeader className="border-b pb-4">
              <CardTitle>Statistik</CardTitle>
              <CardDescription>Ringkasan aktivitas pengguna.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
              <StatBox
                label="Total Postingan"
                value={profile.postCount}
                icon={<FileText className="size-5 text-blue-500" />}
              />
              <StatBox
                label="Peran"
                value={ROLE_LABELS[profile.role] ?? profile.role}
                icon={<Shield className="size-5 text-purple-500" />}
              />
              <StatBox
                label="Bergabung"
                value={formatDate(profile.createdAt)}
                icon={<CalendarDays className="size-5 text-amber-500" />}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// ─── StatBox helper ───────────────────────────────────────────────────────────
function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-xs">
      {icon}
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-foreground/50">{label}</p>
    </div>
  );
}
