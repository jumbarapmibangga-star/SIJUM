// assets/js/utils.js

// Format tanggal ke format Indonesia (contoh: 7 Nov 2026)
function formatTanggal(dateString) {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Format waktu ke HH:MM:SS
function formatWaktu(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', { hour12: false });
}

// Menampilkan notifikasi Toast sederhana
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Konversi detik ke format MM:SS
function formatDetik(totalDetik) {
  const m = Math.floor(totalDetik / 60).toString().padStart(2, '0');
  const s = (totalDetik % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
