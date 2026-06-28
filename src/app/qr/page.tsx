"use client";

import { QRCodeSVG } from "qrcode.react";

const BASE_URL = "https://arcandiklodangan.vercel.app";

const qrPoints = [
  {
    id: "fondasi-candi",
    title: "Fondasi Candi",
    icon: "🏛️",
    url: `${BASE_URL}/ar?point=fondasi-candi`,
  },
  {
    id: "batu-penyusun",
    title: "Batu Penyusun",
    icon: "🪨",
    url: `${BASE_URL}/ar?point=batu-penyusun`,
  },
  {
    id: "area-ekskavasi",
    title: "Area Ekskavasi",
    icon: "⛏️",
    url: `${BASE_URL}/ar?point=area-ekskavasi`,
  },
  {
    id: "status-cagar-budaya",
    title: "Status Cagar Budaya",
    icon: "📜",
    url: `${BASE_URL}/ar?point=status-cagar-budaya`,
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
            QR Code Generator
          </h1>
          <p className="text-stone-candi text-lg mb-6">
            QR codes untuk dicetak dan ditempel di tiap titik informasi di
            lokasi Candi Klodangan.
          </p>
          <button
            onClick={handlePrint}
            className="btn-primary print:hidden"
            id="btn-print-qr"
          >
            🖨️ Cetak Semua QR
          </button>
        </div>

        {/* QR Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {qrPoints.map((point) => (
            <div
              key={point.id}
              className="bg-white rounded-3xl p-8 shadow-sm border border-green-light/50 text-center print:break-inside-avoid print:shadow-none"
            >
              {/* Icon & Title */}
              <span className="text-3xl block mb-2">{point.icon}</span>
              <h3 className="font-display font-bold text-dark text-xl mb-1">
                {point.title}
              </h3>
              <p className="text-stone-candi text-xs mb-6">
                Scan untuk membuka AR view
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
            📋 Panduan Cetak QR
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
                Pasang QR di <strong>ketinggian dada</strong> (~120-150 cm dari
                tanah) agar mudah dijangkau pengunjung.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green-light text-green-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <span>
                Pastikan ada label &quot;Scan QR untuk AR&quot; di sekitar QR
                agar pengunjung tahu fungsinya.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
