
const CACHE_NAME = 'solvia-v2';
const STATIC_CACHE_NAME = 'solvia-static-v2';
const DYNAMIC_CACHE_NAME = 'solvia-dynamic-v2';

// Cache static assets (removed root path as it's dynamic content)
const STATIC_ASSETS = [
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

// Cache API responses and dynamic content
const CACHE_STRATEGIES = {
  // Cache first for static assets
  cacheFirst: [
    /\.(?:js|css|woff|woff2|ttf|eot)$/,
    /\/assets\//,
    /\/lovable-uploads\//
  ],
  // Network first for API calls and dynamic pages
  networkFirst: [
    /\/api\//,
    /supabase/,
    /\/$/  // Root path should always get fresh content
  ],
  // Stale while revalidate for other pages
  staleWhileRevalidate: [
    /\/about/,
    /\/contact/
  ]
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              // Remove old caches and any caches not from this version
              cacheName.startsWith('solvia-v1') || 
              (!cacheName.startsWith('solvia-v2') && cacheName.startsWith('solvia-'))
            )
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and non-GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Determine cache strategy
  let strategy = 'networkFirst'; // default
  
  for (const [strategyName, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(url.pathname))) {
      strategy = strategyName;
      break;
    }
  }

  switch (strategy) {
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
    default:
      event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Network error:', error);
    return new Response('Network error', { status: 500 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Network error', { status: 500 });
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE_NAME);
        cache.then(c => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkPromise;
}
