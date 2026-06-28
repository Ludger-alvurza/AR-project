import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jelajah Edukasi AR Candi Klodangan",
    short_name: "AR Klodangan",
    description:
      "Aplikasi web AR edukasi-arkeologi untuk Candi Klodangan, Sleman, Yogyakarta. Scan QR di lokasi untuk menjelajahi sejarah candi.",
    start_url: "/",
    display: "standalone",
    background_color: "#F0FBF2",
    theme_color: "#2D6A4F",
    orientation: "portrait",
    categories: ["education", "travel"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
