"use client";

import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ARPermissionGate from "@/components/ar/ARPermissionGate";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Dynamic import — ARScene uses browser-only APIs (camera, GPS, compass)
const ARScene = dynamic(() => import("@/components/ar/ARScene"), {
  ssr: false,
  loading: () => <LoadingScreen message="Menyiapkan kamera..." />,
});

// Koordinat tunggal lokasi Candi Klodangan
const CANDI_LOCATION = {
  lat: -7.812667,
  lng: 110.426289,
  title: "Candi Klodangan",
};

function ARPageContent() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handlePermissionsGranted = useCallback(() => {
    setPermissionsGranted(true);
  }, []);

  const handleMarkerClick = useCallback(() => {
    setShowInfo(true);
  }, []);

  const handleCloseInfo = useCallback(() => {
    setShowInfo(false);
  }, []);

  return (
    <div className="fixed inset-0 bg-dark" id="ar-page">
      {/* Permission Gate */}
      {!permissionsGranted && (
        <ARPermissionGate
          onPermissionsGranted={handlePermissionsGranted}
          pointTitle="Navigasi ke Candi"
        />
      )}

      {/* AR Scene */}
      {permissionsGranted && (
        <>
          <ARScene
            candiLocation={CANDI_LOCATION}
            onMarkerClick={handleMarkerClick}
          />

          {/* Top Bar */}
          <div className="fixed top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
            <Link
              href="/"
              className="glass-dark rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              id="btn-back-home"
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
              <span className="text-lg">🧭</span>
              <span className="text-white text-sm font-semibold">
                Navigasi AR
              </span>
            </div>
          </div>

          {/* Bottom hint */}
          {!showInfo && (
            <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
              <div className="glass-dark rounded-full px-6 py-3 flex items-center gap-2 animate-pulse-soft">
                <span className="text-sm">🧭</span>
                <span className="text-white text-sm">
                  Arahkan kamera ke lokasi Candi Klodangan
                </span>
              </div>
            </div>
          )}

          {/* Info Panel */}
          {showInfo && (
            <div
              className="fixed bottom-0 left-0 right-0 z-30 transition-transform duration-400 ease-out translate-y-0"
              id="ar-info-panel"
            >
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/20 -z-10"
                onClick={handleCloseInfo}
              />

              {/* Card */}
              <div className="bg-white rounded-t-3xl shadow-2xl p-6 pb-8 max-h-[60vh] overflow-y-auto">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-green-light rounded-full mx-auto mb-4" />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🏛️</span>
                    <div>
                      <h3 className="font-display font-bold text-dark text-xl">
                        Candi Klodangan
                      </h3>
                      <span className="text-xs text-stone-candi">
                        Navigasi GPS ke Lokasi Candi
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseInfo}
                    className="w-8 h-8 rounded-full bg-green-pale flex items-center justify-center text-stone-candi hover:bg-green-light transition-colors"
                    aria-label="Tutup"
                    id="btn-close-info"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <p className="text-stone-candi text-sm leading-relaxed mb-4">
                  Ikuti arah panah AR untuk menuju area situs Candi Klodangan.
                  Setibanya di lokasi, scan QR code yang tertempel di tiap
                  lapisan batu untuk mempelajari informasi tiap tumpukan.
                </p>

                <div className="bg-green-pale rounded-2xl p-4 mb-6">
                  <p className="text-xs font-semibold text-green-primary mb-2">
                    📋 Di lokasi candi, tersedia:
                  </p>
                  <ul className="space-y-1.5 text-xs text-stone-candi">
                    <li className="flex items-center gap-2">
                      <span>🏛️</span> QR-01: Tumpukan 1 — Fondasi Dasar
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🪨</span> QR-02: Tumpukan 2 — Batu Penyusun
                    </li>
                    <li className="flex items-center gap-2">
                      <span>⛏️</span> QR-03: Tumpukan 3 — Proses Ekskavasi
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📜</span> QR-04: Tumpukan 4 — Puncak & Status CB
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={`https://maps.google.com/?q=${CANDI_LOCATION.lat},${CANDI_LOCATION.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1 text-center text-sm"
                    id="btn-open-maps"
                  >
                    📍 Buka Google Maps
                  </a>
                  <button
                    onClick={handleCloseInfo}
                    className="btn-secondary text-sm px-4"
                    id="btn-back-ar"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ARPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Memuat halaman AR..." />}>
      <ARPageContent />
    </Suspense>
  );
}
