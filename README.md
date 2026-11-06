
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
