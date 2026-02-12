import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const API_URL = '/api/cms';

// ============ CATEGORY COLOR MAP ============
export const categoryColorMap = {
  'Teknologi': 'bg-blue-100 text-blue-700',
  'Ekonomi': 'bg-emerald-100 text-emerald-700',
  'Olahraga': 'bg-orange-100 text-orange-700',
  'Kesehatan': 'bg-rose-100 text-rose-700',
  'Hiburan': 'bg-purple-100 text-purple-700',
  'Politik': 'bg-red-100 text-red-700',
  'Pendidikan': 'bg-cyan-100 text-cyan-700',
  'Lingkungan': 'bg-lime-100 text-lime-700',
  'Bisnis': 'bg-amber-100 text-amber-700',
};

// ============ CONTEXT ============
const CmsContext = createContext(null);

// Helper: POST seluruh state ke server
async function saveAll(news, trending, sources, breakingText) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ news, trending, sources, breakingText }),
    });
  } catch (e) {
    console.error('Gagal sync ke server:', e);
  }
}

export function CmsProvider({ children }) {
  const [news, setNews] = useState([]);
  const [trending, setTrending] = useState([]);
  const [sources, setSources] = useState([]);
  const [breakingText, setBreakingText] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Refs untuk akses state terbaru di dalam callback tanpa dependency
  const newsRef = useRef(news);
  const trendingRef = useRef(trending);
  const sourcesRef = useRef(sources);
  const breakingRef = useRef(breakingText);

  newsRef.current = news;
  trendingRef.current = trending;
  sourcesRef.current = sources;
  breakingRef.current = breakingText;

  // Helper: simpan state terbaru ke server
  const persist = useCallback(() => {
    saveAll(newsRef.current, trendingRef.current, sourcesRef.current, breakingRef.current);
  }, []);

  // ---- Fetch data dari server saat mount ----
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.news || []);
        setTrending(data.trending || []);
        setSources(data.sources || []);
        setBreakingText(data.breakingText || '');
        setLoaded(true);
      })
      .catch((err) => {
        console.error('Gagal fetch CMS data:', err);
        setLoaded(true);
      });
  }, []);

  // ---- Polling setiap 5 detik (HANYA BACA, tidak pernah menulis) ----
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          setNews(data.news || []);
          setTrending(data.trending || []);
          setSources(data.sources || []);
          setBreakingText(data.breakingText ?? '');
        })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ======== NEWS CRUD (langsung persist setelah update) ========
  const addNews = useCallback((item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      catColor: categoryColorMap[item.category] || 'bg-gray-100 text-gray-700',
      createdAt: new Date().toISOString(),
    };
    setNews((prev) => {
      const updated = [newItem, ...prev];
      // Langsung POST ke server dengan data terbaru
      saveAll(updated, trendingRef.current, sourcesRef.current, breakingRef.current);
      return updated;
    });
  }, []);

  const updateNews = useCallback((id, updates) => {
    setNews((prev) => {
      const updated = prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, catColor: categoryColorMap[updates.category || n.category] || n.catColor }
          : n
      );
      saveAll(updated, trendingRef.current, sourcesRef.current, breakingRef.current);
      return updated;
    });
  }, []);

  const deleteNews = useCallback((id) => {
    setNews((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveAll(updated, trendingRef.current, sourcesRef.current, breakingRef.current);
      return updated;
    });
  }, []);

  // ======== TRENDING CRUD ========
  const addTrending = useCallback((item) => {
    setTrending((prev) => {
      const updated = [...prev, { ...item, id: Date.now() }];
      saveAll(newsRef.current, updated, sourcesRef.current, breakingRef.current);
      return updated;
    });
  }, []);

  const deleteTrending = useCallback((id) => {
    setTrending((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveAll(newsRef.current, updated, sourcesRef.current, breakingRef.current);
      return updated;
    });
  }, []);

  const updateTrending = useCallback((id, updates) => {
    setTrending((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveAll(newsRef.current, updated, sourcesRef.current, breakingRef.current);
      return updated;
    });
  }, []);

  // ======== SOURCES CRUD ========
  const addSource = useCallback((item) => {
    setSources((prev) => {
      const updated = [...prev, { ...item, id: Date.now() }];
      saveAll(newsRef.current, trendingRef.current, updated, breakingRef.current);
      return updated;
    });
  }, []);

  const deleteSource = useCallback((id) => {
    setSources((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveAll(newsRef.current, trendingRef.current, updated, breakingRef.current);
      return updated;
    });
  }, []);

  const updateSource = useCallback((id, updates) => {
    setSources((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveAll(newsRef.current, trendingRef.current, updated, breakingRef.current);
      return updated;
    });
  }, []);

  // ======== BREAKING ========
  const setBreaking = useCallback((text) => {
    setBreakingText(text);
    saveAll(newsRef.current, trendingRef.current, sourcesRef.current, text);
  }, []);

  // ======== RESET ========
  const resetAll = useCallback(() => {
    setNews(defaultNewsData);
    setTrending(defaultTrendingData);
    setSources(defaultSourcesData);
    setBreakingText(defaultBreakingData);
    saveAll(defaultNewsData, defaultTrendingData, defaultSourcesData, defaultBreakingData);
  }, []);

  // ======== CATEGORY FILTER ========
  const [selectedCategory, setSelectedCategory] = useState(null);

  const value = {
    news, addNews, updateNews, deleteNews,
    trending, addTrending, deleteTrending, updateTrending,
    sources, addSource, deleteSource, updateSource,
    breakingText, setBreaking,
    selectedCategory, setSelectedCategory,
    resetAll, loaded,
  };

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}

