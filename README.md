# PEDOMAN PROYEK — APLIKASI JUMBARA PMI KABUPATEN PURBALINGGA

**Versi:** 1.0 (Final)
**Tanggal:** 6 November 2026
**Status:** 100% Terkunci — Siap Coding
**Repositori:** `jumbara-purbalingga` (private)
**Hosting:** Vercel
**Database:** Supabase

---

## 1. Ringkasan Eksekutif

Aplikasi Jumbara PMI Kabupaten Purbalingga adalah **PWA (Progressive Web App)** untuk mengelola lomba tahunan, dengan fokus pada:

- **Histori peran peserta per tahun** (narator, pelaku praktik, dll).
- **Pos tak terbatas** dengan kriteria fleksibel.
- **Jumlah juri fleksibel** (1, 2, 3, ...).
- **Metode hitung nilai fleksibel** (7 metode).
- **Penggabungan pos fleksibel** via `induk_pos_id`.
- **Koreksi hanya oleh panitia** dengan jejak audit.
- **Cetak thermal 58mm Bluetooth** + QR ke halaman verifikasi.
- **Dashboard tracker status-only** & **dashboard aula tanpa perangkingan**.
- **Audit log append-only**.
- **9 laporan panitia + 2 laporan publik**.

---

## 2. Prinsip Inti

> **Semua fleksibel, diatur di database, bukan di kode.**
>
> - Pos tidak terbatas 6.
> - Jumlah juri fleksibel (1, 2, 3, ...).
> - Metode hitung fleksibel per pos.
> - Penggabungan pos fleksibel via `induk_pos_id`.
> - Timer & bidak bisa di pos mana pun.
> - Konfigurasi pos **dikunci setelah lomba mulai**, tercatat di audit log.

---

## 3. Teknologi

| Komponen | Teknologi |
|---|---|
| Frontend | HTML murni + JS vanilla + Tailwind CDN |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (username + password) |
| Storage | Supabase Storage (PDF, logo, sertifikat) |
| Realtime | Supabase Realtime + polling fallback |
| Cetak thermal | Web Bluetooth (ESC/POS) + fallback `window.print()` |
| QR | `qrcode.js` (CDN) |
| PDF | `jsPDF` (CDN) / Supabase Edge Function |
| Repositori | GitHub (private) |
| Hosting | Vercel |
| Build step | ❌ Tidak ada |

---

## 4. Aktor & Hak Akses

| Aktor | Hak Akses |
|---|---|
| Super Admin | Semua, kelola user, buka kunci, ekspor audit log |
| Koordinator | Kelola event, verifikasi, koreksi, kontrol aula |
| Admin Event | Kelola data event-nya |
| Juri | Input nilai pos yang ditugaskan; tidak bisa edit setelah locked |
| Kontingen | Daftar peserta, submit, lihat status |
| Publik | Papan juara, histori peran, verifikasi QR (jika publikasi aktif) |

---

## 5. Skema Database

### 5.1 Tabel Inti

| Tabel | Field Kunci |
|---|---|
| `event` | `id`, `tahun`, `nama`, `status`, `pendaftaran_tutup_pada`, `pendaftaran_status`, `aula_mode`, `aula_pesan`, `urutan_pos_locked`, `publikasi_nilai` |
| `tingkat` | `id`, `nama` (Mula/Madya/Wira) |
| `sekolah` | `id`, `nama` |
| `peserta_master` | `id`, `kode_peserta`, `nama`, `sekolah_id`, `tgl_lahir` |
| `peserta_event` | `id`, `event_id`, `peserta_master_id`, `tim_id`, `tingkat_id`, `peran_utama` |
| `tim` | `id`, `event_id`, `nama_tim`, `sekolah_id`, `tingkat_id`, `kode_kontingen` |
| `kontingen_event` | `id`, `event_id`, `akun_id`, `nama_kontingen`, `tingkat_id`, `status` |
| `pos` | `id`, `event_id`, `kode_pos`, `nama_pos`, `urutan`, `jumlah_juri`, `metode_hitung`, `bobot_teori`, `bobot_praktik`, `total_maks`, `pakai_timer`, `pakai_bidak`, `prioritas_tierbreaker`, `induk_pos_id`, `is_aktif`, `config_locked`, `locked_at`, `locked_by` |
| `juri` | `id`, `user_id`, `username`, `nama`, `is_aktif` |
| `juri_pos` | `juri_id`, `pos_id`, `slot` (null/juri1/juri2/juri3/...) |
| `rubrik` | `id`, `pos_id`, `nama_item`, `skor_maksimal`, `opsi_preset`, `urutan`, `is_bidak` |
| `penilaian` | `id`, `event_id`, `tim_id`, `pos_id`, `slot_juri`, `nilai_pos_total`, `status`, `pdf_url`, `qr_url`, `pernah_direvisi` |
| `penilaian_detail` | `id`, `penilaian_id`, `rubrik_id`, `nilai`, `juri_ke` |
| `tierbreaker` | `id`, `penilaian_id`, `jenis`, `waktu_mulai_server`, `waktu_selesai_server`, `waktu_detik`, `bidak_petak`, `status`, `alasan` |
| `koreksi_nilai` | `id`, `penilaian_id`, `jenis_koreksi`, `nilai_lama`, `nilai_baru`, `alasan`, `oleh`, `waktu` |
| `histori_peran` | `id`, `event_id`, `peserta_event_id`, `pos_id`, `peran` |
| `urutan_pos` | `id`, `event_id`, `tingkat_id`, `pos_id`, `urutan`, `locked_at` |
| `audit_log` | `id`, `waktu`, `user_id`, `user_role`, `username`, `kategori`, `aksi`, `entitas`, `entitas_id`, `data_lama`, `data_baru`, `alasan`, `ip_address`, `user_agent` |

