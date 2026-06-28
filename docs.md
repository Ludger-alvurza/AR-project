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
| Trigger utama | **QR code fisik** ditempel di tiap titik situs |

### Alur Inti (dari brief Bu Heny)

```
Scan QR di titik tertentu
        ↓
Kamera AR terbuka otomatis
        ↓
Muncul titik informasi AR di atas kamera
        ↓
User klik titik
        ↓
Muncul narasi: Sejarah / Timeline / Edukasi Arkeologi
```

### Tiga Komponen Konten dalam Satu Web

**A. AR Titik Informasi Situs**
Tiap QR yang ditempel di lokasi fisik (Fondasi Candi, Batu Penyusun, Area Ekskavasi, Status Cagar Budaya) memicu kamera AR. Titik informasi muncul sebagai overlay AR di atas live camera, sesuai QR yang di-scan.

**B. Timeline Situs**
Menu terpisah dalam web yang sama — "Sejarah Singkat Candi Klodangan" berisi urutan kronologis: penemuan → ekskavasi → penetapan sebagai cagar budaya → kondisi saat ini.

**C. AR Edukasi Arkeologi**
Tiap titik informasi AR, saat diklik, membuka penjelasan edukatif mendalam — bukan cuma fakta, tapi konteks ilmiah:
- "Mengapa bentuk candi belum diketahui?"
- "Apa fungsi fondasi?"
- "Apa arti batu putih?"
- "Mengapa disebut situs yang belum selesai dibangun?"

---

## 2. Arsitektur Sistem

### Mapping QR ke Titik

Setiap titik fisik di lokasi punya **QR unik sendiri** (bukan satu QR untuk semua):

| QR Code | Titik Fisik | Konten yang Muncul |
|---|---|---|
| QR-01 | Fondasi Candi | Overlay AR: ukuran, struktur, fungsi fondasi |
| QR-02 | Batu Penyusun | Overlay AR: jenis batu, arti batu putih |
| QR-03 | Area Ekskavasi | Overlay AR: proses & temuan ekskavasi |
| QR-04 | Papan Status Cagar Budaya | Overlay AR: status hukum, BPCB DIY |

Tiap QR meng-encode URL unik, contoh:
```
https://arcandiklodangan.vercel.app/ar?point=fondasi-candi
https://arcandiklodangan.vercel.app/ar?point=batu-penyusun
https://arcandiklodangan.vercel.app/ar?point=area-ekskavasi
https://arcandiklodangan.vercel.app/ar?point=status-cagar-budaya
```

Param `point` di URL ini yang menentukan titik AR mana yang langsung aktif begitu halaman terbuka — jadi user tinggal scan QR pakai kamera bawaan HP (bukan kamera dalam web), browser otomatis terbuka ke halaman yang benar, lalu **web yang membuka kamera AR-nya sendiri**.

> Catatan: QR discan pakai **kamera native HP** (seperti biasa scan QR), bukan kamera dalam web. Setelah itu browser membuka URL spesifik tadi, dan baru di halaman itu web meminta izin akses kamera untuk AR.

---

## 3. Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI:** React + Tailwind CSS
- **Language:** TypeScript

