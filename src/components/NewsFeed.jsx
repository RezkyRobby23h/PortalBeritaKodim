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
        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
      >
        {/* Author Header */}
        <div className="flex items-center gap-3 p-4 pb-2">
          <img src={news.authorAvatar || 'https://i.pravatar.cc/40?img=0'} alt={news.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{news.author || 'Anonim'}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
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

        {/* Image */}
        {news.image && (
          <div className="relative cursor-pointer group" onClick={() => setExpanded(true)}>
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-52 sm:h-64 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 className="text-white font-bold text-lg sm:text-xl leading-tight drop-shadow-lg">
                {news.title}
              </h2>
            </div>
          </div>
        )}

        {!news.image && (
          <div className="px-4 pt-2">
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 leading-tight cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setExpanded(true)}>
              {news.title}
            </h2>
          </div>
        )}

        {/* Description - Truncated */}
        <div className="px-4 pt-3">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {news.summary}
          </p>
          <button
            onClick={() => setExpanded(true)}
            className="text-indigo-600 text-sm font-semibold mt-1 hover:text-indigo-800 transition-colors"
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
              className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close button */}
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${news.catColor}`}>
                  {news.category}
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Full Image */}
              {news.image && (
                <img src={news.image} alt={news.title} className="w-full h-56 sm:h-72 object-cover" />
              )}

              {/* Full Content */}
              <div className="p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-3">
                  {news.title}
                </h2>

                <div className="flex items-center gap-3 mb-5">
                  <img src={news.authorAvatar || 'https://i.pravatar.cc/40?img=0'} alt={news.author} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{news.author || 'Anonim'}</p>
                    <p className="text-xs text-gray-400">{timeAgo(news.createdAt)}</p>
                  </div>
                </div>

                <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line">
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
  const { news, breakingText, selectedCategory, setSelectedCategory } = useCms();
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredNews = selectedCategory
    ? news.filter((item) => item.category === selectedCategory)
    : news;
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

      {/* Category Filter Info */}
      {selectedCategory && (
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>Menampilkan kategori: <strong>{selectedCategory}</strong> ({filteredNews.length} berita)</span>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-indigo-500 hover:text-indigo-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Feed */}
      {filteredNews.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
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
          className="w-full py-4 bg-white rounded-2xl text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors shadow-sm border border-gray-100"
        >
          Tampilkan Berita Lainnya ({filteredNews.length - visibleCount} tersisa)
        </motion.button>
      )}
    </div>
  );
}