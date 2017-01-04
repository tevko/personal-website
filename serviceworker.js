// The files we want to cache
var CACHE_NAME = 'site-cache-v2';
var urlsToCache = [
  '/'
];

// Set the callback for the install step
self.addEventListener('install', function(event) {
    // Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			// Cache hit - return response
			if (response) {
				return response;
			}

			return fetch(event.request);
		})
	);
});

this.addEventListener('activate', function(event) {
	var cacheWhitelist = [CACHE_NAME];

	event.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (cacheWhitelist.indexOf(key) === -1) {
					return caches.delete(key);
				}
			}));
		})
	);
});