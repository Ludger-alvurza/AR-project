"use client";

import { useState, useCallback } from "react";

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<string>;
}

interface ARPermissionGateProps {
  onPermissionsGranted: () => void;
  pointTitle: string;
}

export default function ARPermissionGate({
  onPermissionsGranted,
  pointTitle,
}: ARPermissionGateProps) {
  const [status, setStatus] = useState<"idle" | "requesting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [debugMsg, setDebugMsg] = useState("");

  const requestPermissions = useCallback(async () => {
    setStatus("requesting");
    setErrorMsg("");
    setDebugMsg("");

    try {
      // 1. Request camera — dengan fallback
      setDebugMsg("Meminta izin kamera...");
      let stream: MediaStream | null = null;
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
      // Stop stream — ARScene akan buka ulang sendiri
      stream?.getTracks().forEach((t) => t.stop());
      setDebugMsg("Kamera OK ✓ Meminta GPS...");

      // 2. Request GPS
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });
      setDebugMsg("GPS OK ✓ Mengecek kompas...");

      // 3. iOS Safari DeviceOrientation permission (opsional)
      const DeviceOrientationEvt =
        DeviceOrientationEvent as unknown as DeviceOrientationEventiOS & {
          requestPermission?: () => Promise<string>;
        };
      if (typeof DeviceOrientationEvt.requestPermission === "function") {
        const state = await DeviceOrientationEvt.requestPermission();
        if (state !== "granted") {
          throw new Error("Izin sensor orientasi ditolak.");
        }
      }

      setDebugMsg("Semua izin OK ✓");
      onPermissionsGranted();
    } catch (err: unknown) {
      const e = err as { name?: string; code?: number; message?: string };
      setStatus("error");

      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setErrorMsg(
          "Izin kamera ditolak. Tap ikon gembok di address bar → izinkan kamera, lalu coba lagi.",
        );
      } else if (e.name === "NotFoundError") {
        setErrorMsg("Kamera tidak ditemukan di perangkat ini.");
      } else if (e.name === "NotReadableError" || e.name === "AbortError") {
        setErrorMsg(
          "Kamera sedang dipakai aplikasi lain. Tutup aplikasi kamera lain lalu coba lagi.",
        );
      } else if (e.code === 1) {
        setErrorMsg(
          "Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser.",
        );
      } else if (e.code === 2) {
        setErrorMsg(
          "GPS tidak tersedia. Pastikan GPS aktif dan coba di luar ruangan.",
        );
      } else if (e.code === 3) {
        setErrorMsg("GPS timeout. Pastikan sinyal GPS baik lalu coba lagi.");
      } else {
        setErrorMsg(
          `Error: ${e.name || ""} ${e.message || "Silakan coba lagi."}`,
        );
      }
    }
  }, [onPermissionsGranted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center permission-gate p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-light mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl animate-float">📸</span>
        </div>

        <h2 className="font-display font-bold text-dark text-2xl mb-2">
          Aktifkan AR
        </h2>
        <p className="text-stone-candi text-sm mb-2">
          Untuk melihat titik informasi{" "}
          <span className="font-semibold text-green-primary">{pointTitle}</span>
        </p>

        <div className="bg-green-pale rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-green-primary mb-3 uppercase tracking-wider">
            Dibutuhkan:
          </p>
          <ul className="space-y-2">
            {[
              { icon: "📷", label: "Akses kamera belakang" },
              { icon: "📍", label: "Akses lokasi GPS" },
              { icon: "🧭", label: "Sensor orientasi (kompas)" },
            ].map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-dark"
              >
                <span className="w-6 h-6 rounded-full bg-green-light flex items-center justify-center text-xs">
                  {icon}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Debug info saat requesting */}
        {status === "requesting" && debugMsg && (
          <div className="bg-green-pale rounded-xl p-3 mb-4">
            <p className="text-green-primary text-xs font-mono">{debugMsg}</p>
          </div>
        )}

        {/* Error message */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-left">
            <p className="text-red-700 text-sm">{errorMsg}</p>
          </div>
        )}

        <button
          onClick={requestPermissions}
          disabled={status === "requesting"}
          className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "requesting" ? (
            <span className="flex items-center justify-center gap-2">
              <div className="spinner w-5 h-5" />
              Meminta izin...
            </span>
          ) : status === "error" ? (
            "Coba Lagi"
          ) : (
            "Aktifkan Kamera & Lokasi"
          )}
        </button>

        <p className="text-stone-candi/60 text-xs mt-4">
          Izin ini hanya digunakan selama Anda menggunakan fitur AR.
        </p>
      </div>
    </div>
  );
}
