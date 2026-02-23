import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoryBadge } from "@/components/custom/category-badge";
export { CategoryBadge };

export interface NewsCardPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category: { name: string; color?: string | null };
  author: string;
  authorAvatar?: string;
  date: string;
  time?: string;
  image: string;
}

interface NewsCardProps {
  post: NewsCardPost;
  priority?: boolean;
}

export function NewsCard({ post, priority = false }: NewsCardProps) {
  return (
    <Link href={`/news/${post.slug}`} className="group block">
      <Card className="overflow-hidden border-foreground/10 bg-card py-0 transition hover:border-primary">
        {/* Top bar: author + category */}
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={post.authorAvatar} alt={post.author} />
              <AvatarFallback className="bg-foreground/10 text-xs text-foreground">
                {post.author[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">
                {post.author}
              </span>
              <span className="truncate text-[10px] text-foreground/70">
                ⏱ {post.date}
                {post.time ? ` pukul ${post.time}` : ""}
              </span>
            </div>
          </div>
          <CategoryBadge
            name={post.category.name}
            color={post.category.color}
          />
        </div>

        {/* Cover image */}
        <div className="overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={0}
            height={0}
            sizes="100vw"
            priority={priority}
            className="h-auto w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* Bottom content */}
        <CardContent className="px-4 py-3">
          <h2 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground/60 sm:text-sm">
              {post.excerpt}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
