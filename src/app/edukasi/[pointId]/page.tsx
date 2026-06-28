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
    title: `Edukasi: ${point?.title || params.pointId} — Jelajah Edukasi AR`,
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
            <span className="text-dark font-medium">{point.title}</span>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <span className="reveal text-4xl sm:text-5xl">{point.icon}</span>
            <div>
              <span className="reveal inline-block bg-green-light text-green-primary text-xs font-bold px-3 py-1 rounded-full mb-2">
                Edukasi Arkeologi
              </span>
              <h1 className="reveal font-display font-bold text-dark text-3xl sm:text-4xl">
                {edukasi.title}
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

      {/* Other Points */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="reveal font-display font-bold text-dark text-xl mb-6">
            Jelajahi Titik Lainnya
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {allPoints
              .filter((p) => p.id !== params.pointId)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/edukasi/${p.id}`}
                  className="reveal bg-white rounded-2xl p-5 border border-green-light/50 card-hover flex items-center gap-3"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h4 className="font-display font-semibold text-dark text-sm">
                      {p.title}
                    </h4>
                    <span className="text-xs text-stone-candi">
                      Lihat edukasi →
                    </span>
                  </div>
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
                Ingin melihat langsung di AR?
              </h3>
              <p className="text-green-light text-sm mb-6 max-w-md mx-auto">
                Kunjungi Candi Klodangan dan scan QR code di titik{" "}
                <strong className="text-white">{point.title}</strong> untuk
                pengalaman AR.
              </p>
              <Link
                href={`/ar?point=${point.id}`}
                className="bg-white text-green-primary font-body font-semibold px-8 py-3 rounded-xl transition-all hover:bg-green-light hover:shadow-lg active:scale-95 inline-block"
              >
                📸 Buka AR View
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
