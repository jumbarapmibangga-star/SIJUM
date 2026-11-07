PEDOMAN.md v1.2 — File Lengkap Terbaru untuk GitHub
Berikut file lengkap PEDOMAN.md v1.2. Copy-paste seluruh isi di bawah ini ke PEDOMAN.md di GitHub (replace semua).

markdown
# PEDOMAN PROYEK — APLIKASI JUMBARA PMI KABUPATEN PURBALINGGA

**Versi:** 1.2 (Final — Revisi Skema Penilaian, Generalisasi Komponen, Keputusan Teknis, Aturan Cetak Thermal)
**Tanggal:** 7 November 2026
**Status:** 100% Terkunci — Siap Coding (setelah 15 prasyarat §13.1 disetujui)
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
- **Timer & bidak di pos mana pun** (shared per tim per pos).
- **Koreksi hanya oleh panitia** dengan jejak audit berlevel.
- **Cetak thermal 58mm Bluetooth** + QR ke halaman verifikasi.
- **Dashboard tracker status-only** & **dashboard aula tanpa perangkingan**.
- **Audit log append-only**.
- **9 laporan panitia + 2 laporan publik**.

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
> - **Timer & bidak bisa di pos mana pun**.
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
3.3 Struktur Folder
text
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
│   ├── pos.html
│   ├── kontingen.html
│   ├── juri.html
│   ├── juara.html
│   ├── koreksi.html
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
3.4 File Konfigurasi Penting
manifest.json:

json
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
sw.js (network-first untuk HTML dinamis, cache-first untuk asset statis):

javascript
const CACHE_NAME = 'jumbara-v1.2';
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
vercel.json:

json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;"
        },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
assets/js/supabase-client.js:

javascript
const SUPABASE_URL = 'https://xxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
Catatan: anon key aman di frontend hanya jika RLS aktif. service_role key tidak boleh ada di sini.

3.5 Alur Deploy
text
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
4. Aktor & Hak Akses
Aktor	Hak Akses
Super Admin	Semua, kelola user, buka kunci, ekspor audit log
Koordinator	Kelola event, verifikasi, koreksi, kontrol aula
Admin Event	Kelola data event-nya
Juri	Input nilai pos yang ditugaskan; tidak bisa edit setelah locked
Kontingen	Daftar peserta, submit, lihat status
Publik	Papan juara, histori peran, verifikasi QR (jika publikasi aktif)
5. Skema Database
5.1 Tabel Inti
Tabel	Field Kunci
event	id, tahun, nama, status, pendaftaran_tutup_pada, pendaftaran_status, aula_mode, aula_pesan, urutan_pos_locked, publikasi_nilai
tingkat	id, nama (Mula/Madya/Wira)
sekolah	id, nama
peserta_master	id, kode_peserta, nama, sekolah_id, tgl_lahir
peserta_event	id, event_id, peserta_master_id, tim_id, tingkat_id, peran_utama
tim	id, event_id, nama_tim, sekolah_id, tingkat_id, kode_kontingen, kontingen_event_id
kontingen_event	id, event_id, akun_id, nama_kontingen, tingkat_id, status, verified_at, verified_by
pos	id, event_id, kode_pos, nama_pos, urutan, jumlah_juri (≥0), metode_hitung, agregasi_komponen (tidak_ada/normalisasi_bobot), komponen (untuk sub-pos: teori/praktik/... — null untuk pos biasa), total_maks, pakai_timer, pakai_bidak, prioritas_tierbreaker, induk_pos_id, is_aktif, config_locked, locked_at, locked_by
pos_komponen	id, pos_id, nama, bobot (0–1), urutan — Σ bobot = 1 (validasi config_locked)
juri	id, user_id, username, nama, is_aktif
juri_pos	juri_id, pos_id, slot (null/juri1/juri2/juri3/...) — unique (pos_id, slot); satu juri boleh di banyak pos
rubrik	id, pos_id, nama_item, skor_maksimal, opsi_preset, urutan, is_bidak, komponen (text, merujuk pos_komponen.nama, null untuk agregasi_komponen = tidak_ada)
penilaian_pos	id, event_id, tim_id, pos_id, nilai_final, status (menunggu_juri/final/direvisi), jumlah_juri_submit, jumlah_juri_wajib, pdf_url, qr_url, pernah_direvisi, locked_at — unique (event_id, tim_id, pos_id)
penilaian_juri	id, penilaian_pos_id, juri_id, slot_juri, nilai_juri, status (draft/locked), locked_at — unique (penilaian_pos_id, slot_juri)
penilaian_detail	id, penilaian_juri_id, rubrik_id, nilai — unique (penilaian_juri_id, rubrik_id)
tierbreaker	id, penilaian_pos_id, jenis (timer/bidak), waktu_mulai_server, waktu_selesai_server, waktu_detik, bidak_petak, status, alasan — unique (penilaian_pos_id, jenis)
koreksi_nilai	id, penilaian_pos_id, jenis_koreksi, level_koreksi (item_rubrik/nilai_juri/nilai_final), referensi_id, data_lama (jsonb), data_baru (jsonb), alasan, oleh, waktu
histori_peran	id, event_id, peserta_event_id, peserta_master_id, pos_id, peran
urutan_pos	id, event_id, tingkat_id, pos_id, urutan, locked_at
audit_log	id, waktu, user_id, user_role, username, kategori, aksi, entitas, entitas_id, data_lama, data_baru, alasan, ip_address, user_agent
Catatan revisi v1.1/v1.2:

