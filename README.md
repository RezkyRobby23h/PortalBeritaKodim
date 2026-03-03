<div align="center">

# 📰 Portal Berita Kodim

### Sistem Informasi Berita Modern untuk Kodim 1408 Makassar

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

[Demo](#) • [Dokumentasi](#fitur-utama) • [Instalasi](#-instalasi) • [Kontribusi](#-kontribusi)

</div>

---

## 📋 Daftar Isi

- [Tentang Projek](#-tentang-projek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Instalasi](#-instalasi)
- [Cara Menjalankan](#-cara-menjalankan)
- [Struktur Kode](#-struktur-kode)
- [API Endpoints](#-api-endpoints)
- [Konfigurasi](#%EF%B8%8F-konfigurasi)
- [Kontribusi](#-kontribusi)

---

## 🎯 Tentang Projek

**Portal Berita Kodim** adalah platform portal berita modern yang dirancang khusus untuk Kodim 1408 Makassar. Aplikasi ini menggabungkan teknologi terkini dengan antarmuka yang intuitif untuk memberikan pengalaman membaca berita yang optimal, dilengkapi sistem manajemen konten berbasis web dengan autentikasi pengguna.

### ✨ Kenapa Projek Ini?

- 🚀 **Performa Tinggi** - Dibangun dengan Next.js App Router untuk SSR & SSG yang cepat
- 🎨 **UI/UX Modern** - Desain minimalis menggunakan Shadcn UI & Tailwind CSS
- 🌓 **Dark Mode** - Dukungan tema gelap untuk kenyamanan membaca
- 📱 **Responsive** - Tampilan optimal di semua perangkat (mobile, tablet, desktop)
- 🔐 **Autentikasi** - Login email/password dan Google OAuth via Better Auth
- ✍️ **Rich Text Editor** - Editor berita lengkap dengan Tiptap
- 🖼️ **Cloud Storage** - Upload gambar otomatis ke Cloudinary

---

## 🎨 Fitur Utama

### 👥 Untuk Pengunjung
- ✅ **Feed Berita** - Tampilan berita terbaru dengan layout card modern
- ✅ **Kategori Berita** - Filter berdasarkan kategori yang tersedia
- ✅ **Breaking News** - Ticker berita terkini di bagian atas
- ✅ **Halaman Berita** - Tampilan artikel berita lengkap dengan slug
- ✅ **Profil Penulis** - Halaman profil per pengguna
- ✅ **Kontak** - Halaman kontak Kodim
- ✅ **Dark/Light Mode** - Toggle tema sesuai preferensi

### 🔧 Untuk Admin & Editor
- ✅ **Dashboard** - Panel manajemen konten terpusat
- ✅ **CRUD Berita** - Tambah, edit, hapus, dan publikasi berita
- ✅ **Rich Text Editor** - Editor Tiptap dengan format teks, gambar, heading, dll
- ✅ **Upload Gambar** - Upload thumbnail ke Cloudinary
- ✅ **Manajemen Kategori** - Atur kategori berita beserta warna
- ✅ **Manajemen Pengguna** - Kelola akun dan peran pengguna (Admin/Editor/User)
- ✅ **Breaking News** - Update teks breaking news secara langsung
- ✅ **Pesan Masuk** - Kelola pesan dari pengunjung

---

## 🛠 Teknologi

### Frontend Framework
- **Next.js 16.1.6** - React framework dengan App Router, SSR & SSG
- **React 19.2.3** - UI Library untuk komponen interaktif
- **Tailwind CSS 4** - Utility-first CSS framework

### UI & Komponen
- **Shadcn UI** - Komponen UI berbasis Radix UI
- **Radix UI** - Komponen primitif yang aksesibel
- **Lucide React** - Icon library modern
- **next-themes** - Dark/Light mode management
- **Tiptap 3** - Rich text editor yang powerful dan extensible

### Backend & Database
- **Prisma 7** - ORM modern dengan type-safety penuh
- **PostgreSQL 15** - Database relasional
- **Better Auth 1.4** - Sistem autentikasi (Email/Password & Google OAuth)
- **Cloudinary** - Cloud storage untuk gambar dan media

### DevTools
- **TypeScript** - Type safety end-to-end
- **ESLint** - Code linting
- **Docker** - Containerisasi database PostgreSQL
- **Sass** - CSS preprocessor untuk styling tambahan

---

## 📦 Instalasi

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** versi 18.x atau lebih tinggi
- **npm** atau **pnpm** atau **yarn**
- **Docker** (untuk menjalankan PostgreSQL via Docker Compose)
- Akun **Cloudinary** (untuk upload gambar)

### Langkah Instalasi

1️⃣ **Clone Repository**
```bash
git clone https://github.com/username/PortalBeritaKodim.git
cd PortalBeritaKodim
```

2️⃣ **Install Dependencies**
```bash
npm install
```

3️⃣ **Setup Environment Variables**

Buat file `.env` di root project lalu isi berdasarkan contoh di file `.env.example`

4️⃣ **Jalankan Database dengan Docker**
```bash
docker compose up -d
```

5️⃣ **Jalankan Migrasi & Generate Prisma Client**
```bash
npx prisma migrate dev
```

---

## 🚀 Cara Menjalankan

### Development Mode

```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

- 🏠 Halaman Utama: `http://localhost:3000/`
- ⚙️ Dashboard: `http://localhost:3000/dashboard`
- 🔐 Halaman Login: `http://localhost:3000/auth/signin`

### Production Build

```bash
# Build aplikasi (otomatis menjalankan prisma migrate deploy & generate)
npm run build

# Jalankan production server
npm run start
```

### Available Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Menjalankan development server dengan hot-reload |
| `npm run build` | Build aplikasi untuk production (+ prisma migrate & generate) |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint untuk pengecekan kode |

---

## 📁 Struktur Kode

```
PortalBeritaKodim/
│
├── 📂 app/                             # Next.js App Router
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Halaman utama (/)
│   ├── globals.css                    # Global styles
│   ├── 📂 api/                        # API Route Handlers
│   │   ├── auth/                      # Better Auth endpoints
│   │   ├── posts/                     # GET semua post & POST buat post baru
│   │   │   └── [id]/                  # GET, PUT, PATCH, DELETE single post
│   │   ├── categories/                # GET semua kategori & POST buat kategori
│   │   │   └── [id]/                  # DELETE single kategori
│   │   ├── users/                     # GET semua user
│   │   │   └── [id]/                  # PATCH, DELETE single user
│   │   ├── breaking-news/             # GET, POST, PATCH, DELETE breaking news
│   │   │   └── [id]/                  # PATCH, DELETE single breaking news
│   │   ├── messages/                  # GET semua pesan & POST pesan baru
│   │   │   └── [id]/                  # GET, PATCH, DELETE single pesan
│   │   ├── upload/                    # POST upload gambar ke Cloudinary
│   │   └── profile/
│   │       └── [id]/                  # GET & PATCH profil pengguna
│   ├── 📂 auth/                       # Halaman autentikasi
│   │   ├── signin/                    # Halaman login
│   │   └── signup/                    # Halaman registrasi
│   ├── 📂 dashboard/                  # Panel admin/editor
│   │   ├── page.tsx                   # Dashboard utama
│   │   ├── posts/                     # Manajemen berita
│   │   ├── categories/                # Manajemen kategori
│   │   ├── users/                     # Manajemen pengguna
│   │   ├── breaking-news/             # Manajemen breaking news
│   │   └── messages/                  # Manajemen pesan
│   ├── 📂 news/[slug]/                # Halaman artikel berita
│   ├── 📂 akun/[id]/                  # Halaman profil pengguna
│   ├── 📂 program-satuan/             # Halaman Program satuan
│   └── 📂 kontak/                     # Halaman Kontak
│
├── 📂 components/                      # React components
│   ├── 📂 custom/                     # Komponen kustom aplikasi
│   │   ├── navbar.tsx                 # Navigation bar
│   │   ├── footer.tsx                 # Footer
│   │   ├── news-card.tsx              # Card berita
│   │   ├── posts-grid.tsx             # Grid tampilan berita
│   │   ├── breaking-news.tsx          # Breaking news ticker
│   │   ├── category-badge.tsx         # Badge kategori
│   │   └── image-upload.tsx           # Komponen upload gambar
│   ├── 📂 tiptap-ui/                  # Komponen UI Tiptap editor
│   ├── 📂 tiptap-extension/           # Ekstensi kustom Tiptap
│   ├── 📂 tiptap-icons/               # Icon kustom untuk Tiptap
│   ├── 📂 tiptap-node/                # Node kustom Tiptap
│   ├── 📂 tiptap-templates/           # Template editor Tiptap
│   ├── 📂 tiptap-ui-primitive/        # Komponen primitif Tiptap UI
│   └── 📂 ui/                         # Komponen Shadcn UI
│
├── 📂 lib/                             # Library & utilitas server
│   ├── auth.ts                        # Konfigurasi Better Auth
│   ├── auth-client.ts                 # Better Auth client
│   ├── dal.ts                         # Data Access Layer
│   ├── permissions.ts                 # Konfigurasi izin akses
│   ├── prisma.ts                      # Prisma client instance
│   ├── tiptap-utils.ts                # Utilitas Tiptap
│   ├── utils.ts                       # Fungsi utilitas umum
│   └── schemas/                       # Zod validation schemas
│
├── 📂 prisma/                          # Prisma ORM
│   ├── schema.prisma                  # Schema database
│   └── migrations/                    # Riwayat migrasi database
│
├── 📂 hooks/                           # Custom React hooks
├── 📂 utils/                           # Fungsi utilitas
├── 📂 styles/                          # SCSS styles tambahan
├── 📂 public/                          # Static assets
├── 📂 scripts/                         # Script utilitas
├── 📄 docker-compose.yml              # Konfigurasi Docker (PostgreSQL)
├── 📄 next.config.ts                  # Konfigurasi Next.js
├── 📄 prisma.config.ts                # Konfigurasi Prisma
├── 📄 proxy.ts                        # Konfigurasi proxy
├── 📄 tsconfig.json                   # Konfigurasi TypeScript
└── 📄 package.json                    # Dependencies & scripts
```

### 🗂 Penjelasan Model Database

| Model | Fungsi |
|-------|--------|
| `User` | Data pengguna dengan role (USER / EDITOR / ADMIN) |
| `Session` | Sesi autentikasi pengguna (Better Auth) |
| `Account` | Akun OAuth provider (Google, dll) |
| `Post` | Data artikel berita |
| `Category` | Kategori berita |
| `BreakingNews` | Teks ticker breaking news |
| `Message` | Pesan masuk dari pengunjung |

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/posts` | Ambil semua post berita |
| `POST` | `/api/posts` | Buat post baru |
| `GET` | `/api/posts/[id]` | Ambil detail post |
| `PUT` | `/api/posts/[id]` | Update post (full) |
| `PATCH` | `/api/posts/[id]` | Update post sebagian (misal status publish) |
| `DELETE` | `/api/posts/[id]` | Hapus post |
| `GET` | `/api/categories` | Ambil semua kategori |
| `POST` | `/api/categories` | Buat kategori baru |
| `DELETE` | `/api/categories/[id]` | Hapus kategori |
| `GET` | `/api/breaking-news` | Ambil semua breaking news |
| `POST` | `/api/breaking-news` | Buat breaking news baru |
| `PATCH` | `/api/breaking-news` | Update breaking news |
| `DELETE` | `/api/breaking-news` | Hapus breaking news |
| `PATCH` | `/api/breaking-news/[id]` | Update single breaking news |
| `DELETE` | `/api/breaking-news/[id]` | Hapus single breaking news |
| `GET` | `/api/users` | Ambil semua pengguna |
| `PATCH` | `/api/users/[id]` | Update pengguna |
| `DELETE` | `/api/users/[id]` | Hapus pengguna |
| `GET` | `/api/messages` | Ambil semua pesan |
| `POST` | `/api/messages` | Kirim pesan baru |
| `GET` | `/api/messages/[id]` | Ambil detail pesan |
| `PATCH` | `/api/messages/[id]` | Update pesan (misal tandai sudah dibaca) |
| `DELETE` | `/api/messages/[id]` | Hapus pesan |
| `GET` | `/api/profile/[id]` | Ambil profil pengguna |
| `PATCH` | `/api/profile/[id]` | Update profil pengguna |
| `POST` | `/api/upload` | Upload gambar ke Cloudinary |
| `ALL` | `/api/auth/*` | Endpoint autentikasi Better Auth |

---

## ⚙️ Konfigurasi

### Next.js Config (`next.config.ts`)

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' }, // Cloudinary images
    ],
  },
};
```

### Docker Compose (`docker-compose.yml`)

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: portal_berita_db
    restart: always
    environment:
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=mypassword
      - POSTGRES_DB=portal_berita
    ports:
      - "5432:5432"
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Ikuti langkah berikut:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk Kodim 1408 Makassar

**Maintainer:**
- RezkyRobby
- Yousran
- ArelioPalinoan
- Adrian Tri Putra

---

## 📞 Kontak & Support

- 🐛 **Bug Reports**: [Issues](https://github.com/username/PortalBeritaKodim/issues)
- 💡 **Feature Requests**: [Discussions](https://github.com/username/PortalBeritaKodim/discussions)
- 📧 **Email**: akbarirr23h@student.unhas.ac.id

---

<div align="center">

### ⭐ Jika projek ini bermanfaat, jangan lupa beri bintang!

**Made with Next.js 🚀 • React ⚛️ • Tailwind 🎨 • Prisma 🔷 • PostgreSQL 🐘**

</div>