### 5.2 View

| View | Fungsi |
|---|---|
| `v_nilai_pos_final` | Nilai akhir per tim per pos, sesuai metode hitung |
| `v_nilai_pos_gabungan` | Nilai gabungan pos induk (termasuk sub-pos) |
| `v_penilaian_aula` | Nilai locked per pos, urut kode kontingen |
| `v_tracking_panitia` | Status per tim × pos per juri |
| `v_juara_pos` | Peringkat per pos per tingkat |
| `v_juara_umum` | Perangkingan leksikografis urutan pos |
| `v_verifikasi` | Data halaman verifikasi QR |
| `v_histori_peran` | Histori peran peserta lintas tahun |

### 5.3 RLS (Ringkas)

| Role | Akses |
|---|---|
| Super Admin | Semua |
| Koordinator | Semua kecuali kelola user |
| Admin Event | Data event-nya |
| Juri | Hanya pos yang ditugaskan; insert penilaian; tidak bisa update/delete setelah locked |
| Kontingen | Data sendiri; submit pendaftaran |
| Publik | Hanya view publik (read-only) |

---

## 6. Aturan Bisnis

### 6.1 Portal Pendaftaran Kontingen

- Self-service: kontingen daftar akun, isi tim & peserta, submit.
- **Satu kontingen satu tingkat** per event.
- **Verifikasi per kontingen** oleh panitia.
- Setelah `verified`, data terkunci.
- **Penutupan pendaftaran**: otomatis (tanggal) + manual (panitia), manual menang.

### 6.2 Kriteria Pos (Fleksibel)

| Field | Keterangan |
|---|---|
| `jumlah_juri` | 1, 2, 3, dst. |
| `metode_hitung` | `sum`, `average`, `percentage`, `sum_juri`, `average_juri`, `percentage_juri`, `weighted` |
| `pakai_timer` | Boolean |
| `pakai_bidak` | Boolean |
| `prioritas_tierbreaker` | `bidak_dulu` / `timer_dulu` |
| `induk_pos_id` | Opsional |
| `bobot_teori`, `bobot_praktik` | Opsional (untuk `weighted`) |
| `total_maks` | Untuk `percentage` |

**Validasi:**
- Minimal satu komponen nilai (`ada_teori`/`ada_praktik`) aktif.
- `jumlah_juri` minimal 1.
- Jika `weighted`, `bobot_teori` + `bobot_praktik` = 1.

### 6.3 Metode Hitung Nilai

| Metode | Rumus |
|---|---|
| `sum` | `Σ nilai per soal` |
| `average` | `Σ nilai / jumlah soal` |
| `percentage` | `(Σ nilai / total_maks) × 100` |
| `sum_juri` | `Σ total juri1 + juri2 + ...` |
| `average_juri` | `(Σ total juri) / jumlah_juri` |
| `percentage_juri` | `(Σ total juri) / (jumlah_juri × total_maks) × 100` |
| `weighted` | `(Σ teori × bobot_teori) + (Σ praktik × bobot_praktik)` |

**Pos induk:** nilai = gabungan sub-pos (SUM, atau `weighted` jika dikonfigurasi).

### 6.4 Tierbreaker

```
Jika nilai_pos_total sama:
  Jika pakai_bidak dan pakai_timer:
    → Bidak dulu → lalu timer
  Jika hanya bidak: → Bidak
  Jika hanya timer: → Timer
  Jika masih sama → fallback (shared rank / keputusan panitia, tercatat)
```

**Timer & bidak tidak masuk `nilai_pos_total`.**

### 6.5 Aturan Juara per Pos

```
Untuk setiap pos utama (induk_pos_id = null), per tingkat:
  1. Hitung nilai gabungan
  2. Urutkan DESC
  3. Jika sama → tierbreaker
  4. Jika masih sama → fallback
  5. Ambil 1, 2, 3 → Juara 1, 2, 3
```

