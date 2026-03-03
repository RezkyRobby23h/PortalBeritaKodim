import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { SiInstagram, SiYoutube, SiFacebook, SiX } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Sejarah Satuan", href: "/profil/sejarah-satuan" },
  { label: "Pejabat Kodim", href: "/profil/pejabat-kodim" },
  { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
  { label: "Program Pembinaan", href: "/program-pembinaan" },
  { label: "Aduan", href: "/aduan" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground/10 dark:bg-card text-foreground pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Logo Kodim 1408 Makassar"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[15px] font-extrabold tracking-tight">
                    KODIM 1408/MKS
                  </span>
                  <span className="text-[10px] font-bold tracking-wide text-foreground/70">
                    MAEIKI A&apos;BULO SIBATANG
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/60">
              Website resmi portal berita dan informasi Kodim 1408 Makassar.
              Menyajikan berita terkini seputar kegiatan, program pembinaan
              teritorial, serta Bhakti TNI di wilayah Kota Makassar dan
              sekitarnya.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground/60 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Jam Operasional */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">
              Jam Operasional
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-foreground/80">Senin - Jumat</p>
                  <p className="text-foreground/60">07.00 - 17.00 WITA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aduan */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Kontak</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-primary shrink-0" />
                <a
                  href="mailto:kodim1408bsmakassar@gmail.com"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  kodim1408bsmakassar@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-primary shrink-0" />
                <span className="text-foreground/60">-</span>
              </p>
              <p className="flex items-center gap-2">
                <SiInstagram size={16} className="text-primary shrink-0" />
                <a
                  href="https://instagram.com/kodim1408mks_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  @kodim1408mks_
                </a>
              </p>
              <p className="flex items-center gap-2">
                <SiFacebook size={16} className="text-primary shrink-0" />
                <a
                  href="https://www.facebook.com/profile.php?id=100069975648345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Kodim Makassar
                </a>
              </p>
              <p className="flex items-center gap-2">
                <SiX size={16} className="text-primary shrink-0" />
                <a
                  href="https://x.com/Kodim1408mks_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Kodim1408mks_
                </a>
              </p>
              <p className="flex items-center gap-2">
                <SiYoutube size={16} className="text-primary shrink-0" />
                <a
                  href="https://www.youtube.com/@Kodim_BS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  Kodim 1408/BS
                </a>
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <span className="text-foreground/60">
                  Jl. Lanto Dg. Pasewang, Maricaya Sel, Kec. Mamajang, Kota
                  Makassar, Sulsel 90142
                </span>
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="pt-6 flex flex-col items-center gap-3 text-sm text-foreground/60 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Portal Berita — Kodim 1408
            Makassar. Hak cipta dilindungi.
          </p>
          <div className="flex gap-4">
            <Link
              href="/aduan"
              className="hover:text-primary transition-colors"
            >
              Aduan
            </Link>
            <Link
              href="/program-satuan"
              className="hover:text-primary transition-colors"
            >
              Program
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
