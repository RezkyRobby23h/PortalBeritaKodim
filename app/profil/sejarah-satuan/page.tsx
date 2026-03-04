import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import Image from "next/image";

const koramils = [
  {
    no: 1,
    nama: "Koramil 1408-01/U.Tanah",
    alamat: "Jln. Galangan Kapal Kec. Ujung Tanah Makassar",
    wilayah: "Kecamatan Ujung Tanah",
    luas: "5,94 KM²",
  },
  {
    no: 2,
    nama: "Koramil 1408-02/Tallo",
    alamat: "Jln. Butta-butta Kec. Tallo Makassar",
    wilayah: "Kecamatan Tallo",
    luas: "5,94 KM²",
  },
  {
    no: 3,
    nama: "Koramil 1408-03/Wajo",
    alamat: "Jln. Serui Kec. Wajo Makassar",
    wilayah: "Kecamatan Wajo",
    luas: "1,99 KM²",
  },
  {
    no: 4,
    nama: "Koramil 1408-04/Bontoala",
    alamat: "Jln. Kandea Kec. Bontoala Makassar",
    wilayah: "Kecamatan Bontoala",
    luas: "2,10 KM²",
  },
  {
    no: 5,
    nama: "Koramil 1408-05/Mariso",
    alamat: "Jln. Seroja Kec. Mariso Makassar",
    wilayah: "Kecamatan Mariso",
    luas: "1,82 KM²",
  },
  {
    no: 6,
    nama: "Koramil 1408-06/Mamajang",
    alamat: "Jln. Mawas Kec. Mamajang Makassar",
    wilayah: "Kecamatan Mamajang",
    luas: "2,25 KM²",
  },
  {
    no: 7,
    nama: "Koramil 1408-07/Ujung Pandang",
    alamat: "Jln. Amanagappa Kec. Ujung Pandang Makassar",
    wilayah: "Kecamatan Ujung Pandang",
    luas: "2,63 KM²",
  },
  {
    no: 8,
    nama: "Koramil 1408-08/Makassar",
    alamat: "Jln. Kerung-kerung Lr. 12 Kec. Makassar",
    wilayah: "Kecamatan Makassar",
    luas: "2,52 KM²",
  },
  {
    no: 9,
    nama: "Koramil 1408-09/Tamalate",
    alamat: "Jln. Malengkeri, Kec. Tamalate Makassar",
    wilayah: "Kecamatan Tamalate dan Kecamatan Rappocini",
    luas: "20,21 KM²",
  },
  {
    no: 10,
    nama: "Koramil 1408-10/Panakukang",
    alamat: "Jln. Abdullah Dg. Sirua Kec. Panakukang Makassar",
    wilayah: "Kecamatan Panakkukang dan Kecamatan Manggala",
    luas: "41,19 KM²",
  },
  {
    no: 11,
    nama: "Koramil 1408-11/Biringkanaya",
    alamat: "Jln. Perintis Kemerdekaan Kec. Biringkanaya Makassar",
    wilayah: "Kecamatan Biringkanaya",
    luas: "37,84 KM²",
  },
  {
    no: 12,
    nama: "Koramil 1408-12/Tamalanrea",
    alamat: "Komplek Tamalanrea Kec. Tamalanrea Kota Makassar",
    wilayah: "Kecamatan Tamalanrea",
    luas: "42,12 KM²",
  },
  {
    no: 13,
    nama: "Koramil 1408-13/Rappocini",
    alamat: "Jl. Rappocini Raya Kec. Rappocini Kota Makassar",
    wilayah: "Kecamatan Rappocini",
    luas: "9,23 KM²",
  },
  {
    no: 14,
    nama: "Koramil 1408-14/Sangkarrang",
    alamat: "Pulau Barrang Lompo Kec. Sangkarrang Kota Makassar",
    wilayah: "Kecamatan Sangkarrang",
    luas: "0,542 KM²",
  },
];

