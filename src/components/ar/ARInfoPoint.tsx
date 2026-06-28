"use client";

import Link from "next/link";
import type { ARPoint } from "@/lib/data";

interface ARInfoPointProps {
  point: ARPoint;
  isVisible: boolean;
  onClose: () => void;
}

export default function ARInfoPoint({
  point,
  isVisible,
  onClose,
}: ARInfoPointProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-400 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      id="ar-info-panel"
    >
      {/* Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={onClose}
        />
      )}

      {/* Card */}
      <div className="bg-white rounded-t-3xl shadow-2xl p-6 pb-8 max-h-[60vh] overflow-y-auto">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-green-light rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{point.icon}</span>
            <div>
              <h3 className="font-display font-bold text-dark text-xl">
                {point.title}
              </h3>
              <span className="text-xs text-stone-candi">
                Titik Informasi AR
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-green-pale flex items-center justify-center text-stone-candi hover:bg-green-light transition-colors"
            aria-label="Tutup"
            id="btn-close-info"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <p className="text-stone-candi text-sm leading-relaxed mb-6">
          {point.shortInfo}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/edukasi/${point.edukasiId}`}
            className="btn-primary flex-1 text-center text-sm"
            id="btn-learn-more"
          >
            Pelajari Lebih Lanjut
          </Link>
          <button
            onClick={onClose}
            className="btn-secondary text-sm px-4"
            id="btn-back-ar"
          >
            Kembali ke AR
          </button>
        </div>

        {/* GPS info */}
        <div className="mt-4 pt-4 border-t border-green-light flex items-center gap-2">
          <span className="text-xs">📍</span>
          <span className="text-xs text-stone-candi/60">
            {point.gps.lat.toFixed(6)}, {point.gps.lng.toFixed(6)}
          </span>
        </div>
      </div>
    </div>
  );
}
