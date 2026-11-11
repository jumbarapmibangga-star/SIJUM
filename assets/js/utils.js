// assets/js/utils.js

// ============================================================
// 1. FORMAT TANGGAL & WAKTU
// ============================================================

// Format tanggal ke format Indonesia (contoh: 7 Nov 2026)
function formatTanggal(dateString) {
  if (!dateString) return '-';
  
  // FIX TIMEZONE: Jika format YYYY-MM-DD (hanya tanggal), tambahkan T00:00:00
  // agar JavaScript membacanya sebagai waktu lokal, bukan UTC.
  const safeDateStr = /^\d{4}-\d{2}-\d{2}$/.test(dateString) 
    ? `${dateString}T00:00:00` 
    : dateString;
    
  const date = new Date(safeDateStr);
  
  // FIX INVALID DATE
  if (isNaN(date.getTime())) return '-';

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

// Format waktu ke HH:MM:SS
function formatWaktu(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  return date.toLocaleTimeString('id-ID', { hour12: false });
}

// Konversi detik ke format MM:SS
function formatDetik(totalDetik) {
  // FIX NULL/UNDEFINED
  if (totalDetik == null || isNaN(totalDetik)) return '00:00';
  
  const m = Math.floor(totalDetik / 60).toString().padStart(2, '0');
  const s = (totalDetik % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ============================================================
// 2. NOTIFIKASI TOAST (Dengan animasi & cegah penumpukan)
// ============================================================
let toastTimeout;

function showToast(message, type = 'success') {
  // 1. Hapus toast lama jika ada (mencegah penumpukan)
  const existingToast = document.getElementById('global-toast');
  if (existingToast) {
    clearTimeout(toastTimeout);
    existingToast.remove();
  }

  // 2. Buat elemen toast baru
  const toast = document.createElement('div');
  toast.id = 'global-toast';
  
  // Style dasar (bisa disesuaikan dengan custom.css)
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-xl text-white z-[9999] font-semibold text-sm transition-all duration-300 transform translate-y-2 opacity-0 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`;
  
  // Ikon (opsional)
  const icon = type === 'success' 
    ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
    : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

  toast.innerHTML = `${icon} <span>${message}</span>`; 
  // Catatan: Karena "message" berasal dari kode kita sendiri (bukan input user), 
  // penggunaan innerHTML di sini aman. Jika message dari user, gunakan textContent.
  
  document.body.appendChild(toast);

  // 3. Animasi Masuk (Fade in)
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  // 4. Animasi Keluar (Fade out) & Hapus
  toastTimeout = setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300); // Tunggu animasi selesai
  }, 3000);
}
