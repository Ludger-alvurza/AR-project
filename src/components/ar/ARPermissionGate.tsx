"use client";

import { useState, useCallback } from "react";

// Extend DeviceOrientationEvent for iOS Safari permission API
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<string>;
}

interface PermissionError {
  name?: string;
  code?: number;
  message?: string;
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

  const requestPermissions = useCallback(async () => {
    setStatus("requesting");
    setErrorMsg("");

    try {
      // 1. Request camera permission
      await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // 2. Request GPS permission
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      // 3. iOS Safari: Request DeviceOrientation permission
      const DeviceOrientationEvt = DeviceOrientationEvent as unknown as DeviceOrientationEventiOS;
      if (
        typeof DeviceOrientationEvt.requestPermission === "function"
      ) {
        const permissionState = await DeviceOrientationEvt.requestPermission();
        if (permissionState !== "granted") {
          throw new Error("Izin sensor orientasi ditolak.");
        }
      }

      // All permissions granted
      onPermissionsGranted();
    } catch (err: unknown) {
      const e = err as PermissionError;
      setStatus("error");

      if (e.name === "NotAllowedError") {
        setErrorMsg(
          "Izin kamera ditolak. Silakan aktifkan izin kamera di pengaturan browser Anda."
        );
      } else if (e.code === 1) {
        setErrorMsg(
          "Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser Anda."
        );
      } else if (e.code === 2) {
        setErrorMsg(
          "Lokasi tidak tersedia. Pastikan GPS di perangkat Anda aktif."
        );
      } else if (e.code === 3) {
        setErrorMsg(
          "Timeout saat mencari lokasi. Pastikan Anda berada di luar ruangan dengan sinyal GPS yang baik."
        );
      } else {
        setErrorMsg(e.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  }, [onPermissionsGranted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center permission-gate p-6" id="permission-gate">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-green-light mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl animate-float">📸</span>
        </div>

        {/* Title */}
        <h2 className="font-display font-bold text-dark text-2xl mb-2">
          Aktifkan AR
        </h2>
        <p className="text-stone-candi text-sm mb-2">
          Untuk melihat titik informasi{" "}
          <span className="font-semibold text-green-primary">{pointTitle}</span>
        </p>

        {/* Requirements */}
        <div className="bg-green-pale rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-green-primary mb-3 uppercase tracking-wider">
            Dibutuhkan:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-dark">
              <span className="w-6 h-6 rounded-full bg-green-light flex items-center justify-center text-xs">
                📷
              </span>
              Akses kamera belakang
            </li>
            <li className="flex items-center gap-2 text-sm text-dark">
              <span className="w-6 h-6 rounded-full bg-green-light flex items-center justify-center text-xs">
                📍
              </span>
              Akses lokasi GPS
            </li>
            <li className="flex items-center gap-2 text-sm text-dark">
              <span className="w-6 h-6 rounded-full bg-green-light flex items-center justify-center text-xs">
                🧭
              </span>
              Sensor orientasi (kompas)
            </li>
          </ul>
        </div>

        {/* Error message */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-left">
            <p className="text-red-700 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={requestPermissions}
          disabled={status === "requesting"}
          className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          id="btn-grant-permissions"
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
          Izin ini hanya digunakan selama Anda menggunakan fitur AR dan tidak
          disimpan.
        </p>
      </div>
    </div>
  );
}
