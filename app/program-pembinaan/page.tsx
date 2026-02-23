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

export default function ProgramPembinaanPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Hero Image */}
          <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/program-pembinaan.jpg"
              alt="Program Pembinaan Kodim 1408 Makassar"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Article */}
          <article className="rounded-2xl bg-card p-8 shadow-xl md:p-12">
            <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Program Pembinaan Kodim 1408 Makassar
            </h1>

            <div className="mb-8 space-y-6 text-lg leading-relaxed text-foreground/70">
              <p>
                Kodim 1408 Makassar merupakan bagian dari jajaran Korem
                141/Toddopuli di bawah Kodam XIV/Hasanuddin yang berperan
                strategis di wilayah perkotaan terbesar di timur Indonesia.
                Sebagai garda terdepan TNI AD di Kota Metropolitan Timur, Kodim
                1408 tidak hanya menjaga stabilitas keamanan, tetapi juga
                menginisiasi berbagai program pembinaan yang menyentuh langsung
                kehidupan masyarakat.
              </p>
              <p>
                Program pembinaan yang dijalankan Kodim 1408 Makassar
                berorientasi pada kemanunggalan TNI dan rakyat. Melalui kegiatan
                sosial, kemanusiaan, serta pembangunan masyarakat, Kodim
                berupaya memperkuat ketahanan wilayah dan menumbuhkan kesadaran
                bela negara di tengah masyarakat perkotaan yang dinamis.
              </p>
            </div>

            {/* Program Items */}
            <div className="space-y-8">
              {programs.map((p) => (
                <div key={p.no} className="border-l-4 border-primary py-2 pl-6">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
