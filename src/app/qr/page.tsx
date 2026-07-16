"use client";

import { QRCodeSVG } from "qrcode.react";

const BASE_URL = "https://arcandiklodangan.vercel.app";

const qrPoints = [
  {
    id: "tumpukan-1-fondasi",
    title: "Fondasi Dasar",
    layer: 1,
    layerLabel: "Tumpukan 1 — Fondasi Dasar",
    icon: "🏛️",
    url: `${BASE_URL}/edukasi/tumpukan-1-fondasi`,
  },
  {
    id: "tumpukan-2-batu",
    title: "Batu Penyusun",
    layer: 2,
    layerLabel: "Tumpukan 2 — Batu Penyusun",
    icon: "🪨",
    url: `${BASE_URL}/edukasi/tumpukan-2-batu`,
  },
  {
    id: "tumpukan-3-ekskavasi",
    title: "Proses Ekskavasi",
    layer: 3,
    layerLabel: "Tumpukan 3 — Proses Ekskavasi",
    icon: "⛏️",
    url: `${BASE_URL}/edukasi/tumpukan-3-ekskavasi`,
  },
  {
    id: "tumpukan-4-status",
    title: "Puncak & Status Cagar Budaya",
    layer: 4,
    layerLabel: "Tumpukan 4 — Puncak & Status Cagar Budaya",
    icon: "📜",
    url: `${BASE_URL}/edukasi/tumpukan-4-status`,
  },
];

export default function QRPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-green-pale p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <h1 className="font-display font-bold text-dark text-3xl sm:text-4xl mb-4">
            QR Code — Tumpukan Batu
          </h1>
          <p className="text-stone-candi text-lg mb-6">
            QR codes untuk dicetak dan ditempel di papan kecil di samping tiap
            lapisan batu di lokasi Candi Klodangan.
          </p>
          <button
            onClick={handlePrint}
            className="btn-primary print:hidden"
            id="btn-print-qr"
          >
            🖨️ Cetak Semua QR
          </button>
        </div>

        {/* Stack Diagram */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 mb-8 border border-green-light/50 print:hidden">
          <h3 className="font-display font-bold text-dark text-lg mb-4 text-center">
            📐 Diagram Pemasangan QR
          </h3>
          <p className="text-stone-candi text-sm text-center mb-6">
            Semua QR ditempel di lokasi GPS yang <strong>sama</strong> — yang
            berbeda adalah <strong>tingkatan vertikal</strong> batu.
          </p>
          <div className="max-w-xs mx-auto space-y-2">
            {[...qrPoints].reverse().map((point) => (
              <div
                key={point.id}
                className="flex items-center gap-3 bg-green-pale rounded-xl px-4 py-3 border border-green-light/50"
              >
                <span className="w-8 h-8 rounded-full bg-green-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {point.layer}
                </span>
                <span className="text-lg">{point.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-dark block truncate">
                    {point.title}
                  </span>
                  <span className="text-xs text-stone-candi">
                    QR-0{point.layer}
                  </span>
                </div>
                {point.layer === 4 && (
                  <span className="text-xs bg-green-light text-green-primary px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                    Puncak
                  </span>
                )}
                {point.layer === 1 && (
                  <span className="text-xs bg-green-light text-green-primary px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                    Fondasi
                  </span>
                )}
              </div>
            ))}
            <div className="text-center pt-2">
              <span className="text-xs text-stone-candi/60">
                ← Semua di koordinat GPS yang sama →
              </span>
            </div>
          </div>
        </div>

        {/* QR Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {qrPoints.map((point) => (
            <div
              key={point.id}
              className="bg-white rounded-3xl p-8 shadow-sm border border-green-light/50 text-center print:break-inside-avoid print:shadow-none"
            >
              {/* Layer Badge */}
              <div className="inline-flex items-center gap-1.5 bg-green-pale rounded-full px-3 py-1 mb-3">
                <span className="w-5 h-5 rounded-full bg-green-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {point.layer}
                </span>
                <span className="text-xs font-semibold text-green-primary">
                  QR-0{point.layer}
                </span>
              </div>

              {/* Icon & Title */}
              <span className="text-3xl block mb-2">{point.icon}</span>
              <h3 className="font-display font-bold text-dark text-xl mb-1">
                {point.layerLabel}
              </h3>
              <p className="text-stone-candi text-xs mb-6">
                Scan untuk membuka info tumpukan ini
              </p>

              {/* QR Code */}
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-green-light shadow-inner">
                <QRCodeSVG
                  value={point.url}
                  size={200}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#1B2E27"
                  includeMargin={false}
                />
              </div>

              {/* URL */}
              <p className="mt-4 text-xs text-stone-candi/60 break-all font-mono">
                {point.url}
              </p>

              {/* Label for print */}
              <div className="mt-4 bg-green-pale rounded-xl px-4 py-2">
                <p className="text-xs font-semibold text-green-primary">
                  Jelajah Edukasi AR Candi Klodangan
                </p>
                <p className="text-xs text-stone-candi">
                  Arahkan kamera HP ke QR ini
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-green-light/50 print:hidden">
          <h3 className="font-display font-bold text-dark text-xl mb-4">
            📋 Panduan Cetak & Pasang QR
          </h3>
          <ul className="space-y-3 text-stone-candi text-sm">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green-light text-green-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <span>
                Cetak QR dalam ukuran minimal <strong>8×8 cm</strong> agar
                mudah discan dari jarak 30-50 cm.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green-light text-green-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <span>
                Laminasi QR atau gunakan material{" "}
                <strong>tahan cuaca</strong> karena akan dipasang di luar
                ruangan.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green-light text-green-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <span>
                Pasang tiap QR di <strong>papan kecil di samping lapisan batu</strong>{" "}
                yang sesuai — QR-01 di fondasi paling bawah, QR-04 di puncak.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green-light text-green-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <span>
                Pastikan ada label nomor tumpukan di papan QR (misal:{" "}
                <strong>&quot;Tumpukan 1 — Fondasi&quot;</strong>) agar
                pengunjung tahu fungsinya.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green-light text-green-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                5
              </span>
              <span>
                Scan QR akan langsung membuka{" "}
                <strong>halaman edukasi</strong> per tumpukan — tidak perlu GPS
                atau akses kamera.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
