"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tent,
  Sparkles,
  PackageSearch,
  History,
  ShieldCheck,
  Compass,
  Users,
  ArrowRight,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { C, headingFont, bodyFont } from "../lib/tokens";
import { SectionEyebrow, GearTag } from "../components/Shared";

export default function HomePage() {
  // Data Slide Carousel
  const slides = [
    {
      badge: "Sewa Alat Outdoor & Camping #1 di Mataram",
      title: "Piknik & Grill Seru di Tengah Hutan",
      desc: "Nikmati momen hangat membakar daging bersama teman dan keluarga tanpa ribet. Kami sediakan panggangan portable dan peralatan BBQ siap pakai!",
      ctaText: "Jelajahi Alat BBQ",
      ctaLink: "/catalog",
      image: "https://i.pinimg.com/1200x/72/29/a9/7229a96bd8f47054c4084ca61ac59f59.jpg", // 
      alt: "Piknik & Grill BBQ",
    },
    {
      badge: "Perlengkapan Lengkap & Terawat",
      title: "Set Alat Piknik & Camping Estetik",
      desc: "Sewa tikar piknik, keranjang vintage, piring, alat masak, hingga pemanggang. Semua alat dalam kondisi higienis dan siap memanjakan liburanmu.",
      ctaText: "Lihat Katalog Alat",
      ctaLink: "/catalog",
      image: "https://i.pinimg.com/736x/d6/93/fb/d693fb46125490b2c5665ac94b7dbf3f.jpg",
      alt: "Peralatan Piknik",
    },
    {
      badge: "Solusi Hemat & Berkualitas",
      title: "Sewa Lebih Murah dengan Opsi Bundling",
      desc: "Dapatkan alat outdoor kualitas terbaik dengan harga terjangkau. Lebih hemat dan praktis menggunakan paket bundling yang kami sediakan!",
      ctaText: "Lihat Paket Bundling",
      ctaLink: "/bundle",
      image: "https://i.imgur.com/RGaR899.png",
      alt: "Paket Hemat Camping",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* 1. HERO SLIDER SECTION WITH IMAGE */}
      <section
        className="relative overflow-hidden rounded-3xl p-6 md:p-10 text-white shadow-xl transition-all duration-700 ease-in-out min-h-[420px] flex flex-col justify-between"
        style={{
          backgroundColor: C.forestDeep,
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.2) 0%, transparent 60%)",
        }}
      >
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-12 gap-6 items-center relative z-10 my-auto">
          {/* Text Area (Left) */}
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border border-amber-500/30 bg-amber-500/10 text-amber-300">
              <Sparkles size={14} className="text-amber-400" />
              <span>{slides[currentSlide].badge}</span>
            </div>

            <h1
              className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3 transition-all duration-500"
              style={{ ...headingFont }}
            >
              {slides[currentSlide].title}
            </h1>

            <p
              className="text-xs md:text-sm text-stone-300 mb-6 leading-relaxed max-w-xl"
              style={{ ...bodyFont }}
            >
              {slides[currentSlide].desc}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={slides[currentSlide].ctaLink}
                className="px-5 py-3 rounded-full font-bold text-xs transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg cursor-pointer"
                style={{
                  backgroundColor: C.amber,
                  color: C.forestDeep,
                  ...bodyFont,
                }}
              >
                <PackageSearch size={16} />
                <span>{slides[currentSlide].ctaText}</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/bundle"
                className="px-5 py-3 rounded-full font-bold text-xs border border-stone-600 hover:bg-stone-800/60 transition-colors flex items-center gap-2 cursor-pointer"
                style={{ color: C.paper, ...bodyFont }}
              >
                <Sparkles size={16} className="text-amber-400" />
                <span>Cek Paket Hemat</span>
              </Link>
            </div>
          </div>

          {/* Image Area (Right) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full h-52 md:h-64 rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl bg-stone-900/40">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none hidden md:block">
          <Tent size={300} />
        </div>

        {/* Navigation Controls */}
        <div className="relative z-20 flex items-center justify-between pt-4 border-t border-white/10 mt-6">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-8 bg-amber-400"
                    : "w-2.5 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev/Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Next Slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ShieldCheck, title: "100% Terawat", desc: "Alat bersih & disinfeksi" },
          { icon: Clock, title: "Proses Cepat", desc: "Persetujuan via sistem" },
          { icon: Compass, title: "Paket Lengkap", desc: "Dari solo sampai family" },
          { icon: Users, title: "Ribuan Peminjam", desc: "Dipercaya pendaki & keluarga" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl flex items-center gap-3.5 border"
              style={{
                backgroundColor: C.paper,
                borderColor: C.canvasDeep,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${C.moss}1F` }}
              >
                <Icon size={20} style={{ color: C.moss }} />
              </div>
              <div>
                <p
                  className="text-xs font-bold"
                  style={{ ...headingFont, color: C.forestDeep }}
                >
                  {item.title}
                </p>
                <p
                  className="text-[11px]"
                  style={{ ...bodyFont, color: "#8A8272" }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. MENU PINTAS / KATEGORI */}
      <section>
        <SectionEyebrow
          index={1}
          total={4}
          title="Layanan Peminjaman"
          desc="Pilih cara sewa yang sesuai dengan kebutuhan aktivitas outdoor kamu."
        />

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div
            className="rounded-2xl p-6 flex flex-col justify-between border transition-all hover:shadow-md"
            style={{ backgroundColor: C.paper, borderColor: C.canvasDeep }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${C.moss}20` }}
              >
                <PackageSearch size={24} style={{ color: C.moss }} />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ ...headingFont, color: C.forestDeep }}
              >
                Sewa Alat Satuan
              </h3>
              <p
                className="text-xs leading-relaxed mb-4"
                style={{ ...bodyFont, color: "#5C5548" }}
              >
                Pilih unit spesifik yang kamu butuhkan mulai dari tenda, kompor portable, panggangan BBQ, tikar, hingga coolbox.
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-xs font-bold pt-4 border-t border-stone-100"
              style={{ color: C.moss }}
            >
              <span>Buka Katalog Satuan</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col justify-between border transition-all hover:shadow-md relative overflow-hidden"
            style={{ backgroundColor: C.paper, borderColor: C.canvasDeep }}
          >
            <div className="absolute top-4 right-4">
              <GearTag tone={C.rust}>Hemat 20%</GearTag>
            </div>
            <div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${C.amberDeep}20` }}
              >
                <Sparkles size={24} style={{ color: C.amberDeep }} />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ ...headingFont, color: C.forestDeep }}
              >
                Paket Bundle Hemat
              </h3>
              <p
                className="text-xs leading-relaxed mb-4"
                style={{ ...bodyFont, color: "#5C5548" }}
              >
                Solusi praktis dan ekonomis! Kombinasi alat lengkap untuk Solo Camping, Piknik BBQ, atau Grill Party.
              </p>
            </div>
            <Link
              href="/bundle"
              className="inline-flex items-center gap-2 text-xs font-bold pt-4 border-t border-stone-100"
              style={{ color: C.amberDeep }}
            >
              <span>Lihat Semua Paket</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col justify-between border transition-all hover:shadow-md"
            style={{ backgroundColor: C.paper, borderColor: C.canvasDeep }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${C.forestDeep}15` }}
              >
                <History size={24} style={{ color: C.forestDeep }} />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ ...headingFont, color: C.forestDeep }}
              >
                Status Peminjaman
              </h3>
              <p
                className="text-xs leading-relaxed mb-4"
                style={{ ...bodyFont, color: "#5C5548" }}
              >
                Pantau status pengajuan peminjaman kamu secara real-time, mulai dari persetujuan hingga masa pengembalian.
              </p>
            </div>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-xs font-bold pt-4 border-t border-stone-100"
              style={{ color: C.forestDeep }}
            >
              <span>Cek Riwayat Saya</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CARA PENGAJUAN SEWA */}
      <section
        className="rounded-3xl p-8 border"
        style={{ backgroundColor: C.paper, borderColor: C.canvasDeep }}
      >
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2
            className="text-xl md:text-2xl font-bold mb-2"
            style={{ ...headingFont, color: C.forestDeep }}
          >
            Cara Mudah Peminjaman Alat
          </h2>
          <p className="text-xs text-stone-500" style={{ ...bodyFont }}>
            Hanya butuh 3 langkah sederhana sebelum kamu siap berpetualang.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {[
            {
              step: "01",
              title: "Pilih Alat / Paket",
              desc: "Cari alat yang dibutuhkan di katalog dan tentukan tanggal mulai serta kembali sewa.",
            },
            {
              step: "02",
              title: "Kirim Pengajuan",
              desc: "Masuk dengan akun kamu lalu kirim formulir pengajuan sewa secara cepat.",
            },
            {
              step: "03",
              title: "Ambil & Nikmati",
              desc: "Tunggu status disetujui oleh admin, ambil alat di lokasi, dan siap untuk berpetualang!",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-stone-200 relative flex flex-col justify-between"
            >
              <div>
                <span
                  className="text-2xl font-black mb-3 block"
                  style={{ ...headingFont, color: C.amber }}
                >
                  {s.step}
                </span>
                <h4
                  className="font-bold text-sm mb-1.5"
                  style={{ ...headingFont, color: C.forestDeep }}
                >
                  {s.title}
                </h4>
                <p
                  className="text-xs text-stone-600 leading-relaxed"
                  style={{ ...bodyFont }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section
        className="rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4"
        style={{ backgroundColor: `${C.moss}15`, border: `1px solid ${C.moss}30` }}
      >
        <Tent size={40} style={{ color: C.moss }} />
        <h2
          className="text-2xl font-bold"
          style={{ ...headingFont, color: C.forestDeep }}
        >
          Siap Untuk Liburan Minggu Ini?
        </h2>
        <p
          className="text-xs max-w-md text-stone-600 leading-relaxed"
          style={{ ...bodyFont }}
        >
          Jangan biarkan rencana camping kamu tertunda. Cek ketersediaan alat sekarang sebelum kehabisan stok!
        </p>
        <Link
          href="/catalog"
          className="px-8 py-3.5 rounded-full font-bold text-xs md:text-sm text-white transition-opacity hover:opacity-90 shadow-md cursor-pointer"
          style={{ backgroundColor: C.forestDeep, ...bodyFont }}
        >
          Mulai Sewa Sekarang
        </Link>
      </section>
    </div>
  );
}