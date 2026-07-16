import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
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
                QR Scan • Edukasi Arkeologi
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
              Scan QR code di tiap lapisan batu untuk menjelajahi sejarah dan
              arkeologi Candi Klodangan melalui{" "}
              <span className="font-semibold text-green-primary">
                edukasi interaktif
              </span>
              .
            </p>

            {/* CTAs */}
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scan" className="btn-primary text-lg px-8 py-4 ring-2 ring-green-mid ring-offset-2 ring-offset-green-pale" id="cta-scan-qr">
                📱 Scan QR Tumpukan
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

      {/* ===== 3 FITUR UTAMA ===== */}
      <section className="py-16 bg-white" id="fitur-utama">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="reveal inline-block text-green-mid font-semibold text-sm uppercase tracking-wider mb-3">
              Tiga Cara Menjelajah
            </span>
            <h2 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl mb-4">
              Fitur Utama
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📱",
                title: "QR per Tumpukan",
                subtitle: "Di lokasi candi",
                desc: "Scan QR code di tiap lapisan batu untuk membuka info spesifik tumpukan tersebut. Simpel, akurat, tanpa perlu GPS.",
                tag: "Info Detail",
                color: "bg-green-primary",
              },
              {
                icon: "🧭",
                title: "Navigasi AR GPS",
                subtitle: "Menuju ke candi",
                desc: "Gunakan kamera HP + GPS untuk navigasi AR dari parkiran menuju lokasi Candi Klodangan.",
                tag: "Navigasi",
                color: "bg-green-mid",
              },
              {
                icon: "🗺️",
                title: "Jelajah Virtual",
                subtitle: "Dari mana saja",
                desc: "Lihat foto aerial situs dengan hotspot interaktif — untuk yang tidak bisa datang langsung.",
                tag: "Remote",
                color: "bg-stone-candi",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`reveal reveal-delay-${i + 1} bg-green-pale rounded-2xl p-6 border border-green-light/30 card-hover`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="font-display font-bold text-dark text-lg">
                      {item.title}
                    </h3>
                    <span className="text-xs text-stone-candi">{item.subtitle}</span>
                  </div>
                </div>
                <p className="text-stone-candi text-sm leading-relaxed mb-3">
                  {item.desc}
                </p>
                <span className={`inline-block text-xs text-white px-3 py-1 rounded-full ${item.color}`}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CARA MENGGUNAKAN ===== */}
      <section className="py-20 kawung-pattern" id="cara-pakai">
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
                title: "Temukan QR Code",
                desc: "Cari papan QR yang tertempel di samping tiap lapisan batu — ada 4 tumpukan.",
              },
              {
                step: "03",
                icon: "🔍",
                title: "Scan QR",
                desc: "Scan QR pakai kamera HP, atau tekan tombol 'Scan QR' di web ini. Halaman edukasi langsung terbuka.",
              },
              {
                step: "04",
                icon: "📖",
                title: "Baca & Pelajari",
                desc: "Pelajari sejarah dan arkeologi tiap lapisan batu. Lanjut scan QR tumpukan berikutnya!",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`reveal reveal-delay-${i + 1} relative bg-white rounded-2xl p-6 text-center card-hover border border-green-light/30`}
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

      {/* ===== 4 TUMPUKAN BATU ===== */}
      <section className="py-20 bg-white" id="tumpukan-batu">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="reveal inline-block text-green-mid font-semibold text-sm uppercase tracking-wider mb-3">
              4 Tumpukan Batu
            </span>
            <h2 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl mb-4">
              Lapisan Batu di Situs
            </h2>
            <p className="reveal text-stone-candi text-lg max-w-2xl mx-auto">
              Scan QR di tiap lapisan untuk mempelajari informasinya.
              Semua berada di <strong>lokasi yang sama</strong> — yang berbeda adalah
              tingkatan vertikal batu.
            </p>
          </div>

          {/* Vertical Stack Visualization */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-3">
              {[...arPoints].sort((a, b) => b.layer - a.layer).map((point, i) => (
                <Link
                  key={point.id}
                  href={`/edukasi/${point.edukasiId}`}
                  className={`reveal reveal-delay-${i + 1} block group`}
                >
                  <div className="flex items-center gap-4 bg-green-pale rounded-2xl p-5 border border-green-light/50 card-hover transition-all group-hover:border-green-mid">
                    {/* Layer Number */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-primary text-white flex items-center justify-center font-display font-bold text-lg shadow-md">
                      {point.layer}
                    </div>

                    {/* Icon */}
                    <span className="text-3xl flex-shrink-0">{point.icon}</span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-dark text-lg truncate">
                          {point.layerLabel}
                        </h3>
                      </div>
                      <p className="text-stone-candi text-sm leading-relaxed line-clamp-2">
                        {point.shortInfo}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 text-green-mid group-hover:translate-x-1 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* GPS Note */}
            <div className="text-center mt-4">
              <span className="text-xs text-stone-candi/60 inline-flex items-center gap-1">
                📍 Semua di koordinat GPS yang sama — perbedaan hanya vertikal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TENTANG CANDI ===== */}
      <section className="py-20 kawung-pattern" id="tentang">
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

              <div className="reveal mt-6 flex flex-wrap gap-3">
                <Link href="/timeline" className="btn-primary inline-flex items-center gap-2" id="btn-timeline-tentang">
                  📅 Lihat Sejarah Lengkap
                </Link>
                <Link href="/ar" className="btn-secondary inline-flex items-center gap-2" id="btn-navigasi-ar">
                  🧭 Navigasi AR ke Candi
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="reveal">
              <div className="bg-white rounded-3xl p-8 kawung-pattern-strong relative overflow-hidden">
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
                        className="bg-green-pale/80 rounded-xl p-3 backdrop-blur-sm"
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
            Kunjungi Candi Klodangan dan scan QR code di tiap lapisan batu
            untuk memulai pengalaman edukasi arkeologi.
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
