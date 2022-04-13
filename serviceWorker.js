// Service worker for the application
const CACHE_NAME = 'cache-v1'
const urls_to_cache = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/script.js'
]

self.addEventListener('install', install_event => {
    install_event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urls_to_cache))
            .then(() => self.skipWaiting())
    )
})

self.addEventListener('fetch', fetch_event => {
    fetch_event.respondWith(
        caches.match(fetch_event.request)
            .then(response => response || fetch(fetch_event.request))
    )
})