### AR Engine
- **Library AR:** [AR.js](https://ar-js-org.github.io/AR.js-Docs/) — Location-based atau Marker-based AR di browser
- **Renderer:** [A-Frame](https://aframe.io/) — render titik informasi sebagai entity AR di atas kamera live
- **Strategi marker:**
  - **Opsi A (rekomendasi):** AR.js *Location-based* — tiap titik info AR muncul berdasarkan koordinat GPS yang sudah di-set per titik. QR hanya berfungsi membuka URL yang tepat, AR overlay-nya muncul karena GPS + arah kompas HP, bukan deteksi visual.
  - **Opsi B:** AR.js *Marker-based* — selain QR untuk membuka halaman, ditempel marker visual tambahan (pattern image) untuk presisi posisi AR. Lebih akurat tapi butuh 2 jenis kode tertempel (QR + marker visual).

> Rekomendasi: pakai **Opsi A** dulu karena area situs kecil (~8x9.5m) dan GPS akurat cukup untuk skala ini, plus implementasinya lebih simpel — QR cukup sendirian tanpa marker visual tambahan.

### QR Code
- **Generator:** [qrcode.react](https://www.npmjs.com/package/qrcode.react) (untuk generate QR dari dalam project) atau tools online seperti [QR Code Generator](https://www.qr-code-generator.com/) untuk cetak fisik
- QR dicetak dan ditempel di plat/papan tahan cuaca di tiap titik lokasi

### Konten / Data
- **Data titik AR + edukasi + timeline:** File JSON statis di `/public/data/`
- **Tidak perlu database** — konten ringan dan jarang berubah

### Deployment
- **Platform:** Vercel (gratis, HTTPS otomatis — wajib untuk akses kamera & GPS browser)

---

## 4. Struktur Folder Proyek

```
ar-candi-klodangan/
├── public/
│   ├── data/
│   │   ├── ar-points.json       # Data titik AR (lokasi GPS, judul, AR content)
│   │   ├── edukasi.json         # Data penjelasan arkeologi per titik
│   │   └── timeline.json        # Data kronologi sejarah situs
│   ├── images/
│   │   ├── points/
│   │   │   ├── fondasi.jpg
│   │   │   ├── batu-penyusun.jpg
│   │   │   ├── ekskavasi.jpg
│   │   │   └── cagar-budaya.jpg
│   │   └── timeline/
│   │       └── ...
│   └── qr/
│       ├── qr-fondasi-candi.png        # File QR untuk dicetak
│       ├── qr-batu-penyusun.png
│       ├── qr-area-ekskavasi.png
│       └── qr-status-cagar-budaya.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing page / home
│   │   ├── ar/
│   │   │   └── page.tsx            # Halaman AR — baca ?point= dari URL
│   │   ├── timeline/
│   │   │   └── page.tsx            # Halaman Timeline Situs
│   │   └── edukasi/
│   │       └── [pointId]/
│   │           └── page.tsx        # Halaman detail edukasi arkeologi per titik
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── InfoCard.tsx        # Card narasi sejarah/edukasi
│   │   │   └── LoadingScreen.tsx
│   │   ├── ar/
│   │   │   ├── ARScene.tsx         # Wrapper A-Frame + AR.js
│   │   │   ├── ARInfoPoint.tsx     # Titik informasi AR yang bisa diklik
│   │   │   └── ARPermissionGate.tsx # Minta izin kamera + lokasi sebelum AR aktif
│   │   ├── timeline/
│   │   │   └── TimelineItem.tsx    # Satu entri kronologi
│   │   └── edukasi/
│   │       └── EdukasiAccordion.tsx # Pertanyaan & jawaban arkeologi (expand/collapse)
│   │
│   ├── lib/
│   │   ├── data.ts                 # Fungsi baca data JSON
│   │   └── geolocation.ts          # Helper hitung jarak & arah GPS
│   │
│   └── styles/
│       └── globals.css
│
├── next.config.js
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

**Pertimbangan khusus UI untuk AR outdoor:**
- Kontras tinggi pada overlay teks AR (background semi-transparan gelap di belakang teks putih) — karena akan dipakai di luar ruangan dengan cahaya matahari langsung
- Tombol besar, mudah ditekan dengan satu tangan (user sambil pegang HP buat AR)
- Indikator loading jelas saat GPS/kamera masih mencari posisi

---

### Halaman & Layout

#### Landing Page (`/`)

```
┌────────────────────────────────────────────┐
│  NAVBAR: Logo "Jelajah Edukasi AR"          │
│          Menu: Timeline | Tentang           │
├────────────────────────────────────────────┤
│  [motif kawung tipis di background]         │
│                                             │
│  HERO:                                     │
│  "Jelajah Edukasi AR Candi Klodangan"      │
│  Subtext: scan QR di lokasi untuk mulai     │
│                                             │
│  [Tombol: Lihat Timeline Situs]            │
│                                             │
├────────────────────────────────────────────┤
│  SECTION: Cara Menggunakan                 │
│  1. Datang ke lokasi candi                 │
│  2. Scan QR di titik yang ingin dipelajari │
│  3. Arahkan kamera, klik titik info        │
│  4. Baca narasi sejarah & edukasi          │
├────────────────────────────────────────────┤
│  SECTION: Tentang Candi (ringkas)          │
├────────────────────────────────────────────┤
│  FOOTER: kredit + sumber data JogjaCagar   │
└────────────────────────────────────────────┘
```

#### Halaman AR (`/ar?point=fondasi-candi`)

```
┌────────────────────────────────────────────┐
│  [Tanpa navbar penuh — minimal UI]         │
│  ← Kembali        Fondasi Candi            │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  [LIVE KAMERA — fullscreen]          │  │
│  │                                      │  │
│  │         ⊙ Titik Info AR              │  │
│  │      (muncul mengambang di kamera)   │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [Card muncul dari bawah saat titik diklik]│
│  ┌──────────────────────────────────────┐  │
│  │ Fondasi Candi                       │  │
│  │ Ukuran 7,5 x 7,5 meter...           │  │
│  │ [Pelajari Lebih Lanjut →]           │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

#### Timeline Situs (`/timeline`)

```
┌────────────────────────────────────────────┐
│  NAVBAR                                    │
├────────────────────────────────────────────┤
│  "Sejarah Singkat Candi Klodangan"         │
│                                            │
│  ●── Penemuan                              │
│  │   Tahun & konteks penemuan situs        │
│  │                                        │
│  ●── Ekskavasi                             │
│  │   Proses penggalian arkeologi           │
│  │                                        │
│  ●── Penetapan Cagar Budaya                │
│  │   Status hukum & pengelola (BPCB DIY)   │
│  │                                        │
│  ●── Kondisi Saat Ini                      │
│      Deskripsi kondisi situs sekarang      │
└────────────────────────────────────────────┘
```

#### Edukasi Arkeologi (`/edukasi/[pointId]`)

```
┌────────────────────────────────────────────┐
│  NAVBAR                                    │
├────────────────────────────────────────────┤
│  "Edukasi Arkeologi: Fondasi Candi"        │
│                                            │
│  [Accordion — bisa expand/collapse]        │
│  ▸ Apa fungsi fondasi?                     │
│  ▸ Mengapa bentuk candi belum diketahui?   │
│  ▸ Apa arti batu putih?                    │
│  ▸ Mengapa disebut situs belum selesai?    │
└────────────────────────────────────────────┘
```

---

## 6. Struktur Data JSON

### `public/data/ar-points.json`

```json
[
  {
    "id": "fondasi-candi",
    "title": "Fondasi Candi",
    "qrUrl": "/ar?point=fondasi-candi",
    "gps": { "lat": -7.812667, "lng": 110.426289 },
    "shortInfo": "Fondasi candi berukuran 7,5 x 7,5 meter, berada 1,2 meter di bawah permukaan tanah.",
    "image": "/images/points/fondasi.jpg",
    "edukasiId": "fondasi-candi"
  },
  {
    "id": "batu-penyusun",
    "title": "Batu Penyusun",
    "qrUrl": "/ar?point=batu-penyusun",
    "gps": { "lat": -7.812690, "lng": 110.426310 },
    "shortInfo": "Susunan batu andesit yang menjadi material dasar pembangunan candi.",
    "image": "/images/points/batu-penyusun.jpg",
    "edukasiId": "batu-penyusun"
  },
  {
    "id": "area-ekskavasi",
    "title": "Area Ekskavasi",
    "qrUrl": "/ar?point=area-ekskavasi",
    "gps": { "lat": -7.812650, "lng": 110.426270 },
    "shortInfo": "Area yang telah digali oleh tim arkeologi untuk mengungkap struktur candi.",
    "image": "/images/points/ekskavasi.jpg",
    "edukasiId": "area-ekskavasi"
  },
  {
    "id": "status-cagar-budaya",
    "title": "Status Cagar Budaya",
    "qrUrl": "/ar?point=status-cagar-budaya",
    "gps": { "lat": -7.812667, "lng": 110.426300 },
    "shortInfo": "Dikelola oleh Balai Pelestarian Cagar Budaya DIY sebagai warisan budaya yang dilindungi.",
    "image": "/images/points/cagar-budaya.jpg",
    "edukasiId": "status-cagar-budaya"
  }
]
```

### `public/data/edukasi.json`

```json
[
  {
    "pointId": "fondasi-candi",
    "questions": [
      {
        "question": "Apa fungsi fondasi?",
        "answer": "Fondasi adalah struktur dasar yang menopang seluruh badan candi. Pada Candi Klodangan, hanya bagian fondasi dan dinding bawah yang tersisa, sehingga inilah elemen utama yang masih bisa dipelajari arkeolog hari ini."
      },
      {
        "question": "Mengapa bentuk candi belum diketahui?",
        "answer": "Karena bagian tubuh, atap, dan puncak candi sudah tidak ditemukan — kemungkinan runtuh, hilang, atau terkubur dalam jangka waktu lama. Tanpa bagian-bagian tersebut, arkeolog tidak punya cukup bukti fisik untuk merekonstruksi bentuk aslinya secara pasti."
      }
    ]
  },
  {
    "pointId": "batu-penyusun",
    "questions": [
      {
        "question": "Apa arti batu putih?",
        "answer": "Isi sesuai temuan riset lapangan / sumber BPCB — jenis batu, asal usul, dan signifikansinya dalam konstruksi candi."
      }
    ]
  },
  {
    "pointId": "area-ekskavasi",
    "questions": [
      {
        "question": "Mengapa disebut situs yang belum selesai dibangun?",
        "answer": "Isi sesuai temuan riset — kemungkinan terkait pola struktur yang ditemukan saat ekskavasi yang mengindikasikan candi tidak pernah selesai dibangun secara penuh."
      }
    ]
  }
]
```

### `public/data/timeline.json`

```json
[
  {
    "id": "penemuan",
    "title": "Penemuan",
    "year": "Isi tahun penemuan",
    "description": "Konteks awal penemuan situs Candi Klodangan oleh warga/peneliti."
  },
  {
    "id": "ekskavasi",
    "title": "Ekskavasi",
    "year": "Isi tahun ekskavasi",
    "description": "Proses penggalian arkeologi yang dilakukan untuk mengungkap struktur candi."
  },
  {
    "id": "penetapan",
    "title": "Penetapan Cagar Budaya",
    "year": "Isi tahun penetapan",
    "description": "Status hukum sebagai cagar budaya, dikelola oleh Balai Pelestarian Cagar Budaya DIY."
  },
  {
    "id": "kondisi-saat-ini",
    "title": "Kondisi Saat Ini",
    "year": "Sekarang",
    "description": "Deskripsi kondisi fisik situs saat ini — fondasi yang tersisa, luas area, dan status pelestarian."
  }
]
```

> ⚠️ Banyak field di atas masih placeholder ("Isi sesuai..."). Ini **wajib diisi** dengan data akurat dari Bu Heny / BPCB DIY sebelum go-live — jangan asal isi karena ini konten edukasi publik tentang cagar budaya.

---

## 7. Milestone & Timeline

> Estimasi untuk 1-2 developer (lo + teman)

| Fase | Task | Estimasi |
|---|---|---|
| **Fase 0** | Setup repo, Next.js, Tailwind, deploy awal ke Vercel | 1 hari |
| **Fase 1** | Landing page + navbar + footer + UI dasar | 2 hari |
| **Fase 2** | Halaman Timeline Situs + data JSON | 1-2 hari |
| **Fase 3** | Halaman Edukasi Arkeologi (accordion per titik) | 2 hari |
| **Fase 4** | Kunjungan lokasi: ambil GPS presisi tiap titik, foto, riset konten bersama Bu Heny | 1-2 hari (lapangan) |
| **Fase 5** | Setup AR.js Location-based + render titik info AR | 3-4 hari |
| **Fase 6** | Generate & cetak QR per titik, testing scan → buka halaman AR yang benar | 1-2 hari |
| **Fase 7** | Integrasi klik titik AR → buka card info → link ke edukasi | 2 hari |
| **Fase 8** | Testing end-to-end **langsung di lokasi candi** (GPS akurasi, cahaya outdoor, koneksi internet di lokasi) | 1-2 hari |
| **Fase 9** | Polish UI, responsive check, lintas device (Android/iOS) | 2 hari |
| **Fase 10** | Final deploy + cetak QR fisik + handover ke Bu Heny | 1 hari |
| **Total** | | **~4-5 minggu** |

---

## 8. Hal yang Wajib Dikonfirmasi ke Bu Heny

1. **Sumber konten arkeologi** — jawaban untuk pertanyaan seperti "apa arti batu putih?" dan "mengapa situs belum selesai dibangun?" itu dari hasil riset/ekskavasi resmi siapa? Perlu narasumber (arkeolog/BPCB) atau Bu Heny sudah punya datanya?
2. **Tahun-tahun pasti** — kapan situs ditemukan, kapan ekskavasi dilakukan, kapan ditetapkan sebagai cagar budaya? Ini krusial untuk Timeline.
3. **Jumlah & lokasi titik QR** — selain 4 titik di brief (Fondasi, Batu Penyusun, Area Ekskavasi, Status Cagar Budaya), apakah ada titik lain yang mau ditambahkan?
4. **Siapa yang cetak & pasang QR fisik di lokasi?** — developer, Bu Heny, atau pihak BPCB?
5. **Koneksi internet di lokasi** — situs ini perlu dicek apakah sinyal internet di lokasi (Sleman) cukup stabil untuk load AR, atau perlu strategi offline-first/caching?
6. **Akses lokasi untuk ambil data GPS presisi** — developer perlu izin masuk dan waktu luang untuk survei lapangan, ambil koordinat tiap titik pakai GPS HP
7. **Deadline & budget** — sama seperti sebelumnya, perlu kepastian timeline dan skema honor

---

## 9. Catatan Teknis Penting

- **AR.js Location-based wajib HTTPS + izin GPS + izin kamera** — ketiganya harus diizinkan user. Vercel otomatis kasih HTTPS.
- **Akurasi GPS HP biasa** sekitar 5-15 meter — untuk situs sekecil ini (~8x9.5m), titik-titik AR bisa saling "tumpang tindih" kalau GPS kurang presisi. Mitigasi: kombinasikan dengan **device orientation** (kompas HP) supaya titik AR muncul di arah yang benar relatif ke user, bukan cuma jarak GPS.
- **A-Frame & AR.js tidak compatible langsung dengan App Router SSR** — load via `next/script` dengan strategy `beforeInteractive`, dan pastikan komponen AR punya `'use client'` di paling atas.
- **QR code generation** — pastikan tiap QR meng-encode full URL (bukan cuma ID), supaya saat discan kamera HP biasa, browser langsung tahu mau buka ke mana.
- **Testing wajib di HP asli, langsung di lokasi** — AR.js Location-based **tidak bisa ditest akurat dari rumah/kos**, karena GPS butuh koordinat asli di lapangan. Simulasi GPS di browser desktop tidak representatif.
- **iOS Safari** — butuh izin eksplisit untuk `DeviceOrientationEvent`, beda dari Android. Pastikan ada UI yang minta izin ini secara jelas (tombol "Aktifkan Kompas" sebelum AR jalan).
- **Cuaca & pencahayaan outdoor** — testing sebaiknya dilakukan di siang hari dengan kondisi cahaya terang, karena itu kondisi nyata pengunjung akan memakai app ini.

---

## 10. Referensi & Sumber

- AR.js docs (Location-based): https://ar-js-org.github.io/AR.js-Docs/
- AR.js Studio (no-code AR builder): https://ar-js-org.github.io/studio/
- A-Frame docs: https://aframe.io/docs/
- qrcode.react (npm): https://www.npmjs.com/package/qrcode.react
- Data resmi candi: https://jogjacagar.jogjaprov.go.id/detail/522/displayrecords-i-nama-warisan
- Wikipedia Candi Klodangan: https://id.wikipedia.org/wiki/Candi_Klodangan
- Google Fonts (Playfair Display + Inter): https://fonts.google.com

---

*Plan v2 — disusun berdasarkan brief resmi Bu Heny via WhatsApp ("Jelajah Edukasi AR Candi Klodangan"). Menggantikan plan v1 (virtual tour 360° + AR scan generik) karena scope sudah lebih spesifik: QR per titik + AR location-based + Timeline + Edukasi Arkeologi dalam satu web terintegrasi.*