### 6.6 Aturan Juara Umum

```
Untuk setiap tingkat:
  1. Pastikan semua peringkat per pos final (locked)
  2. Ambil urutan pos yang ditetapkan panitia
  3. Bandingkan tim secara leksikografis:
     - Pos prioritas 1: peringkat lebih kecil menang
     - Jika sama → pos prioritas 2
     - ... sampai semua pos
  4. Jika masih sama → fallback:
     a. Timer total (akumulasi waktu tierbreaker timer)
     b. Usia lebih muda (rata-rata tanggal lahir anggota)
     c. Keputusan panitia (tercatat di audit)
  5. Hasil: Juara umum 1, 2, 3
```

**Tim tidak ikut pos** → diperlakukan **peringkat terbawah** di pos tersebut.

### 6.7 Alur Juri

**Pos `jumlah_juri = 1`:**

```
Login → pilih pos → lihat tim belum dinilai
   ↓
Pilih tim → start timer (jika pakai_timer)
   ↓
Form rubrik (1 kolom nilai)
   ↓
Stop timer → simpan (locked)
   ↓
Tim hilang dari dropdown semua juri pos ini
   ↓
Generate PDF + QR → cetak thermal
```

**Pos `jumlah_juri = 2+`:**

```
Login → pilih pos → lihat tim belum dinilai lengkap
   ↓
Pilih tim → start timer (jika pakai_timer)
   ↓
Form rubrik (kolom sesuai slot juri yang login)
   ↓
Isi nilai → simpan (locked)
   ↓
Jika semua juri sudah submit → tim hilang
   ↓
Nilai akhir dihitung sesuai metode_hitung
   ↓
Generate PDF + QR → cetak thermal (setelah semua juri submit)
```

**Juri non-digital:** didampingi panitia/relawan, device khusus, UI sederhana, tombol "Minta Bantuan".

### 6.8 Koreksi

- **Juri tidak bisa edit** setelah simpan (langsung locked).
- **Panitia bisa koreksi** dengan jejak:
  - Nilai lama → baru (audit log)
  - Regenerate PDF
  - QR lama menampilkan "DIREVISI" + nilai terbaru
  - Cetak ulang opsional dengan watermark "REVISI"
- **Timer bisa dikoreksi** dengan alasan + verifikasi.
- **Konfigurasi pos dikunci** setelah lomba mulai.

### 6.9 Cetak Thermal

- **58mm, Bluetooth, ESC/POS.**
- **QR ke halaman verifikasi** (`/verifikasi/{id}`), 25×25mm, tanpa logo.
- **Fallback `window.print()`** jika Bluetooth gagal.
- **Menu cetak ulang** dari server.
- **Struk POS 2+ juri** menampilkan total per juri + hasil akhir.
- **Struk hanya dicetak setelah semua juri submit** (pos 2+ juri).

### 6.10 Dashboard

**Tracker Panitia (status-only):**
- Matriks tim × pos, status per juri.
- Filter per tingkat, pos, kontingen.
- Highlight pos/tim tertinggal.
- Tanpa nilai mentah.

**Aula:**
- Semua nilai per pos, urutan kode kontingen.
- Tanpa perangkingan.
- Tierbreaker sebagai catatan.
- Hanya nilai locked.
- 9 tema visual, tanpa highlight nilai baru.
- Kontrol panitia (mode, pesan, panic button).

### 6.11 Histori Peran

- Peserta + peran per tahun.
- Bisa dicari per nama (publik).

### 6.12 Audit Log

- **Append-only**, tidak bisa edit/hapus.
- Mencatat semua aktivitas.
- **Juri bisa lihat log sendiri**.
- **Percobaan akses ditolak dicatat**.
- **Retensi 5 tahun**, backup CSV harian.

### 6.13 Menu Laporan

**9 laporan panitia:**
1. Rekap Juara Umum
2. Rekap Juara per Pos
3. Rekap Nilai per Kontingen
4. Rekap Nilai per Pos
5. Detail per Kontingen
6. Rekap Tierbreaker
7. Rekap Histori Peran
8. Log Aktivitas
9. Sertifikat Peserta

**2 laporan publik:**
10. Papan Juara
11. Histori Peran Peserta

**Format:** PDF (A4) + CSV.
**Generate:** On-demand.
**Audit:** Setiap generate/export tercatat.
**Sertifikat:** Disimpan di Supabase Storage.

---

## 7. Akun Juri

- **Username + password + nama** (bukan email, bukan PIN).
- Email palsu di Supabase: `{username}@jumbara.local`.
- Admin buat akun → sampaikan username & password manual.
- Reset password manual oleh admin.
- Multi-device login.
- Satu orang bisa ditugaskan ke >1 pos via `juri_pos`.