export default function SejarahSatuanPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Hero Image */}
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/logo.png"
              alt="Kodim 1408 Makassar"
              width={1200}
              height={600}
              className="mx-auto h-48 w-auto object-contain py-8 sm:h-64"
              priority
            />
          </div>

          {/* Article */}
          <article className="rounded-2xl bg-card p-8 shadow-xl md:p-12">
            <h1 className="mb-2 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Sejarah Satuan
            </h1>
            <p className="mb-8 text-base font-semibold uppercase tracking-widest text-primary">
              Kodim 1408/Makassar
            </p>

            {/* ── Sejarah Singkat ── */}
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">
                A. Sejarah Singkat Kodim 1408/Makassar
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-foreground/70">
                <p>
                  Situasi politik dan keamanan dalam negeri beberapa tahun
                  setelah Proklamasi Kemerdekaan 17 Agustus 1945 belum
                  menunjukkan titik terang dan sering terjadi pemberontakan
                  dimana-mana dan aksi bersenjata yang berbentuk gerakan
                  separatis. Fenomena ini direspon oleh pemerintah dan TNI
                  dengan melakukan konsolidasi dan reorganisasi terhadap
                  instansi militer. Pada Tahun 1950 maka dibentuklah Komando
                  Militer Makassar dibawah Pimpinan Mayor Inf H. Pieterz yang
                  merupakan Cikal bakal terbentuknya Komando Distrik Militer
                  1408/Makassar.
                </p>
                <p>
                  Kodim 1408/Makassar yang ada sekarang merupakan hasil
                  perubahan dan penyempurnaan sejak tahun 1950. Kodim ini
                  merupakan unsur komando pelaksana Komando Daerah Militer
                  XIV/Hasanuddin bersifat kewilayahan yang berkedudukan langsung
                  di bawah Panglima Daerah Militer XIV/Hasanuddin serta
                  melaksanakan tugas kegarnisunan guna mendukung tercapainya
                  tugas pokok Kodam XIV/Hasanuddin.
                </p>
                <p>
                  Reorganisasi dalam institusi TNI-AD terus berjalan. Komando
                  Militer Makassar pada tahun 1951 berubah nama menjadi Komando
                  Militer Kota Besar Makassar sebagai Komandan pertamanya Mayor
                  Inf J. E. Bolang. Eksistensi Komando Militer Kota Besar
                  Makassar (KMKBM) hanya berjalan 7 tahun sebab pada tahun 1958
                  Komando Militer Kota Besar Makassar berubah menjadi Komando
                  Resimen Militer 3/Jung Pandang dan Mayor Inf Eddy Sabara
                  diangkat menjadi Komandan pertamanya.
                </p>
                <p>
                  Pada Tahun 1963 karena penyempurnaan organisasi dan Tugas
                  Komando Daerah Militer Sulawesi Selatan dan Tenggara kemudian
                  berubah menjadi Komando XIV/Hasanuddin, dan berubah lagi
                  menjadi Komando Daerah Militer VII/Wirabuana, kemudian pada
                  tahun 2017 Kodam VII/Wirabuana terjadi pemekaran sehingga
                  Kodam VII/Wirabuana berubah menjadi Kodam XIII/Merdeka dengan
                  membawahi 2 Korem yaitu Korem 131/STG dan Korem 132/TDL.
                  Kemudian Kodam XIV/Hasanuddin membawahi 3 Korem yaitu Korem
                  141/TP, Korem 142/Ttg dan Korem 143/HO, dan Komando Resimen
                  3/Jung Pandang berubah menjadi Komando Distrik Militer
                  1408/BS, kemudian berdasarkan surat perintah Pangdam XIV/Hsn
                  Nomor Sprin/817/IV/2021 tanggal 29 April 2021 agar
                  melaksanakan penyesuaian nomenklatur Kodim 1408/BS menjadi
                  Kodim 1408/Makassar.
                </p>
              </div>
            </section>

            {/* ── Dislokasi Satuan ── */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold">Dislokasi Satuan</h2>
              <p className="mb-6 leading-relaxed text-foreground/70">
                Dalam pelaksanaan pembinaan teritorial, Kodim 1408/Makassar
                dibagi dalam beberapa Komando Rayon Militer dan satu Markas
                Komando dengan dislokasi satuan sebagai berikut:
              </p>

              <div className="mb-6 border-l-4 border-primary py-2 pl-6">
                <h3 className="font-bold">
                  Markas Komando Distrik Militer 1408/Makassar
                </h3>
                <p className="text-foreground/70">
                  Jln. Lanto Daeng Pasewang No. 14 Makassar
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-foreground/10">
                <table className="w-full min-w-175 text-left text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 bg-foreground/5">
                      <th className="px-4 py-3 font-semibold">No</th>
                      <th className="px-4 py-3 font-semibold">Koramil</th>
                      <th className="px-4 py-3 font-semibold">
                        Alamat
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        Wilayah
                      </th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Luas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {koramils.map((k) => (
                      <tr
                        key={k.no}
                        className="border-b border-foreground/5 transition-colors hover:bg-foreground/5"
                      >
                        <td className="px-4 py-3 font-medium">{k.no}</td>
                        <td className="px-4 py-3 font-medium">{k.nama}</td>
                        <td className="px-4 py-3 text-foreground/70">
                          {k.alamat}
                        </td>
                        <td className="px-4 py-3 text-foreground/70">
                          {k.wilayah}
                        </td>
                        <td className="px-4 py-3 text-right text-foreground/70">
                          {k.luas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Tugas Pokok ── */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold">
                Tugas Pokok Kodim 1408/Makassar
              </h2>
              <p className="mb-6 leading-relaxed text-foreground/70">
                Komando Distrik Militer 1408/Makassar adalah bagian dari
                Tentara Nasional Indonesia Angkatan Darat sebagai Satuan
                Kewilayahan yang tugasnya sebagai penyelenggara pembinaan
                kemampuan, kekuatan dan gelar kekuatan, menyelenggarakan
                pembinaan teritorial untuk menyiapkan wilayah pertahanan di
                darat dan menjaga keamanan wilayahnya dalam rangka mendukung
                tugas pokok Kodam XIV/Hasanuddin.
              </p>
              <div className="space-y-4">
                {[
                  "Melaksanakan tugas-tugas TNI di wilayah Kota Makassar.",
                  "Melaksanakan pengamanan darat dan kepulauan yang berada di wilayah Kota Makassar.",
                  "Melaksanakan pembangunan dan pembinaan kekuatan personel Kodim 1408/Makassar dan melaksanakan pemberdayaan wilayah pertahanan darat di wilayah Kota Makassar.",
                  "Melaksanakan tugas-tugas pemberian bantuan kepada Polri dan Pemkot yang disesuaikan dengan peraturan perundang-undangan.",
                ].map((tugas, i) => (
                  <div
                    key={i}
                    className="border-l-4 border-primary py-2 pl-6"
                  >
                    <p className="leading-relaxed text-foreground/70">
                      <span className="font-semibold text-foreground">
                        {String.fromCharCode(97 + i)}.
                      </span>{" "}
                      {tugas}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Prioritas Pembinaan ── */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold">
                Prioritas Pembinaan
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Pembinaan Satuan */}
                <div className="rounded-xl border border-foreground/10 p-6">
                  <h3 className="mb-4 text-lg font-bold text-primary">
                    Pembinaan Satuan
                  </h3>
                  <ol className="space-y-2 text-foreground/70">
                    {[
                      "Pemeliharaan personel dan kendaraan untuk siap operasional.",
                      "Peningkatan kualitas latihan.",
                      "Peningkatan kesejahteraan prajurit dan PNS beserta keluarga Kodim 1408/Makassar.",
                      "Tertib administrasi.",
                      "Pemeliharaan pangkalan.",
                      "Pemeliharaan peranti lunak.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 font-semibold text-foreground">
                          {i + 1})
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Pembinaan Teritorial Terbatas */}
                <div className="rounded-xl border border-foreground/10 p-6">
                  <h3 className="mb-4 text-lg font-bold text-primary">
                    Pembinaan Teritorial Terbatas
                  </h3>
                  <ol className="space-y-2 text-foreground/70">
                    {[
                      "Memelihara dan menjaga hubungan dengan masyarakat agar tetap terjalin dengan baik.",
                      "Mengadakan siskamling dan olah raga bersama.",
                      "Menjadikan tokoh-tokoh masyarakat dan pemuda sebagai bahan pengumpul keterangan dan sumber informasi.",
                      "Mengaktifkan Babinsa di wilayah Koramil masing-masing untuk membina sekaligus memonitor daerah binaan Kodim 1408/Makassar.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 font-semibold text-foreground">
                          {i + 1})
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* ── Visi & Misi ── */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">
                Visi dan Misi Kodim 1408/Makassar
              </h2>

              {/* Visi */}
              <div className="mb-8">
                <h3 className="mb-3 text-lg font-bold text-primary">Visi</h3>
                <blockquote className="rounded-r-lg border-l-4 border-primary bg-primary/5 py-4 pl-6">
                  <p className="text-lg italic leading-relaxed text-foreground/80">
                    Mewujudkan satuan Komando teritorial yang profesional,
                    disiplin, bermoral dan kehadirannya didambakan oleh
                    masyarakat sebagai kekuatan terdepan dalam menghadapi
                    segala ancaman dan rongrongan di wilayah garnisun Makassar
                    dan keutuhan NKRI.
                  </p>
                </blockquote>
              </div>

              {/* Misi */}
              <div>
                <h3 className="mb-3 text-lg font-bold text-primary">Misi</h3>
                <div className="space-y-4">
                  {[
                    "Meningkatkan kemampuan personil Kodim 1408/Makassar secara terus menerus melalui latihan-latihan agar tetap terpelihara disiplin, loyalitas, hierarki, maupun kemampuan pembinaan teritorial dalam rangka pencegahan dini terhadap segala macam ancaman.",
                    "Meningkatkan sumber daya manusia (SDM) Kodim 1408/Makassar dengan berbagai macam pelatihan dan pendidikan serta peningkatan 5 (lima) kemampuan teritorial guna diterapkan dan diaplikasikan di wilayah binaan masing-masing.",
                    "Meningkatkan koordinasi antar instansi baik militer, sipil dan instansi lain secara sinergi dalam rangka turut serta menciptakan kondisi yang aman guna mendukung terlaksananya program pembangunan daerah Sulawesi Selatan umumnya dan wilayah Kota Makassar pada khususnya.",
                    'Menciptakan hubungan kerjasama yang harmonis dengan semua elemen masyarakat guna terbentuknya kesamaan rasa dan pikiran sebagai aplikasi dari "TENTARA DARI RAKYAT OLEH RAKYAT DAN UNTUK RAKYAT."',
                  ].map((misi, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-primary py-2 pl-6"
                    >
                      <p className="leading-relaxed text-foreground/70">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Closing */}
            <div className="mt-10 border-t border-foreground/10 pt-8">
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
