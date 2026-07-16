# Plan Project: Jelajah Edukasi AR Candi Klodangan

> Aplikasi web AR edukasi-arkeologi untuk Candi Klodangan, Sleman, Yogyakarta.
> Dana dari pemerintah DIY — klien: Bu Heny.
> Brief resmi diterima via WhatsApp.

---

## 1. Overview Proyek

| Item | Detail |
|---|---|
| Nama fitur | Jelajah Edukasi AR Candi Klodangan |
| Tipe | Web App (no install, akses via browser) |
| Target user | Pengunjung yang **datang langsung** ke lokasi situs |
| Platform | Browser mobile (kamera belakang HP) |
| Bahasa | Indonesia |
| Trigger utama | **QR code fisik** ditempel di tiap tumpukan batu |

### Alur Inti (dari brief Bu Heny)

```
Scan QR di tumpukan batu tertentu
        ↓
Halaman edukasi tumpukan itu langsung terbuka
        ↓
Muncul info arkeologi spesifik tumpukan tersebut
        ↓
User baca, lalu scan QR tumpukan berikutnya
```

### Tiga Komponen Utama

**A. QR per Tumpukan Batu (Fitur Utama)**
4 tingkatan batu yang ditumpuk vertikal di lokasi GPS yang **sama**. Tiap tumpukan punya QR sendiri yang ditempel di papan kecil di samping lapisan batu. Scan QR → langsung buka halaman edukasi tumpukan itu. Tidak perlu GPS atau kamera AR — simpel dan akurat.

> **Catatan Penting:** 4 titik ini bukan 4 lokasi terpisah di peta, tapi 4 tingkatan vertikal di koordinat GPS yang sama. GPS tidak bisa membedakan titik-titik ini, makanya pakai QR per tumpukan.

**B. Timeline Situs**
Menu terpisah dalam web yang sama — "Sejarah Singkat Candi Klodangan" berisi urutan kronologis: penemuan → ekskavasi → penetapan sebagai cagar budaya → kondisi saat ini.

**C. Navigasi AR GPS (untuk menuju area candi)**
AR GPS tetap tersedia untuk navigasi **dari parkiran menuju lokasi candi** — menampilkan 1 marker tunggal "Candi Klodangan" di kamera live, bukan 4 marker terpisah. Berguna untuk pengunjung yang belum tahu letak pasti candi.

**D. Jelajah Virtual**
Foto aerial situs dengan hotspot interaktif — untuk yang tidak bisa datang langsung.

---

## 2. Arsitektur Sistem

### Skema Teknologi Final

| Fitur | Teknologi | Cocok untuk |
|---|---|---|
| Info per tumpukan batu | **QR per tingkatan** → halaman edukasi | Titik di lokasi GPS sama tapi beda vertikal |
| Navigasi ke area candi | GPS + kompas (AR) | Navigasi horizontal dari parkiran ke candi |
| Jelajah Virtual | Foto aerial + hotspot klik | Remote — yang tidak bisa datang |

### Mapping QR ke Tumpukan

Setiap tumpukan batu punya **QR unik sendiri** yang ditempel di papan kecil di samping lapisan batu:

| QR Code | Tumpukan | Konten |
|---|---|---|
| QR-01 | Tumpukan 1 — Fondasi Dasar | Info fondasi candi, ukuran, struktur |
| QR-02 | Tumpukan 2 — Batu Penyusun | Jenis batu, teknik konstruksi, batu putih |
| QR-03 | Tumpukan 3 — Area Ekskavasi | Proses & temuan ekskavasi |
| QR-04 | Tumpukan 4 — Puncak (Status CB) | Status hukum, pengelola BPCB DIY |

> Semua di koordinat GPS yang sama: -7.812667, 110.426289. Yang berbeda hanya tingkatan vertikal.

Tiap QR meng-encode URL langsung ke halaman edukasi:
```
https://arcandiklodangan.vercel.app/edukasi/tumpukan-1-fondasi
https://arcandiklodangan.vercel.app/edukasi/tumpukan-2-batu
https://arcandiklodangan.vercel.app/edukasi/tumpukan-3-ekskavasi
https://arcandiklodangan.vercel.app/edukasi/tumpukan-4-status
```

Scan QR pakai **kamera native HP** → browser langsung terbuka ke halaman edukasi yang benar. Tidak perlu GPS atau akses kamera.

---

## 3. Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI:** React + Tailwind CSS
- **Language:** TypeScript

### AR Engine (untuk navigasi GPS saja)
- Kamera live + GPS + kompas di browser
- Menampilkan 1 marker navigasi ke area candi
- Tidak digunakan untuk membedakan 4 tumpukan batu

