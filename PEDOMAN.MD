# PEDOMAN PROYEK — APLIKASI JUMBARA PMI KABUPATEN PURBALINGGA

**Versi:** 1.5 (Final — Revisi Skema Penilaian, Generalisasi Komponen, Presensi QR, Tierbreaker Umur, Role Panitia)
**Tanggal:** 7 November 2026
**Status:** 100% Terkunci — Siap Coding (setelah 17 prasyarat §13.1 disetujui)
**Repositori:** `jumbara-purbalingga` (private)
**Hosting:** Vercel
**Database:** Supabase

---

## 1. Ringkasan Eksekutif

Aplikasi Jumbara PMI Kabupaten Purbalingga adalah **PWA (Progressive Web App)** untuk mengelola lomba tahunan, dengan fokus pada:

- **Histori peran peserta per tahun** (narator, pelaku praktik, dll).
- **Pos tak terbatas** dengan kriteria fleksibel.
- **Sub-pos tak terbatas** per induk, kedalaman pohon tak terbatas.
- **Komponen tak terbatas** (teori, praktik, wawancara, ...) via `pos_komponen`.
- **Jumlah juri fleksibel** (0, 1, 2, 3, ...) — termasuk **0 untuk pos induk** yang jurinya di sub-pos.
- **Metode hitung nilai fleksibel** (7 metode + `weighted` dengan komponen tak terbatas).
- **Penggabungan pos fleksibel** via `induk_pos_id`.
- **Juri melekat di pos mana pun** via `juri_pos` (satu juri, banyak pos, slot berbeda).
- **Timer, bidak, & umur di pos mana pun** (shared per tim per pos).
- **Presensi Peserta via Scan QR** (mencari peserta tergiat, mengakomodasi 1 tim ikut banyak lomba).
- **Koreksi hanya oleh panitia** dengan jejak audit berlevel.
- **Cetak thermal 58mm Bluetooth** + QR ke halaman verifikasi.
- **Dashboard tracker status-only** & **dashboard aula tanpa perangkingan**.
- **Audit log append-only**.
- **10 laporan panitia + 3 laporan publik**.

**Teknologi:** HTML murni + vanilla JS + Tailwind CDN + Supabase + Vercel + PWA.

---

## 2. Prinsip Inti

> **Semua fleksibel, diatur di database, bukan di kode.**
>
> - Pos **tak terbatas** — tambah kapan saja sebelum `config_locked`.
> - Sub-pos **tak terbatas** per induk, kedalaman pohon **tak terbatas**.
> - Komponen **tak terbatas** (teori, praktik, wawancara, ...) via `pos_komponen`.
> - Jumlah juri **fleksibel per pos** (0, 1, 2, 3, ...).
> - Metode hitung **fleksibel per pos**.
> - **Juri melekat di pos mana pun** — satu juri bisa di >1 pos, slot berbeda.
> - **Timer, bidak, & umur bisa di pos mana pun**.
> - Konfigurasi pos **dikunci setelah lomba mulai**, tercatat di audit log.

---

## 3. Teknologi

### 3.1 Tabel Teknologi

| Komponen | Teknologi | Cara Muat | Alasan |
|---|---|---|---|
| Frontend | HTML5 murni | File `.html` | Sederhana, konsisten, mudah dirawat |
| CSS | Tailwind CSS | CDN | Cepat, tanpa build |
| JavaScript | Vanilla JS (ES6+) | File `.js` | Tanpa framework, ringan |
| Database | Supabase (PostgreSQL) | CDN `@supabase/supabase-js` | Relasional, RLS, Auth, Storage, Realtime |
| Auth | Supabase Auth | Bagian Supabase client | Username + password, multi-device |
| Storage | Supabase Storage | Bagian Supabase client | PDF, logo, sertifikat |
| Realtime | Supabase Realtime | Bagian Supabase client | Dashboard live, fallback polling |
| Cetak thermal | Web Bluetooth (ESC/POS) | Native browser API | Langsung ke printer 58mm |
| Scan QR (Presensi)| `html5-qrcode` / `jsQR` | CDN | Kamera HP juri untuk scan presensi |
| Fallback cetak | `window.print()` + CSS `@media print` | Native browser | Jika Bluetooth gagal |
| QR code | `qrcodejs` | CDN | Generate QR lokal |
| PDF | `jsPDF` + `html2canvas` | CDN | Laporan kecil di client |
| PDF massal | Supabase Edge Function | Deno | Sertifikat massal |
| Ikon | Font Awesome 6 | CDN | Ikon lengkap |
| PWA | `manifest.json` + `sw.js` | File statis | Installable, offline |
| Repositori | GitHub (private) | — | Version control |
| Hosting | Vercel | Deploy dari GitHub | HTTPS, CDN, gratis |
| Build step | ❌ Tidak ada | — | Tanpa npm, tanpa bundler |
| Framework JS | ❌ Tidak ada | — | HTML murni + vanilla JS |

### 3.2 Cara Muat Library (CDN)

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal Juri — Jumbara PMI Purbalingga</title>
  
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#DC2626">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
  <script src="https://unpkg.com/html5-qrcode"></script> <!-- Untuk scan QR -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body>
  <!-- konten -->
  
  <script src="assets/js/supabase-client.js"></script>
  <script src="assets/js/auth.js"></script>
  <script src="assets/js/utils.js"></script>
</body>
</html>

{
  "id": "/",
  "name": "Jumbara PMR Mula Ke-4 Purbalingga",
  "short_name": "JuriPMR",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#0F172A",
  "theme_color": "#DC2626",
  "icons": [
    { "src": "assets/img/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/img/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "assets/img/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Portal Juri", "url": "/login.html?role=juri" },
    { "name": "Dashboard Aula", "url": "/dashboard-aula.html" },
    { "name": "Verifikasi QR", "url": "/verifikasi.html" }
  ]
}
```
### 3.3 Struktur Folder
```text
jumbara-purbalingga/
├── index.html
├── login.html
├── portal-kontingen.html
├── dashboard-aula.html
├── dashboard-tracker.html
├── dashboard-laporan.html
├── verifikasi.html
├── offline.html
├── admin/
│   ├── dashboard.html
│   ├── pos.html
│   ├── kontingen.html
│   ├── juri.html
│   ├── juara.html
│   ├── koreksi.html
│   ├── cetak-qr.html
│   ├── users.html
│   └── audit.html
├── juri/
│   ├── pos.html
│   ├── tim.html
│   ├── penilaian.html
│   ├── riwayat.html
│   └── aktivitas.html
├── assets/
│   ├── css/
│   │   └── custom.css
│   ├── js/
│   │   ├── supabase-client.js
│   │   ├── auth.js
│   │   ├── timer.js
│   │   ├── penilaian.js
│   │   ├── scanner-qr.js
│   │   ├── cetak-thermal.js
│   │   ├── qr.js
│   │   ├── pdf.js
│   │   └── utils.js
│   └── img/
│       ├── logo.png
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-maskable-512.png
├── manifest.json
├── sw.js
├── vercel.json
├── .gitignore
├── README.md
└── PEDOMAN.md
```