penilaian dipecah 3 tabel: penilaian_pos (induk per tim per pos) → penilaian_juri (per juri) → penilaian_detail (per rubrik per juri).

tierbreaker merujuk penilaian_pos_id (shared per tim per pos), bukan per juri.

pos.agregasi_komponen menggantikan mode_komponen enum.

pos_komponen tabel terpisah menggantikan pos.bobot_teori/bobot_praktik.

pos.komponen untuk sub-pos menandai komponennya.

rubrik.komponen merujuk pos_komponen.nama.

jumlah_juri >= 0 — 0 diizinkan untuk pos induk.

koreksi_nilai berlevel + jsonb.

histori_peran punya peserta_master_id.

5.2 View & Fungsi
Nama	Jenis	Fungsi
v_nilai_pos_final	View	Nilai final per tim per pos, sesuai metode_hitung (via fn_hitung_nilai_final)
v_nilai_pos_gabungan	View	Nilai gabungan pos induk (via fn_hitung_nilai_gabungan)
v_penilaian_aula	View	Nilai locked per pos, urut kode kontingen (tanpa perangkingan)
v_tracking_panitia	View	Status per tim × pos per juri (status-only, jsonb status_per_juri)
fn_hitung_nilai_final(penilaian_pos_id)	Fungsi	Hitung nilai final per pos (7 metode + weighted N komponen)
fn_hitung_nilai_gabungan(tim_id, pos_induk_id)	Fungsi	Hitung nilai gabungan pos induk (dari sub-pos)
fn_hitung_nilai_sub(penilaian_pos_id)	Fungsi	Hitung nilai final sub-pos (sum/average/...)
fn_juara_pos(event_id, tingkat_id)	Fungsi	Peringkat per pos per tingkat
fn_juara_umum(event_id, tingkat_id)	Fungsi	Perangkingan leksikografis dinamis (jumlah pos tak terbatas)
v_verifikasi	View	Data halaman verifikasi QR
v_histori_peran	View	Histori peran peserta lintas tahun (join peserta_master)
5.3 RLS (Ringkas)
Role	Akses
Super Admin	Semua
Koordinator	Semua kecuali kelola user
Admin Event	Data event-nya
Juri	Hanya pos yang ditugaskan (via juri_pos, slot cocok); insert penilaian; tidak bisa update/delete setelah locked
Kontingen	Data sendiri; submit pendaftaran
Publik	Hanya view publik (read-only)
6. Aturan Bisnis
6.1 Portal Pendaftaran Kontingen
Self-service: kontingen daftar akun, isi tim & peserta, submit.

Satu kontingen satu tingkat per event.

Verifikasi per kontingen oleh panitia.

Setelah verified, data terkunci.

Penutupan pendaftaran: otomatis (tanggal) + manual (panitia), manual menang.

6.2 Kriteria Pos (Fleksibel)
Field	Keterangan
jumlah_juri	0, 1, 2, 3, dst. — 0 diizinkan untuk pos induk yang jurinya di sub-pos
metode_hitung	sum, average, percentage, sum_juri, average_juri, percentage_juri, weighted
agregasi_komponen	tidak_ada / normalisasi_bobot
komponen	Untuk sub-pos: teori/praktik/... — null untuk pos biasa
pakai_timer	Boolean
pakai_bidak	Boolean
prioritas_tierbreaker	bidak_dulu / timer_dulu
induk_pos_id	Opsional — membentuk pohon pos
total_maks	Untuk percentage (≥ Σ skor_maksimal rubrik)
Validasi config_locked:

jumlah_juri >= 0.

Minimal satu komponen nilai aktif (rubrik ada).

agregasi_komponen = 'normalisasi_bobot' → metode_hitung = 'weighted', pos_komponen terisi, Σ bobot = 1, minimal satu rubrik per komponen.

agregasi_komponen = 'tidak_ada' → rubrik.komponen = null.

