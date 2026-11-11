// assets/js/theme.js

function setTheme(isDark) {
  const html = document.documentElement;
  const body = document.body;

  // Tambahkan class untuk memicu animasi memudar (fade)
  if (body) body.classList.add('theme-changing');

  if (isDark) {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  
  updateThemeIcon();

  // Hapus class animasi setelah 500ms (setengah detik)
  if (body) {
    setTimeout(() => {
      body.classList.remove('theme-changing');
    }, 500);
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(!isDark);
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  const buttons = document.querySelectorAll('.btn-theme-toggle');
  
  buttons.forEach(btn => {
    if (isDark) {
      // Jika sedang Gelap, tampilkan opsi untuk ke Terang (Matahari)
      btn.innerHTML = `
        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        <span class="hidden">Mode Terang</span>
      `;
    } else {
      // Jika sedang Terang, tampilkan opsi untuk ke Gelap (Bulan)
      btn.innerHTML = `
        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        <span class="hidden">Mode Gelap</span>
      `;
    }
  });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcon();
  
  // Pantau perubahan preferensi OS secara langsung (jika user belum pilih manual)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });
});
