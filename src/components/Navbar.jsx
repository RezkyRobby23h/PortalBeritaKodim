import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Newspaper, Settings } from 'lucide-react';

const categories = ['Terbaru', 'Politik', 'Ekonomi', 'Teknologi', 'Olahraga', 'Hiburan', 'Kesehatan'];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 no-underline">
            <img
              src="/cropped-logo_kodim1408makassar-removebg-preview-1.png"
              alt="Logo Kodim"
              className="w-[48px] h-[48px] object-contain"
            />
            <span className="text-xl font-black text-gray-900 tracking-tight">
              Info<span className="text-[#35CE8D]">Kodim</span>
            </span>
          </a>

          {/* Desktop Categories */}
          <div className="hidden md:flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#306B34] hover:bg-[#306B34]/20 rounded-full transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-[gray-100] rounded-full transition-colors"
            >
              <Search size={20} className="text-gray-600" />
            </motion.button>
            <a
              href="/admin"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-indigo-600"
              title="Admin Panel"
            >
              <Settings size={20} />
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3"
            >
              <input
                autoFocus
                type="text"
                placeholder="Cari berita..."
                className="w-full px-4 py-2.5 bg-gray-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-3 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-full transition-colors"
                >
                  {cat}
                </button>
              ))}
              <a
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors"
              >
                Admin Panel
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}