import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jelajah Edukasi AR Candi Klodangan",
  description:
    "Aplikasi web AR edukasi-arkeologi untuk Candi Klodangan, Sleman, Yogyakarta. Scan QR di lokasi untuk menjelajahi sejarah candi melalui Augmented Reality.",
  keywords: [
    "Candi Klodangan",
    "AR",
    "Augmented Reality",
    "edukasi",
    "arkeologi",
    "Sleman",
    "Yogyakarta",
    "cagar budaya",
  ],
  authors: [{ name: "Jelajah Edukasi AR" }],
  openGraph: {
    title: "Jelajah Edukasi AR Candi Klodangan",
    description:
      "Jelajahi sejarah Candi Klodangan melalui Augmented Reality langsung di lokasi situs.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2D6A4F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
