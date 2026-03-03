import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import Image from "next/image";

const programs = [
  {
    no: 1,
    judul: "Pembinaan Teritorial",
    deskripsi:
      "Sebagai bagian dari tugas pokok TNI AD, pembinaan teritorial menjadi fokus utama. Kodim 1408 Makassar melaksanakan kegiatan Binter melalui komunikasi sosial, karya bakti, serta program ketahanan wilayah. Melalui pendekatan humanis, para prajurit menjalin kedekatan dengan warga, memperkuat nilai gotong royong, serta mengajak masyarakat berperan aktif dalam menjaga keamanan dan ketertiban lingkungan.",
  },
  {
    no: 2,
    judul: "Pembinaan Ketahanan Wilayah",
    deskripsi:
      "Di tengah tantangan urbanisasi dan modernisasi, Kodim 1408 Makassar terus memperkuat ketahanan wilayah melalui kolaborasi dengan pemerintah kota dan instansi lainnya. Program ketahanan pangan, penghijauan kota, serta edukasi mitigasi bencana menjadi bagian dari pembinaan berkelanjutan demi menciptakan lingkungan yang aman dan tangguh terhadap perubahan zaman.",
  },
  {
    no: 3,
    judul: "Pembinaan Sumber Daya Manusia",
    deskripsi:
      "Kodim juga mengembangkan pembinaan SDM melalui pelatihan bela negara, pendidikan karakter kebangsaan, dan kegiatan kepemudaan. Melalui sinergi dengan lembaga pendidikan dan komunitas lokal, Kodim 1408 menanamkan semangat cinta tanah air di kalangan generasi muda sebagai benteng moral bangsa.",
  },
  {
    no: 4,
    judul: "Pembinaan Wilayah Sosial dan Ekonomi",
    deskripsi:
      "Program ini mencakup pemberdayaan ekonomi masyarakat melalui kegiatan wirausaha produktif, UMKM binaan, serta program ketahanan pangan rumah tangga. Kodim juga aktif mendukung kegiatan sosial seperti donor darah, renovasi rumah tidak layak huni, dan bantuan bencana alam, sebagai bentuk nyata pengabdian kepada rakyat.",
  },
  {
    no: 5,
    judul: "Pembinaan Lingkungan dan Kebersihan Kota",
    deskripsi:
      "Sebagai bagian dari komitmen TNI AD yang profesional, Kodim 1408 Makassar juga berperan aktif dalam menjaga kebersihan dan kelestarian lingkungan perkotaan. Melalui kegiatan kerja bakti, penanaman pohon, dan edukasi lingkungan, Kodim berupaya mewujudkan Makassar yang bersih, hijau, dan sehat.",
  },
];

