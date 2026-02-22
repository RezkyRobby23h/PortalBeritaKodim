import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { type NewsCardPost } from "@/components/custom/news-card";
import { CategoryBadge } from "@/components/custom/category-badge";
import { BreakingNews } from "@/components/custom/breaking-news";
import { PostsGrid } from "@/components/custom/posts-grid";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const highlightPosts: NewsCardPost[] = [
  {
    id: "fsfdf",
    slug: "test-upload-gambar",
    title: "Test Upload Gambar",
    excerpt:
      "Kodim 1408/MKS berhasil mengintegrasikan sistem unggah gambar baru ke dalam portal berita resmi satuan. Sistem ini memudahkan pengelola konten dalam menampilkan dokumentasi kegiatan secara cepat dan efisien.",
    category: { name: "Teknologi", color: "#0ea5e9" },
    author: "Anonim",
    authorAvatar: "https://i.pravatar.cc/40?img=3",
    date: "14 Februari 2026",
    time: "17.19",
    image: "https://picsum.photos/seed/kodim1/800/500",
  },
  {
    id: "fsdf2",
    slug: "pelaksanaan-program-sppg",
    title: "Pelaksanaan Program SPPG di Wilayah Kodim 1408/MKS",
    excerpt:
      "Program SPPG dilaksanakan di seluruh wilayah Kodim 1408/MKS sebagai upaya peningkatan kesejahteraan masyarakat di Sulawesi Selatan.",
    category: { name: "Teknologi", color: "#0ea5e9" },
    author: "Redaksi",
    date: "13 Februari 2026",
    image: "https://picsum.photos/seed/kodim6/800/500",
  },
  {
    id: "fsdf3",
    slug: "ruu-perlindungan-data-pribadi",
    title: "RUU Perlindungan Data Pribadi Resmi Berlaku, Sanksi Tegas Menanti",
    excerpt:
      "Pemerintah resmi memberlakukan RUU Perlindungan Data Pribadi dengan sanksi yang lebih tegas bagi pelanggar privasi data warga negara.",
    category: { name: "Politik", color: "#ef4444" },
    author: "Redaksi",
    date: "12 Februari 2026",
    image: "https://picsum.photos/seed/kodim7/800/500",
  },
  {
    id: "fsdf",
    slug: "film-nusantara-karya-sineas-lokal",
    title: 'Film "Nusantara" Karya Sineas Lokal Raih Penghargaan Internasional',
    excerpt:
      'Film berjudul "Nusantara" karya sutradara muda asal Makassar berhasil meraih penghargaan bergengsi di festival film internasional.',
    category: { name: "Hiburan", color: "#a855f7" },
    author: "Redaksi",
    date: "11 Februari 2026",
    image: "https://picsum.photos/seed/kodim8/800/500",
  },
  {
    id: "fsdf4",
    slug: "timnas-indonesia-lolos-piala-dunia",
    title:
      "Timnas Indonesia Lolos ke Piala Dunia 2026: Sejarah Baru Sepak Bola",
    excerpt:
      "Untuk pertama kalinya dalam sejarah, Timnas Indonesia berhasil lolos ke Piala Dunia 2026 setelah mengalahkan lawan di babak kualifikasi.",
    category: { name: "Olahraga", color: "#f97316" },
    author: "Redaksi",
    date: "10 Februari 2026",
    image: "https://picsum.photos/seed/kodim9/800/500",
  },
];

type ApiPost = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  image: string | null;
  createdAt: string;
  category: { id: string; name: string; color: string | null } | null;
  authors: { id: string; name: string; image: string | null }[];
};

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  _count: { posts: number };
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BerandaPage() {
  const [postsRes, kategorisRes] = await Promise.all([
    fetch(`${BASE_URL}/api/posts?status=published&limit=20`, {
      cache: "no-store",
    }),
    fetch(`${BASE_URL}/api/categories?limit=100`, { cache: "no-store" }),
  ]);

  const postsJson = postsRes.ok
    ? await postsRes.json()
    : { data: [], totalPages: 1 };
  const kategorisJson = kategorisRes.ok
    ? await kategorisRes.json()
    : { data: [] };

  const allPosts: NewsCardPost[] = (postsJson.data as ApiPost[]).map(
    (post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.summary ?? undefined,
      category: {
        name: post.category?.name ?? "Umum",
        color: post.category?.color,
      },
      author: post.authors[0]?.name ?? "Redaksi",
      authorAvatar: post.authors[0]?.image ?? undefined,
      date: formatDate(post.createdAt),
      image: post.image ?? `https://picsum.photos/seed/${post.slug}/800/500`,
    }),
  );

  const dbKategori = kategorisJson.data as ApiCategory[];
  const totalPages: number = postsJson.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar variant="public" />
      <div className="h-16" />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-6">
          {/* Left — All Posts Grid */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="grid gap-5">
              <BreakingNews text="Website sudah hampir jadi!" />
              <PostsGrid
                initialPosts={allPosts}
                initialPage={1}
                totalPages={totalPages}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="hidden w-72 shrink-0 flex-col gap-6 xl:flex">
            {/* Highlight */}
            <Card className="border-zinc-800 bg-zinc-900 py-4">
              <CardContent className="px-4">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                  <span className="text-yellow-400">✦</span> Highlight
                </h3>
                <Separator className="mb-4 bg-zinc-800" />
                <div className="flex flex-col gap-3">
                  {highlightPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/news/${post.slug}`}
                      className="group flex gap-3"
                    >
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col justify-center gap-1">
                        <CategoryBadge
                          name={post.category.name}
                          color={post.category.color}
                        />
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-zinc-200 transition-colors group-hover:text-sky-400">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Kategori — from DB */}
            <Card className="border-zinc-800 bg-zinc-900 py-4">
              <CardContent className="px-4">
                <h3 className="mb-4 text-base font-bold text-white">
                  Kategori
                </h3>
                <Separator className="mb-4 bg-zinc-800" />
                <div className="grid grid-cols-2 gap-2">
                  {dbKategori.map((kat) => (
                    <Button
                      key={kat.id}
                      variant="ghost"
                      size="sm"
                      className="h-auto justify-start gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-left hover:bg-zinc-700"
                      asChild
                    >
                      <Link href={`/?category=${kat.slug}`}>
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: kat.color ?? "#6b7280" }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white">
                            {kat.name}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {kat._count.posts} berita
                          </p>
                        </div>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
