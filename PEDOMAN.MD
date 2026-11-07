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
### 3.4 File Konfigurasi Penting

manifest.json:
```html
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
sw.js (network-first untuk HTML dinamis, cache-first untuk asset statis):

```html
const CACHE_NAME = 'jumbara-v1.5';
const STATIC_ASSETS = [
  '/', '/index.html', '/manifest.json',
  '/assets/css/custom.css', '/assets/js/supabase-client.js',
  '/assets/js/auth.js', '/assets/js/utils.js',
  '/assets/img/logo.png', '/offline.html'
];
const DYNAMIC_HTML = [
  '/dashboard-aula.html', '/dashboard-tracker.html',
  '/dashboard-laporan.html', '/verifikasi.html',
  '/portal-kontingen.html', '/admin/', '/juri/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('supabase.co')) return;

  // Network-first untuk HTML dinamis
  const isDynamicHtml = DYNAMIC_HTML.some((p) => url.pathname.startsWith(p));
  if (isDynamicHtml) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  // Cache-first untuk asset statis
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => caches.match('/offline.html'))
  );
});
```
vercel.json:

```html
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;"
        },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```
assets/js/supabase-client.js:

```html
const SUPABASE_URL = 'https://xxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```
Catatan: anon key aman di frontend hanya jika RLS aktif. service_role key tidak boleh ada di sini.

### 3.5 Alur Deploy
```text
1. Push kode ke GitHub (private)
   ↓
2. Vercel otomatis detect & deploy
   ↓
3. Dapat URL: https://jumbara-purbalingga.vercel.app
   ↓
4. Aktifkan Vercel Authentication
   ↓
5. Uji PWA installable di HP/PC
   ↓
6. Uji service worker (offline)
   ↓
7. Uji CSP (tidak ada error di console)
```
## 4. Aktor & Hak Akses
| Aktor |	Hak Akses |
| ----- | --------- |
|Super Admin | Semua, kelola user, buka kunci, ekspor audit log |
Koordinator	Kelola event, verifikasi, koreksi, kontrol aula
Admin Event	Kelola data event-nya
Juri	Input presensi (Scan QR), input nilai pos yang ditugaskan; tidak bisa edit setelah locked
Kontingen	Daftar peserta, submit, lihat status
Publik	Papan juara, histori peran, papan tergiat, verifikasi QR (jika publikasi aktif)


