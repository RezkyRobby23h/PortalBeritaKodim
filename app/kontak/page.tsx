"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";

interface FormState {
  fullName: string;
  email: string;
  phoneNumber: string;
  content: string;
}

export default function KontakPage() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim() || null,
          content: form.content.trim(),
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ fullName: "", email: "", phoneNumber: "", content: "" });
      } else {
        const json = await res.json();
        setError((json.error as string) ?? "Gagal mengirim pesan.");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <Navbar variant="public" />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero Image */}
          <div className="mb-12 overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/IMG-20240928-WA0087-scaled.jpg"
              alt="Kodim 1408 Makassar"
              width={1200}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-black leading-tight md:text-5xl">
              Kontak Kodim 1408 Makassar
            </h1>
            <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
              TNI AD Profesional di Kota Metropolitan Timur
            </p>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="rounded-2xl bg-white dark:bg-zinc-800 p-8 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold">Informasi Kontak</h2>
              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-700/10 dark:bg-emerald-400/10">
                    <MapPin className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold">Alamat Markas</h3>
                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                      Jl. Perintis Kemerdekaan No.45, Kota Makassar, Sulawesi
                      Selatan, Indonesia
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-700/10 dark:bg-emerald-400/10">
                    <Phone className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold">Nomor Telepon</h3>
                    <a
                      href="tel:+62411123456"
                      className="text-zinc-600 transition-colors hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400"
                    >
                      (0411) 123-4567
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-700/10 dark:bg-emerald-400/10">
                    <Mail className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold">Email Resmi</h3>
                    <a
                      href="mailto:humas@kodim1408mks.mil.id"
                      className="text-zinc-600 transition-colors hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400"
                    >
                      humas@kodim1408mks.mil.id
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-700/10 dark:bg-emerald-400/10">
                    <Clock className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold">Jam Operasional</h3>
                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                      Senin – Jumat: 08.00 – 16.00 WITA
                      <br />
                      Sabtu: 08.00 – 12.00 WITA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl bg-white dark:bg-zinc-800 p-8 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold">Formulir Pesan</h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Masukkan nama lengkap Anda"
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="contoh@email.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="08xx xxxx xxxx"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phoneNumber: e.target.value }))
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Pesan Anda
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tulis pesan Anda di sini..."
                    required
                    value={form.content}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, content: e.target.value }))
                    }
                    className="w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-emerald-400"
                  />
                </div>
                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-emerald-700 to-emerald-400 px-6 py-4 font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-700/50 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-emerald-400/50"
                >
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {submitting ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
