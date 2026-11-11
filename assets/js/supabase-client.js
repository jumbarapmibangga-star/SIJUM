// assets/js/supabase-client.js

// ============================================================
// KONFIGURASI SUPABASE
// ============================================================
// ⚠️ PENTING:
// - URL TANPA /rest/v1/ (client Supabase otomatis menambahkannya)
// - Key harus "anon" atau "publishable" (bukan service_role/secret)
//   Di dashboard Supabase: Settings → API → Project API keys
// ============================================================
const SUPABASE_URL = 'https://erkjbmqljvbljkghvwqa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hm-V1hNsiRmGoPSOaGhEtA_xchAazXa';
//                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                         ⚠️ Cek ini "publishable key" atau "secret key"!
//                            Kalau secret → GANTI dengan anon/publishable.

// ============================================================
// GUARD: Pastikan Supabase CDN sudah dimuat
// ============================================================
if (!window.supabase) {
  const msg = 'Supabase CDN belum dimuat! Pastikan <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> ada di ATAS file ini.';
  console.error(msg);
  // Tampilkan pesan di UI kalau body sudah ada
  if (document.body) {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#dc2626;color:#fff;padding:12px;text-align:center;font-family:sans-serif;z-index:9999;';
    div.textContent = 'Gagal memuat Supabase. Cek koneksi internet & refresh halaman.';
    document.body.appendChild(div);
  }
  throw new Error(msg);
}

// ============================================================
// INISIALISASI CLIENT
// ============================================================
try {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  console.error('Gagal inisialisasi Supabase client:', err);
  throw err;
}