percentage → total_maks >= Σ skor_maksimal.

6.3 Metode Hitung Nilai
Metode	Rumus
sum	Σ nilai per soal
average	Σ nilai / jumlah soal
percentage	(Σ nilai / total_maks) × 100
sum_juri	Σ total juri1 + juri2 + ...
average_juri	(Σ total juri) / jumlah_juri
percentage_juri	(Σ total juri) / (jumlah_juri × total_maks) × 100
weighted	Lihat §6.3.2
Aturan umum:

sum_juri / average_juri / percentage_juri — wajib semua juri submit sebelum final (Opsi A).

Nilai final pos dihitung via fn_hitung_nilai_final.

6.3.1 Agregasi Komponen (agregasi_komponen)
Nilai	Arti	Struktur
tidak_ada	Pos tanpa komponen teori/praktik	metode_hitung bebas, rubrik.komponen = null
normalisasi_bobot	Pos dengan komponen (teori, praktik, wawancara, ...)	metode_hitung = 'weighted', pos_komponen terisi, rubrik.komponen merujuk pos_komponen.nama
Tiga pola konfigurasi (semua didukung, bukan mode kaku):

Pola 1 — Satu pos, banyak komponen, juri sama:

text
POS-X (agregasi_komponen = normalisasi_bobot, weighted, jumlah_juri = N)
  ├── pos_komponen: teori (0.3), praktik (0.7)
  └── rubrik dengan komponen = teori/praktik
Juri → POS-X (slot juri1..juriN)
Pola 2 — Pos induk + sub-pos, juri terpisah (bisa >2 sub-pos):

text
POS-Y (induk, agregasi_komponen = normalisasi_bobot, weighted, jumlah_juri = 0)
  ├── POS-Y-T (sub, komponen = teori, sum, jumlah_juri = 1)
  ├── POS-Y-P (sub, komponen = praktik, sum, jumlah_juri = 2)
  └── POS-Y-W (sub, komponen = wawancara, sum, jumlah_juri = 1)
  pos_komponen: teori (0.3), praktik (0.5), wawancara (0.2)
Juri → sub-pos masing-masing via juri_pos
Pola 3 — Juri sama di beberapa pos terpisah:

text
POS-A (sum, jumlah_juri = 1)
POS-B (sum, jumlah_juri = 1)
Juri X → POS-A (juri1) dan POS-B (juri1)  ← via juri_pos
Prinsip: tidak ada batasan jumlah pos, sub-pos, komponen, atau juri per pos. Semua diatur data (pos, pos_komponen, juri_pos), bukan kode.

6.3.2 Rumus weighted (Generalisasi N Komponen)
text
untuk setiap komponen k di pos_komponen:
  normal_k = (Σ_i Σnilai_k_juri_i / N) / maks_k × 100
  kontribusi_k = normal_k × bobot_k

nilai_final = Σ_k kontribusi_k
N = jumlah juri submit (locked) di pos/sub-pos terkait.

maks_k = Σ skor_maksimal rubrik dengan komponen = k.

Σ bobot_k = 1.

Normalisasi per komponen + rata-rata lintas juri.

Untuk pos induk (juri di sub-pos): nilai_final = Σ (normalisasi nilai sub-pos × bobot komponen).

Catatan:

Wajib minimal satu rubrik per komponen di pos_komponen.

Jika hanya satu komponen, paksa bobot = 1 dan metode = sum/average (bukan weighted).

Tidak menormalisasi skala global; normalisasi per komponen sudah menyerap perbedaan skala.

6.4 Tierbreaker
Timer & bidak adalah shared per tim per pos (bukan per juri). Disimpan di tierbreaker dengan penilaian_pos_id.

text
Timer:
  - Di-start oleh juri pertama yang membuka form penilaian pos-tim.
  - Di-stop oleh juri terakhir yang submit (status → locked).
  - Disimpan: waktu_mulai_server, waktu_selesai_server, waktu_detik.

Bidak:
  - Diinput satu kali per tim per pos (oleh juri slot 1 atau panitia).
  - Disimpan: bidak_petak.

Aturan tiebreak:
Jika nilai_pos_total sama:
  Jika pakai_bidak dan pakai_timer:
    → Bidak dulu → lalu timer (default), atau sesuai prioritas_tierbreaker
  Jika hanya bidak: → Bidak
  Jika hanya timer: → Timer
  Jika masih sama → fallback (shared rank / keputusan panitia, tercatat di audit)

Timer & bidak tidak masuk nilai_pos_total.
Catatan pos induk + sub-pos:

Timer/bidak di sub-pos (-T, -P, ...), bukan induk.

Tierbreaker induk hanya fallback jika nilai gabungan sama.

