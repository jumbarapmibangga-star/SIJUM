// assets/js/supabase-client.js

// ============================================================
// KONFIGURASI SUPABASE
// ============================================================
// ✅ PUBLISHABLE KEY (aman untuk client/browser)
// ❌ JANGAN pakai Secret Key (sb_secret_...) di sini!
// ============================================================
const SUPABASE_URL = 'https://erkjbmqljvbljkghvwqa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hm-V1hNsiRmGoPSOaGhEtA_xchAazXa';

// ============================================================
// GUARD: Pastikan CDN Supabase sudah dimuat
// ============================================================
if (!window.supabase) {
  const msg = 'Supabase CDN belum dimuat! Pastikan <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> ada di atas file ini.';
  console.error(msg);
  
  // Tampilkan pesan error di layar jika body sudah ada
  if (document.body) {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#dc2626;color:#fff;padding:12px;text-align:center;font-family:sans-serif;z-index:9999;';
    div.textContent = 'Gagal memuat sistem. Periksa koneksi internet Anda dan refresh halaman.';
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
