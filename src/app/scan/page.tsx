"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Dynamic import — QRScanner uses camera APIs
const QRScanner = dynamic(() => import("@/components/ar/QRScanner"), {
  ssr: false,
  loading: () => <LoadingScreen message="Memuat scanner..." />,
});

// Valid edukasi paths that QR codes can point to
const VALID_PATHS = [
  "/edukasi/tumpukan-1-fondasi",
  "/edukasi/tumpukan-2-batu",
  "/edukasi/tumpukan-3-ekskavasi",
  "/edukasi/tumpukan-4-status",
];

const BASE_URL = "https://arcandiklodangan.vercel.app";

function parseQRResult(text: string): string | null {
  // Handle full URLs
  if (text.startsWith(BASE_URL)) {
    const path = text.replace(BASE_URL, "");
    if (VALID_PATHS.includes(path)) return path;
  }

  // Handle relative paths
  if (VALID_PATHS.includes(text)) return text;

  // Handle any URL that contains our edukasi paths
  for (const path of VALID_PATHS) {
    if (text.includes(path)) return path;
  }

  return null;
}

export default function ScanPage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<{
    type: "success" | "invalid";
    text: string;
    path?: string;
  } | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      const path = parseQRResult(decodedText);

      if (path) {
        setScanResult({ type: "success", text: decodedText, path });
        // Auto-redirect after brief delay to show success state
        setTimeout(() => {
          router.push(path);
        }, 1200);
      } else {
        setScanResult({ type: "invalid", text: decodedText });
      }
    },
    [router]
  );

  const handleRetry = useCallback(() => {
    setScanResult(null);
    setShowScanner(false);
    // Re-mount scanner
    setTimeout(() => setShowScanner(true), 100);
  }, []);

  // Layer info for the instruction panel
  const layers = [
    { num: 1, icon: "🏛️", label: "Fondasi Dasar" },
    { num: 2, icon: "🪨", label: "Batu Penyusun" },
    { num: 3, icon: "⛏️", label: "Area Ekskavasi" },
    { num: 4, icon: "📜", label: "Status Cagar Budaya" },
  ];

  return (
    <div className="fixed inset-0 bg-dark" id="scan-page">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <Link
          href="/"
          className="glass-dark rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm font-medium hover:bg-white/20 transition-colors"
          id="btn-back-home-scan"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali
        </Link>

        <div className="glass-dark rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-lg">📱</span>
          <span className="text-white text-sm font-semibold">Scan QR</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-8">
        {/* Before scanning — show intro */}
        {!showScanner && !scanResult && (
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 rounded-full bg-green-primary/20 mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">📱</span>
            </div>

            <h1 className="font-display font-bold text-white text-2xl sm:text-3xl mb-3">
              Scan QR Tumpukan Batu
            </h1>
            <p className="text-white/60 text-sm mb-8 max-w-sm mx-auto">
              Arahkan kamera ke QR code yang tertempel di papan kecil di samping
              tiap lapisan batu di lokasi candi.
            </p>

            <button
              onClick={() => setShowScanner(true)}
              className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
              id="btn-start-scan"
            >
              📸 Buka Kamera & Scan
            </button>

            {/* Available QR codes */}
            <div className="mt-10 text-left">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 text-center">
                QR yang tersedia di lokasi
              </p>
              <div className="space-y-2">
                {layers.map((l) => (
                  <div
                    key={l.num}
                    className="glass-dark rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-lg bg-green-primary text-white text-xs font-bold flex items-center justify-center">
                      {l.num}
                    </span>
                    <span className="text-lg">{l.icon}</span>
                    <span className="text-white text-sm">
                      Tumpukan {l.num} — {l.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scanner active */}
        {showScanner && !scanResult && (
          <div className="w-full max-w-lg">
            <QRScanner onScanSuccess={handleScanSuccess} />

            {/* Scanning frame overlay hint */}
            <p className="text-white/40 text-xs text-center mt-4">
              Posisikan QR code di dalam kotak pemindai
            </p>
          </div>
        )}

        {/* Scan result — success */}
        {scanResult?.type === "success" && (
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 rounded-full bg-green-mid/20 mx-auto mb-6 flex items-center justify-center animate-pulse-soft">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="font-display font-bold text-white text-2xl mb-2">
              QR Terdeteksi!
            </h2>
            <p className="text-green-mid text-sm mb-4">
              Membuka halaman edukasi...
            </p>
            <div className="glass-dark rounded-xl px-4 py-3 inline-block">
              <span className="text-white/60 text-xs font-mono break-all">
                {scanResult.path}
              </span>
            </div>
          </div>
        )}

        {/* Scan result — invalid QR */}
        {scanResult?.type === "invalid" && (
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 rounded-full bg-red-500/20 mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">❌</span>
            </div>
            <h2 className="font-display font-bold text-white text-2xl mb-2">
              QR Tidak Dikenali
            </h2>
            <p className="text-white/60 text-sm mb-2">
              QR code ini bukan milik Candi Klodangan.
            </p>
            <div className="glass-dark rounded-xl px-4 py-3 mb-6 inline-block">
              <span className="text-white/40 text-xs font-mono break-all">
                {scanResult.text.length > 100
                  ? scanResult.text.slice(0, 100) + "..."
                  : scanResult.text}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                className="btn-primary text-lg px-8 py-4"
                id="btn-retry-scan"
              >
                🔄 Scan Ulang
              </button>
              <Link
                href="/"
                className="text-white/60 text-sm hover:text-white transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
