"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PostRef {
  id: string;
  title: string;
  slug: string;
}

interface BreakingNewsItem {
  id: string;
  text: string;
  labelLink: string | null;
  postId: string | null;
  post: PostRef | null;
  isActive: boolean;
}

interface ApiResponse {
  data: BreakingNewsItem[];
}

// ── Single item display ───────────────────────────────────────────────────────
function NewsItemDisplay({ item }: { item: BreakingNewsItem }) {
  const content = (
    <span className="text-md font-medium text-white">{item.text}</span>
  );

  if (item.post) {
    return (
      <Link
        href={`/news/${item.post.slug}`}
        className="hover:underline hover:underline-offset-2"
      >
        {content}
      </Link>
    );
  }

  if (item.labelLink) {
    return (
      <a
        href={item.labelLink}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline hover:underline-offset-2"
      >
        {content}
      </a>
    );
  }

  return <span>{content}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────
export function BreakingNews() {
  const [items, setItems] = useState<BreakingNewsItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/breaking-news?active=true&limit=100")
      .then((res) => (res.ok ? (res.json() as Promise<ApiResponse>) : null))
      .then((json) => {
        if (json) setItems(json.data);
      })
      .catch(() => {
        /* silent — don't break the page */
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!loaded || items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div className="bg-linear-to-r from-red-600 to-red-500 rounded-xl px-4 py-2.5">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <Badge className="shrink-0 animate-pulse bg-white font-extrabold uppercase tracking-widest text-red-600">
          Breaking
        </Badge>
        <div
          key={currentIndex}
          className="animate-in fade-in duration-500 flex-1 overflow-hidden truncate"
        >
          <NewsItemDisplay item={current} />
        </div>
      </div>
    </div>
  );
}
