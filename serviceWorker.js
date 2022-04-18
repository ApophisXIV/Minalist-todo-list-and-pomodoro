// Service worker for the application
const CACHE_NAME = 'cache-v1'
const urls_to_cache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/css/atomic/aligment.min.css',
    '/assets/css/atomic/buttons.min.css',
    '/assets/css/atomic/flex.min.css',
    '/assets/css/atomic/inputs.min.css',
    '/assets/css/atomic/spacing.min.css',
    '/assets/js/task_list.js',
    '/assets/js/task_list_ui.js',
    '/assets/js/date_header_ui.js',
    '/assets/js/pomodoro.js',
    '/assets/js/pomodoro_ui.js',
    '/assets/js/index.js',
    '/assets/js/utils.js',
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