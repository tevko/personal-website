// The files we want to cache
const CACHE_NAME = 'site-cache-v4';

const urlsToCache = [
  '/',
  '/blog',
  '/blog/how-this-blog-was-made/',
  '/blog/wp-content/themes/blog/public/css/main.min.css',
  'https://fonts.googleapis.com/css?family=Open+Sans:400,700'
 ];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(caches.open(CACHE_NAME).then(cache =>
        Promise.all(
             urlsToCache.map((url) => {
                const request = new Request(url);
                return fetch(request).then(response => cache.put(request, response));
            })
        )
    ))
});

// respond with matches from cache
self.addEventListener('fetch', (event) => {
    if (urlsToCache.some(url => event.request.url.indexOf(url) !== -1)) {
        event.respondWith(caches.match(event.request).then(response => {
            if (!response) {
                const request = new Request(event.request.url);
                return fetch(request)
            }
            return response;
        }));
    }
});

// remove old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(caches.keys()
    .then(keyList =>
        Promise.all(keyList.map(key =>
            cacheWhitelist.indexOf(key) === -1 ? caches.delete(key) : false))));
});