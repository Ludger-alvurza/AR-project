"use client";

import Link from "next/link";

interface VirtualTourPoint {
  id: string;
  title: string;
  icon: string;
  shortInfo: string;
  detailInfo: string;
  edukasiId: string;
}

interface VirtualTourInfoPanelProps {
  point: VirtualTourPoint;
  isVisible: boolean;
  onClose: () => void;
}

export default function VirtualTourInfoPanel({
  point,
  isVisible,
  onClose,
}: VirtualTourInfoPanelProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-400 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      id="virtual-tour-info-panel"
    >
      {/* Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/30 -z-10 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Card */}
      <div className="bg-white rounded-t-3xl shadow-2xl max-h-[65vh] overflow-hidden flex flex-col">
        {/* Handle bar */}
        <div className="flex-shrink-0 pt-4 pb-2 px-6">
          <div className="w-12 h-1.5 bg-green-light rounded-full mx-auto" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-green-pale flex items-center justify-center shadow-sm">
                <span className="text-3xl">{point.icon}</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-dark text-xl leading-tight">
                  {point.title}
                </h3>
                <span className="text-xs text-green-mid font-semibold uppercase tracking-wider">
                  Titik Informasi Virtual
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-green-pale flex items-center justify-center text-stone-candi hover:bg-green-light transition-colors flex-shrink-0 mt-1"
              aria-label="Tutup"
              id="btn-close-virtual-info"
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-green-light to-transparent mb-5" />

          {/* Short Info */}
          <div className="bg-green-pale rounded-2xl p-4 mb-4">
            <p className="text-dark text-sm leading-relaxed font-medium">
              {point.shortInfo}
            </p>
          </div>

          {/* Detail Info */}
          <div className="mb-6">
            <h4 className="font-display font-semibold text-dark text-sm mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-mid/20 flex items-center justify-center text-[10px]">
                📖
              </span>
              Detail Informasi
            </h4>
            <p className="text-stone-candi text-sm leading-relaxed">
              {point.detailInfo}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/edukasi/${point.edukasiId}`}
              className="btn-primary flex-1 text-center text-sm"
              id="btn-learn-more-virtual"
            >
              📚 Pelajari Lebih Lanjut
            </Link>
            <button
              onClick={onClose}
              className="btn-secondary text-sm px-4"
              id="btn-back-virtual"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
