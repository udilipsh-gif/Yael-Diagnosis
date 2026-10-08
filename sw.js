// בכל פעם שאתה מעלה עדכון קוד ל-GitHub, שנה את המספר כאן (למשל ל-v2, v3)
const CACHE_NAME = 'yael-clinic-v1'; 
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// שלב ההתקנה: שומר את הקבצים ומודיע לדפדפן להפעיל את הגרסה החדשה מיד
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// שלב ההפעלה: מוחק גרסאות מטמון ישנות (למשל מוחק את v1 כש-v2 עולה)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// אסטרטגיית משיכת קבצים: Network First
self.addEventListener('fetch', event => {
  event.respondWith(
    // קודם כל מנסה להביא את הקובץ המעודכן ביותר מהשרת (GitHub)
    fetch(event.request).catch(() => {
      // אם אין אינטרנט או שהשרת נפל, הוא מביא את הגרסה השמורה מהמטמון
      return caches.match(event.request);
    })
  );
});
