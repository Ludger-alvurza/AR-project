"use client";

import { useEffect, useRef, useState } from "react";
import type { ARPoint } from "@/lib/data";

// Extend Window for A-Frame global
declare global {
  interface Window {
    AFRAME?: unknown;
  }
}

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
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    // Load A-Frame and AR.js scripts dynamically
    const loadScripts = async () => {
      try {
        // Check if already loaded
        if (window.AFRAME) {
          setIsLoaded(true);
          return;
        }

        // Load A-Frame
        await loadScript(
          "https://aframe.io/releases/1.6.0/aframe.min.js",
          "aframe-script"
        );

        // Load AR.js
        await loadScript(
          "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js",
          "arjs-script"
        );

        setIsLoaded(true);
      } catch (err) {
        setLoadError("Gagal memuat library AR. Periksa koneksi internet Anda.");
        console.error("Failed to load AR scripts:", err);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    const container = sceneRef.current;
    if (!isLoaded || !container) return;

    // Build A-Frame scene
    const activePoint = points.find((p) => p.id === activePointId);
    if (!activePoint) return;

    const sceneEl = document.createElement("a-scene");
    sceneEl.setAttribute("vr-mode-ui", "enabled: false");
    sceneEl.setAttribute(
      "arjs",
      "sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
    );
    sceneEl.setAttribute(
      "renderer",
      "antialias: true; alpha: true; logarithmicDepthBuffer: true;"
    );
    sceneEl.style.position = "fixed";
    sceneEl.style.top = "0";
    sceneEl.style.left = "0";
    sceneEl.style.width = "100%";
    sceneEl.style.height = "100%";

    // Camera with GPS
    const camera = document.createElement("a-camera");
    camera.setAttribute("gps-new-camera", "");
    camera.setAttribute("rotation-reader", "");
    sceneEl.appendChild(camera);

    // Add entities for each point
    points.forEach((point) => {
      const entity = document.createElement("a-entity");
      entity.setAttribute(
        "gps-new-entity-place",
        `latitude: ${point.gps.lat}; longitude: ${point.gps.lng}`
      );

      // Create a text panel
      const text = document.createElement("a-text");
      text.setAttribute("value", point.icon + " " + point.title);
      text.setAttribute("look-at", "[gps-new-camera]");
      text.setAttribute("scale", "15 15 15");
      text.setAttribute(
        "color",
        point.id === activePointId ? "#52B788" : "#FFFFFF"
      );
      text.setAttribute("align", "center");
      text.setAttribute("font", "roboto");
      text.setAttribute("width", "6");

      // Background plane
      const bg = document.createElement("a-plane");
      bg.setAttribute("width", "8");
      bg.setAttribute("height", "2");
      bg.setAttribute("color", "#1B2E27");
      bg.setAttribute("opacity", "0.8");
      bg.setAttribute("look-at", "[gps-new-camera]");
      bg.setAttribute("scale", "15 15 15");
      bg.setAttribute("position", "0 0 -0.1");

      // Make clickable
      bg.classList.add("clickable");
      bg.addEventListener("click", () => {
        onPointClick(point);
      });

      entity.appendChild(bg);
      entity.appendChild(text);
      sceneEl.appendChild(entity);
    });

    container.innerHTML = "";
    container.appendChild(sceneEl);

    return () => {
      // Cleanup
      const existingScene = container.querySelector("a-scene");
      if (existingScene) {
        existingScene.remove();
      }
    };
  }, [isLoaded, points, activePointId, onPointClick]);

  if (loadError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark text-white p-6">
        <div className="text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-lg font-semibold mb-2">Error</p>
          <p className="text-white/70 text-sm">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark text-white">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4 border-green-mid border-t-white" />
          <p className="font-display text-lg">Memuat AR Engine...</p>
          <p className="text-white/60 text-sm mt-1">
            Menyiapkan kamera dan sensor
          </p>
        </div>
      </div>
    );
  }

  return <div ref={sceneRef} className="fixed inset-0 z-0" id="ar-scene" />;
}

// Utility to load external scripts
function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}
