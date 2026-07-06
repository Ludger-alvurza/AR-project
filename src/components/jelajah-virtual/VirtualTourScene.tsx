"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface VirtualTourPoint {
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
  shortInfo: string;
  detailInfo: string;
  edukasiId: string;
}

interface VirtualTourSceneProps {
  points: VirtualTourPoint[];
  onPointClick: (point: VirtualTourPoint) => void;
  activePointId: string | null;
}

export default function VirtualTourScene({
  points,
  onPointClick,
  activePointId,
}: VirtualTourSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-dark select-none"
      id="virtual-tour-scene"
    >
      {/* Loading state */}
      {!imageLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-dark">
          <div className="text-center">
            <div className="spinner w-12 h-12 mx-auto mb-4 border-green-mid border-t-white" />
            <p className="font-display text-white text-lg">
              Memuat foto situs...
            </p>
          </div>
        </div>
      )}

      {/* Main image */}
      <div className="relative w-full h-full">
        <Image
          src="/images/jelajah-virtual-image/candi-klodangan.jpeg"
          alt="Foto situs Candi Klodangan tampak atas — fondasi candi berukuran 7,5 x 7,5 meter"
          fill
          className="object-cover"
          priority
          quality={90}
          onLoad={handleImageLoad}
          sizes="100vw"
        />

        {/* Vignette overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        {/* Hotspot points */}
        {imageLoaded &&
          points.map((point) => {
            const isActive = point.id === activePointId;
            const isHovered = point.id === hoveredId;

            return (
              <button
                key={point.id}
                className="absolute z-10 group"
                style={{
                  left: `${point.position.x}%`,
                  top: `${point.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => onPointClick(point)}
                onMouseEnter={() => setHoveredId(point.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={`Lihat info: ${point.title}`}
                id={`hotspot-${point.id}`}
              >
                {/* Pulse ring */}
                <div
                  className={`absolute inset-0 rounded-full hotspot-pulse ${
                    isActive ? "bg-green-mid/40" : "bg-white/30"
                  }`}
                  style={{
                    width: "56px",
                    height: "56px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* Outer glow ring */}
                <div
                  className={`absolute rounded-full transition-all duration-300 ${
                    isActive || isHovered
                      ? "bg-green-mid/30 scale-125"
                      : "bg-white/15 scale-100"
                  }`}
                  style={{
                    width: "52px",
                    height: "52px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* Icon circle */}
                <div
                  className={`relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-2 ${
                    isActive
                      ? "bg-green-primary border-green-mid scale-110 shadow-green-mid/40"
                      : "bg-dark/80 border-white/40 hover:bg-green-primary hover:border-green-mid hover:scale-110 hover:shadow-green-mid/40"
                  }`}
                  style={{
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-lg drop-shadow-md">{point.icon}</span>
                </div>

                {/* Label tooltip */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
                    isActive || isHovered
                      ? "opacity-100 translate-y-1"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  }`}
                  style={{ top: "calc(100% + 4px)" }}
                >
                  <div className="bg-dark/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-mid/30 shadow-xl">
                    {point.title}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark/90 rotate-45 border-l border-t border-green-mid/30" />
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