// ============ DEFAULT DATA (for reset only) ============
const defaultNewsData = [
  {
    id: 1, category: 'Teknologi', catColor: 'bg-blue-100 text-blue-700',
    title: 'AI Generatif Revolusi Dunia Pendidikan Indonesia di Tahun 2026',
    summary: 'Kecerdasan buatan generatif kini mulai diadopsi secara massal di berbagai institusi pendidikan Indonesia.',
    fullContent: 'Kecerdasan buatan generatif kini mulai diadopsi secara massal di berbagai institusi pendidikan Indonesia. Mulai dari pembuatan materi ajar yang dipersonalisasi hingga sistem evaluasi otomatis, AI mengubah cara guru dan siswa berinteraksi di ruang kelas.\n\nKementerian Pendidikan dan Kebudayaan meluncurkan program "AI untuk Semua" yang memberikan akses gratis ke platform pembelajaran berbasis AI bagi seluruh sekolah negeri.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    author: 'Dewi Kartika', authorAvatar: 'https://i.pravatar.cc/40?img=1',
    time: '2 jam lalu', likes: 1243, comments: 89, views: '15.2K', trending: true,
  },
  {
    id: 2, category: 'Ekonomi', catColor: 'bg-emerald-100 text-emerald-700',
    title: 'Rupiah Menguat Tajam, IHSG Cetak Rekor Tertinggi Sepanjang Masa',
    summary: 'Nilai tukar rupiah terhadap dolar AS menguat signifikan ke level Rp14.800 per dolar.',
    fullContent: 'Nilai tukar rupiah terhadap dolar AS menguat signifikan ke level Rp14.800 per dolar AS pada perdagangan Selasa (10/2/2026).',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    author: 'Rizki Pratama', authorAvatar: 'https://i.pravatar.cc/40?img=3',
    time: '4 jam lalu', likes: 876, comments: 124, views: '22.1K', trending: true,
  },
  {
    id: 3, category: 'Olahraga', catColor: 'bg-orange-100 text-orange-700',
    title: 'Timnas Indonesia Lolos ke Piala Dunia 2026',
    summary: 'Untuk pertama kalinya dalam sejarah, Tim Nasional Indonesia berhasil menembus fase grup Piala Dunia.',
    fullContent: 'Untuk pertama kalinya dalam sejarah, Tim Nasional Indonesia berhasil menembus fase grup Piala Dunia 2026.',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=800',
    author: 'Ahmad Syaiful', authorAvatar: 'https://i.pravatar.cc/40?img=5',
    time: '6 jam lalu', likes: 5621, comments: 432, views: '89.3K', trending: false,
  },
];

const defaultTrendingData = [
  { id: 1, title: 'Timnas Indonesia Piala Dunia', posts: '125K posts' },
  { id: 2, title: 'Vaksin Kanker ITB', posts: '89K posts' },
  { id: 3, title: 'Rupiah Menguat', posts: '67K posts' },
];

const defaultSourcesData = [
  { id: 1, name: 'Kompas Digital', handle: '@kompascom', avatar: 'https://i.pravatar.cc/40?img=20' },
  { id: 2, name: 'Tech in Asia ID', handle: '@techinasia', avatar: 'https://i.pravatar.cc/40?img=21' },
  { id: 3, name: 'CNN Indonesia', handle: '@cnnindonesia', avatar: 'https://i.pravatar.cc/40?img=22' },
];

const defaultBreakingData = 'Timnas Indonesia resmi lolos ke Piala Dunia 2026 — Sejarah baru sepak bola tanah air!';