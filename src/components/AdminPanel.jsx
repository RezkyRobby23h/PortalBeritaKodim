import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper, Plus, Trash2, Edit3, Save, X, ArrowLeft,
  FileText, TrendingUp, Users, Megaphone, RotateCcw,
  ChevronDown, ChevronUp, Eye, Image, AlertTriangle, Lock, LogOut, Upload
} from 'lucide-react';
import { useCms, categoryColorMap } from '../store/cmsStore.jsx';

const categoryOptions = Object.keys(categoryColorMap);

// ============ TAB: NEWS MANAGER ============
function NewsManager() {
  const { news, addNews, updateNews, deleteNews } = useCms();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    title: '', summary: '', fullContent: '', category: 'Teknologi',
    image: '', author: '', authorAvatar: '', trending: false,
  });
  
  // State untuk upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm({ title: '', summary: '', fullContent: '', category: 'Teknologi', image: '', author: '', authorAvatar: '', trending: false });
    setEditId(null);
    setShowForm(false);
    setUploadError('');
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title, summary: item.summary, fullContent: item.fullContent,
      category: item.category, image: item.image, author: item.author,
      authorAvatar: item.authorAvatar, trending: item.trending,
    });
    setEditId(item.id);
    setShowForm(true);
    setUploadError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi client-side
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.ok) {
        setForm({ ...form, image: result.url });
      } else {
        setUploadError(result.error || 'Upload gagal');
      }
    } catch (error) {
      setUploadError('Terjadi kesalahan saat upload');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) return;
    if (editId) {
      updateNews(editId, form);
    } else {
      addNews(form);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={22} className="text-indigo-600" /> Kelola Berita
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{news.length} berita terpublikasi</p>
        </div>
        {!showForm && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-[#35CE8D] text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-[#306B34] transition-colors shadow-sm"
          >
            <Plus size={18} /> Tambah Berita
          </motion.button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {editId ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h3>
              <button type="button" onClick={resetForm} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Judul *</label>
                  <input
                    required value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Judul berita..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ringkasan *</label>
                <textarea
                  required value={form.summary} rows={2}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ringkasan singkat berita..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Konten Lengkap</label>
                <textarea
                  value={form.fullContent} rows={5}
                  onChange={(e) => setForm({ ...form, fullContent: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Isi lengkap berita... (gunakan baris kosong untuk paragraf baru)"
                />
              </div>

              {/* BAGIAN UPLOAD GAMBAR - BARU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Gambar Berita
                </label>
                
                {/* Upload Button */}
                <div className="flex gap-2 mb-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"
                        />
                        Mengupload...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload Gambar
                      </>
                    )}
                  </button>
                  
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: '' })}
                      className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <X size={14} />
                      Hapus Gambar
                    </button>
                  )}
                </div>

                {/* Upload Error */}
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2"
                  >
                    <AlertTriangle size={14} />
                    {uploadError}
                  </motion.div>
                )}

                {/* Manual URL Input (alternative) */}
                <div className="relative">
                  <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Atau masukkan URL gambar manual..."
                  />
                </div>
                
                <p className="text-xs text-gray-400 mt-1.5">
                  Upload dari komputer (max 5MB, JPG/PNG/GIF/WebP) atau masukkan URL gambar
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Penulis</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Nama penulis..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL Avatar Penulis</label>
                  <input
                    value={form.authorAvatar}
                    onChange={(e) => setForm({ ...form, authorAvatar: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://i.pravatar.cc/40?img=..."
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="checkbox" checked={form.trending}
                    onChange={(e) => setForm({ ...form, trending: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Tandai sebagai Trending</span>
                </label>
              </div>

              {/* Image Preview */}
              {form.image && (
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-48">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>

            <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
              <button type="button" onClick={resetForm}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                <Save size={16} /> {editId ? 'Simpan Perubahan' : 'Publikasi Berita'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* News List */}
      <div className="space-y-3">
        {news.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4 items-start hover:shadow-sm transition-shadow"
          >
            {item.image && (
              <img src={item.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0 hidden sm:block" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.catColor}`}>
                  {item.category}
                </span>
                {item.trending && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 flex items-center gap-1">
                    <TrendingUp size={10} /> Trending
                  </span>
                )}
                <span className="text-[11px] text-gray-400">{item.time}</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.summary}</p>
              <p className="text-xs text-gray-400 mt-1">oleh {item.author || 'Anonim'}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => handleEdit(item)}
                className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors" title="Edit">
                <Edit3 size={16} />
              </button>
              {confirmDelete === item.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => { deleteNews(item.id); setConfirmDelete(null); }}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-colors" title="Konfirmasi hapus">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => setConfirmDelete(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="Batal">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(item.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Hapus">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============ TAB: TRENDING MANAGER ============
function TrendingManager() {
  const { trending, addTrending, updateTrending, deleteTrending } = useCms();
  const [form, setForm] = useState({ title: '', posts: '' });
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editId) {
      updateTrending(editId, form);
      setEditId(null);
    } else {
      addTrending(form);
    }
    setForm({ title: '', posts: '' });
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, posts: item.posts });
    setEditId(item.id);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <TrendingUp size={22} className="text-orange-500" /> Kelola Trending Topics
      </h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Judul trending topic..."
            />
          </div>
          <div className="flex gap-2">
            <input value={form.posts}
              onChange={(e) => setForm({ ...form, posts: e.target.value })}
              className="flex-1 px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="cth: 125K posts"
            />
            <button type="submit"
              className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shrink-0">
              {editId ? <Save size={16} /> : <Plus size={16} />}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ title: '', posts: '' }); }}
                className="px-3 py-2.5 bg-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-300 transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="space-y-2">
        {trending.map((item, index) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
            <span className="text-lg font-black text-gray-300 dark:text-gray-600 w-6 text-center">{index + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.posts}</p>
            </div>
            <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Edit3 size={15} />
            </button>
            <button onClick={() => deleteTrending(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {trending.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Belum ada trending topic.</p>
        )}
      </div>
    </div>
  );
}

// ============ TAB: SOURCES MANAGER ============
function SourcesManager() {
  const { sources, addSource, updateSource, deleteSource } = useCms();
  const [form, setForm] = useState({ name: '', handle: '', avatar: '' });
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      updateSource(editId, form);
      setEditId(null);
    } else {
      addSource(form);
    }
    setForm({ name: '', handle: '', avatar: '' });
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, handle: item.handle, avatar: item.avatar });
    setEditId(item.id);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Users size={22} className="text-blue-600" /> Kelola Sumber Berita
      </h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Nama sumber..." />
          <input value={form.handle}
            onChange={(e) => setForm({ ...form, handle: e.target.value })}
            className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="@handle" />
          <input value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            className="px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="URL avatar..." />
        </div>
        <div className="flex justify-end gap-2">
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ name: '', handle: '', avatar: '' }); }}
              className="px-4 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-300 transition-colors">
              Batal
            </button>
          )}
          <button type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            {editId ? <><Save size={15} /> Simpan</> : <><Plus size={15} /> Tambah</>}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {sources.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
            {item.avatar && <img src={item.avatar} alt="" className="w-10 h-10 rounded-full shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
              <p className="text-xs text-gray-400">{item.handle}</p>
            </div>
            <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Edit3 size={15} />
            </button>
            <button onClick={() => deleteSource(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {sources.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Belum ada sumber berita.</p>
        )}
      </div>
    </div>
  );
}

// ============ TAB: BREAKING NEWS ============
function BreakingManager() {
  const { breakingText, setBreaking } = useCms();
  const [draft, setDraft] = useState(breakingText);

  const handleSave = () => {
    setBreaking(draft);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Megaphone size={22} className="text-red-500" /> Breaking News Banner
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Teks Breaking News</label>
          <textarea
            value={draft} rows={3}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Teks breaking news yang akan ditampilkan di banner..."
          />
          <p className="text-xs text-gray-400 mt-1">Kosongkan untuk menyembunyikan banner breaking news.</p>
        </div>

        {/* Preview */}
        {draft && (
          <>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Preview:</p>
            <div className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-5 py-3 rounded-2xl flex items-center gap-3">
              <span className="bg-white text-red-600 text-xs font-black px-3 py-1 rounded-full animate-pulse shrink-0">
                BREAKING
              </span>
              <p className="text-sm font-medium truncate">{draft}</p>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            <Save size={16} /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ LOGIN FORM ============
function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.ok) {
        onLogin();
      } else {
        setError(result.error || 'Username atau password salah!');
        setPassword('');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#306B34] to-[#35CE8D] p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4"
            >
              <img
              src="/cropped-logo_kodim1408makassar-removebg-preview-1.png"
              alt="Logo Kodim"
              className="w-[48px] h-[48px] object-contain"
            />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-indigo-100 text-sm">Silakan masuk untuk melanjutkan</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                <AlertTriangle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="Masukkan username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="Masukkan password"
                disabled={isLoading}
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#306B34] to-[#306B34] text-white font-medium py-3 px-4 rounded-xl hover:from-[#2a5829] hover:to-[#2ebc7a] transition-all shadow-lg shadow-[#306B34]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 pt-0">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
              <Lock size={14} className="inline mr-1" />
              Akses terbatas hanya untuk administrator
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============ MAIN ADMIN PANEL ============
const tabs = [
  { key: 'news', label: 'Berita', icon: FileText, color: 'text-indigo-600' },
  { key: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-orange-500' },
  { key: 'sources', label: 'Sumber', icon: Users, color: 'text-blue-600' },
  { key: 'breaking', label: 'Breaking', icon: Megaphone, color: 'text-red-500' },
];

export default function AdminPanel() {
  const { resetAll } = useCms();
  const [activeTab, setActiveTab] = useState('news');
  const [showReset, setShowReset] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0f172a] transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 no-underline text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ArrowLeft size={20} />
              </a>
              <div className="flex items-center gap-2">
                <div className="bg-[#35CE8D] text-white p-1.5 rounded-lg">
                  <Newspaper size={18} />
                </div>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  Admin<span className="text-[#35CE8D] dark:text-[#35CE8D]">Panel</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" target="_blank"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors no-underline">
                <Eye size={16} /> Lihat Situs
              </a>
              <button onClick={() => setShowReset(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <RotateCcw size={16} /> Reset
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={18} className={isActive ? tab.color : ''} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'news' && <NewsManager />}
            {activeTab === 'trending' && <TrendingManager />}
            {activeTab === 'sources' && <SourcesManager />}
            {activeTab === 'breaking' && <BreakingManager />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReset(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertTriangle size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reset Semua Data?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Semua data berita, trending, dan sumber berita akan dikembalikan ke data default. Perubahan yang telah dibuat akan hilang.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowReset(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  Batal
                </button>
                <button onClick={() => { resetAll(); setShowReset(false); }}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm">
                  Ya, Reset Semua
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}