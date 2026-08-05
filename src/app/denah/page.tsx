"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function DenahPage() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const imagePath =
    "/images/denah-candi-klodangan/SC02986_DENAH_POT.SITUS_KLODANGAN_REG_YEP.06.P.03652_watermarked.jpg.jpeg";

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      imageContainerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // Reveal animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative pt-24 pb-12 md:pt-32 md:pb-16 hero-gradient kawung-pattern overflow-hidden"
        id="denah-hero"
      >
        {/* Decorative blurs */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-green-mid/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-primary/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="reveal flex items-center justify-center gap-2 text-sm text-stone-candi mb-6">
              <Link
                href="/"
                className="hover:text-green-primary transition-colors"
              >
                Beranda
              </Link>
              <svg
                className="w-4 h-4 text-stone-candi/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-green-primary font-semibold">
                Denah Situs
              </span>
            </nav>

            {/* Badge */}
            <div className="reveal inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-light rounded-full px-4 py-2 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-mid animate-pulse-soft" />
              <span className="text-xs font-semibold text-green-primary tracking-wider uppercase">
                Dokumen Arkeologi Resmi
              </span>
            </div>

            {/* Title */}
            <h1 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
              Denah & Potongan
              <br />
              <span className="text-green-primary">Situs Klodangan</span>
            </h1>

            {/* Subtitle */}
            <p className="reveal text-stone-candi text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Gambar teknis denah dan potongan Situs Klodangan yang dibuat oleh{" "}
              <span className="font-semibold text-green-primary">
                Balai Pelestarian Kebudayaan D.I. Yogyakarta
              </span>{" "}
              sebagai dokumentasi arkeologi resmi.
            </p>
          </div>
        </div>
      </section>

      {/* ===== DENAH IMAGE SECTION ===== */}
      <section className="py-12 md:py-16 bg-white" id="denah-gambar">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-8">
            <span className="reveal inline-block text-green-mid font-semibold text-sm uppercase tracking-wider mb-3">
              Gambar Teknis
            </span>
            <h2 className="reveal font-display font-bold text-dark text-2xl sm:text-3xl mb-2">
              Denah Situs Klodangan
            </h2>
            <p className="reveal text-stone-candi text-sm">
              Klik gambar untuk memperbesar • Skala asli 1:40
            </p>
          </div>

          {/* Image container */}
          <div className="reveal max-w-5xl mx-auto">
            <div
              ref={imageContainerRef}
              className={`relative rounded-2xl overflow-hidden border border-green-light/50 shadow-lg bg-green-pale transition-all duration-500 ${
                isFullscreen ? "rounded-none" : ""
              }`}
            >
              {/* Loading skeleton */}
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-pale z-10">
                  <div className="text-center">
                    <div className="spinner mx-auto mb-4" />
                    <p className="text-stone-candi text-sm">
                      Memuat gambar denah...
                    </p>
                  </div>
                </div>
              )}

              {/* The denah image */}
              <div
                className={`relative cursor-zoom-in transition-transform duration-500 ease-out ${
                  isZoomed && !isFullscreen
                    ? "scale-150 cursor-zoom-out"
                    : "scale-100"
                } ${isFullscreen ? "h-screen flex items-center justify-center bg-dark" : ""}`}
                onClick={() => {
                  if (!isFullscreen) setIsZoomed(!isZoomed);
                }}
              >
                <Image
                  src={imagePath}
                  alt="Denah dan Potongan Situs Klodangan - Balai Pelestarian Kebudayaan D.I. Yogyakarta"
                  width={1920}
                  height={1080}
                  className={`w-full h-auto ${isFullscreen ? "object-contain max-h-screen w-auto mx-auto" : ""}`}
                  priority
                  onLoad={() => setIsImageLoaded(true)}
                  unoptimized
                />
              </div>

              {/* Image controls overlay */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="glass rounded-full p-3 hover:bg-white/90 transition-all shadow-md group"
                  aria-label={isZoomed ? "Perkecil" : "Perbesar"}
                  id="btn-zoom-denah"
                >
                  {isZoomed ? (
                    <svg
                      className="w-5 h-5 text-green-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-green-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  )}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="glass rounded-full p-3 hover:bg-white/90 transition-all shadow-md group"
                  aria-label={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
                  id="btn-fullscreen-denah"
                >
                  {isFullscreen ? (
                    <svg
                      className="w-5 h-5 text-green-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-green-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Image caption */}
            <div className="mt-4 text-center">
              <p className="text-stone-candi text-xs italic">
                Sumber: Balai Pelestarian Kebudayaan D.I. Yogyakarta — Nomor
                Reg. YEP.06.P.03652
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFO DENAH ===== */}
      <section className="py-12 md:py-16 kawung-pattern" id="info-denah">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="reveal inline-block text-green-mid font-semibold text-sm uppercase tracking-wider mb-3">
              Informasi Dokumen
            </span>
            <h2 className="reveal font-display font-bold text-dark text-2xl sm:text-3xl mb-2">
              Detail Gambar Teknis
            </h2>
            <p className="reveal text-stone-candi text-sm max-w-xl mx-auto">
              Informasi resmi yang tercantum dalam dokumen denah situs arkeologi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Info Lokasi */}
            <div className="reveal bg-white rounded-2xl p-6 border border-green-light/30 card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-green-primary flex items-center justify-center">
                  <span className="text-xl">📍</span>
                </div>
                <h3 className="font-display font-bold text-dark text-lg">
                  Lokasi Situs
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Dusun", value: "Klodangan" },
                  { label: "Desa", value: "Sendangtirto" },
                  { label: "Kecamatan", value: "Berbah" },
                  { label: "Kabupaten", value: "Sleman" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-green-light/30 last:border-0"
                  >
                    <span className="text-stone-candi text-sm">
                      {item.label}
                    </span>
                    <span className="font-semibold text-dark text-sm">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Gambar */}
            <div className="reveal reveal-delay-1 bg-white rounded-2xl p-6 border border-green-light/30 card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-green-mid flex items-center justify-center">
                  <span className="text-xl">📐</span>
                </div>
                <h3 className="font-display font-bold text-dark text-lg">
                  Spesifikasi Gambar
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Skala", value: "1 : 200" },
                  { label: "Ukuran", value: "45 × 34 cm" },
                  { label: "Tanggal", value: "20 Agustus 2000" },
                  { label: "Nomor Lembar", value: "9 dari 12" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-green-light/30 last:border-0"
                  >
                    <span className="text-stone-candi text-sm">
                      {item.label}
                    </span>
                    <span className="font-semibold text-dark text-sm">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keterangan Denah */}
            <div className="reveal reveal-delay-2 bg-white rounded-2xl p-6 border border-green-light/30 card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-stone-candi flex items-center justify-center">
                  <span className="text-xl">📋</span>
                </div>
                <h3 className="font-display font-bold text-dark text-lg">
                  Keterangan Denah
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { symbol: "■", label: "Temuan kekunoan dari batu putih" },
                  { symbol: "---", label: "Perkiraan" },
                  { symbol: "≋", label: "Pematang bertebing" },
                  { symbol: "···", label: "Pematang sawah" },
                  { symbol: "≈", label: "Permukaan tanah" },
                  { symbol: "~", label: "Saluran air" },
                  { symbol: "◎", label: "Datum Point (DP)" },
                  { symbol: "▨", label: "Penampang batu putih" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 py-1.5"
                  >
                    <span className="w-8 text-center text-green-primary font-mono text-sm font-bold flex-shrink-0">
                      {item.symbol}
                    </span>
                    <span className="text-stone-candi text-sm">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tim Penyusun */}
            <div className="reveal reveal-delay-3 bg-white rounded-2xl p-6 border border-green-light/30 card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-green-primary flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <h3 className="font-display font-bold text-dark text-lg">
                  Tim Penyusun
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { role: "Diukur", name: "Supana" },
                  { role: "Digambar", name: "Dulrachman" },
                  { role: "Penanggung Jawab", name: "Dra. Herni Pramastuti" },
                  { role: "Diperiksa", name: "Dra. Tri Hartini" },
                  { role: "Kapok Perlindungan", name: "Dra. Surayati Supangat" },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="flex items-center justify-between py-2 border-b border-green-light/30 last:border-0"
                  >
                    <span className="text-stone-candi text-sm">
                      {item.role}
                    </span>
                    <span className="font-semibold text-dark text-sm text-right">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Source badge */}
          <div className="reveal mt-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-green-light/50 shadow-sm">
              <span className="text-lg">🏛️</span>
              <div className="text-left">
                <p className="text-xs font-semibold text-green-primary">
                  Sumber Resmi
                </p>
                <p className="text-xs text-stone-candi">
                  Suaka Peninggalan Sejarah dan Purbakala — D.I. Yogyakarta
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-12 bg-green-primary relative overflow-hidden">
        <div className="absolute inset-0 kawung-pattern opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-4">
            Jelajahi Lebih Lanjut
          </h2>
          <p className="text-green-light text-base mb-8 max-w-2xl mx-auto">
            Lihat timeline sejarah situs atau kunjungi langsung lokasi Candi
            Klodangan untuk pengalaman edukasi yang lebih lengkap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/timeline"
              className="bg-white text-green-primary font-body font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:bg-green-light hover:shadow-lg active:scale-95"
              id="cta-denah-timeline"
            >
              📅 Lihat Timeline
            </Link>
            <Link
              href="/jelajah-virtual"
              className="border-2 border-white text-white font-body font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:bg-white/10 active:scale-95"
              id="cta-denah-jelajah"
            >
              🗺️ Jelajah Virtual
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
