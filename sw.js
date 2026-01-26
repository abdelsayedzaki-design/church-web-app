const CACHE_NAME = 'is-app-v2'; // غيرنا الرقم لكي يفهم المتصفح أن هناك تحديث
const ASSETS = [
  './',
  'index.html',
  'sw.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if(key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => caches.match('index.html'))
  );
});
