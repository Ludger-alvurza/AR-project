"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import VirtualTourScene from "@/components/jelajah-virtual/VirtualTourScene";
import VirtualTourInfoPanel from "@/components/jelajah-virtual/VirtualTourInfoPanel";
import LoadingScreen from "@/components/ui/LoadingScreen";

interface VirtualTourPoint {
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
  shortInfo: string;
  detailInfo: string;
  edukasiId: string;
}

export default function JelajahVirtualPage() {
  const [points, setPoints] = useState<VirtualTourPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<VirtualTourPoint | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(true);

  // Load virtual tour points
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch("/data/virtual-tour-points.json", { signal: controller.signal })
      .then((res) => res.json())
      .then((data: VirtualTourPoint[]) => {
        setPoints(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load virtual tour points:", err);
        }
        setIsLoading(false);
      })
      .finally(() => clearTimeout(timeoutId));
  }, []);

  // Auto-hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handlePointClick = useCallback((point: VirtualTourPoint) => {
    setSelectedPoint(point);
    setShowHint(false);
  }, []);

  const handleCloseInfo = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Memuat Jelajah Virtual..." />;
  }

  return (
    <div className="fixed inset-0 bg-dark" id="jelajah-virtual-page">
      {/* Virtual Tour Scene */}
      <VirtualTourScene
        points={points}
        onPointClick={handlePointClick}
        activePointId={selectedPoint?.id || null}
      />

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <Link
          href="/"
          className="glass-dark rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm font-medium hover:bg-white/20 transition-colors"
          id="btn-back-home-virtual"
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
          <span className="text-lg">🗺️</span>
          <span className="text-white text-sm font-semibold">
            Jelajah Virtual
          </span>
        </div>
      </div>

      {/* Bottom hint */}
      {!selectedPoint && showHint && (
        <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="glass-dark rounded-full px-6 py-3 flex items-center gap-2 animate-pulse-soft">
            <span className="text-sm">👆</span>
            <span className="text-white text-sm">
              Ketuk titik-titik pada foto untuk melihat informasi
            </span>
          </div>
        </div>
      )}

      {/* Point selector (bottom bar) */}
      {!selectedPoint && (
        <div className="fixed bottom-8 left-0 right-0 z-20">
          <div className="flex gap-2 overflow-x-auto pb-2 px-4 justify-start sm:justify-center scrollbar-hide">
            {points.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePointClick(p)}
                className="flex-shrink-0 glass-dark rounded-full px-4 py-2 flex items-center gap-2 transition-all opacity-70 hover:opacity-100"
                id={`selector-${p.id}`}
              >
                <span className="text-sm">{p.icon}</span>
                <span className="text-white text-xs font-medium whitespace-nowrap">
                  {p.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Panel */}
      {selectedPoint && (
        <VirtualTourInfoPanel
          point={selectedPoint}
          isVisible={!!selectedPoint}
          onClose={handleCloseInfo}
        />
      )}
    </div>
  );
}
