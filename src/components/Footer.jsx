import React from 'react';
import { Newspaper, Mail, Phone, MapPin, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
              src="/cropped-logo_kodim1408makassar-removebg-preview-1.png"
              alt="Logo Kodim"
              className="w-[48px] h-[48px] object-contain"
            />
              <span className="text-xl font-black text-white tracking-tight">
              Info<span className="text-[#35CE8D]">Kodim</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Portal berita terkini dan terpercaya. Menyajikan informasi akurat untuk Indonesia yang lebih cerdas.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {['Beranda', 'Politik', 'Ekonomi', 'Teknologi', 'Olahraga', 'Hiburan'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              {['Tentang Kami', 'Redaksi', 'Karir', 'Pedoman Media', 'Iklan', 'Hubungi Kami'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2"><Mail size={16} className="text-emerald-400" /> info@kodim1408makassar.id</p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-emerald-400" /> (021) 1234-5678</p>
              <p className="flex items-start gap-2"><MapPin size={16} className="text-emerald-400 mt-0.5" /> Jakarta Selatan, Indonesia</p>
            </div>
            <div className="flex gap-3 mt-5">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>&copy; 2026 KabarKini. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privasi</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Ketentuan</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}