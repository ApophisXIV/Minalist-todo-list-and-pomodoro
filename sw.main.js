const CACHE_NAME = 'pomolist-static-cache-v1'

// !FIXME Probably is not the best way to do this but it works for now
const FILES_TO_CACHE = [
    './',
    './index.html',
    './assets/js/index.js',
    './assets/js/utils.js',
    './assets/js/date_header_ui.js',
    './assets/js/pomodoro.js',
    './assets/js/pomodoro_ui.js',
    './assets/js/task_list.js',
    './assets/js/task_list_ui.js',
    './assets/css/styles.css',
    './assets/css/date.css',
    './assets/css/pomodoro.css',
    './assets/css/todo_list.css',
    './assets/css/atomic/alignment.min.css',
    './assets/css/atomic/buttons.min.css',
    './assets/css/atomic/flex.min.css',
    './assets/css/atomic/inputs.min.css',
    './assets/css/atomic/spacing.min.css',
    './assets/images/icons/manifest-icon-192.maskable.png',
    './assets/images/icons/manifest-icon-512.maskable.png',
    './manifest.webmanifest',
    './sw.main.js',
    './sw.reg.js',
]

self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Install')
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page')
            return cache.addAll(FILES_TO_CACHE)
        })
    )
    self.skipWaiting()
})

self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activate')
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key)
                    return caches.delete(key)
                }
            }))
        })
    )
    self.clients.claim()
})

self.addEventListener('fetch', (e) => {
    console.log('[ServiceWorker] Fetch', e.request.url)
    e.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(e.request)
                .then((response) => {
                    console.log("RESP", response)
                    return response || fetch(e.request)
                })
        })
    )
})
