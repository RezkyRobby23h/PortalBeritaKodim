import Link from "next/link";
import Navbar from "@/components/custom/navbar";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Users,
  MessageSquare,
  Tag,
  Eye,
  TrendingUp,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  MailOpen,
  Mail,
} from "lucide-react";

// ── Data Fetching ─────────────────────────────────────────────────────────────

async function getDashboardStats() {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    trendingPosts,
    totalViews,
    totalUsers,
    totalMessages,
    unreadMessages,
    totalCategories,
    totalBreakingNews,
    recentPosts,
    recentMessages,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.post.count({ where: { trending: true } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.user.count(),
    prisma.message.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.category.count(),
    prisma.breakingNews.count({ where: { isActive: true } }),

    // 5 most recent posts
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        trending: true,
        views: true,
        createdAt: true,
        category: { select: { name: true, color: true } },
        authors: { select: { name: true } },
      },
    }),

    // 5 most recent messages
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    trendingPosts,
    totalViews: totalViews._sum.views ?? 0,
    totalUsers,
    totalMessages,
    unreadMessages,
    totalCategories,
    totalBreakingNews,
    recentPosts,
    recentMessages,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Postingan",
      value: formatNumber(stats.totalPosts),
      icon: FileText,
      description: `${stats.publishedPosts} diterbitkan · ${stats.draftPosts} draf`,
      href: "/dashboard/posts",
    },
    {
      label: "Total Penayangan",
      value: formatNumber(stats.totalViews),
      icon: Eye,
      description: `${stats.trendingPosts} postingan trending`,
      href: "/dashboard/posts",
    },
    {
      label: "Pengguna",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      description: "Total akun terdaftar",
      href: "/dashboard/users",
    },
    {
      label: "Pesan Masuk",
      value: formatNumber(stats.totalMessages),
      icon: MessageSquare,
      description: `${stats.unreadMessages} belum dibaca`,
      href: "/dashboard/messages",
    },
    {
      label: "Kategori",
      value: formatNumber(stats.totalCategories),
      icon: Tag,
      description: "Kategori konten aktif",
      href: "/dashboard/categories",
    },
    {
      label: "Breaking News",
      value: formatNumber(stats.totalBreakingNews),
      icon: Bell,
      description: "Berita aktif di marquee",
      href: "/dashboard/breaking-news",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="dashboard" />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 pt-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Selamat Datang
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan analitik portal berita Kodim — diperbarui secara
            real-time.
          </p>
        </div>

        <Separator />

        {/* Stat Cards */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Ringkasan
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.label} href={card.href}>
                  <Card className="group transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.label}
                      </CardTitle>
                      <div className="rounded-md bg-muted p-1.5 text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-extrabold text-foreground">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Post Status Breakdown */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="mb-2 h-6 w-6 text-green-500" />
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats.publishedPosts)}
            </p>
            <p className="text-xs text-muted-foreground">Diterbitkan</p>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="mb-2 h-6 w-6 text-yellow-500" />
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats.draftPosts)}
            </p>
            <p className="text-xs text-muted-foreground">Draf</p>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6 text-center">
            <TrendingUp className="mb-2 h-6 w-6 text-blue-500" />
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats.trendingPosts)}
            </p>
            <p className="text-xs text-muted-foreground">Trending</p>
          </Card>
        </section>

        {/* Recent Posts */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Postingan Terbaru
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/posts" className="flex items-center gap-1">
                Lihat semua <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Kategori
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Penulis
                  </TableHead>
                  <TableHead className="text-center">Tayang</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">
                    Penayangan
                  </TableHead>
                  <TableHead className="hidden text-right md:table-cell">
                    Tanggal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentPosts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Belum ada postingan.
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="max-w-50 font-medium">
                        <Link
                          href={`/dashboard/posts`}
                          className="line-clamp-1 hover:underline"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {post.category ? (
                          <Badge
                            variant="secondary"
                            className={post.category.color ?? ""}
                          >
                            {post.category.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {post.authors.map((a) => a.name).join(", ") || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {post.published ? (
                          <Badge
                            variant="default"
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            Tayang
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Draf</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-right text-sm text-muted-foreground lg:table-cell">
                        {formatNumber(post.views)}
                      </TableCell>
                      <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                        {formatDate(post.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Recent Messages */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Pesan Terbaru
              </h2>
              {stats.unreadMessages > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.unreadMessages} baru
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/dashboard/messages"
                className="flex items-center gap-1"
              >
                Lihat semua <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengirim</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Pesan</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="hidden text-right md:table-cell">
                    Tanggal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentMessages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Belum ada pesan masuk.
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentMessages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell className="font-medium">
                        {msg.fullName}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                        {msg.email}
                      </TableCell>
                      <TableCell className="hidden max-w-60 text-sm text-muted-foreground md:table-cell">
                        <span className="line-clamp-1">{msg.content}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {msg.isRead ? (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MailOpen className="h-3.5 w-3.5" />
                            Dibaca
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            <Mail className="h-3.5 w-3.5" />
                            Baru
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                        {formatDate(msg.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </section>
      </main>
    </div>
  );
}
