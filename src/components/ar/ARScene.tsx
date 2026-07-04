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
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");
  const [userPos, setUserPos] = useState<UserPosition | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Start camera
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        // Coba kamera belakang dulu (untuk HP di lokasi candi)
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { exact: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });
        } catch {
          // Fallback: kamera belakang tidak ada (desktop/laptop) → pakai kamera apapun yang tersedia
          console.warn(
            "Kamera belakang tidak tersedia, mencoba kamera lain...",
          );
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });
        }

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsReady(true);
      } catch (err) {
        if (mounted) {
          setError(
            "Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.",
          );
          console.error("Camera error:", err);
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Watch GPS position
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("GPS tidak tersedia di perangkat ini.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setUserPos({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error("GPS error:", err);
        // Still allow the app to work — just use a default position
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Watch device orientation (compass)
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android
      const compassHeading =
        (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
          .webkitCompassHeading ??
        (event.alpha !== null ? 360 - event.alpha : 0);
      setHeading(compassHeading);
    };

    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation,
      true,
    );
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true,
      );
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  // Calculate bearing between two GPS coordinates
  const getBearing = useCallback(
    (from: UserPosition, to: { lat: number; lng: number }): number => {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const toDeg = (rad: number) => (rad * 180) / Math.PI;

      const dLng = toRad(to.lng - from.lng);
      const lat1 = toRad(from.lat);
      const lat2 = toRad(to.lat);

      const y = Math.sin(dLng) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

      return (toDeg(Math.atan2(y, x)) + 360) % 360;
    },
    [],
  );

  // Calculate distance between two GPS coordinates (meters)
  const getDistance = useCallback(
    (from: UserPosition, to: { lat: number; lng: number }): number => {
      const R = 6371000;
      const toRad = (deg: number) => (deg * Math.PI) / 180;

      const dLat = toRad(to.lat - from.lat);
      const dLng = toRad(to.lng - from.lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(from.lat)) *
          Math.cos(toRad(to.lat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    [],
  );

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark text-white p-6">
        <div className="text-center max-w-sm">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-lg font-semibold mb-2">Error</p>
          <p className="text-white/70 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark text-white">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4 border-green-mid border-t-white" />
          <p className="font-display text-lg">Menyiapkan Kamera...</p>
          <p className="text-white/60 text-sm mt-1">
            Menghubungkan ke kamera dan sensor
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0" id="ar-scene">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* AR Overlay — Position info points based on compass bearing */}
      <div className="absolute inset-0 pointer-events-none" id="ar-overlay">
        {points.map((point) => {
          // If we have GPS, calculate position based on bearing
          if (userPos) {
            const bearing = getBearing(userPos, point.gps);
            const distance = getDistance(userPos, point.gps);

            // Calculate relative angle from current heading
            let relativeAngle = bearing - heading;
            if (relativeAngle > 180) relativeAngle -= 360;
            if (relativeAngle < -180) relativeAngle += 360;

            // Only show points within ~120 degree field of view
            if (Math.abs(relativeAngle) > 60) return null;

            // Map angle to screen X position (center = 50%)
            const xPercent = 50 + (relativeAngle / 60) * 50;

            // Scale based on distance
            const distScale = Math.max(
              0.5,
              Math.min(1.5, 100 / Math.max(distance, 1)),
            );
            const yPercent = 30 + (1 / distScale) * 15;

            return (
              <div
                key={point.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                  transform: "translate(-50%, -50%)",
                  transition: "left 0.3s ease-out, top 0.3s ease-out",
                }}
              >
                <button
                  onClick={() => onPointClick(point)}
                  className={`ar-point-label flex flex-col items-center gap-1 transition-all ${
                    point.id === activePointId ? "scale-110" : "opacity-80"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl drop-shadow-lg">
                    {point.icon}
                  </span>
                  <span
                    className={`ar-overlay-text text-xs sm:text-sm font-semibold whitespace-nowrap ${
                      point.id === activePointId ? "ring-2 ring-green-mid" : ""
                    }`}
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

          // Fallback: No GPS — show all points in a row
          const index = points.indexOf(point);
          const xPercent = 20 + (index / Math.max(points.length - 1, 1)) * 60;

          return (
            <div
              key={point.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${xPercent}%`,
                top: "40%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <button
                onClick={() => onPointClick(point)}
                className={`ar-point-label flex flex-col items-center gap-1 transition-all hover:scale-110 ${
                  point.id === activePointId ? "scale-110" : "opacity-70"
                }`}
              >
                <span className="text-3xl sm:text-4xl drop-shadow-lg animate-float">
                  {point.icon}
                </span>
                <span
                  className={`ar-overlay-text text-xs sm:text-sm font-semibold whitespace-nowrap ${
                    point.id === activePointId ? "ring-2 ring-green-mid" : ""
                  }`}
                >
                  {point.title}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* GPS Status indicator */}
      <div className="absolute top-16 left-4 z-10">
        <div className="glass-dark rounded-full px-3 py-1.5 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              userPos ? "bg-green-mid animate-pulse-soft" : "bg-yellow-400"
            }`}
          />
          <span className="text-white/70 text-[10px]">
            {userPos
              ? `GPS: ${userPos.lat.toFixed(4)}, ${userPos.lng.toFixed(4)}`
              : "Mencari GPS..."}
          </span>
        </div>
      </div>
    </div>
  );
}