const bhaktiPrograms = [
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

export default function ProgramPembinaanPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">

          {/* ─── SECTION 1: Program Pembinaan ─── */}
          <section>
            {/* Hero Image */}
            <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/program-pembinaan.jpg"
                alt="Program Pembinaan Kodim 1408 Makassar"
                width={1200}
                height={600}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            {/* Article */}
            <article className="rounded-2xl bg-card p-8 shadow-xl md:p-12">
              <h1 className="mb-2 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Program Pembinaan
              </h1>
              <p className="mb-8 text-base font-semibold uppercase tracking-widest text-primary">
                Kodim 1408 Makassar
              </p>

              <div className="mb-10 space-y-6 text-lg leading-relaxed text-foreground/70">
                <p>
                  Kodim 1408 Makassar merupakan bagian dari jajaran Korem
                  141/Toddopuli di bawah Kodam XIV/Hasanuddin yang berperan
                  strategis di wilayah perkotaan terbesar di timur Indonesia.
                  Sebagai garda terdepan TNI AD di Kota Metropolitan Timur,
                  Kodim 1408 tidak hanya menjaga stabilitas keamanan, tetapi
                  juga menginisiasi berbagai program pembinaan yang menyentuh
                  langsung kehidupan masyarakat.
                </p>
                <p>
                  Program pembinaan yang dijalankan Kodim 1408 Makassar
                  berorientasi pada kemanunggalan TNI dan rakyat. Melalui
                  kegiatan sosial, kemanusiaan, serta pembangunan masyarakat,
                  Kodim berupaya memperkuat ketahanan wilayah dan menumbuhkan
                  kesadaran bela negara di tengah masyarakat perkotaan yang
                  dinamis.
                </p>
              </div>

              {/* Program Items */}
              <div className="space-y-8">
                {programs.map((p) => (
                  <div
                    key={p.no}
                    className="border-l-4 border-primary py-2 pl-6"
                  >
                    <h2 className="mb-3 text-2xl font-bold">
                      {p.no}. {p.judul}
                    </h2>
                    <p className="leading-relaxed text-foreground/70">
                      {p.deskripsi}
                    </p>
                  </div>
                ))}
              </div>

              {/* Closing */}
              <div className="mt-10 border-t border-foreground/10 pt-8">
                <p className="mb-6 leading-relaxed text-foreground/70">
                  Setiap program pembinaan dilaksanakan dengan prinsip
                  partisipatif — melibatkan masyarakat sebagai mitra sejajar.
                  Dengan demikian, kehadiran Kodim 1408 Makassar bukan hanya
                  sebagai kekuatan militer, tetapi juga sebagai penggerak
                  pembangunan sosial yang berkelanjutan.
                </p>
                <blockquote className="rounded-r-lg border-l-4 border-primary bg-primary/5 py-2 pl-6">
                  <p className="text-lg font-semibold italic text-primary">
                    &ldquo;TNI AD Profesional di Kota Metropolitan Timur —
                    Mengabdi dengan Hati, Bersama Membangun Negeri.&rdquo;
                  </p>
                </blockquote>
              </div>
            </article>
          </section>

          {/* ─── DIVIDER ─── */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-foreground/15" />
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
              Bhakti TNI
            </span>
            <div className="flex-1 border-t border-foreground/15" />
          </div>

          {/* ─── SECTION 2: Bhakti TNI ─── */}
          <section id="bhakti-tni">
            {/* Header */}
            <div className="mb-8">
              <h2 className="mb-4 text-4xl font-black leading-tight md:text-5xl">
                Kegiatan Bhakti TNI
              </h2>
              <p className="text-xl leading-relaxed text-foreground/60">
                Beragam kegiatan sosial, kemanusiaan, dan kebangsaan yang
                dijalankan Kodim 1408 Makassar dalam mendukung pembangunan
                masyarakat dan memperkuat kemanunggalan TNI dengan rakyat.
              </p>
            </div>

            {/* Hero Image */}
            <div className="mb-10 overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/bhakti-tni.jpg"
                alt="Kegiatan Bhakti TNI Kodim 1408 Makassar"
                width={1200}
                height={600}
                className="h-auto w-full object-cover"
              />
              <div className="bg-card px-6 py-4">
                <p className="text-center text-sm italic text-foreground/60">
                  Dokumentasi kegiatan sosial dan Bhakti TNI Kodim 1408
                  Makassar di wilayah Sulawesi Selatan.
                </p>
              </div>
            </div>

            {/* Article */}
            <article className="rounded-2xl bg-card p-8 shadow-xl md:p-12">
              <p className="mb-10 text-lg leading-relaxed text-foreground/70">
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

              {/* Bhakti Program Cards */}
              <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                {bhaktiPrograms.map((card) => (
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
                  Selain kegiatan utama tersebut, Kodim juga aktif dalam
                  berbagai event lokal seperti HUT RI, HUT TNI, dan upacara adat
                  daerah. Dalam setiap momentum, prajurit TNI AD menunjukkan
                  komitmen untuk hadir di tengah rakyat serta mendukung
                  ketahanan wilayah.
                </p>
                <p>
                  Melalui berbagai kegiatan berkelanjutan, Kodim 1408 Makassar
                  bertekad menjaga hubungan harmonis dengan masyarakat, menjadi
                  motor penggerak semangat persatuan, dan memperkuat peran TNI
                  dalam pembangunan bangsa.
                </p>
              </div>
            </article>
          </section>

          {/* ─── CTA ─── */}
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
