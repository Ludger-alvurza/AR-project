import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import TimelineItem from "@/components/timeline/TimelineItem";
import { getTimelineServer } from "@/lib/data";
import type { Metadata } from "next";
import TimelineAnimations from "./TimelineAnimations";

export const metadata: Metadata = {
  title: "Timeline Situs — Jelajah Edukasi AR Candi Klodangan",
  description:
    "Sejarah singkat Candi Klodangan: dari penemuan pada tahun 1998 hingga kondisi saat ini sebagai cagar budaya yang dilindungi.",
};

export default async function TimelinePage() {
  const timeline = await getTimelineServer();

  return (
    <main className="min-h-screen bg-green-pale">
      <Navbar />
      <TimelineAnimations />

      {/* Header */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 kawung-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="reveal inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-light rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="text-sm">📅</span>
            <span className="text-xs font-semibold text-green-primary tracking-wider uppercase">
              Kronologi Sejarah
            </span>
          </span>

          <h1 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl md:text-5xl mb-4">
            Sejarah Singkat
            <br />
            <span className="text-green-primary">Candi Klodangan</span>
          </h1>

          <p className="reveal text-stone-candi text-lg max-w-2xl mx-auto">
            Dari penemuan tak sengaja oleh petani pada tahun 1998 hingga
            statusnya sebagai cagar budaya yang dilindungi.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto relative">
          {/* Center line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-mid via-green-primary to-green-mid opacity-30" />

          {timeline.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              title={entry.title}
              year={entry.year}
              description={entry.description}
              icon={entry.icon}
              index={index}
              isLast={index === timeline.length - 1}
            />
          ))}

          {/* End marker */}
          <div className="flex justify-center md:justify-center">
            <div className="reveal bg-green-primary text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg shadow-green-primary/25">
              <span className="text-sm">🏛️</span>
              <span className="font-display font-semibold text-sm">
                Warisan Budaya Indonesia
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-green-pale rounded-3xl p-8 kawung-pattern-strong">
            <div className="text-center">
              <h3 className="reveal font-display font-bold text-dark text-2xl mb-4">
                📍 Lokasi Situs
              </h3>
              <p className="reveal text-stone-candi leading-relaxed max-w-lg mx-auto mb-6">
                Dusun Klodangan, Desa Sendangtirto, Kecamatan Berbah, Kabupaten
                Sleman, Daerah Istimewa Yogyakarta.
              </p>
              <a
                href="https://maps.google.com/?q=-7.812667,110.426289"
                target="_blank"
                rel="noopener noreferrer"
                className="reveal btn-primary inline-flex items-center gap-2"
              >
                📍 Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
