// Service Worker for Offline Support
// Cache-first for audio, network-first for API

const CACHE_NAME = 'dj-app-v1';
const AUDIO_CACHE = 'audio-samples-v1';

// Install: Cache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching critical assets');
      return cache.addAll([
        '/',
        '/manifest.json'
      ]);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control immediately
  return self.clients.claim();
});

// Fetch: Handle requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Audio samples: Cache-first
  if (url.pathname.startsWith('/samples/') || url.pathname.includes('/audio/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((fetchResponse) => {
          // Cache successful responses
          if (fetchResponse.ok) {
            return caches.open(AUDIO_CACHE).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          }
          return fetchResponse;
        });
      }).catch(() => {
        // Return offline fallback if available
        return new Response('Offline', { status: 503 });
      })
    );
    return;
  }
  
  // API: Network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful GET requests
          if (event.request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(event.request).then((response) => {
            return response || new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }
  
  // Static assets: Cache-first
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2)$/)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }
  
  // Default: Network-first
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-audio') {
    event.waitUntil(syncAudioData());
  }
});

async function syncAudioData() {
  console.log('Service Worker: Syncing audio data...');
  // Implement sync logic here
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'DJ App', {
      body: data.body || 'New notification',
      icon: '/icon-192.png',
      badge: '/badge-72.png'
    })
  );
});

console.log('Service Worker: Loaded');
