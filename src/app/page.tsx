import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import InfoCard from "@/components/ui/InfoCard";
import { getARPointsServer } from "@/lib/data";
import LandingAnimations from "./LandingAnimations";

export default async function HomePage() {
  const arPoints = await getARPointsServer();

  return (
    <main className="min-h-screen">
      <Navbar />
      <LandingAnimations />

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 hero-gradient kawung-pattern overflow-hidden" id="hero">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-green-mid/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-primary/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="reveal inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-light rounded-full px-4 py-2 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-mid animate-pulse-soft" />
              <span className="text-xs font-semibold text-green-primary tracking-wider uppercase">
                Augmented Reality • Edukasi
              </span>
            </div>

            {/* Title */}
            <h1 className="reveal font-display font-bold text-dark text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
              Jelajah Edukasi AR
              <br />
              <span className="text-green-primary">Candi Klodangan</span>
            </h1>

            {/* Subtitle */}
            <p className="reveal text-stone-candi text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
              Scan QR code di lokasi situs untuk menjelajahi sejarah dan
              arkeologi Candi Klodangan melalui{" "}
              <span className="font-semibold text-green-primary">
                Augmented Reality
              </span>
              .
            </p>

            {/* CTAs */}
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/timeline" className="btn-primary text-lg px-8 py-4" id="cta-timeline">
                📅 Lihat Timeline Situs
              </Link>
              <Link href="/jelajah-virtual" className="btn-primary text-lg px-8 py-4" id="cta-jelajah-virtual">
                🗺️ Jelajah Virtual
              </Link>
              <Link href="#cara-pakai" className="btn-secondary text-lg px-8 py-4" id="cta-cara-pakai">
                📱 Cara Menggunakan
              </Link>
            </div>
          </div>

          {/* Floating icons */}
          <div className="hidden md:block">
            <div className="absolute top-32 left-8 text-4xl animate-float opacity-30">
              🏛️
            </div>
            <div
              className="absolute top-48 right-12 text-3xl animate-float opacity-20"
              style={{ animationDelay: "1s" }}
            >
              🪨
            </div>
            <div
              className="absolute bottom-20 left-20 text-3xl animate-float opacity-25"
              style={{ animationDelay: "2s" }}
            >
              📜
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARA MENGGUNAKAN ===== */}
      <section className="py-20 bg-white" id="cara-pakai">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal inline-block text-green-mid font-semibold text-sm uppercase tracking-wider mb-3">
              Panduan
            </span>
            <h2 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl mb-4">
              Cara Menggunakan
            </h2>
            <p className="reveal text-stone-candi text-lg max-w-2xl mx-auto">
              Empat langkah mudah untuk menjelajahi situs Candi Klodangan
              dengan AR
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: "🚶",
                title: "Datang ke Lokasi",
                desc: "Kunjungi situs Candi Klodangan di Dusun Klodangan, Sendangtirto, Berbah, Sleman.",
              },
              {
                step: "02",
                icon: "📱",
                title: "Scan QR Code",
                desc: "Scan QR code yang tertempel di tiap titik informasi menggunakan kamera HP.",
              },
              {
                step: "03",
                icon: "📸",
                title: "Arahkan Kamera",
                desc: "Izinkan akses kamera dan GPS, lalu arahkan HP ke area sekitar titik informasi.",
              },
              {
                step: "04",
                icon: "📖",
                title: "Baca & Pelajari",
                desc: "Klik titik info AR yang muncul, baca narasi sejarah, dan pelajari arkeologinya.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`reveal reveal-delay-${i + 1} relative bg-green-pale rounded-2xl p-6 text-center card-hover border border-green-light/30`}
              >
                {/* Step number */}
                <div className="absolute -top-3 -right-2 w-8 h-8 rounded-full bg-green-primary text-white text-xs font-bold flex items-center justify-center shadow-lg">
                  {item.step}
                </div>
                <span className="text-4xl block mb-4">{item.icon}</span>
                <h3 className="font-display font-bold text-dark text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-candi text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TITIK INFORMASI ===== */}
      <section className="py-20 kawung-pattern" id="titik-info">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal inline-block text-green-mid font-semibold text-sm uppercase tracking-wider mb-3">
              4 Titik AR
            </span>
            <h2 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl mb-4">
              Titik Informasi di Situs
            </h2>
            <p className="reveal text-stone-candi text-lg max-w-2xl mx-auto">
              Setiap titik memiliki QR code unik yang memicu pengalaman AR
              berbeda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {arPoints.map((point, i) => (
              <InfoCard
                key={point.id}
                icon={point.icon}
                title={point.title}
                description={point.shortInfo}
                linkHref={`/edukasi/${point.edukasiId}`}
                className={`reveal reveal-delay-${(i % 4) + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TENTANG CANDI ===== */}
      <section className="py-20 bg-white" id="tentang">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="reveal inline-block text-green-mid font-semibold text-sm uppercase tracking-wider mb-3">
                Tentang
              </span>
              <h2 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl mb-6">
                Candi Klodangan
              </h2>
              <div className="space-y-4 text-stone-candi leading-relaxed">
                <p className="reveal">
                  Candi Klodangan adalah situs arkeologi yang terletak di Dusun
                  Klodangan, Desa Sendangtirto, Kecamatan Berbah, Kabupaten
                  Sleman, Daerah Istimewa Yogyakarta.
                </p>
                <p className="reveal">
                  Ditemukan secara tidak sengaja oleh petani pada{" "}
                  <strong className="text-dark">3 Juni 1998</strong>, candi ini
                  diperkirakan berasal dari{" "}
                  <strong className="text-dark">abad ke-9 hingga ke-10 Masehi</strong>{" "}
                  — sezaman dengan era Kerajaan Mataram Kuno yang membangun Candi
                  Prambanan dan Borobudur.
                </p>
                <p className="reveal">
                  Saat ini hanya tersisa struktur fondasi berukuran 7,5 × 7,5
                  meter. Bentuk asli candi belum diketahui dan diduga tidak
                  pernah selesai dibangun. Situs ini dikelola oleh{" "}
                  <strong className="text-dark">
                    Balai Pelestarian Cagar Budaya (BPCB) DIY
                  </strong>
                  .
                </p>
              </div>

              <div className="reveal mt-6">
                <Link href="/timeline" className="btn-primary inline-flex items-center gap-2" id="btn-timeline-tentang">
                  📅 Lihat Sejarah Lengkap
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="reveal">
              <div className="bg-green-pale rounded-3xl p-8 kawung-pattern-strong relative overflow-hidden">
                <div className="text-center">
                  <div className="text-7xl mb-4">🏛️</div>
                  <h3 className="font-display font-bold text-dark text-xl mb-3">
                    Fakta Singkat
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {[
                      { label: "Ditemukan", value: "1998" },
                      { label: "Usia", value: "Abad IX-X" },
                      { label: "Fondasi", value: "7,5 × 7,5 m" },
                      { label: "Lokasi", value: "Sleman, DIY" },
                    ].map((fact) => (
                      <div
                        key={fact.label}
                        className="bg-white/80 rounded-xl p-3 backdrop-blur-sm"
                      >
                        <div className="font-display font-bold text-green-primary text-lg">
                          {fact.value}
                        </div>
                        <div className="text-stone-candi text-xs">
                          {fact.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 bg-green-primary relative overflow-hidden">
        <div className="absolute inset-0 kawung-pattern opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="font-display font-bold text-white text-3xl sm:text-4xl mb-4">
            Siap Menjelajah?
          </h2>
          <p className="text-green-light text-lg mb-8 max-w-2xl mx-auto">
            Kunjungi Candi Klodangan dan scan QR code di lokasi untuk memulai
            pengalaman AR edukasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/timeline"
              className="bg-white text-green-primary font-body font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:bg-green-light hover:shadow-lg active:scale-95"
              id="cta-bottom-timeline"
            >
              📅 Lihat Timeline
            </Link>
            <a
              href="https://maps.google.com/?q=-7.812667,110.426289"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white font-body font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:bg-white/10 active:scale-95"
              id="cta-bottom-maps"
            >
              📍 Buka di Google Maps
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
