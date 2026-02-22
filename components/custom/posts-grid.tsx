"use client";

import { useState, useTransition } from "react";
import { NewsCard, type NewsCardPost } from "@/components/custom/news-card";
import { Button } from "@/components/ui/button";

interface PostsGridProps {
  initialPosts: NewsCardPost[];
  initialPage: number;
  totalPages: number;
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

export function PostsGrid({
  initialPosts,
  initialPage,
  totalPages,
}: PostsGridProps) {
  const [posts, setPosts] = useState<NewsCardPost[]>(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [isPending, startTransition] = useTransition();

  const hasMore = page < totalPages;

  function loadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const res = await fetch(
        `/api/posts?status=published&limit=5&page=${nextPage}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const json = await res.json();
      const newPosts: NewsCardPost[] = (json.data as ApiPost[]).map((post) => ({
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
      }));
      setPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
    });
  }

  return (
    <>
      {posts.map((post, i) => (
        <NewsCard key={post.id} post={post} priority={i === 0} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={loadMore}
            disabled={isPending}
            variant="outline"
            className="w-full py-6 border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            {isPending ? "Memuat..." : "Tampilkan Berita Lainnya"}
          </Button>
        </div>
      )}
    </>
  );
}
