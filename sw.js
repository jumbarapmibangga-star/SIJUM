// Service worker for the static SIJUM landing page and local app shell.
const CACHE_NAME = 'sijum-static-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './login.html',
  './dashboard-aula.html',
  './assets/css/custom.css',
  './assets/js/theme.js',
  './assets/img/favicon.png',
  './assets/img/logo-pmi.png',
  './assets/img/hero-pmi-light.png',
  './assets/img/hero-pmi-dark.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Missing optional routes/assets must not prevent the landing page from installing.
    await Promise.all(APP_SHELL.map((url) => cache.add(url).catch((error) => {
      console.warn(`Tidak dapat menyimpan ${url} ke cache:`, error);
    })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Leave external services/CDNs and non-HTTP(S) requests to the browser.
  if (url.origin !== self.location.origin || (url.protocol !== 'http:' && url.protocol !== 'https:')) return;

  const isHtml = request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (isHtml) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match(request)) || (await caches.match('./index.html')) || (await caches.match('./offline.html'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      return (await caches.match('./offline.html')) || Response.error();
    }
  })());
});
