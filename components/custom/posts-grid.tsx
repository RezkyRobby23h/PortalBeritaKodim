"use client";

import { useState } from "react";
import { NewsCard, type NewsCardPost } from "@/components/custom/news-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PostsGridProps {
  initialPosts: NewsCardPost[];
  initialPage: number;
  totalPages: number;
  categoryId?: string | null;
  searchQuery?: string;
}

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapApiPost(post: ApiPost): NewsCardPost {
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

const SKELETON_ROWS = Array.from({ length: 5 });

export function PostsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {SKELETON_ROWS.map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl bg-card p-4">
          <Skeleton className="h-28 w-40 shrink-0 rounded-lg bg-foreground/50" />
          <div className="flex flex-1 flex-col gap-3 py-1">
            <Skeleton className="h-3 w-20 rounded bg-foreground/50" />
            <Skeleton className="h-4 w-full rounded bg-foreground/50" />
            <Skeleton className="h-4 w-3/4 rounded bg-foreground/50" />
            <Skeleton className="mt-auto h-3 w-24 rounded bg-foreground/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PostsGrid({
  initialPosts,
  initialPage,
  totalPages,
  categoryId = null,
  searchQuery = "",
}: PostsGridProps) {
  const [posts, setPosts] = useState<NewsCardPost[]>(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [currentTotalPages, setCurrentTotalPages] = useState(totalPages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore = page < currentTotalPages;

  async function fetchAndAppend(catId: string | null, pageNum: number) {
    const params = new URLSearchParams({
      status: "published",
      limit: "5",
      page: String(pageNum),
    });
    if (catId) params.set("categoryId", catId);
    const res = await fetch(`/api/posts?${params}`, { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    const newPosts = (json.data as ApiPost[]).map(mapApiPost);
    setPosts((prev) => [...prev, ...newPosts]);
    setPage(pageNum);
    setCurrentTotalPages(json.totalPages ?? 1);
  }

  async function loadMore() {
    setIsLoadingMore(true);
    await fetchAndAppend(categoryId ?? null, page + 1);
    setIsLoadingMore(false);
  }

  return (
    <>
      {posts.length === 0 ? (
        <p className="py-8 text-center text-sm text-foreground">
          Tidak ada berita ditemukan.
        </p>
      ) : (
        <>
          {posts.map((post, i) => (
            <NewsCard key={post.id} post={post} priority={i === 0} />
          ))}
          {isLoadingMore && <PostsSkeleton />}
        </>
      )}

      {hasMore && !isLoadingMore && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="w-full py-6 bg-card border-foreground hover:border-primary text-foreground hover:text-primary transition-colors"
          >
            {isLoadingMore ? "Memuat..." : "Tampilkan Berita Lainnya"}
          </Button>
        </div>
      )}
    </>
  );
}