6.5 Aturan Juara per Pos
text
Untuk setiap pos utama (induk_pos_id = null), per tingkat:
  1. Hitung nilai (fn_hitung_nilai_final untuk pos biasa;
     fn_hitung_nilai_gabungan untuk pos induk dengan sub-pos)
  2. Urutkan DESC
  3. Jika sama → tierbreaker
  4. Jika masih sama → fallback
  5. Ambil 1, 2, 3 → Juara 1, 2, 3
Catatan:

Hanya pos induk (induk_pos_id = null) yang masuk perangkingan juara pos.

Sub-pos sudah terwakili di nilai gabungan induk.

Implementasi: fn_juara_pos(event_id, tingkat_id).

6.6 Aturan Juara Umum
text
Untuk setiap tingkat:
  1. Pastikan semua peringkat per pos final (locked)
  2. Ambil urutan pos yang ditetapkan panitia (urutan_pos)
  3. Bandingkan tim secara leksikografis:
     - Pos prioritas 1: peringkat lebih kecil menang
     - Jika sama → pos prioritas 2
     - ... sampai semua pos
  4. Jika masih sama → fallback:
     a. Timer total (akumulasi waktu tierbreaker timer)
     b. Usia lebih muda (rata-rata tanggal lahir anggota)
     c. Keputusan panitia (tercatat di audit)
  5. Hasil: Juara umum 1, 2, 3
Catatan:

Hanya pos induk yang masuk leksikografis.

Tim tidak ikut pos → peringkat terbawah = jumlah_tim_tingkat + 1 (konsisten).

Implementasi: fn_juara_umum(event_id, tingkat_id) — fungsi dinamis, bukan view.

6.7 Alur Juri
Pos jumlah_juri = 1:

text
Login → pilih pos → lihat tim belum dinilai
   ↓
Pilih tim → start timer (jika pakai_timer)
   ↓
Form rubrik (1 kolom nilai)
   ↓
Stop timer → simpan (locked) → penilaian_pos.status = final
   ↓
Tim hilang dari dropdown semua juri pos ini
   ↓
Generate PDF + QR → cetak thermal
Pos jumlah_juri = 2+:

text
Login → pilih pos → lihat tim belum dinilai lengkap
   ↓
Pilih tim → start timer (jika pakai_timer, jika belum di-start juri lain)
   ↓
Form rubrik (kolom sesuai slot juri yang login)
   ↓
Isi nilai → simpan (locked) → penilaian_juri.status = locked
   ↓
Trigger update penilaian_pos:
   - jika semua juri submit → status = final, locked_at = now()
   - jika belum → status = menunggu_juri
   ↓
Tim hilang dari dropdown setelah status = final
   ↓
Nilai final dihitung via fn_hitung_nilai_final
   ↓
Generate PDF + QR → cetak thermal (setelah semua juri submit)
Aturan wajib: nilai final pos hanya dihitung setelah semua juri submit (Opsi A).

Pos induk (juri di sub-pos):

Juri melihat sub-pos yang ditugaskan (-T, -P, ...).

Nilai sub-pos final → induk dihitung via fn_hitung_nilai_gabungan.

Struk induk dicetak setelah semua sub-pos final.

Juri non-digital: didampingi panitia/relawan, device khusus, UI sederhana, tombol "Minta Bantuan".

6.8 Koreksi
Juri tidak bisa edit setelah simpan (langsung locked).

Panitia bisa koreksi dengan jejak berlevel:

level_koreksi = item_rubrik → koreksi satu nilai rubrik (referensi_id = penilaian_detail.id)

level_koreksi = nilai_juri → koreksi total juri (referensi_id = penilaian_juri.id)

level_koreksi = nilai_final → koreksi nilai final pos (referensi_id = penilaian_pos.id)

data_lama / data_baru disimpan sebagai jsonb

Regenerate PDF setelah koreksi.

QR lama menampilkan "DIREVISI" + nilai terbaru.

Cetak ulang opsional dengan watermark "REVISI".

Timer/bidak bisa dikoreksi dengan alasan + verifikasi.

Konfigurasi pos dikunci setelah lomba mulai.

6.9 Cetak Thermal
Spesifikasi:

58mm, Bluetooth, ESC/POS.

QR ke halaman verifikasi (/verifikasi/{penilaian_pos_id}), 25×25mm, tanpa logo.

Fallback window.print() jika Bluetooth gagal.

Menu cetak ulang dari server.

Struk POS 2+ juri menampilkan total per juri + hasil akhir.

Struk hanya dicetak setelah semua juri submit (pos 2+ juri).

Struk pos induk dicetak setelah semua sub-pos final; menampilkan gabungan komponen.

