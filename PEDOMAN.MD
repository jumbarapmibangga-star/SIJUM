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
| Koordinator |	Kelola event, verifikasi, koreksi, kontrol aula |
| Admin Event |	Kelola data event-nya |
| Juri |	Input presensi (Scan QR), input nilai pos yang ditugaskan; tidak bisa edit setelah locked |
| Kontingen |	Daftar peserta, submit, lihat status |
| Publik |	Papan juara, histori peran, papan tergiat, verifikasi QR (jika publikasi aktif) |

## 5. Skema Database
### 5.1 Tabel Inti
| Tabel	| Field Kunci |
| ----- | ----------- |
| event |	id, tahun, nama, status, pendaftaran_tutup_pada, pendaftaran_status, aula_mode, aula_pesan, urutan_pos_locked, publikasi_nilai |
| tingkat |	id, nama (Mula/Madya/Wira) |
| sekolah |	id, nama |
| peserta_master | id, kode_peserta, nama, sekolah_id, tgl_lahir |
| peserta_event	| id, event_id, peserta_master_id, tim_id, tingkat_id, peran_utama |
| tim |	id, event_id, nama_tim, sekolah_id, tingkat_id, kode_kontingen, kontingen_event_id
| kontingen_event	| id, event_id, akun_id, nama_kontingen, tingkat_id, status, verified_at, verified_by
| pos |	id, event_id, kode_pos, nama_pos, urutan, jumlah_juri (≥0), metode_hitung, agregasi_komponen (tidak_ada/normalisasi_bobot), komponen (untuk sub-pos: teori/praktik/... — null untuk pos biasa), total_maks, pakai_timer, pakai_bidak, prioritas_tierbreaker, induk_pos_id, is_aktif, config_locked, locked_at, locked_by
| pos_komponen |	id, pos_id, nama, bobot (0–1), urutan — Σ bobot = 1 (validasi config_locked)
| juri |	id, user_id, username, nama, is_aktif
| juri_pos |	juri_id, pos_id, slot (null/juri1/juri2/juri3/...) — unique (pos_id, slot); satu juri boleh di banyak pos
| rubrik |	id, pos_id, nama_item, skor_maksimal, opsi_preset, urutan, is_bidak, komponen (text, merujuk pos_komponen.nama, null untuk agregasi_komponen = tidak_ada)
| penilaian_pos |	id, event_id, tim_id, pos_id, nilai_final, status (menunggu_juri/final/direvisi), jumlah_juri_submit, jumlah_juri_wajib, pdf_url, qr_url, pernah_direvisi, locked_at — unique (event_id, tim_id, pos_id)
| penilaian_juri | id, penilaian_pos_id, juri_id, slot_juri, nilai_juri, status (draft/locked), locked_at — unique (penilaian_pos_id, slot_juri)
| penilaian_detail |	id, penilaian_juri_id, rubrik_id, nilai — unique (penilaian_juri_id, rubrik_id)
| presensi_peserta |	id, penilaian_pos_id, peserta_event_id, kode_peserta, discan_oleh, waktu_scan — unique (penilaian_pos_id, peserta_event_id)
| tierbreaker |	id, penilaian_pos_id, jenis (timer/bidak), waktu_mulai_server, waktu_selesai_server, waktu_detik, bidak_petak, status, alasan — unique (penilaian_pos_id, jenis)
| koreksi_nilai |	id, penilaian_pos_id, jenis_koreksi, level_koreksi (item_rubrik/nilai_juri/nilai_final), referensi_id, data_lama (jsonb), data_baru (jsonb), alasan, oleh, waktu
| histori_peran |	id, event_id, peserta_event_id, peserta_master_id, pos_id, peran
| urutan_pos |	id, event_id, tingkat_id, pos_id, urutan, locked_at
| audit_log |	id, waktu, user_id, user_role, username, kategori, aksi, entitas, entitas_id, data_lama, data_baru, alasan, ip_address, user_agent |

Catatan revisi v1.5:
- presensi_peserta ditambahkan untuk mencatat kehadiran peserta per pos via scan QR.
- Tierbreaker Umur ditambahkan sebagai opsi penentu akhir.

### 5.2 View & Fungsi
| Nama |	Jenis	| Fungsi |
| ---- | ------ | ----- |
| v_nilai_pos_final |	View |	Nilai final per tim per pos, sesuai metode_hitung (via fn_hitung_nilai_final) |
| v_nilai_pos_gabungan |	View |	Nilai gabungan pos induk (via fn_hitung_nilai_gabungan)
| v_penilaian_aula |	View |	Nilai locked per pos, urut kode kontingen (tanpa perangkingan)
| v_tracking_panitia |	View |	Status per tim × pos per juri (status-only, jsonb status_per_juri)
| v_peserta_tergiat |	View |	Peringkat peserta berdasarkan jumlah kehadiran (scan) terbanyak
| fn_hitung_nilai_final(penilaian_pos_id) |	Fungsi |	Hitung nilai final per pos (7 metode + weighted N komponen)
| fn_hitung_nilai_gabungan(tim_id, pos_induk_id) |	Fungsi |	Hitung nilai gabungan pos induk (dari sub-pos)
| fn_hitung_nilai_sub(penilaian_pos_id) |	Fungsi |	Hitung nilai final sub-pos (sum/average/...)
| fn_hitung_rata_rata_umur(tim_id) |	Fungsi |	Hitung rata-rata usia tim (dari peserta_master.tgl_lahir) untuk tierbreaker
| fn_juara_pos(event_id, tingkat_id) |	Fungsi |	Peringkat per pos per tingkat
| fn_juara_umum(event_id, tingkat_id) |	Fungsi |	Perangkingan leksikografis dinamis (jumlah pos tak terbatas)
| v_verifikasi |	View |	Data halaman verifikasi QR
| v_histori_peran	| View |	Histori peran peserta lintas tahun (join peserta_master) |

### 5.3 RLS (Ringkas)
| Role |Akses |
| Super Admin |	Semua
| Koordinator |	Semua kecuali kelola user
| Admin Event	| Data event-nya
| Juri |	Hanya pos yang ditugaskan; insert presensi & penilaian; tidak bisa update/delete setelah locked
| Kontingen |	Data sendiri; submit pendaftaran
| Publik |	Hanya view publik (read-only)

