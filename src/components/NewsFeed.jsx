import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, X } from 'lucide-react';
import { useCms } from '../store/cmsStore.jsx';


function timeAgo(dateString) {
  if (!dateString) return 'Baru saja';
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;

  // Lebih dari 24 jam, tampilkan tanggal
  return created.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function useTick() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);
}

function NewsCard({ news }) {
  const [expanded, setExpanded] = useState(false);
  useTick();
  
  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Author Header */}
        <div className="flex items-center gap-3 p-4 pb-2">
          <img src={news.authorAvatar || 'https://i.pravatar.cc/40?img=0'} alt={news.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{news.author || 'Anonim'}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              <span>{timeAgo(news.createdAt)}</span>
              {news.trending && (
                <span className="flex items-center gap-1 text-orange-500 font-medium">
                  <TrendingUp size={12} /> Trending
                </span>
              )}
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${news.catColor}`}>
            {news.category}
          </span>
        </div>

        {/* Image - DIPERBAIKI: Mengikuti rasio aspek asli */}
        {news.image && (
          <div className="relative cursor-pointer group bg-gray-50 dark:bg-gray-900" onClick={() => setExpanded(true)}>
            <img
              src={news.image}
              alt={news.title}
              className="w-full object-contain max-h-[600px]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <h2 className="text-white font-bold text-lg sm:text-xl leading-tight drop-shadow-lg">
                {news.title}
              </h2>
            </div>
          </div>
        )}

        {/* Title & Description */}
        <div className="px-4 pt-3 pb-4">
          {news.image && (
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white leading-tight mb-2">
              {news.title}
            </h2>
          )}
          
          {!news.image && (
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white leading-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2" onClick={() => setExpanded(true)}>
              {news.title}
            </h2>
          )}

          {/* Description - Truncated */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 mb-2">
            {news.summary}
          </p>
          <button
            onClick={() => setExpanded(true)}
            className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            Baca selengkapnya...
          </button>
        </div>
      </motion.article>

      {/* Expanded Overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close button */}
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${news.catColor}`}>
                  {news.category}
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Full Image - DIPERBAIKI: Mengikuti rasio aspek asli */}
              {news.image && (
                <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full max-h-[60vh] object-contain" 
                  />
                </div>
              )}

              {/* Full Content */}
              <div className="p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                  {news.title}
                </h2>

                <div className="flex items-center gap-3 mb-5">
                  <img src={news.authorAvatar || 'https://i.pravatar.cc/40?img=0'} alt={news.author} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{news.author || 'Anonim'}</p>
                    <p className="text-xs text-gray-400">{timeAgo(news.createdAt)}</p>
                  </div>
                </div>

                <div className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed whitespace-pre-line">
                  {news.fullContent || news.summary}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function NewsFeed() {
  const { news, breakingText, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useCms();
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredNews = news.filter((item) => {
    const matchCategory = !selectedCategory || item.category === selectedCategory;
    const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });
  const visibleNews = filteredNews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNews.length;

  const showMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="space-y-5">
      {/* Breaking News Banner */}
      {breakingText && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-red-500/20"
        >
          <span className="bg-white text-red-600 text-xs font-black px-3 py-1 rounded-full animate-pulse shrink-0">
            BREAKING
          </span>
          <p className="text-sm font-medium truncate">
            {breakingText}
          </p>
        </motion.div>
      )}

      {/* Search Filter Info */}
      {searchQuery && (
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>Hasil pencarian: <strong>"{searchQuery}"</strong> ({filteredNews.length} berita)</span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Category Filter Info */}
      {selectedCategory && (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>Menampilkan kategori: <strong>{selectedCategory}</strong> ({filteredNews.length} berita)</span>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Feed */}
      {filteredNews.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center text-gray-400">
          <p className="text-lg font-medium">{selectedCategory ? `Belum ada berita ${selectedCategory}.` : 'Belum ada berita.'}</p>
          <p className="text-sm mt-1">Tambahkan berita melalui Admin Panel.</p>
        </div>
      )}
      {visibleNews.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}

      {hasMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={showMore}
          className="w-full py-4 bg-white dark:bg-gray-800 rounded-2xl text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-100 dark:border-gray-700"
        >
          Tampilkan Berita Lainnya ({filteredNews.length - visibleCount} tersisa)
        </motion.button>
      )}
    </div>
  );
}