"use client";

import { useEffect, useRef, useState } from "react";
import type { ARPoint } from "@/lib/data";

interface ARSceneProps {
  points: ARPoint[];
  activePointId: string;
  onPointClick: (point: ARPoint) => void;
}

export default function ARScene({
  points,
  activePointId,
  onPointClick,
}: ARSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Inisialisasi...");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setStatus("Cek mediaDevices...");
        if (!navigator?.mediaDevices?.getUserMedia) {
          throw new Error("getUserMedia tidak tersedia");
        }

        setStatus("Minta stream kamera...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        setStatus("Stream OK, tunggu videoRef...");

        // Tunggu videoRef dengan polling — fix race condition
        let tries = 0;
        while (!videoRef.current && tries < 20) {
          await new Promise((r) => setTimeout(r, 100));
          tries++;
        }

        if (!videoRef.current) {
          throw new Error("videoRef tidak tersedia setelah 2 detik");
        }

        setStatus("videoRef OK, set srcObject...");
        const video = videoRef.current;
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;

        setStatus("Tunggu metadata...");
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          setTimeout(() => reject(new Error("metadata timeout 8s")), 8000);
        });

        setStatus("Play...");
        await video.play();

        setStatus("READY ✓");
        if (mounted) setReady(true);
      } catch (err) {
        const msg =
          err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        if (mounted) setError(msg);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 bg-dark flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-white text-lg mb-2">❌ Error</p>
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-dark">
      {/* Status overlay — selalu tampil di atas */}
      <div className="absolute top-20 left-4 right-4 z-50 bg-black/70 rounded-xl p-3">
        <p className="text-green-400 text-xs font-mono">{status}</p>
        <p className="text-white/40 text-xs mt-1">ready: {String(ready)}</p>
      </div>

      {/* Video — selalu di DOM, tidak conditional */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* AR Overlay — hanya kalau ready */}
      {ready && (
        <div className="absolute inset-0 pointer-events-none">
          {points.map((point, index) => {
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
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-3xl drop-shadow-lg">{point.icon}</span>
                  <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {point.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