Device standar juri = Android (Chrome). iOS Safari tidak mendukung Web Bluetooth.

Fallback window.print() wajib diuji di gladi.

Struk thermal diregenerate dari data saat cetak ulang (bukan simpan gambar).

PDF A4 laporan disimpan di Storage; struk thermal tidak.

Aturan siapa yang cetak (pos 2+ juri):

Juri terakhir yang submit → otomatis dapat tombol "Cetak Struk" di halaman sukses submit.

Juri lain (submit lebih awal) → tidak dapat tombol saat submit; bisa cetak ulang dari menu Riwayat & Cetak Ulang setelah status final.

Panitia → selalu bisa cetak ulang dari menu Cetak Ulang (device khusus di lokasi).

Struk yang dicetak = struk yang sama (dari penilaian_pos, bukan per juri) — menampilkan total per juri + hasil akhir.

Juri non-digital → didampingi relawan/panitia; panitia yang cetak.

Format struk (satu struk per tim per pos):

text
================================
JUMBARA PMR MULA KE-4
PMI KABUPATEN PURBALINGGA
================================
POS: POS-03 (Lomba Gabungan)
Tim: MU-05 — SD N 1 Purbalingga
Tingkat: Mula
--------------------------------
NILAI PER JURI:
  Juri 1 (Budi):     85.50
  Juri 2 (Sari):     90.00
--------------------------------
NILAI AKHIR:         87.75
(metode: average_juri)
--------------------------------
Waktu: 12:34:56
================================
[QR CODE]
Verifikasi: /verifikasi/{penilaian_pos_id}
================================
Catatan:

Struk sama untuk semua juri (bukan struk per juri).

Menampilkan total per juri + nilai akhir.

QR ke halaman verifikasi penilaian_pos (bukan per juri).

Untuk pos 1 juri, bagian "NILAI PER JURI" bisa disembunyikan (hanya nilai akhir).

6.10 Dashboard
Tracker Panitia (status-only):

Matriks tim × pos, status per juri.

Filter per tingkat, pos, kontingen.

Highlight pos/tim tertinggal.

Tanpa nilai mentah.

Aula:

Semua nilai per pos, urutan kode kontingen.

Tanpa perangkingan.

Tierbreaker sebagai catatan.

Hanya nilai locked.

9 tema visual, tanpa highlight nilai baru.

Kontrol panitia (mode, pesan, panic button).

Grid harus bisa dibaca dari jauh (uji di gladi).

6.11 Histori Peran
Peserta + peran per tahun (join peserta_master).

Bisa dicari per nama (publik).

6.12 Audit Log
Append-only, tidak bisa edit/hapus.

Mencatat semua aktivitas.

Juri bisa lihat log sendiri.

Percobaan akses ditolak dicatat.

Retensi 5 tahun, backup CSV harian.

ip_address diisi via Edge Function atau client (jangan janji akurasi 100%).

6.13 Menu Laporan
9 laporan panitia:

Rekap Juara Umum

Rekap Juara per Pos

Rekap Nilai per Kontingen

Rekap Nilai per Pos

Detail per Kontingen

Rekap Tierbreaker

Rekap Histori Peran

Log Aktivitas

Sertifikat Peserta

2 laporan publik:

Papan Juara

Histori Peran Peserta

Format: PDF (A4) + CSV.
Generate: On-demand.
Audit: Setiap generate/export tercatat.
Sertifikat: Disimpan di Supabase Storage.

