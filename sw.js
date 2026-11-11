// sw.js
const CACHE_NAME = 'jumbara-v1'; // ⬅️ Naikkan angkanya (v2, v3...) setiap kali edit file di ASSETS

const ASSETS = [
  './', 
  'index.html', 
  'login.html', 
  'assets/css/custom.css',
  'assets/img/logo-pmi.png', 
  'offline.html'
];

// ============================================================
// 1. INSTALL: Cache asset statis (toleran jika ada file hilang)
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Gunakan map & catch agar jika 'offline.html' belum ada, 
      // file lain tetap berhasil di-cache (tidak gagal total)
      return Promise.all(
        ASSETS.map(url => cache.add(url).catch(err => console.warn(`Gagal cache ${url}`, err)))
      );
    })
  );
  self.skipWaiting();
});

// ============================================================
// 2. ACTIVATE: Hapus cache versi lama
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ============================================================
// 3. FETCH: Strategi Cerdas
// ============================================================
self.addEventListener('fetch', (event) => {
  // A. Abaikan request selain GET (misal POST login, tidak boleh di-cache)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // B. Abaikan request ke luar domain (Supabase, Tailwind CDN, dll)
  if (url.hostname !== location.hostname) return;

  // C. Network-First untuk HTML (agar konten selalu update)
  const isHtml = url.pathname.endsWith('.html') || url.pathname === '/';
  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Simpan ke cache hanya jika sukses (status 200)
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('offline.html')))
    );
    return;
  }

  // D. Cache-First untuk aset statis (CSS, JS, Gambar)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      
      return fetch(event.request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('offline.html'));
    })
  );
});
