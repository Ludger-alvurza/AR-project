"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (url: string) => void;
  onScanError?: (error: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Menyiapkan kamera...");
  const hasProcessedRef = useRef(false);

  const startScanner = useCallback(async () => {
    if (!containerRef.current || scannerRef.current) return;

    try {
      setStatus("Membuka kamera...");
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          // Prevent double-processing
          if (hasProcessedRef.current) return;
          hasProcessedRef.current = true;

          onScanSuccess(decodedText);
        },
        () => {
          // QR not found in frame — ignore silently
        }
      );

      setIsScanning(true);
      setStatus("Arahkan kamera ke QR code");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      onScanError?.(msg);
    }
  }, [onScanSuccess, onScanError]);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
            scannerRef.current = null;
          })
          .catch(() => {
            // Ignore cleanup errors
          });
      }
    };
  }, [startScanner]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <span className="text-4xl block mb-4">⚠️</span>
          <p className="text-white font-semibold text-lg mb-2">
            Kamera Gagal Dibuka
          </p>
          <p className="text-white/60 text-sm mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              hasProcessedRef.current = false;
              startScanner();
            }}
            className="btn-primary"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Scanner container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-md mx-auto"
      >
        <div
          id="qr-reader"
          className="w-full overflow-hidden rounded-2xl"
          style={{ minHeight: "300px" }}
        />
      </div>

      {/* Status */}
      <div className="mt-6 text-center">
        {!isScanning ? (
          <div className="flex items-center justify-center gap-3">
            <div className="spinner w-5 h-5 border-green-mid border-t-white" />
            <span className="text-white/70 text-sm">{status}</span>
          </div>
        ) : (
          <div className="glass-dark rounded-full px-6 py-3 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-mid animate-pulse-soft" />
            <span className="text-white text-sm font-medium">
              {status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
