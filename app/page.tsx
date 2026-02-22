"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { CategoryBadge } from "@/components/custom/category-badge";
import { BreakingNews } from "@/components/custom/breaking-news";
import { PostsGrid } from "@/components/custom/posts-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { type NewsCardPost } from "@/components/custom/news-card";

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
  color: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapPost(post: ApiPost): NewsCardPost {
  return {
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
  };
}

export default function BerandaPage() {
  const [allPosts, setAllPosts] = useState<NewsCardPost[]>([]);
  const [highlightPosts, setHighlightPosts] = useState<NewsCardPost[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [postsRes, kategorisRes, highlightRes] = await Promise.all([
        fetch("/api/posts?status=published&limit=20", { cache: "no-store" }),
        fetch("/api/categories?limit=100", { cache: "no-store" }),
        fetch("/api/posts?status=published&isHighlight=true&limit=5", {
          cache: "no-store",
        }),
      ]);
      if (postsRes.ok) {
        const j = await postsRes.json();
        setAllPosts((j.data as ApiPost[]).map(mapPost));
        setTotalPages(j.totalPages ?? 1);
      }
      if (kategorisRes.ok) {
        const j = await kategorisRes.json();
        setCategories(j.data as ApiCategory[]);
      }
      if (highlightRes.ok) {
        const j = await highlightRes.json();
        setHighlightPosts((j.data as ApiPost[]).map(mapPost));
      }
      setIsLoading(false);
    }
    load();
  }, []);

  function handleCategoryToggle(id: string) {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar variant="public" />
      <div className="h-16" />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-6">
          {/* Left — Posts */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="grid gap-5">
              <BreakingNews />
              {isLoading ? (
                <div className="flex flex-col gap-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 rounded-xl bg-zinc-900 p-4"
                    >
                      <Skeleton className="h-28 w-40 shrink-0 rounded-lg bg-zinc-800" />
                      <div className="flex flex-1 flex-col gap-3 py-1">
                        <Skeleton className="h-3 w-20 rounded bg-zinc-800" />
                        <Skeleton className="h-4 w-full rounded bg-zinc-800" />
                        <Skeleton className="h-4 w-3/4 rounded bg-zinc-800" />
                        <Skeleton className="mt-auto h-3 w-24 rounded bg-zinc-800" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <PostsGrid
                  initialPosts={allPosts}
                  initialPage={1}
                  totalPages={totalPages}
                  categoryId={selectedCategoryId}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="hidden w-72 shrink-0 flex-col gap-6 xl:flex">
            {/* Highlight */}
            <Card className="border-zinc-800 bg-zinc-900 py-4">
              <CardContent className="px-4">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                  Highlight
                </h3>
                <Separator className="mb-4 bg-zinc-800" />
                <div className="flex flex-col gap-3">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <Skeleton className="h-14 w-20 shrink-0 rounded-lg bg-zinc-800" />
                          <div className="flex flex-1 flex-col justify-center gap-2">
                            <Skeleton className="h-2.5 w-16 rounded bg-zinc-800" />
                            <Skeleton className="h-3 w-full rounded bg-zinc-800" />
                            <Skeleton className="h-3 w-2/3 rounded bg-zinc-800" />
                          </div>
                        </div>
                      ))
                    : highlightPosts.map((post) => (
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

            {isLoading ? (
              <Card className="border-zinc-800 bg-zinc-900 py-4">
                <CardContent className="px-4">
                  <h3 className="mb-4 text-base font-bold text-white">
                    Kategori
                  </h3>
                  <Separator className="mb-4 bg-zinc-800" />
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-9 rounded-lg bg-zinc-800"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              categories.length > 0 && (
                <Card className="border-zinc-800 bg-zinc-900 py-4">
                  <CardContent className="px-4">
                    <h3 className="mb-4 text-base font-bold text-white">
                      Kategori
                    </h3>
                    <Separator className="mb-4 bg-zinc-800" />
                    <div className="grid grid-cols-2 gap-2">
                      <Toggle
                        pressed={selectedCategoryId === null}
                        onPressedChange={() => setSelectedCategoryId(null)}
                        className="w-full justify-start rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 data-[state=on]:border-sky-500 data-[state=on]:bg-sky-500/10 data-[state=on]:text-sky-400"
                      >
                        Semua
                      </Toggle>
                      {categories.map((cat) => (
                        <Toggle
                          key={cat.id}
                          pressed={selectedCategoryId === cat.id}
                          onPressedChange={() => handleCategoryToggle(cat.id)}
                          className="w-full justify-start rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 data-[state=on]:border-sky-500 data-[state=on]:bg-sky-500/10 data-[state=on]:text-sky-400"
                        >
                          <span
                            className="mr-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: cat.color ?? "#6b7280" }}
                          />
                          <span className="truncate">{cat.name}</span>
                        </Toggle>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
