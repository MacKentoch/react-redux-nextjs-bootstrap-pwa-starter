const CACHE_NAME  = 'simple-cache-v1';
const urlsToCache = [
  '/',
  'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cosmo/bootstrap.min.css',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
];

self.addEventListener(
  'install',
  event => {
    const preLoaded = caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache));
    event.waitUntil(preLoaded);
  }
);

self.addEventListener(
  'fetch',
  event => {
    const cacheNonMatchedThenReturnFetchReponse = eventRequest => fetch(eventRequest).then(fetchResponse => caches.open(CACHE_NAME).then(
      cache => {
        cache.put(eventRequest, fetchResponse.clone());
        return fetchResponse;
      }
    ));

    const response = caches.match(event.request).then(match => match || cacheNonMatchedThenReturnFetchReponse(event.request));
    event.respondWith(response);
  }
);