6.14 Keputusan Teknis (Final)
#	Keputusan	Alasan
A	Device juri standar = Android (Chrome)	Web Bluetooth tidak didukung iOS Safari & Firefox.
B	Timer & bidak = shared per tim per pos	Menghindari ambiguitas. Disimpan di tierbreaker.penilaian_pos_id.
C	Nilai final pos = wajib semua juri submit (Opsi A)	Mencegah nilai tidak adil. Status menunggu_juri → final.
D	Penilaian dipecah 3 tabel: penilaian_pos / penilaian_juri / penilaian_detail	Memisahkan nilai final pos dari nilai per juri.
E	Juara umum = hanya pos induk (induk_pos_id = null)	Sub-pos sudah terwakili di nilai gabungan induk.
F	fn_juara_umum = fungsi SQL dinamis, bukan view statis	Jumlah pos tak terbatas.
G	Pos tak terbatas, sub-pos tak terbatas, komponen tak terbatas	Prinsip §2.
H	pos.agregasi_komponen = tidak_ada/normalisasi_bobot	Generalisasi, bukan enum mode kaku.
I	pos_komponen tabel terpisah (bukan bobot_teori/bobot_praktik di pos)	Dukung 3+ komponen.
J	weighted = normalisasi per komponen + rata-rata lintas juri	Adil antar pos dengan jumlah juri berbeda & skala berbeda.
K	pos.komponen untuk sub-pos menandai komponennya	Memudahkan agregasi induk.
L	jumlah_juri >= 0 — 0 diizinkan untuk induk (juri di sub-pos)	Fleksibel.
M	Juri bisa melekat di pos mana pun via juri_pos	Prinsip §2.
N	Struk thermal: pos induk cetak setelah semua sub-pos final	Hindari struk ganda.
O	weighted wajib kedua komponen ada (validasi config_locked)	Cegah nilai hangus.
P	maks_k dihitung dari Σ skor_maksimal rubrik, bukan pos.total_maks	Normalisasi benar.
Q	Koreksi berlevel (item_rubrik/nilai_juri/nilai_final) + jsonb	Fleksibel & auditable.
R	nilai_final dihitung via view/fungsi dulu, materialize jika lambat	Hindari trigger kompleks di awal.
S	Backup: manual CSV harian selama event (kecuali Supabase Pro)	Free tier tidak punya automated backup.
T	Reset password juri via Edge Function admin-reset-password	service_role hanya di Edge Function.
U	Service worker: network-first untuk HTML dinamis, cache-first untuk asset statis	Halaman dashboard harus selalu fresh.
V	Cetak thermal pos 2+ juri: juri terakhir submit otomatis dapat tombol cetak; juri lain & panitia via cetak ulang	Natural, tidak perlu koordinasi. Struk sama untuk semua.
W	Struk thermal = satu struk per tim per pos (bukan per juri) — menampilkan total per juri + nilai akhir; QR ke penilaian_pos	Hindari duplikasi.
7. Akun Juri
Username + password + nama (bukan email, bukan PIN).

Email palsu di Supabase: {username}@jumbara.local.

Admin buat akun → sampaikan username & password manual.

Reset password manual oleh admin (via Edge Function admin-reset-password).

Multi-device login.

Satu orang bisa ditugaskan ke >1 pos via juri_pos.

8. Halaman Aplikasi
text
Publik
├── Beranda / info Jumbara
├── Papan Skor (jika publikasi aktif)
├── Histori Peran Peserta
├── Verifikasi QR
└── Dashboard Aula

Portal Kontingen (login)
├── Dashboard
├── Form Tim & Peserta
└── Submit Verifikasi

Juri (login)
├── Daftar Pos Saya
├── Daftar Tim Belum Dinilai
├── Form Penilaian
├── Cetak Struk
├── Riwayat & Cetak Ulang
└── Aktivitas Saya

Panitia (login)
├── Kelola Event
├── Kelola Pos & Rubrik
├── Verifikasi Kontingen
├── Penugasan Juri
├── Dashboard Tracker
├── Koreksi Nilai
├── Rekap Juara
├── Menu Laporan
├── Kontrol Dashboard Aula
└── Audit Log
9. Design System
Komponen	Spesifikasi
Warna primer	Merah #DC2626
Font	Inter / system sans-serif
Font monospace	JetBrains Mono (timer)
Ikon	Font Awesome 6
Border radius	8px / 12px / 16px
Shadow	shadow-md / shadow-xl
Breakpoint	640px / 768px / 1024px / 1280px
Tema	Terang (default), Gelap (opsional)
10. Keamanan
Aspek	Keputusan
RLS	Aktif di semua tabel
PIN	Dihapus
Password	Hash bcrypt (Supabase Auth)
service_role key	Hanya di Edge Function
CSP	Header via vercel.json
Vercel	Aktifkan Vercel Authentication
MFA	Aktifkan di akun Supabase Super Admin
Audit log	Append-only, retensi 5 tahun
10.1 Catatan Keamanan Tambahan
Aspek	Keputusan
Web Bluetooth	Hanya Chrome/Edge Android/Desktop. iOS Safari & Firefox tidak didukung. Tetapkan device standar juri = Android.
Fallback cetak	window.print() → PDF → printer biasa. Wajib diuji di gladi.
RLS slot_juri	Policy insert penilaian_juri harus cek slot_juri = juri_pos.slot milik juri. Butuh fungsi RLS. Uji di tahap 1.
Reset password	Edge Function admin-reset-password (verifikasi role admin).
audit_log.ip_address	Tidak otomatis diisi Supabase. Isi via Edge Function (x-forwarded-for) atau client. Jangan janji akurasi 100%.
Backup	Free tier = manual CSV harian. Pro = automated. Putuskan sebelum event.
Rate limiting	Supabase RLS tidak punya rate limit. Monitor via audit log, atau Edge Function.
CSP unsafe-inline	Untuk MVP OK (Tailwind CDN). Hindari inline onclick — pakai addEventListener.
11. Migrasi Data
Data	Migrasi?
KONTINGEN (18 tim)	✅ Ya
POS (8 kode — konfirmasi: hanya 8 atau ada tambahan?)	✅ Ya
JURI (16 juri)	✅ Ya (password hash)
RUBRIK (semua soal)	✅ Ya
NILAI (historis)	❌ Tidak
12. Referensi File & Sheet
12.1 File yang Sudah Direview
File	Status
dashboardx.html	✅ 9 tema dipertahankan, perangkingan dihilangkan
dashboard1.html	✅ Diganti jadi tracker status-only + laporan
index.html	✅ Alur juri & timer dipertahankan, backend diganti Supabase
manifest.json	✅ Perlu update (start_url, orientation, ikon)
sw.js	✅ Perlu update: network-first untuk HTML dinamis, cache-first untuk asset statis; bypass Supabase
gs.html	✅ Backend diganti Supabase, token Telegram di-revoke
12.2 Sheet yang Dimigrasi
Sheet	Migrasi?
RUBRIK	✅ Ya
POS	✅ Ya
KONTINGEN	✅ Ya
JURI	✅ Ya (password hash)
NILAI	❌ Tidak (historis)
12.3 Data Master 2026
Data	Jumlah
Kontingen	18 tim (MU-01 s/d MU-18)
Pos	8 kode (POS-01, 02, 03-T, 03-P, 04-T, 04-P, 05, 06) — konfirmasi: struktur aktual?
Juri	16 baris (14 orang unik, karena Kukuh & Adit double)
Rubrik	±100 soal (dari sheet)
Catatan: Data master 2026 belum dikonfirmasi untuk konfigurasi agregasi_komponen, pos_komponen, dan juri_pos. Seed dibuat terpisah setelah konfirmasi.

