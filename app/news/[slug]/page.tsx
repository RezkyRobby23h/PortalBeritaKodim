import { notFound } from "next/navigation";
import { after } from "next/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { CategoryBadge } from "@/components/custom/category-badge";
import { NewsCard, type NewsCardPost } from "@/components/custom/news-card";
import { ScrollToTopButton } from "@/components/custom/scroll-to-top";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type PostAuthor = {
  id: string;
  name: string;
  image: string | null;
};

type PostCategory = {
  id: string;
  name: string;
  color: string | null;
};

type PostDetail = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  fullContent: string;
  image: string | null;
  views: number;
  createdAt: Date;
  category: PostCategory;
  authors: PostAuthor[];
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapToNewsCard(post: {
  id: string;
  slug: string;
  title: string;
  summary: string;
  image: string | null;
  createdAt: Date;
  category: PostCategory;
  authors: PostAuthor[];
}): NewsCardPost {
  const authorImage = post.authors[0]?.image;
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.summary,
    category: {
      name: post.category.name,
      color: post.category.color,
    },
    author: post.authors[0]?.name ?? "Redaksi",
    ...(authorImage ? { authorAvatar: authorImage } : {}),
    date: formatDate(post.createdAt),
    image: post.image ?? `https://picsum.photos/seed/${post.slug}/800/500`,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, summary: true, image: true },
  });

  if (!post) {
    return { title: "Berita Tidak Ditemukan — InfoKodim" };
  }

  return {
    title: `${post.title} — InfoKodim`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const rawPost = await prisma.post.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      fullContent: true,
      image: true,
      views: true,
      createdAt: true,
      category: { select: { id: true, name: true, color: true } },
      authors: { select: { id: true, name: true, image: true } },
    },
  });

  if (!rawPost) notFound();

  const post: PostDetail = rawPost;

  // Increment view count after response is sent (server-side, non-blocking)
  after(async () => {
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  });

  // Fetch related posts from the same category
  const relatedRaw = await prisma.post.findMany({
    where: {
      published: true,
      categoryId: post.category.id,
      slug: { not: post.slug },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      image: true,
      createdAt: true,
      category: { select: { id: true, name: true, color: true } },
      authors: { select: { id: true, name: true, image: true } },
    },
  });

  const relatedPosts: NewsCardPost[] = relatedRaw.map(mapToNewsCard);

  const primaryAuthor = post.authors[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main className="pb-16 pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-sm text-foreground/50"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Beranda
            </Link>
            <ChevronRight className="size-4 shrink-0" />
            <span className="line-clamp-1 text-foreground/70">
              {post.title}
            </span>
          </nav>

          {/* Cover Image */}
          {post.image && (
            <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                width={900}
                height={500}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <CategoryBadge
                name={post.category.name}
                color={post.category.color}
              />
            </div>

            <h1 className="mb-4 text-3xl font-black leading-tight md:text-4xl">
              {post.title}
            </h1>

            {/* Author & Date Row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="size-9">
                  <AvatarImage
                    src={primaryAuthor?.image ?? ""}
                    alt={primaryAuthor?.name ?? "Redaksi"}
                  />
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {(primaryAuthor?.name ?? "R")[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {primaryAuthor?.name ?? "Redaksi"}
                  </p>
                  <p className="text-xs text-foreground/50">Penulis</p>
                </div>
              </div>

              <Separator
                orientation="vertical"
                className="hidden h-8 sm:block"
              />

              <div className="flex items-center gap-1.5 text-sm text-foreground/50">
                <CalendarDays className="size-4 shrink-0" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </header>

          {/* Full Content */}
          <article
            className="prose prose-neutral mb-12 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.fullContent }}
          />

          {/* Multiple Authors */}
          {post.authors.length > 1 && (
            <div className="mb-12">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50">
                Ditulis oleh
              </p>
              <div className="flex flex-wrap gap-4">
                {post.authors.map((author) => (
                  <div key={author.id} className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage src={author.image ?? ""} alt={author.name} />
                      <AvatarFallback className="bg-foreground/20 text-xs text-foreground">
                        {author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{author.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black">Berita Terkait</h2>
                <Link
                  href="/"
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Lihat semua
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {relatedPosts.map((rel) => (
                  <NewsCard key={rel.id} post={rel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
