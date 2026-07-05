"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ARPoint } from "@/lib/data";

interface ARSceneProps {
  points: ARPoint[];
  activePointId: string;
  onPointClick: (point: ARPoint) => void;
}

interface UserPosition {
  lat: number;
  lng: number;
}

export default function ARScene({
  points,
  activePointId,
  onPointClick,
}: ARSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Inisialisasi...");
  const [userPos, setUserPos] = useState<UserPosition | null>(null);
  const [heading, setHeading] = useState(0);

  // ── KAMERA ──────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        // Cek API tersedia
        if (!navigator?.mediaDevices?.getUserMedia) {
          throw new Error("getUserMedia tidak tersedia. Pastikan HTTPS.");
        }

        // Delay 800ms — beri waktu release kalau sebelumnya ada stream
        await new Promise((r) => setTimeout(r, 800));
        setStatus("Membuka kamera...");

        // Coba kamera belakang dulu, fallback ke video:true
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } },
          });
        } catch {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: "environment" },
            });
          } catch {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          }
        }

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        // Polling tunggu videoRef siap (fix race condition dynamic import)
        setStatus("Menunggu elemen video...");
        let tries = 0;
        while (!videoRef.current && tries < 30) {
          await new Promise((r) => setTimeout(r, 100));
          tries++;
        }
        if (!videoRef.current) throw new Error("Video element tidak tersedia");

        // Set stream ke video element
        setStatus("Menghubungkan stream...");
        const video = videoRef.current;
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;

        // Tunggu metadata
        setStatus("Memuat metadata...");
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          setTimeout(() => reject(new Error("Metadata timeout")), 8000);
        });

        // Play
        setStatus("Memulai video...");
        await video.play();

        if (mounted) {
          setStatus("Kamera aktif ✓");
          setReady(true);
        }
      } catch (err) {
        if (mounted) {
          const msg =
            err instanceof Error ? `${err.name}: ${err.message}` : String(err);
          setError(msg);
        }
      }
    };

    run();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── GPS ─────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) =>
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn("GPS error:", err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );

    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // ── KOMPAS ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const h =
        (e as DeviceOrientationEvent & { webkitCompassHeading?: number })
          .webkitCompassHeading ?? (e.alpha !== null ? 360 - e.alpha : 0);
      setHeading(h);
    };
    window.addEventListener("deviceorientationabsolute", handler, true);
    window.addEventListener("deviceorientation", handler, true);
    return () => {
      window.removeEventListener("deviceorientationabsolute", handler, true);
      window.removeEventListener("deviceorientation", handler, true);
    };
  }, []);

  // ── HELPERS ─────────────────────────────────────────────
  const getBearing = useCallback(
    (from: UserPosition, to: { lat: number; lng: number }) => {
      const r = (d: number) => (d * Math.PI) / 180;
      const d = (r: number) => (r * 180) / Math.PI;
      const dLng = r(to.lng - from.lng);
      const y = Math.sin(dLng) * Math.cos(r(to.lat));
      const x =
        Math.cos(r(from.lat)) * Math.sin(r(to.lat)) -
        Math.sin(r(from.lat)) * Math.cos(r(to.lat)) * Math.cos(dLng);
      return (d(Math.atan2(y, x)) + 360) % 360;
    },
    [],
  );

  const getDistance = useCallback(
    (from: UserPosition, to: { lat: number; lng: number }) => {
      const R = 6371000;
      const r = (d: number) => (d * Math.PI) / 180;
      const dLat = r(to.lat - from.lat);
      const dLng = r(to.lng - from.lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(r(from.lat)) * Math.cos(r(to.lat)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
    [],
  );

  // ── ERROR STATE ─────────────────────────────────────────
  if (error) {
    return (
      <div className="fixed inset-0 bg-dark flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-white text-lg font-semibold mb-2">Kamera Gagal</p>
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      </div>
    );
  }

  // ── LOADING STATE ───────────────────────────────────────
  // Video tetap di DOM meskipun loading — ini krusial untuk fix race condition
  return (
    <div className="fixed inset-0 bg-dark">
      {/* Loading overlay — tampil di atas video saat belum ready */}
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-dark">
          <div className="text-center px-6">
            <div className="spinner w-12 h-12 mx-auto mb-4 border-green-mid border-t-white" />
            <p className="font-display text-white text-lg mb-1">
              Menyiapkan Kamera...
            </p>
            <p className="text-white/50 text-xs font-mono mt-2">{status}</p>
          </div>
        </div>
      )}

      {/* Video — SELALU di DOM dari awal, tidak conditional */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* AR Overlay — hanya kalau ready */}
      {ready && (
        <>
          <div className="absolute inset-0 pointer-events-none" id="ar-overlay">
            {points.map((point) => {
              if (userPos) {
                const bearing = getBearing(userPos, point.gps);
                const distance = getDistance(userPos, point.gps);
                let angle = bearing - heading;
                if (angle > 180) angle -= 360;
                if (angle < -180) angle += 360;
                if (Math.abs(angle) > 60) return null;

                const x = 50 + (angle / 60) * 50;
                const scale = Math.max(
                  0.5,
                  Math.min(1.5, 100 / Math.max(distance, 1)),
                );
                const y = 30 + (1 / scale) * 15;

                return (
                  <div
                    key={point.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%,-50%)",
                      transition: "left 0.3s, top 0.3s",
                    }}
                  >
                    <button
                      onClick={() => onPointClick(point)}
                      className={`ar-point-label flex flex-col items-center gap-1 ${point.id === activePointId ? "scale-110" : "opacity-80"}`}
                    >
                      <span className="text-3xl drop-shadow-lg">
                        {point.icon}
                      </span>
                      <span
                        className={`ar-overlay-text text-xs font-semibold whitespace-nowrap ${point.id === activePointId ? "ring-2 ring-green-mid" : ""}`}
                      >
                        {point.title}
                      </span>
                      <span className="text-white/60 text-[10px]">
                        {distance < 1000
                          ? `${Math.round(distance)}m`
                          : `${(distance / 1000).toFixed(1)}km`}
                      </span>
                    </button>
                  </div>
                );
              }

              // Fallback no GPS
              const idx = points.indexOf(point);
              const x = 20 + (idx / Math.max(points.length - 1, 1)) * 60;
              return (
                <div
                  key={point.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${x}%`,
                    top: "40%",
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  <button
                    onClick={() => onPointClick(point)}
                    className={`ar-point-label flex flex-col items-center gap-1 ${point.id === activePointId ? "scale-110" : "opacity-70"}`}
                  >
                    <span className="text-3xl drop-shadow-lg animate-float">
                      {point.icon}
                    </span>
                    <span
                      className={`ar-overlay-text text-xs font-semibold whitespace-nowrap ${point.id === activePointId ? "ring-2 ring-green-mid" : ""}`}
                    >
                      {point.title}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* GPS Status */}
          <div className="absolute top-16 left-4 z-10">
            <div className="glass-dark rounded-full px-3 py-1.5 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${userPos ? "bg-green-mid animate-pulse-soft" : "bg-yellow-400"}`}
              />
              <span className="text-white/70 text-[10px]">
                {userPos
                  ? `GPS: ${userPos.lat.toFixed(4)}, ${userPos.lng.toFixed(4)}`
                  : "Mencari GPS..."}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
