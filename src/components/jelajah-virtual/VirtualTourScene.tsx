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
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-dark">
          <div className="text-center">
            <div className="spinner w-12 h-12 mx-auto mb-4 border-green-mid border-t-white" />
            <p className="font-display text-white text-lg">
              Memuat foto situs...
            </p>
          </div>
        </div>
      )}

      {/* Blurred background fill — fills empty space around the image */}
      <Image
        src="/images/jelajah-virtual-image/candi-klodangan.jpeg"
        alt=""
        fill
        className="object-cover blur-2xl opacity-20 scale-125"
        quality={5}
        aria-hidden="true"
      />

      {/* Centered image container — uses min() to fit the square image
          without cropping on any screen orientation */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          style={{
            width: "min(calc(100vw - 1.5rem), calc(100vh - 12rem), 920px)",
            height: "min(calc(100vw - 1.5rem), calc(100vh - 12rem), 920px)",
          }}
        >
          {/* Main image — fits exactly in the square container */}
          <Image
            src="/images/jelajah-virtual-image/candi-klodangan.jpeg"
            alt="Foto situs Candi Klodangan tampak atas — fondasi candi berukuran 7,5 x 7,5 meter"
            fill
            className="object-cover"
            priority
            quality={90}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, 920px"
          />

          {/* Vignette overlay for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)",
            }}
          />

          {/* Subtle border glow */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/10" />

          {/* Hotspot points — positioned relative to the image container */}
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
                    className={`absolute rounded-full hotspot-pulse ${
                      isActive ? "bg-green-mid/40" : "bg-white/30"
                    }`}
                    style={{
                      width: "48px",
                      height: "48px",
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
                      width: "44px",
                      height: "44px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />

                  {/* Icon circle */}
                  <div
                    className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-2 ${
                      isActive
                        ? "bg-green-primary border-green-mid scale-110 shadow-green-mid/40"
                        : "bg-dark/80 border-white/40 hover:bg-green-primary hover:border-green-mid hover:scale-110 hover:shadow-green-mid/40"
                    }`}
                    style={{
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span className="text-base sm:text-lg drop-shadow-md">
                      {point.icon}
                    </span>
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
                    <div className="bg-dark/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-green-mid/30 shadow-xl">
                      {point.title}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark/90 rotate-45 border-l border-t border-green-mid/30" />
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