13. Rencana Implementasi
13.1 Prasyarat Sebelum Coding
Sebelum tahap 1 dimulai, wajib diputuskan:

Device juri = Android (Web Bluetooth) — setuju?

Timer & bidak shared per tim per pos — setuju?

Nilai final = wajib semua juri submit — setuju?

Pisah penilaian_pos / penilaian_juri / penilaian_detail — setuju?

Juara umum = hanya pos induk — setuju?

agregasi_komponen + pos_komponen + pos.komponen — setuju?

weighted = normalisasi per komponen + rata-rata lintas juri — setuju?

Backup: manual CSV atau Supabase Pro?

Edge Function admin-reset-password — siap?

Service worker network-first untuk HTML dinamis — setuju?

Koreksi berlevel — setuju?

Jumlah pos aktual 2026 — hanya 8 kode, atau ada tambahan?

Konfigurasi aktual 2026: POS-03/POS-04 pola 1 atau 2? POS-01/02/05/06 metode apa? juri_pos aktual? Timer/bidak?

Cetak thermal pos 2+ juri: juri terakhir yang cetak, juri lain via cetak ulang — setuju?

Struk thermal = satu struk per tim per pos (bukan per juri), QR ke penilaian_pos — setuju?

Tanpa keputusan ini, coding skema berisiko rework.

13.2 Tahapan Implementasi
Tahap	Aktivitas	Estimasi
1	Setup Supabase (skema, RLS, view, fungsi, seed placeholder)	2 hari
2	Setup GitHub + Vercel + PWA shell	1 hari
3	Auth + Portal Kontingen	3 hari
4	Set Pos & Rubrik	2 hari
5	Form Penilaian Juri	5 hari
6	Cetak Thermal & QR	2 hari
7	Juara & Koreksi	4 hari
8	Dashboard Tracker & Aula	6 hari
9	Histori & Audit Log	3 hari
10	Laporan & Sertifikat	4 hari
11	Uji Coba & Deploy	3 hari
Total estimasi: ±35–45 hari kerja.

14. Rencana Chat Coding
Chat	Judul	Isi
1	Skema SQL & Supabase	DDL semua tabel (penilaian_pos/penilaian_juri/penilaian_detail, pos_komponen), RLS lengkap, view + fungsi (fn_hitung_nilai_final, fn_hitung_nilai_gabungan, fn_juara_pos, fn_juara_umum), seed placeholder
2	PWA Shell & Repositori	Struktur folder, manifest, sw, vercel, deploy
3	Auth & Portal Kontingen	Login, role, portal, verifikasi
4	Set Pos & Rubrik	Form pos fleksibel (agregasi_komponen, pos_komponen), CRUD rubrik
5	Form Penilaian Juri	Alur juri, timer, rubrik, locked, trigger status
6	Cetak Thermal & QR	Web Bluetooth, QR, verifikasi
7	Juara & Koreksi	Hitung nilai (fn_*), peringkat, koreksi berlevel, tierbreaker
8	Dashboard Tracker & Aula	Tracker, aula, 9 tema
9	Histori & Audit Log	Histori, audit, ekspor
10	Laporan & Sertifikat	9 laporan + 2 publik
11	Deploy & Uji Coba	Vercel, gladi, bug fix
15. Template Pembuka Chat Coding
Setiap chat baru, kirim:

