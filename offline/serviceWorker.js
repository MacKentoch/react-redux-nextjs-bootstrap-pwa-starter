const CACHE_NAME = 'simple-cache-v1'; // just change CACHE_NAME to trigger a new service worker activation (a single change in this file will trigger new worker install - will replace then previous one when client closes /opens the website)
const urlsToCache = [
  '/',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cosmo/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
];
const cacheWhitelist = [CACHE_NAME]; // by default current CACHE_NAME will persist on activation (non whitelisted ones will be deleted)

self.addEventListener('install', event => {
  const addAllToCache = cache => cache.addAll(urlsToCache);
  const preLoaded = caches.open(CACHE_NAME).then(addAllToCache);
  event.waitUntil(preLoaded);
});

self.addEventListener('fetch', event => {
  const cacheNonMatchedThenReturnFetchReponse = eventRequest =>
    fetch(eventRequest).then(fetchResponse => {
      if (
        !fetchResponse ||
        fetchResponse.status !== 200 ||
        fetchResponse.type !== 'basic'
      ) {
        return fetchResponse;
      }
      caches.open(CACHE_NAME).then(cache => {
        cache.put(eventRequest, fetchResponse.clone());
        return fetchResponse;
      });
    });

  const response = caches
    .match(event.request)
    .then(
      match => match || cacheNonMatchedThenReturnFetchReponse(event.request),
    );
  event.respondWith(response);
});

self.addEventListener('activate', event => {
  const cachesCleaned = caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
        return Promise.resolve();
      }),
    );
  });

  event.waitUntil(cachesCleaned);
});