### QR Code
- **Generator:** [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- QR dicetak dan ditempel di papan kecil di samping tiap lapisan batu

### Konten / Data
- **Data titik AR + edukasi + timeline:** File JSON statis di `/public/data/`
- **Tidak perlu database** — konten ringan dan jarang berubah

### Deployment
- **Platform:** Vercel (gratis, HTTPS otomatis)

---

## 4. Struktur Folder Proyek

```
ar-candi-klodangan/
├── public/
│   ├── data/
│   │   ├── ar-points.json         # Data 4 tumpukan batu (layer, GPS, info)
│   │   ├── edukasi.json           # Data Q&A arkeologi per tumpukan
│   │   ├── timeline.json          # Data kronologi sejarah situs
│   │   └── virtual-tour-points.json # Hotspot untuk jelajah virtual
│   ├── images/
│   │   ├── points/
│   │   │   ├── fondasi.jpg
│   │   │   ├── batu-penyusun.jpg
│   │   │   ├── ekskavasi.jpg
│   │   │   └── cagar-budaya.jpg
│   │   └── jelajah-virtual-image/
│   │       └── candi-klodangan.jpeg
│   └── qr/                        # (opsional) File QR untuk dicetak
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing page — 3 fitur utama + 4 tumpukan
│   │   ├── ar/
│   │   │   └── page.tsx            # Navigasi AR GPS ke area candi (1 marker)
│   │   ├── qr/
│   │   │   └── page.tsx            # Generator QR per tumpukan + panduan cetak
│   │   ├── timeline/
│   │   │   └── page.tsx            # Timeline Situs
│   │   ├── jelajah-virtual/
│   │   │   └── page.tsx            # Jelajah Virtual (foto aerial + hotspot)
│   │   └── edukasi/
│   │       └── [pointId]/
│   │           └── page.tsx        # Halaman edukasi per tumpukan (prev/next nav)
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── InfoCard.tsx
│   │   │   └── LoadingScreen.tsx
│   │   ├── ar/
│   │   │   ├── ARScene.tsx         # Kamera live + 1 marker GPS ke candi
│   │   │   ├── ARInfoPoint.tsx     # (legacy — info panel inline di AR page)
│   │   │   └── ARPermissionGate.tsx
│   │   ├── jelajah-virtual/
│   │   │   ├── VirtualTourScene.tsx
│   │   │   └── VirtualTourInfoPanel.tsx
│   │   ├── timeline/
│   │   │   └── TimelineItem.tsx
│   │   └── edukasi/
│   │       └── EdukasiAccordion.tsx
│   │
│   └── lib/
│       ├── data.ts                 # Types + fungsi baca data JSON
│       └── geolocation.ts          # Helper hitung jarak & arah GPS
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Desain UI

### Identitas Visual

Tema: **alam + warisan budaya Jawa**, dominan hijau-putih sesuai arahan — tidak generik, tidak AI-slop.

| Token | Nilai | Keterangan |
|---|---|---|
| `--green-primary` | `#2D6A4F` | Hijau tua — warna utama, tombol, aksen |
| `--green-mid` | `#52B788` | Hijau medium — hover, border aktif, badge AR |
| `--green-light` | `#D8F3DC` | Hijau muda — background section, card |
| `--green-pale` | `#F0FBF2` | Hijau sangat muda — background halaman |
| `--white` | `#FFFFFF` | Putih bersih — card, modal, navbar |
| `--stone` | `#8C7B6E` | Abu batu — teks sekunder, elemen dekoratif (merujuk batu candi) |
| `--dark` | `#1B2E27` | Hijau gelap hampir hitam — teks utama |

**Tipografi:**
- Display / heading: `Playfair Display` — berkarakter, kesan heritage/arkeologi
- Body: `Inter` — bersih, mudah dibaca di kondisi outdoor/cahaya terang
- Label / caption AR: `Inter` weight 600, sedikit besar (mudah dibaca saat HP digerakkan)

**Signature elemen:**
Motif garis batik kawung abstrak tipis sebagai aksen di navbar dan kartu timeline — relevan karena kawung berasal dari era Hindu-Buddha Jawa, sezaman dengan perkiraan usia Candi Klodangan (abad IX-X).

---

### Halaman & Layout

#### Landing Page (`/`)

```
┌────────────────────────────────────────────┐
│  NAVBAR: Logo "Jelajah AR"                 │
│          Menu: Timeline | Jelajah Virtual  │
├────────────────────────────────────────────┤
│  HERO:                                     │
│  "Jelajah Edukasi AR Candi Klodangan"      │
│  Subtext: scan QR di tiap lapisan batu     │
├────────────────────────────────────────────┤
│  SECTION: 3 Fitur Utama                   │
│  📱 QR per Tumpukan | 🧭 AR GPS | 🗺️ Virtual │
├────────────────────────────────────────────┤
│  SECTION: Cara Menggunakan                 │
│  1. Datang ke lokasi                       │
│  2. Temukan QR di tiap lapisan batu        │
│  3. Scan QR → halaman edukasi terbuka      │
│  4. Baca & lanjut ke tumpukan berikutnya   │
├────────────────────────────────────────────┤
│  SECTION: 4 Tumpukan Batu (vertikal)       │
│  [4] 📜 Tumpukan 4 — Puncak               │
│  [3] ⛏️ Tumpukan 3 — Area Ekskavasi        │
│  [2] 🪨 Tumpukan 2 — Batu Penyusun        │
│  [1] 🏛️ Tumpukan 1 — Fondasi Dasar        │
├────────────────────────────────────────────┤
│  SECTION: Tentang Candi (ringkas)          │
├────────────────────────────────────────────┤
│  FOOTER: kredit + sumber data JogjaCagar   │
└────────────────────────────────────────────┘
```

#### Halaman AR — Navigasi GPS (`/ar`)

```
┌────────────────────────────────────────────┐
│  ← Kembali        🧭 Navigasi AR          │
├────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │  [LIVE KAMERA — fullscreen]          │  │
│  │                                      │  │
│  │         🏛️ Candi Klodangan          │  │
│  │         (1 marker tunggal)          │  │
│  │         ↳ jarak + arah              │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [Info Panel: daftar 4 QR di lokasi]       │
│  [📍 Buka Google Maps]                     │
└────────────────────────────────────────────┘
```

#### Edukasi per Tumpukan (`/edukasi/tumpukan-1-fondasi`)

```
┌────────────────────────────────────────────┐
│  NAVBAR                                    │
├────────────────────────────────────────────┤
│  [Badge: Tumpukan 1 dari 4]               │
│  "Tumpukan 1 — Fondasi Dasar"             │
│                                            │
│  [Accordion — Q&A arkeologi]               │
│  ▸ Apa fungsi fondasi?                     │
│  ▸ Mengapa bentuk candi belum diketahui?   │
│  ▸ Seberapa besar area fondasi?            │
│                                            │
│  [← Prev tumpukan | Next tumpukan →]      │
│  [1] [2] [3] [4]  ← quick nav dots        │
│                                            │
│  [CTA: Jelajah Virtual | Timeline]         │
└────────────────────────────────────────────┘
```

---

## 6. Struktur Data JSON

### `public/data/ar-points.json`

```json
[
  {
    "id": "tumpukan-1-fondasi",
    "title": "Fondasi Dasar",
    "layer": 1,
    "layerLabel": "Tumpukan 1 — Fondasi Dasar",
    "qrUrl": "/edukasi/tumpukan-1-fondasi",
    "gps": { "lat": -7.812667, "lng": 110.426289 },
    "shortInfo": "Fondasi candi berukuran 7,5 x 7,5 meter...",
    "image": "/images/points/fondasi.jpg",
    "edukasiId": "tumpukan-1-fondasi",
    "icon": "🏛️"
  }
]
```

### `public/data/edukasi.json`

```json
[
  {
    "pointId": "tumpukan-1-fondasi",
    "title": "Fondasi Dasar",
    "questions": [
      {
        "question": "Apa fungsi fondasi candi?",
        "answer": "Fondasi adalah struktur dasar yang menopang..."
      }
    ]
  }
]
```

---

## 7. Catatan Teknis Penting

- **GPS tidak cocok untuk 4 tumpukan batu** — koordinat GPS-nya identik, AR overlay-nya tumpang tindih semua di satu titik. Solusi: QR per tumpukan.
- **QR scan tidak perlu kamera dalam web** — user scan pakai kamera native HP, browser langsung terbuka ke halaman edukasi yang benar. Jauh lebih reliable daripada AR.
- **AR GPS tetap berguna** untuk navigasi ke **area** candi (dari parkiran → ke lokasi), bukan untuk membedakan titik individual.
- **A-Frame & AR.js tidak lagi digunakan** — navigasi AR cukup pakai kamera live + GPS + kompas native browser.
- **HTTPS wajib** untuk akses kamera & GPS — Vercel otomatis kasih HTTPS.
- **iOS Safari** — butuh izin eksplisit untuk `DeviceOrientationEvent`.
- **Testing QR wajib di HP asli** — scan QR harus dicoba dengan kamera native HP, bukan simulator.

---

## 8. Referensi & Sumber

- qrcode.react (npm): https://www.npmjs.com/package/qrcode.react
- Data resmi candi: https://jogjacagar.jogjaprov.go.id/detail/522/displayrecords-i-nama-warisan
- Wikipedia Candi Klodangan: https://id.wikipedia.org/wiki/Candi_Klodangan
- Google Fonts (Playfair Display + Inter): https://fonts.google.com

---

*Plan v3 — revisi arsitektur: GPS-based AR untuk 4 titik diganti QR per tumpukan batu, karena 4 titik tersebut adalah tingkatan vertikal di koordinat GPS yang sama, bukan 4 lokasi terpisah. AR GPS tetap dipakai untuk navigasi ke area candi secara keseluruhan.*