---

## 8. Halaman Aplikasi

```
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
```

---

## 9. Design System

| Komponen | Spesifikasi |
|---|---|
| Warna primer | Merah `#DC2626` |
| Font | Inter / system sans-serif |
| Font monospace | JetBrains Mono (timer) |
| Ikon | Font Awesome 6 |
| Border radius | 8px / 12px / 16px |
| Shadow | `shadow-md` / `shadow-xl` |
| Breakpoint | 640px / 768px / 1024px / 1280px |
| Tema | Terang (default), Gelap (opsional) |

---

## 10. Keamanan

| Aspek | Keputusan |
|---|---|
| RLS | Aktif di semua tabel |
| PIN | Dihapus |
| Password | Hash bcrypt (Supabase Auth) |
| `service_role` key | Hanya di Edge Function |
| CSP | Header via `vercel.json` |
| Vercel | Aktifkan Vercel Authentication |
| MFA | Aktifkan di akun Supabase Super Admin |
| Audit log | Append-only, retensi 5 tahun |

---

## 11. Migrasi Data

| Data | Migrasi? |
|---|---|
| `KONTINGEN` (18 tim) | ✅ Ya |
| `POS` (8 kode) | ✅ Ya |
| `JURI` (16 juri) | ✅ Ya (password hash) |
| `RUBRIK` (semua soal) | ✅ Ya |
| `NILAI` (historis) | ❌ Tidak |

---

## 12. Rencana Implementasi

| Tahap | Aktivitas | Estimasi |
|---|---|---|
| 1 | Setup Supabase (skema, RLS, view, seed) | 2 hari |
| 2 | Setup GitHub + Vercel + PWA shell | 1 hari |
| 3 | Auth + Portal Kontingen | 3 hari |
| 4 | Set Pos & Rubrik | 2 hari |
| 5 | Form Penilaian Juri | 5 hari |
| 6 | Cetak Thermal & QR | 2 hari |
| 7 | Juara & Koreksi | 4 hari |
| 8 | Dashboard Tracker & Aula | 6 hari |
| 9 | Histori & Audit Log | 3 hari |
| 10 | Laporan & Sertifikat | 4 hari |
| 11 | Uji Coba & Deploy | 3 hari |

**Total estimasi: ±35–45 hari kerja.**

---

## 13. Rencana Chat Coding

| Chat | Judul | Isi |
|---|---|---|
| 1 | Skema SQL & Supabase | DDL, RLS, view, seed |
| 2 | PWA Shell & Repositori | Struktur folder, manifest, sw, vercel, deploy |
| 3 | Auth & Portal Kontingen | Login, role, portal, verifikasi |
| 4 | Set Pos & Rubrik | Form pos fleksibel, CRUD rubrik |
| 5 | Form Penilaian Juri | Alur juri, timer, rubrik, locked |
| 6 | Cetak Thermal & QR | Web Bluetooth, QR, verifikasi |
| 7 | Juara & Koreksi | Hitung nilai, peringkat, koreksi |
| 8 | Dashboard Tracker & Aula | Tracker, aula, 9 tema |
| 9 | Histori & Audit Log | Histori, audit, ekspor |
| 10 | Laporan & Sertifikat | 9 laporan + 2 publik |
| 11 | Deploy & Uji Coba | Vercel, gladi, bug fix |

---

## 14. Template Pembuka Chat Coding

Setiap chat baru, kirim:

> *"Lanjutan Jumbara PMI Purbalingga. Dokumen final sudah lengkap (PWA HTML murni + Supabase + Vercel). Bagian: **[nama bagian]**. Mulai dari **[langkah spesifik]**."*

Contoh:

> *"Lanjutan Jumbara PMI Purbalingga. Bagian: Skema SQL & Supabase. Tolong buatkan DDL semua tabel, RLS policy, dan view."*

---

## 15. Peringatan Keamanan

⚠️ Revoke Telegram Bot Token di `gs.html` via BotFather.

⚠️ Jangan commit `gs.html` asli ke GitHub publik.

⚠️ Jangan commit Supabase `service_role` key ke frontend.

⚠️ RLS wajib aktif di semua tabel.

⚠️ Hash password via Supabase Auth.

⚠️ Backup harian database selama event.

---

## 16. Status Dokumen

| Bagian | Status |
|---|---|
| Dokumen final | ✅ 100% Terkunci |
| Teknologi | ✅ Final |
| Keamanan | ✅ Final |
| Rencana implementasi | ✅ Final |
| Rencana chat coding | ✅ Final |
| Siap coding | ✅ Ya |

---

**Dokumen ini FINAL 100%. Siap dijadikan acuan tunggal untuk coding.**

**Terima kasih atas kerja samanya. Semangat coding! 🚀**
