"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { ARPoint } from "@/lib/data";
import ARPermissionGate from "@/components/ar/ARPermissionGate";
import ARInfoPoint from "@/components/ar/ARInfoPoint";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Dynamic import — ARScene uses browser-only APIs (camera, GPS, compass)
const ARScene = dynamic(() => import("@/components/ar/ARScene"), {
  ssr: false,
  loading: () => <LoadingScreen message="Menyiapkan kamera..." />,
});

function ARPageContent() {
  const searchParams = useSearchParams();
  const pointId = searchParams.get("point") || "fondasi-candi";

  const [points, setPoints] = useState<ARPoint[]>([]);
  const [activePoint, setActivePoint] = useState<ARPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ARPoint | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load AR points data
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    fetch("/data/ar-points.json", { signal: controller.signal })
      .then((res) => res.json())
      .then((data: ARPoint[]) => {
        setPoints(data);
        const found = data.find((p) => p.id === pointId);
        setActivePoint(found || data[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load AR points:", err);
        }
        setIsLoading(false);
      })
      .finally(() => clearTimeout(timeoutId));
  }, [pointId]);

  const handlePermissionsGranted = useCallback(() => {
    setPermissionsGranted(true);
  }, []);

  const handlePointClick = useCallback((point: ARPoint) => {
    setSelectedPoint(point);
  }, []);

  const handleCloseInfo = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Memuat data titik AR..." />;
  }

  if (!activePoint) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-green-pale p-6">
        <div className="text-center">
          <span className="text-5xl block mb-4">🔍</span>
          <h2 className="font-display font-bold text-dark text-2xl mb-2">
            Titik Tidak Ditemukan
          </h2>
          <p className="text-stone-candi mb-6">
            Parameter <code className="bg-green-light px-2 py-1 rounded text-green-primary text-sm">?point={pointId}</code> tidak valid.
          </p>
          <Link href="/" className="btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-dark" id="ar-page">
      {/* Permission Gate */}
      {!permissionsGranted && (
        <ARPermissionGate
          onPermissionsGranted={handlePermissionsGranted}
          pointTitle={activePoint.title}
        />
      )}

      {/* AR Scene */}
      {permissionsGranted && (
        <>
          <ARScene
            points={points}
            activePointId={activePoint.id}
            onPointClick={handlePointClick}
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
              <span className="text-lg">{activePoint.icon}</span>
              <span className="text-white text-sm font-semibold">
                {activePoint.title}
              </span>
            </div>
          </div>

          {/* Bottom hint */}
          {!selectedPoint && (
            <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
              <div className="glass-dark rounded-full px-6 py-3 flex items-center gap-2 animate-pulse-soft">
                <span className="text-sm">👆</span>
                <span className="text-white text-sm">
                  Arahkan kamera ke titik informasi
                </span>
              </div>
            </div>
          )}

          {/* Point selector */}
          <div className="fixed bottom-24 left-0 right-0 z-20 px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {points.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePointClick(p)}
                  className={`flex-shrink-0 glass-dark rounded-full px-4 py-2 flex items-center gap-2 transition-all ${
                    p.id === activePoint.id
                      ? "ring-2 ring-green-mid"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className="text-sm">{p.icon}</span>
                  <span className="text-white text-xs font-medium whitespace-nowrap">
                    {p.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          {selectedPoint && (
            <ARInfoPoint
              point={selectedPoint}
              isVisible={!!selectedPoint}
              onClose={handleCloseInfo}
            />
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