"Lanjutan Jumbara PMI Purbalingga. Dokumen final: PEDOMAN.md v1.2 (di repositori GitHub). Teknologi: HTML murni + vanilla JS + Tailwind CDN + Supabase + Vercel + PWA. Prinsip: semua fleksibel (pos tak terbatas, sub-pos tak terbatas, komponen tak terbatas via pos_komponen, jumlah juri 0/1/2/3+, 7 metode hitung, induk_pos_id, timer/bidak shared per pos-tim, juri melekat di pos mana pun via juri_pos). Akun juri: username + password + nama. Cetak thermal: juri terakhir submit yang cetak, struk satu per tim per pos, QR ke penilaian_pos. Bagian: [nama bagian]. Mulai dari: [langkah spesifik]. Kutipan PEDOMAN.md yang relevan: [copy bagian]."

Contoh:

"Lanjutan Jumbara PMI Purbalingga. Dokumen final: PEDOMAN.md v1.2. Bagian: Skema SQL & Supabase. Mulai dari: DDL semua tabel (termasuk pos_komponen, penilaian_pos/penilaian_juri/penilaian_detail), RLS policy, fungsi (fn_hitung_nilai_final, fn_hitung_nilai_gabungan, fn_juara_pos, fn_juara_umum). Kutipan PEDOMAN.md: [copy bagian 5]."

16. Peringatan Keamanan
⚠️ Revoke Telegram Bot Token di gs.html via BotFather.

⚠️ Jangan commit gs.html asli ke GitHub publik.

⚠️ Jangan commit Supabase service_role key ke frontend.

⚠️ RLS wajib aktif di semua tabel.

⚠️ Hash password via Supabase Auth.

⚠️ Backup harian database selama event.

⚠️ Web Bluetooth hanya Chrome/Edge Android/Desktop — tetapkan device juri = Android.

⚠️ Reset password juri via Edge Function — jangan taruh service_role di frontend.

17. Status Dokumen
Bagian	Status
Dokumen final	✅ 100% Terkunci (revisi v1.2)
Teknologi	✅ Final
Skema database	✅ Final (revisi 3 tabel penilaian + pos_komponen + pos.komponen)
Keputusan teknis	✅ Final (§6.14, 23 keputusan A–W)
Keamanan	✅ Final (§10 + §10.1)
Rencana implementasi	✅ Final
Rencana chat coding	✅ Final
Siap coding	✅ Ya (setelah 15 prasyarat §13.1 disetujui)
Dokumen ini FINAL 100% (v1.2). Siap dijadikan acuan tunggal untuk coding.

Catatan: Seed & konfigurasi aktual 2026 belum ada di dokumen ini — dibuat terpisah di seed.sql setelah 15 prasyarat §13.1 disetujui.

Terima kasih atas kerja samanya. Semangat coding! 🚀

text

---

## Cara Pasang di GitHub

### Via Web GitHub

1. Buka repositori `jumbara-purbalingga` di GitHub.
2. Klik file `PEDOMAN.md` (atau **Add file → Create new file** jika belum ada).
3. Klik ikon **pensil** (Edit).
4. **Select all** (`Ctrl+A` / `Cmd+A`), hapus semua.
5. **Paste** seluruh isi di atas.
6. Scroll bawah → **Commit changes**.
7. Pesan commit: `docs: PEDOMAN v1.2 — aturan cetak thermal pos 2+ juri, 23 keputusan teknis, 15 prasyarat`.
8. **Commit**.

### Via Git CLI

```bash
git pull origin main
# replace PEDOMAN.md dengan isi di atas
git add PEDOMAN.md
git commit -m "docs: PEDOMAN v1.2 — aturan cetak thermal pos 2+ juri, 23 keputusan teknis, 15 prasyarat"
git push origin main
Verifikasi Setelah Push
Cek di GitHub:

Header — Versi: 1.2, 15 prasyarat.

§6.9 — ada "Aturan siapa yang cetak" + format struk + QR ke penilaian_pos.

§6.14 — baris V dan W ada (total 23 keputusan A–W).

§13.1 — poin 14 dan 15 ada (total 15 prasyarat).

§17 — v1.2, 23 keputusan A–W, 15 prasyarat.
