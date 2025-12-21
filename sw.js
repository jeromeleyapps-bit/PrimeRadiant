const CACHE_NAME = 'prime-radiant-v9.1';
const ASSETS = [
    './index.html',
    './schrodinger_engine_v3.js',
    './radiant_visualizer_v5.js',
    './param_dictionary_l4.js',
    './manifest.json'
];

// 1. INSTALLATION (Mise en cache)
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(ASSETS);
        })
    );
});

// 2. FETCH (Mode Hors Ligne)
self.addEventListener('fetch', (e) => {
    // Ignorer les requêtes non-HTTP (ex: chrome-extension, file, etc.)
    if (!e.request.url.startsWith('http')) return;

    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
