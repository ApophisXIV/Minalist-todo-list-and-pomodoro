if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('./service_worker.js')

const PRECACHE = 'Pomolist-v1.0'
const RUNTIME = 'runtime'

const PRECACHE_URLS = [
    './index.html',
    './assets/css/styles.css',
    './assets/css/atomic/aligment.min.css',
    './assets/css/atomic/buttons.min.css',
    './assets/css/atomic/flex.min.css',
    './assets/css/atomic/inputs.min.css',
    './assets/css/atomic/spacing.min.css',
    './assets/js/task_list.js',
    './assets/js/task_list_ui.js',
    './assets/js/date_header_ui.js',
    './assets/js/pomodoro.js',
    './assets/js/pomodoro_ui.js',
    './assets/js/index.js',
    './assets/js/utils.js',
]

// Install handler
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    )
})

// Activate handler
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME]
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete)
            }))
        }).then(() => self.clients.claim())
    )
})

// Fetch handler
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (event.request.url.startsWith(self.location.origin))
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse)
                    return cachedResponse
                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        // Copy of the response in the runtime cache.
                        return cache.put(event.request, response.clone()).then(() => { return response })
                    })
                })
            })
        )
})