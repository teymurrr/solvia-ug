

const CACHE_NAME = 'solvia-v1';
const STATIC_CACHE_NAME = 'solvia-static-v1';
const DYNAMIC_CACHE_NAME = 'solvia-dynamic-v1';

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

// Cache strategies with expiration times
const CACHE_STRATEGIES = {
  // Cache first for static assets (1 year)
  cacheFirst: [
    /\.(?:js|css|woff|woff2|ttf|eot)$/,
    /\/assets\//,
    /\/lovable-uploads\//
  ],
  // Network first for API calls (5 minutes)
  networkFirst: [
    /\/api\//,
    /supabase/
  ],
  // Stale while revalidate for pages (1 hour)
  staleWhileRevalidate: [
    /\/$/,
    /\/about/,
    /\/contact/
  ]
};

// Cache expiration times in milliseconds
const CACHE_EXPIRATION = {
  static: 365 * 24 * 60 * 60 * 1000, // 1 year
  dynamic: 60 * 60 * 1000, // 1 hour
  api: 5 * 60 * 1000, // 5 minutes
  html: 60 * 60 * 1000 // 1 hour
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
            .filter((cacheName) => !cacheName.startsWith('solvia-'))
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

// Add cache headers to response
function addCacheHeaders(response, cacheType) {
  const headers = new Headers(response.headers);
  const expiration = CACHE_EXPIRATION[cacheType] || CACHE_EXPIRATION.dynamic;
  const expirationDate = new Date(Date.now() + expiration);
  
  headers.set('Cache-Control', `public, max-age=${Math.floor(expiration / 1000)}`);
  headers.set('Expires', expirationDate.toUTCString());
  
  // Add immutable flag for static assets
  if (cacheType === 'static') {
    headers.set('Cache-Control', `public, max-age=${Math.floor(expiration / 1000)}, immutable`);
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Check if cached response is expired
function isExpired(cachedResponse) {
  const cachedDate = cachedResponse.headers.get('date');
  const cacheControl = cachedResponse.headers.get('cache-control');
  
  if (!cachedDate || !cacheControl) {
    return true;
  }
  
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  if (!maxAgeMatch) {
    return true;
  }
  
  const maxAge = parseInt(maxAgeMatch[1]) * 1000;
  const cachedTime = new Date(cachedDate).getTime();
  const now = Date.now();
  
  return (now - cachedTime) > maxAge;
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      const responseWithHeaders = addCacheHeaders(networkResponse.clone(), 'static');
      cache.put(request, responseWithHeaders.clone());
      return responseWithHeaders;
    }
    return networkResponse;
  } catch (error) {
    console.error('Network error:', error);
    return cachedResponse || new Response('Network error', { status: 500 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const url = new URL(request.url);
      const cacheType = url.pathname.includes('/api/') ? 'api' : 'dynamic';
      const responseWithHeaders = addCacheHeaders(networkResponse.clone(), cacheType);
      cache.put(request, responseWithHeaders.clone());
      return responseWithHeaders;
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse && !isExpired(cachedResponse)) {
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
        const responseWithHeaders = addCacheHeaders(networkResponse.clone(), 'html');
        cache.then(c => c.put(request, responseWithHeaders.clone()));
        return responseWithHeaders;
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  // Return cached response immediately if available and not expired
  if (cachedResponse && !isExpired(cachedResponse)) {
    return cachedResponse;
  }

  return networkPromise;
}

