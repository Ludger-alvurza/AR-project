import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import EdukasiAccordion from "@/components/edukasi/EdukasiAccordion";
import {
  getEdukasiByPointIdServer,
  getARPointByIdServer,
  getARPointsServer,
} from "@/lib/data";
import type { Metadata } from "next";
import EdukasiAnimations from "./EdukasiAnimations";

interface PageProps {
  params: { pointId: string };
}

export async function generateStaticParams() {
  const points = await getARPointsServer();
  return points.map((p) => ({ pointId: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const edukasi = await getEdukasiByPointIdServer(params.pointId);
  const point = await getARPointByIdServer(params.pointId);

  return {
    title: `${point?.layerLabel || point?.title || params.pointId} — Jelajah Edukasi AR`,
    description:
      edukasi?.questions[0]?.answer?.slice(0, 160) ||
      "Edukasi arkeologi Candi Klodangan",
  };
}

export default async function EdukasiPage({ params }: PageProps) {
  const edukasi = await getEdukasiByPointIdServer(params.pointId);
  const point = await getARPointByIdServer(params.pointId);
  const allPoints = await getARPointsServer();

  if (!edukasi || !point) {
    return (
      <main className="min-h-screen bg-green-pale">
        <Navbar />
        <div className="pt-32 pb-20 text-center px-4">
          <span className="text-5xl block mb-4">🔍</span>
          <h1 className="font-display font-bold text-dark text-3xl mb-4">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-stone-candi mb-8">
            Titik edukasi &quot;{params.pointId}&quot; tidak tersedia.
          </p>
          <Link href="/" className="btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Sort all points by layer for prev/next navigation
  const sortedPoints = [...allPoints].sort((a, b) => a.layer - b.layer);
  const currentIndex = sortedPoints.findIndex((p) => p.id === point.id);
  const prevPoint = currentIndex > 0 ? sortedPoints[currentIndex - 1] : null;
  const nextPoint =
    currentIndex < sortedPoints.length - 1
      ? sortedPoints[currentIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-green-pale">
      <Navbar />
      <EdukasiAnimations />

      {/* Header */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 kawung-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="reveal flex items-center gap-2 text-sm text-stone-candi mb-6">
            <Link
              href="/"
              className="hover:text-green-primary transition-colors"
            >
              Beranda
            </Link>
            <span>›</span>
            <span className="text-green-primary font-medium">Edukasi</span>
            <span>›</span>
            <span className="text-dark font-medium">{point.layerLabel}</span>
          </div>

          {/* Layer Badge */}
          <div className="reveal mb-4">
            <div className="inline-flex items-center gap-2 bg-green-primary text-white rounded-full px-4 py-2 shadow-md">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-sm">
                {point.layer}
              </span>
              <span className="text-sm font-semibold">
                Tumpukan {point.layer} dari {allPoints.length}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <span className="reveal text-4xl sm:text-5xl">{point.icon}</span>
            <div>
              <span className="reveal inline-block bg-green-light text-green-primary text-xs font-bold px-3 py-1 rounded-full mb-2">
                Edukasi Arkeologi
              </span>
              <h1 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl">
                {point.layerLabel}
              </h1>
            </div>
          </div>

          <p className="reveal text-stone-candi text-lg max-w-2xl">
            {point.shortInfo}
          </p>
        </div>
      </section>

      {/* Questions Accordion */}
      <section className="pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {edukasi.questions.map((q, index) => (
              <EdukasiAccordion
                key={index}
                question={q.question}
                answer={q.answer}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Prev/Next Layer Navigation */}
      <section className="pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="reveal font-display font-bold text-dark text-xl mb-6">
            Jelajahi Tumpukan Lainnya
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Previous Layer */}
            {prevPoint ? (
              <Link
                href={`/edukasi/${prevPoint.id}`}
                className="reveal bg-white rounded-2xl p-5 border border-green-light/50 card-hover flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-primary group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-stone-candi">
                    ← Tumpukan sebelumnya
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{prevPoint.icon}</span>
                    <h4 className="font-display font-semibold text-dark text-sm truncate">
                      {prevPoint.layerLabel}
                    </h4>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-green-pale/50 rounded-2xl p-5 border border-green-light/30 flex items-center gap-3 opacity-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center">
                  <span className="text-xs text-stone-candi">—</span>
                </div>
                <span className="text-sm text-stone-candi">
                  Ini tumpukan paling bawah
                </span>
              </div>
            )}

            {/* Next Layer */}
            {nextPoint ? (
              <Link
                href={`/edukasi/${nextPoint.id}`}
                className="reveal bg-white rounded-2xl p-5 border border-green-light/50 card-hover flex items-center gap-3 group"
              >
                <div className="flex-1 min-w-0 text-right">
                  <span className="text-xs text-stone-candi">
                    Tumpukan berikutnya →
                  </span>
                  <div className="flex items-center gap-2 justify-end">
                    <h4 className="font-display font-semibold text-dark text-sm truncate">
                      {nextPoint.layerLabel}
                    </h4>
                    <span className="text-lg">{nextPoint.icon}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-primary group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ) : (
              <div className="bg-green-pale/50 rounded-2xl p-5 border border-green-light/30 flex items-center gap-3 opacity-50 justify-end text-right">
                <span className="text-sm text-stone-candi">
                  Ini tumpukan paling atas
                </span>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center">
                  <span className="text-xs text-stone-candi">—</span>
                </div>
              </div>
            )}
          </div>

          {/* All layers quick nav */}
          <div className="mt-6 flex gap-2 justify-center">
            {sortedPoints.map((p) => (
              <Link
                key={p.id}
                href={`/edukasi/${p.id}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  p.id === point.id
                    ? "bg-green-primary text-white shadow-md scale-110"
                    : "bg-white text-green-primary border border-green-light/50 hover:bg-green-pale"
                }`}
                title={p.layerLabel}
              >
                {p.layer}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-primary rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 kawung-pattern opacity-10" />
            <div className="relative z-10">
              <h3 className="font-display font-bold text-white text-2xl mb-3">
                Ingin melihat lebih banyak?
              </h3>
              <p className="text-green-light text-sm mb-6 max-w-md mx-auto">
                Jelajahi situs secara virtual dari mana saja, atau lihat timeline
                sejarah lengkap Candi Klodangan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/jelajah-virtual"
                  className="bg-white text-green-primary font-body font-semibold px-8 py-3 rounded-xl transition-all hover:bg-green-light hover:shadow-lg active:scale-95 inline-block"
                >
                  🗺️ Jelajah Virtual
                </Link>
                <Link
                  href="/timeline"
                  className="border-2 border-white text-white font-body font-semibold px-8 py-3 rounded-xl transition-all hover:bg-white/10 active:scale-95 inline-block"
                >
                  📅 Lihat Timeline
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
