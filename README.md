<div align="center">

# 📰 Portal Berita Kodim

### Sistem Informasi Berita Modern untuk Kodim 1408 Makassar

![Astro](https://img.shields.io/badge/Astro-5.17.1-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node](https://img.shields.io/badge/Node-SSR-339933?style=for-the-badge&logo=node.js&logoColor=white)

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

**Portal Berita Kodim** adalah platform portal berita modern yang dirancang khusus untuk Kodim 1408 Makassar. Aplikasi ini menggabungkan teknologi terkini dengan antarmuka yang intuitif untuk memberikan pengalaman membaca berita yang optimal.

### ✨ Kenapa Projek Ini?

- 🚀 **Performa Tinggi** - Dibangun dengan Astro untuk loading super cepat
- 🎨 **UI/UX Modern** - Desain minimalis dengan animasi halus menggunakan Framer Motion
- 🌓 **Dark Mode** - Dukungan tema gelap untuk kenyamanan membaca
- 📱 **Responsive** - Tampilan optimal di semua perangkat (mobile, tablet, desktop)
- ⚡ **Real-time Updates** - Sistem CMS untuk update konten secara langsung
- 🔍 **Pencarian Cepat** - Fitur pencarian berita yang responsif

---

## 🎨 Fitur Utama

### 👥 Untuk Pengunjung
- ✅ **Feed Berita** - Tampilan berita terbaru dengan layout card modern
- ✅ **Kategori Berita** - Filter berdasarkan Politik, Ekonomi, Teknologi, Olahraga, dll
- ✅ **Trending News** - Sidebar berita yang sedang trending
- ✅ **Breaking News** - Ticker berita terkini di bagian atas
- ✅ **Pencarian** - Cari berita dengan kata kunci
- ✅ **Dark/Light Mode** - Toggle tema sesuai preferensi

### 🔧 Untuk Admin
- ✅ **Admin Panel** - Dashboard untuk manajemen konten
- ✅ **CRUD Berita** - Tambah, edit, hapus berita
- ✅ **Upload Gambar** - Preview dan upload thumbnail berita
- ✅ **Manajemen Kategori** - Atur kategori dan tag
- ✅ **Real-time Preview** - Lihat perubahan langsung sebelum publish
- ✅ **Sumber Berita** - Kelola daftar sumber berita

---

## 🛠 Teknologi

### Frontend Framework
- **Astro 5.17.1** - Static Site Generator dengan Islands Architecture
- **React 19.2.4** - UI Library untuk komponen interaktif
- **Tailwind CSS 4.1.18** - Utility-first CSS framework

### Libraries & Tools
- **Framer Motion** - Animasi dan transisi yang smooth
- **Lucide React** - Icon library modern
- **Nanostores** - State management ringan
- **Node Adapter** - SSR (Server-Side Rendering)

### DevTools
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **ESLint** - Code linting

---

## 📦 Instalasi

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** versi 18.x atau lebih tinggi
- **npm** atau **pnpm** atau **yarn**

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
> ⚠️ **Penting:** Pastikan menjalankan `npm install` untuk menginstall semua dependencies yang diperlukan

Atau gunakan package manager lain:
```bash
# Menggunakan pnpm
pnpm install

# Menggunakan yarn
yarn install
```

3️⃣ **Setup Data (Opsional)**
```bash
# File data/cms.json akan otomatis dibuat saat pertama kali menjalankan aplikasi
# Atau bisa manual create file data/cms.json dengan struktur:
{
  "news": [],
  "trending": [],
  "sources": [],
  "breakingText": "Selamat datang di Portal Berita Kodim"
}
```

---

## 🚀 Cara Menjalankan

### Development Mode

```bash
npm run dev
```

Server akan berjalan di: **http://localhost:4321**

- 🏠 Halaman Utama: `http://localhost:4321/`
- ⚙️ Admin Panel: `http://localhost:4321/admin`

### Production Build

```bash
# Build aplikasi
npm run build

# Preview hasil build
npm run preview
```

### Available Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Menjalankan development server dengan hot-reload |
| `npm run build` | Build aplikasi untuk production |
| `npm run preview` | Preview hasil build di local |
| `npm run astro` | Akses Astro CLI commands |

---

## 📁 Struktur Kode

```
PortalBeritaKodim/
│
├── 📂 public/                          # Static assets
│   ├── cropped-logo_kodim1408...png   # Logo Kodim
│   └── favicon.svg                     # Favicon
│
├── 📂 src/                             # Source code utama
│   ├── 📂 components/                  # React components
│   │   ├── HomeApp.jsx                # ⭐ Main app wrapper (home)
│   │   ├── AdminApp.jsx               # ⭐ Admin panel wrapper
│   │   ├── Navbar.jsx                 # 🔝 Navigation bar dengan search & dark mode
│   │   ├── NewsFeed.jsx               # 📰 Feed berita utama
│   │   ├── Sidebar.jsx                # 📊 Sidebar trending & sources
│   │   ├── AdminPanel.jsx             # ⚙️ Admin dashboard & CRUD
│   │   └── Footer.jsx                 # 📄 Footer section
│   │
│   ├── 📂 pages/                       # Astro pages (routing)
│   │   ├── index.astro                # 🏠 Homepage route (/)
│   │   ├── admin.astro                # 🔧 Admin page route (/admin)
│   │   └── 📂 api/                    # API endpoints
│   │       └── cms.ts                 # 🔌 REST API untuk CMS (GET/POST)
│   │
│   ├── 📂 store/                       # State management
│   │   └── cmsStore.jsx               # 📦 Global state dengan Context API
│   │
│   └── 📂 styles/                      # Global styles
│       └── global.css                 # 🎨 Tailwind base & custom CSS
│
├── 📂 data/                            # Data persistence
│   └── cms.json                       # 💾 Database JSON untuk berita
│
├── 📄 astro.config.mjs                # ⚙️ Astro configuration
├── 📄 package.json                    # 📦 Dependencies & scripts
├── 📄 tsconfig.json                   # 🔷 TypeScript config
└── 📄 README.md                       # 📖 Dokumentasi ini

```

### 🗂 Penjelasan Struktur

#### **Components** (`src/components/`)
| File | Fungsi | Komponen Utama |
|------|--------|----------------|
| `HomeApp.jsx` | Wrapper utama homepage | Navbar, NewsFeed, Sidebar, Footer |
| `AdminApp.jsx` | Wrapper admin panel | AdminPanel component |
| `Navbar.jsx` | Navigation bar | Logo, kategori, search, dark mode toggle |
| `NewsFeed.jsx` | Tampilan feed berita | Card berita, filter kategori, pagination |
| `Sidebar.jsx` | Sidebar konten | Trending news, sumber berita |
| `AdminPanel.jsx` | Dashboard admin | Form CRUD, preview, image upload |
| `Footer.jsx` | Footer website | Info, links, copyright |

#### **Pages** (`src/pages/`)
- **index.astro**: Homepage dengan SSR, load `HomeApp` component
- **admin.astro**: Admin page dengan SSR, load `AdminApp` component
- **api/cms.ts**: RESTful API endpoint untuk operasi CRUD

#### **Store** (`src/store/`)
- **cmsStore.jsx**: Global state management menggunakan React Context
  - State: `news`, `trending`, `sources`, `breakingText`, `searchQuery`
  - Functions: `addNews()`, `updateNews()`, `deleteNews()`, `addTrending()`, dll

#### **Data** (`data/`)
- **cms.json**: File JSON sebagai database sederhana
  - Struktur: `{ news: [], trending: [], sources: [], breakingText: "" }`

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:4321/api
```

### Endpoints

#### **GET** `/api/cms`
Mengambil semua data CMS

**Response:**
```json
{
  "news": [...],
  "trending": [...],
  "sources": [...],
  "breakingText": "Breaking news text"
}
```

#### **POST** `/api/cms`
Menyimpan/update data CMS

**Request Body:**
```json
{
  "news": [...],
  "trending": [...],
  "sources": [...],
  "breakingText": "Breaking news text"
}
```

**Response:**
```json
{
  "status": "saved"
}
```

---

## ⚙️ Konfigurasi

### Astro Config (`astro.config.mjs`)

```javascript
export default defineConfig({
  output: 'server',           // SSR mode
  adapter: node({              // Node.js adapter
    mode: 'standalone',
  }),
  integrations: [react()],     // React integration
  server: {
    host: true,                // Allow network access
    port: 4321,                // Development port
  }
});
```

### Environment Variables (Opsional)

Buat file `.env` di root project:
```env
# Port server
PORT=4321

# Public URL
PUBLIC_URL=http://localhost:4321
```

---

## 🎨 Customization

### Menambah Kategori Baru

Edit file `src/components/Navbar.jsx`:
```javascript
const categories = [
  'Terbaru', 
  'Politik', 
  'Ekonomi', 
  'Teknologi', 
  'Olahraga', 
  'Hiburan', 
  'Kesehatan',
  'Kategori Baru Anda' // ← Tambahkan di sini
];
```

Edit juga `src/store/cmsStore.jsx` untuk color mapping:
```javascript
export const categoryColorMap = {
  'Kategori Baru Anda': 'bg-indigo-100 text-indigo-700',
  // ...
};
```

### Mengubah Tema Warna

Edit file `src/styles/global.css`:
```css
:root {
  --primary-color: #35CE8D;    /* Hijau utama */
  --secondary-color: #306B34;  /* Hijau gelap */
  /* Ubah sesuai kebutuhan */
}
```

---

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
- AurelioPalinoan
- Yousran
- Adrian Tri Putra

---

## 📞 Kontak & Support

- 🐛 **Bug Reports**: [Issues](https://github.com/username/PortalBeritaKodim/issues)
- 💡 **Feature Requests**: [Discussions](https://github.com/username/PortalBeritaKodim/discussions)
- 📧 **Email**: akbarirr23h@student.unhas.ac.id

---

<div align="center">

### ⭐ Jika projek ini bermanfaat, jangan lupa beri bintang!

**Made with Astro 🚀 • React ⚛️ • Tailwind 🎨**

</div>
