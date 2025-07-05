let CACHE_NAME = 'pwa-spa-cache-v1'; // Default cache name

// Function to detect if running as PWA or SPA
function detectAppType() {
    // Check if running in standalone mode (PWA)
    if (self.matchMedia && self.matchMedia('(display-mode: standalone)').matches) {
        return 'pwa';
    }
    
    // Check if launched from home screen on mobile
    if (self.navigator.standalone === true) {
        return 'pwa';
    }
    
    // Check if referrer is empty (common for PWA launches)
    if (self.document && self.document.referrer === '') {
        return 'pwa';
    }
    
    // Default to SPA
    return 'spa';
}

// Function to update cache with new name
async function updateCache() {
    console.log(`Updating cache to: ${CACHE_NAME}`);
    const cacheNames = await caches.keys();
    
    // Wait for all old caches to be deleted before proceeding
    await Promise.all(
        cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
            }
        })
    );

    // Only then open the new cache
    const cache = await caches.open(CACHE_NAME);
    console.log(`Cache updated successfully: ${CACHE_NAME}`);
}

// Listen for messages from the main page
self.addEventListener('message', (event) => {
    console.log('TEST MESSAGE');
    console.log('Service Worker received message:', event.data);
    if (event.data.type === 'SET_CACHE_NAME') {
        const newCacheName = event.data.cacheName;
        if (newCacheName !== CACHE_NAME) {
            CACHE_NAME = newCacheName;
            // Update cache with new name
            updateCache();
            // Force reinstall by updating registration
            self.registration.update();
            self.skipWaiting(); // Skip waiting to activate the new service worker immediately
            console.log(`Cache name updated to: ${CACHE_NAME}`);
        }
    } else if (event.data.type === 'FORCE_INSTALL') {
        // Manually trigger install event
        self.registration.update();
    } else if (event.data.type === 'SYNC_REQUESTS') {
        // Handle sync requests here
        console.log('Syncing requests to server...');
        // You can implement your logic to sync requests to the server
        // For example, you can fetch pending requests from IndexedDB and send them to the server
        // Pull pending requests from indexdb
        

    } else {
        console.log('Unknown message type:', event.data.type);
    }
});

self.addEventListener('install', (event) => {
    if(CACHE_NAME === 'pwa-spa-cache-v1') {
        //don't install if the cache name is the default one
        console.log('Service Worker not installing due to default cache name:', CACHE_NAME);
        return;
    } else {
        console.log('Service Worker installing...', CACHE_NAME);
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                // cache differetn spa vs pwa
                //if SPA then cache the index.html and manifest.json
                let appType = detectAppType();
                console.log('Detected app type:', appType);
                if (appType === 'spa') {
                    console.log('Caching SPA assets...');
                    return cache.addAll([
                        '/',
                        '/index.html',
                        '/manifest.json',
                        '/icon.png',
                        '/js/app.js',
                        '/js/dynamicLoader.js',
                        '/js/navigateTo.js'
                    ]);
                } else {
                    console.log('Caching PWA assets...');
                    // if PWA then cache the index.html, manifest.json, and icon
                    return cache.addAll([
                        '/',
                        '/index.html',
                        '/manifest.json',
                        '/icon.png',
                        '/js/app.js',
                        '/js/dynamicLoader.js',
                        '/js/navigateTo.js'
                    ]);
                }
            })
        );
    }
    
});

self.addEventListener('fetch', (event) => {
    console.log('test update');
    // skip if the cache name is the default one
    if (CACHE_NAME === 'pwa-spa-cache-v1') {
        console.log('Service Worker skipping fetch due to default cache name:', CACHE_NAME);
        event.respondWith(fetch(event.request)); 
    } else {
        console.log('Service Worker fetching:', event.request.url);
        const url = new URL(event.request.url);
        
        // Check if it's an API call (adjust the path as needed for your API)
        const isApiCall = url.pathname.startsWith('/api/') || 
                        url.hostname !== location.hostname;
        
        // Check if it's a static asset
        const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(url.pathname);
        
        if (event.request.mode === 'navigate') {
            event.respondWith(
                caches.match('/')
                    .then(response => response || fetch(event.request))
            );
        } else if (isApiCall) {
            // For API calls: always fetch from network (no caching)
            event.respondWith(fetch(event.request)); 
        } else if (isStaticAsset) {
            // For static assets: cache first, then fetch and cache
            event.respondWith(
                caches.match(event.request).then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(fetchResponse => {
                        // Only cache successful responses
                        if (fetchResponse.status === 200) {
                            // Clone the response before consuming it
                            const responseClone = fetchResponse.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseClone);
                            }).catch(error => {
                                console.log('Cache put failed:', error);
                            });
                        }
                        return fetchResponse; 
                    });
                })
            );
        } else {
            // For other requests: try cache first, fallback to network
            event.respondWith(
                caches.match(event.request)
                    .then(response => response || fetch(event.request))
            );
        }
    }
    
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([ 
            // Claim clients immediately
            self.clients.claim(),
            // Delete old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Only open current cache if it's not the default
            CACHE_NAME !== 'pwa-spa-cache-v1' ? caches.open(CACHE_NAME) : Promise.resolve()
        ])
    );
});