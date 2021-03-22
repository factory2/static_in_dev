var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
    'static/logos/factory2.png',
    'static/logos/factory2apple.png',
    'static/bootstrap-4.6.0-dist/js/jquery-3.5.1.slim.min.js',
    'static/bootstrap-4.6.0-dist/js/bootstrap.bundle.min.js',
    'static/bootstrap-4.6.0-dist/css/bootstrap.min.css',
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("django-pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline');
            })
    )
});
