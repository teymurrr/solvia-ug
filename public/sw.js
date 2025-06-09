
// Service Worker for aggressive caching and compression
const CACHE_NAME = 'solvia-v1';
const STATIC_CACHE = 'solvia-static-v1';
const DYNAMIC_CACHE = 'solvia-dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/src/index.css',
  '/src/main.tsx',
  '/manifest.json'
];

// Compression support check
const supportsCompression = () => {
  return 'CompressionStream' in window;
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with compression optimization
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (!url.hostname.includes(self.location.hostname)) return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Determine cache strategy based on resource type
            const cacheToUse = isStaticAsset(url.pathname) ? STATIC_CACHE : DYNAMIC_CACHE;

            // Cache the response
            caches.open(cacheToUse)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback for offline
            if (request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Helper function to determine if asset is static
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) || pathname.includes('/assets/');
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Implement background sync logic here
      console.log('Background sync triggered')
    );
  }
});
