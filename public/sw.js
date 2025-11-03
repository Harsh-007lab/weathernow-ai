const CACHE_NAME = 'weathernow-v2';
const OFFLINE_CACHE = 'weathernow-offline-v2';
const WEATHER_DATA_CACHE = 'weathernow-weather-v1';
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== OFFLINE_CACHE && name !== WEATHER_DATA_CACHE)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Security: Validate request origins
const ALLOWED_ORIGINS = [
  self.location.origin,
  'https://weathernow.vercel.app',
];

// Fetch event - network first with cache fallback, special handling for weather data
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Security: Only cache requests from allowed origins
  const requestUrl = new URL(event.request.url);
  const isAllowedOrigin = ALLOWED_ORIGINS.some(origin => requestUrl.origin === origin || requestUrl.origin === self.location.origin);
  
  if (!isAllowedOrigin && !requestUrl.protocol.startsWith('http')) {
    return;
  }

  // Check if this is a weather API request
  const isWeatherAPI = requestUrl.pathname.includes('/functions/v1/weather');

  if (isWeatherAPI) {
    // Cache-first strategy for weather data with time-based invalidation
    event.respondWith(
      caches.open(WEATHER_DATA_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time'));
          const now = new Date();
          
          // Use cached data if less than 5 minutes old
          if (now - cachedTime < API_CACHE_DURATION) {
            // Fetch fresh data in background
            fetch(event.request).then(response => {
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                const headers = new Headers(responseToCache.headers);
                headers.set('sw-cached-time', now.toISOString());
                
                cache.put(event.request, new Response(responseToCache.body, {
                  status: responseToCache.status,
                  statusText: responseToCache.statusText,
                  headers: headers
                }));
              }
            }).catch(() => {});
            
            return cachedResponse;
          }
        }
        
        // Fetch fresh data
        try {
          const response = await fetch(event.request);
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cached-time', new Date().toISOString());
            
            cache.put(event.request, new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: headers
            }));
          }
          return response;
        } catch (error) {
          // Return stale cache if network fails
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        }
      })
    );
  } else {
    // Standard network-first strategy for other requests
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Security: Only cache successful, safe responses
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              
              // Return offline page for navigation requests
              if (event.request.mode === 'navigate') {
                return caches.match('/');
              }
            });
        })
    );
  }
});
