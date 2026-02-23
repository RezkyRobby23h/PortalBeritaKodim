import Link from "next/link";
import Navbar from "@/components/custom/navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="dashboard" />

      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-foreground px-6 pt-16 text-center text-background">
        <span className="mb-4 rounded-full bg-background/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest">
          Dashboard
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Selamat Datang
        </h1>
        <p className="mt-4 max-w-xl text-lg text-background/70">
          Kelola postingan, berita tertutup, pengguna, kategori, dan pesan dalam
          satu platform.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/dashboard/posts"
            className="rounded-full bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background/90"
          >
            Lihat Postingan
          </Link>
          <Link
            href="/dashboard/users"
            className="rounded-full border border-background/30 px-6 py-2.5 text-sm font-semibold text-background transition hover:bg-background/10"
          >
            Kelola Pengguna
          </Link>
        </div>
      </section>
    </div>
  );
}
