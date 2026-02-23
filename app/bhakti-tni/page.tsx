import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import Image from "next/image";

const programCards = [
  {
    judul: "Karya Bakti & Gotong Royong",
    deskripsi:
      "Prajurit Kodim bersama masyarakat melaksanakan kerja bakti membersihkan lingkungan, memperbaiki fasilitas umum, serta menanam pohon di area pemukiman dan sekolah demi menjaga kelestarian lingkungan.",
  },
  {
    judul: "Pembinaan Teritorial",
    deskripsi:
      "Melalui pembinaan kewilayahan, Babinsa aktif membangun komunikasi dengan masyarakat, memberikan penyuluhan tentang bela negara, dan meningkatkan kesadaran kebangsaan.",
  },
  {
    judul: "Bakti Sosial & Kemanusiaan",
    deskripsi:
      "Kegiatan sosial seperti donor darah, bantuan bencana alam, dan distribusi sembako rutin dilakukan sebagai bentuk kepedulian TNI AD terhadap masyarakat yang membutuhkan.",
  },
  {
    judul: "Kegiatan Edukasi & Bela Negara",
    deskripsi:
      "Kodim 1408 turut serta memberikan penyuluhan wawasan kebangsaan di sekolah dan perguruan tinggi, untuk menanamkan semangat nasionalisme di kalangan generasi muda.",
  },
];

export default function BhaktiTniPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-black leading-tight md:text-5xl">
              Kegiatan Bhakti TNI — Kodim 1408 Makassar
            </h1>
            <p className="text-xl leading-relaxed text-foreground/60">
              Beragam kegiatan sosial, kemanusiaan, dan kebangsaan yang
              dijalankan Kodim 1408 Makassar dalam mendukung pembangunan
              masyarakat dan memperkuat kemanunggalan TNI dengan rakyat.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-12 overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/bhakti-tni.jpg"
              alt="Kegiatan Bhakti TNI Kodim 1408 Makassar"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
            <div className="bg-card px-6 py-4">
              <p className="text-center text-sm italic text-foreground/60">
                Dokumentasi kegiatan sosial dan Bhakti TNI Kodim 1408 Makassar
                di wilayah Sulawesi Selatan.
              </p>
            </div>
          </div>

          {/* Article */}
          <article className="mb-8 rounded-2xl bg-card p-8 shadow-xl md:p-12">
            {/* Intro */}
            <p className="mb-12 text-lg leading-relaxed text-foreground/70">
              Kodim 1408 Makassar secara konsisten melaksanakan berbagai
              kegiatan Bhakti TNI yang bertujuan mempererat hubungan antara
              prajurit TNI AD dan masyarakat. Kegiatan ini mencakup sektor
              sosial, lingkungan, pendidikan, dan kebencanaan yang disesuaikan
              dengan kebutuhan masyarakat di wilayah Sulawesi Selatan. Melalui
              sinergi dengan pemerintah daerah, instansi pendidikan, dan
              organisasi masyarakat, Kodim berupaya mendorong semangat gotong
              royong, solidaritas sosial, serta meningkatkan kepedulian warga
              terhadap ketahanan nasional.
            </p>

            {/* Program Cards */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {programCards.map((card) => (
                <div
                  key={card.judul}
                  className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  <h3 className="mb-3 text-xl font-bold">{card.judul}</h3>
                  <p className="leading-relaxed text-foreground/70">
                    {card.deskripsi}
                  </p>
                </div>
              ))}
            </div>

            {/* Closing */}
            <div className="space-y-6 text-lg leading-relaxed text-foreground/70">
              <p>
                Selain kegiatan utama tersebut, Kodim juga aktif dalam berbagai
                event lokal seperti HUT RI, HUT TNI, dan upacara adat daerah.
                Dalam setiap momentum, prajurit TNI AD menunjukkan komitmen
                untuk hadir di tengah rakyat serta mendukung ketahanan wilayah.
              </p>
              <p>
                Melalui berbagai kegiatan berkelanjutan, Kodim 1408 Makassar
                bertekad menjaga hubungan harmonis dengan masyarakat, menjadi
                motor penggerak semangat persatuan, dan memperkuat peran TNI
                dalam pembangunan bangsa.
              </p>
            </div>
          </article>

          {/* CTA */}
          <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground shadow-2xl transition-transform duration-300 hover:scale-105 md:p-12">
            <h2 className="mb-4 text-3xl font-black md:text-4xl">
              Mari Berpartisipasi
            </h2>
            <p className="text-lg leading-relaxed opacity-95 md:text-xl">
              Kodim 1408 Makassar mengajak seluruh masyarakat, pelajar, dan
              komunitas lokal untuk berkolaborasi dalam kegiatan sosial dan
              pembangunan daerah demi kemajuan bersama.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
