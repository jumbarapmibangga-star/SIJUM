// sw.js
const CACHE_NAME = 'jumbara-v1.7';  // ⬅️ Naikkan setiap kali edit asset/custom.css

const STATIC_ASSETS = [
  './', 'index.html', 'login.html', 'manifest.json',
  'assets/css/custom.css', 'assets/js/supabase-client.js',
  'assets/js/auth.js', 'assets/js/theme.js',
  'assets/img/logo-pmi.png', 'assets/img/favicon.png', 'offline.html'
];
// ⚠️ PASTIKAN semua file di atas ADA. Kalau tidak, hapus dari list.

// ============================================================
// INSTALL: Cache asset statis (toleran terhadap file yang hilang)
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache satu per satu — kalau satu gagal, yang lain tetap masuk
      await Promise.all(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn(`Gagal cache ${url}:`, err))
        )
      );
    })
  );
  self.skipWaiting();
});

// ============================================================
// ACTIVATE: Hapus cache lama
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ============================================================
// FETCH: Strategi per jenis request
// ============================================================
self.addEventListener('fetch', (event) => {
  // Hanya cache GET request — POST/PUT/DELETE biarkan lewat
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass SEMUA request eksternal (Supabase, CDN, fonts, dll.)
  // Biarkan browser handle secara native
  if (url.hostname !== location.hostname) return;

  // 1. Network-first untuk HTML dinamis (index, login, dll.)
  const isDynamicHtml = url.pathname.endsWith('.html') || url.pathname === '/';
  if (isDynamicHtml) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Hanya cache kalau sukses
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(
            (cached) => cached || caches.match('offline.html')
          )
        )
    );
    return;
  }

  // 2. Cache-first untuk asset statis (CSS, JS, img)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      
      return fetch(event.request)
        .then((response) => {
          // Hanya cache response sukses
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match('offline.html'));
    })
  );
});
