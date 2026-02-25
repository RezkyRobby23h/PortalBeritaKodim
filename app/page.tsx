// TODO: refactor code for uniformity and readability
// TODO: multiple category for posts
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { CategoryBadge } from "@/components/custom/category-badge";
import { BreakingNews } from "@/components/custom/breaking-news";
import { DateRangePicker } from "@/components/custom/date-range-picker";
import { PostsGrid, PostsSkeleton } from "@/components/custom/posts-grid";
import { ScrollToTopButton } from "@/components/custom/scroll-to-top";
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

function BerandaContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";

  const [allPosts, setAllPosts] = useState<NewsCardPost[]>([]);
  const [highlightPosts, setHighlightPosts] = useState<NewsCardPost[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categoryPosts, setCategoryPosts] = useState<NewsCardPost[]>([]);
  const [categoryTotalPages, setCategoryTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const dateFrom = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const dateTo = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setSelectedCategoryId(null);
      const postsParams = new URLSearchParams({
        status: "published",
        limit: "20",
      });
      if (searchQuery) postsParams.set("q", searchQuery);
      if (dateFrom) postsParams.set("dateFrom", dateFrom);
      if (dateTo) postsParams.set("dateTo", dateTo);
      const postsUrl = `/api/posts?${postsParams}`;
      const [postsRes, kategorisRes, highlightRes] = await Promise.all([
        fetch(postsUrl, { cache: "no-store" }),
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
  }, [searchQuery, dateRange, dateFrom, dateTo]);

  async function handleCategoryToggle(id: string) {
    const newId = selectedCategoryId === id ? null : id;
    setSelectedCategoryId(newId);
    if (!newId) return;
    setIsCategoryLoading(true);
    const catParams = new URLSearchParams({
      status: "published",
      limit: "5",
      categoryId: newId,
    });
    if (dateFrom) catParams.set("dateFrom", dateFrom);
    if (dateTo) catParams.set("dateTo", dateTo);
    const res = await fetch(`/api/posts?${catParams}`, { cache: "no-store" });
    if (res.ok) {
      const j = await res.json();
      setCategoryPosts((j.data as ApiPost[]).map(mapPost));
      setCategoryTotalPages(j.totalPages ?? 1);
    }
    setIsCategoryLoading(false);
  }

  return (
    <div className="min-h-screen text-foreground">
      <Navbar variant="public" />
      <div className="h-16" />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-6">
          {/* Left — Posts */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="grid gap-5">
              <BreakingNews />

              {/* Mobile Highlight & Category — hidden on xl (shown in sidebar) */}
              <div className="flex flex-col gap-4 overflow-hidden xl:hidden">
                {/* Mobile Category */}
                {isLoading ? (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-8 w-24 shrink-0 rounded-lg bg-foreground/50"
                      />
                    ))}
                  </div>
                ) : (
                  categories.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold text-foreground">
                        Kategori
                      </h3>
                      <div className="flex w-full gap-2 overflow-x-auto pb-1">
                        <Toggle
                          pressed={selectedCategoryId === null}
                          onPressedChange={() => setSelectedCategoryId(null)}
                          className="shrink-0 rounded-lg border border-foreground/20 px-3 py-1.5 text-xs font-semibold text-foreground/60 hover:border-primary hover:bg-primary/10 data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                          Semua
                        </Toggle>
                        {categories.map((cat) => (
                          <Toggle
                            key={cat.id}
                            pressed={selectedCategoryId === cat.id}
                            onPressedChange={() => handleCategoryToggle(cat.id)}
                            className="shrink-0 rounded-lg border border-foreground/20 px-3 py-1.5 text-xs font-semibold text-foreground/60 hover:border-primary hover:bg-primary/10 data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                          >
                            <span
                              className="mr-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
                              style={{
                                backgroundColor: cat.color ?? "#6b7280",
                              }}
                            />
                            {cat.name}
                          </Toggle>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Mobile Date Filter */}
                <div>
                  <h3 className="mb-2 text-sm font-bold text-foreground">
                    Filter Tanggal
                  </h3>
                  <DateRangePicker value={dateRange} onChange={setDateRange} />
                  {dateRange && (
                    <button
                      onClick={() => setDateRange(undefined)}
                      className="mt-1.5 text-xs text-foreground/60 hover:text-primary"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {isLoading || isCategoryLoading ? (
                <PostsSkeleton />
              ) : (
                <PostsGrid
                  key={`${selectedCategoryId ?? "all"}-${searchQuery}`}
                  initialPosts={selectedCategoryId ? categoryPosts : allPosts}
                  initialPage={1}
                  totalPages={
                    selectedCategoryId ? categoryTotalPages : totalPages
                  }
                  categoryId={selectedCategoryId}
                  searchQuery={searchQuery}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="hidden w-72 shrink-0 flex-col gap-6 xl:flex">
            {/* Highlight */}
            <Card className="border-foreground/10 bg-card py-4">
              <CardContent className="px-4">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                  Highlight
                </h3>
                <Separator className="mb-4 border-foreground/10" />
                <div className="flex flex-col gap-3">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <Skeleton className="h-14 w-20 shrink-0 rounded-lg bg-foreground/50" />
                          <div className="flex flex-1 flex-col justify-center gap-2">
                            <Skeleton className="h-2.5 w-16 rounded bg-foreground/50" />
                            <Skeleton className="h-3 w-full rounded bg-foreground/50" />
                            <Skeleton className="h-3 w-2/3 rounded bg-foreground/50" />
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
                            <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground/80 transition-colors group-hover:text-primary">
                              {post.title}
                            </p>
                          </div>
                        </Link>
                      ))}
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <Card className="border-foreground/10 bg-card py-4">
                <CardContent className="px-4">
                  <h3 className="mb-4 text-base font-bold text-foreground">
                    Kategori
                  </h3>
                  <Separator className="mb-4 border-foreground/10" />
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-9 rounded-lg bg-foreground/50"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              categories.length > 0 && (
                <Card className="border-foreground/10 bg-card py-4">
                  <CardContent className="px-4">
                    <h3 className="mb-4 text-base font-bold text-foreground">
                      Kategori
                    </h3>
                    <Separator className="mb-4 border-foreground/10" />
                    <div className="grid grid-cols-2 gap-2">
                      <Toggle
                        pressed={selectedCategoryId === null}
                        onPressedChange={() => setSelectedCategoryId(null)}
                        className="w-full justify-start rounded-lg border border-foreground/20 hover:bg-primary/10 hover:border-primary px-3 py-2 text-xs font-semibold text-foreground/60 data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                      >
                        Semua
                      </Toggle>
                      {categories.map((cat) => (
                        <Toggle
                          key={cat.id}
                          pressed={selectedCategoryId === cat.id}
                          onPressedChange={() => handleCategoryToggle(cat.id)}
                          className="w-full justify-start rounded-lg border border-foreground/20 hover:bg-primary/10 hover:border-primary px-3 py-2 text-xs font-semibold text-foreground/60 data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
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

            {/* Desktop Date Filter */}
            <Card className="border-foreground/10 bg-card py-4">
              <CardContent className="px-4">
                <h3 className="mb-4 text-base font-bold text-foreground">
                  Filter Tanggal
                </h3>
                <Separator className="mb-4 border-foreground/10" />
                <div className="flex flex-col gap-3">
                  <DateRangePicker value={dateRange} onChange={setDateRange} />
                  {dateRange && (
                    <button
                      onClick={() => setDateRange(undefined)}
                      className="text-xs text-foreground/60 hover:text-primary"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default function BerandaPage() {
  return (
    <Suspense>
      <BerandaContent />
    </Suspense>
  );
}
