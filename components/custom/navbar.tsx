"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  User,
  LogIn,
  UserPlus,
  FileText,
  Bell,
  Users,
  Tag,
  MessageSquare,
  Menu,
  X,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/string";

// --- Types ---
interface NavLink {
  label: string;
  href: string;
}

const publicLinks: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Program Pembinaan", href: "/program-pembinaan" },
  { label: "Aduan", href: "/kontak" },
];

const dashboardLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Postingan", href: "/dashboard/posts" },
  { label: "Breaking News", href: "/dashboard/breaking-news" },
  { label: "Pengguna", href: "/dashboard/users" },
  { label: "Kategori", href: "/dashboard/categories" },
  { label: "Pesan", href: "/dashboard/messages" },
];

const dashboardIcons: Record<string, React.ElementType> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/posts": FileText,
  "/dashboard/breaking-news": Bell,
  "/dashboard/users": Users,
  "/dashboard/categories": Tag,
  "/dashboard/messages": MessageSquare,
};

// --- Main Navbar ---
interface NavbarProps {
  variant?: "public" | "dashboard";
}

export default function Navbar({ variant = "public" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when panel opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
    setSearchOpen(false);
    setSearchValue("");
  }

  const userRole = session?.user?.role;
  const isPrivileged = userRole === "EDITOR" || userRole === "ADMIN";
  const isAdmin = userRole === "ADMIN";

  const visibleDashboardLinks = isAdmin
    ? dashboardLinks
    : dashboardLinks.filter((l) => l.href !== "/dashboard/users");

  const links = variant === "dashboard" ? visibleDashboardLinks : publicLinks;

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-card/70 backdrop-blur-md"
      data-search-open={searchOpen}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        {/* ── Logo & Title ── */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo Kodim"
            width={36}
            height={36}
            className="rounded-sm object-contain"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-extrabold tracking-tight">
              KODIM 1408/MKS
            </span>
            <span className="text-[10px] font-bold tracking-wide text-foreground/70">
              MAEIKI A&apos;BULO SIBATANG
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map((link) => {
            const Icon = dashboardIcons[link.href];
            const active =
              link.href === "/" || link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-foreground/10",
                  )}
                >
                  {Icon && <Icon className="size-4 shrink-0" />}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right Side: Theme + Avatar ── */}
        <div className="flex shrink-0 items-center gap-1">
          {pathname === "/" && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-9 transition-colors",
                searchOpen && "bg-primary/10 text-primary",
              )}
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Cari berita"
            >
              <Search className="size-4" />
            </Button>
          )}
          <ThemeToggle />

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="size-9 rounded-full p-0 focus-visible:ring-2"
              >
                <Avatar className="size-8">
                  <AvatarImage
                    src={session?.user?.image ?? undefined}
                    alt={session?.user?.name ?? "Pengguna"}
                  />
                  <AvatarFallback className="text-xs bg-foreground/10 text-foreground">
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {session ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <p className="truncate text-sm font-medium text-foreground">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {isPrivileged && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <LayoutDashboard />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href={`/profil/${session.user.id}`}>
                        <User />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin">
                      <LogIn />
                      Masuk
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signup">
                      <UserPlus />
                      Daftar
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* ── Search Dropdown ── */}
      {pathname === "/" && (
        <div
          className={cn(
            "overflow-hidden border-foreground/10 bg-card/90 backdrop-blur-md transition-all duration-300 ease-in-out",
            searchOpen ? "max-h-20 border-t py-3" : "max-h-0 border-t-0 py-0",
          )}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto flex max-w-7xl items-center gap-3 px-4 md:px-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
              <Input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                placeholder="Cari berita..."
                className="pl-9"
              />
            </div>
            <Button type="submit" size="sm" className="shrink-0">
              Cari
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => setSearchOpen(false)}
            >
              Batal
            </Button>
          </form>
        </div>
      )}

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="border-t border-foreground/10 bg-card/90 px-4 pb-4 pt-2 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const Icon = dashboardIcons[link.href];
              const active =
                link.href === "/" || link.href === "/dashboard"
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-foreground/10",
                    )}
                  >
                    {Icon && <Icon className="size-4 shrink-0" />}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
