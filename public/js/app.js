import(`./dynamicLoader.js?v=${window.__FILE_HASHES__['dynamicLoader.js'].hash}`)
    .then(({ loader }) => {
        // Ensure the loader is available globally
        window.JSLoader = loader;
        import(`./customFetch.js?v=${window.__FILE_HASHES__['customFetch.js'].hash}`)
            .then(({ customPost, customFetch, makeid }) => {
                // Ensure custom fetch functions are available globally
                window.CPost = customPost;
                window.CFetch = customFetch; 
                window.makeid = makeid;   
                // Start the app
                console.log('Dynamic loader and custom fetch functions loaded successfully. Starting app...');

                // load the service worker
                if ('serviceWorker' in navigator) {
                    console.log('Service Worker is supported in this browser');
                    const cacheName = `pwa-spa-cache-v${window.__FILE_HASHES__['sw.js'].hash}`; // Dynamic cache name
                    
                    navigator.serviceWorker.register(`/sw.js?v=${window.__FILE_HASHES__['sw.js'].hash}`)
                        .then(reg => {
                            console.log('Service Worker registered:', reg);
                            
                            // Handle different registration states
                            let serviceWorker;
                            if (reg.installing) {
                                console.log('Service Worker installing...');
                                serviceWorker = reg.installing;
                            } else if (reg.waiting) {
                                console.log('Service Worker waiting...');
                                serviceWorker = reg.waiting;
                            } else if (reg.active) {
                                console.log('Service Worker active');
                                serviceWorker = reg.active;
                            }
                            
                            // Send cache name when service worker is ready
                            const sendCacheName = () => {
                                if (navigator.serviceWorker.controller) {
                                    console.log('Sending cache name to service worker:', cacheName);
                                    navigator.serviceWorker.controller.postMessage({
                                        type: 'SET_CACHE_NAME',
                                        cacheName: cacheName
                                    });
                                } else {
                                    console.log('No service worker controller available yet');
                                }
                            };
                            
                            // If there's already a controller, send the message
                            if (navigator.serviceWorker.controller) {
                                sendCacheName();
                            } else {
                                // Wait for the service worker to become the controller
                                navigator.serviceWorker.addEventListener('controllerchange', () => {
                                    console.log('Service worker controller changed');
                                    sendCacheName();
                                });
                            }
                            
                            // Also listen for state changes
                            if (serviceWorker) {
                                serviceWorker.addEventListener('statechange', () => {
                                    console.log('Service Worker state changed:', serviceWorker.state);
                                    if (serviceWorker.state === 'activated') {
                                        // Give it a moment to become controller
                                        setTimeout(sendCacheName, 100);
                                    }
                                });
                            }
                        })
                        .catch(err => console.error('Service Worker registration failed:', err));
                }
                
                // Intercept click events on links
                document.addEventListener('click', (e) => {
                    const link = e.target.closest('[data-link]');
                    if(link) {
                        e.preventDefault();
                        JSLoader('navigateTo', {link: link.getAttribute('href')});
                    }
                });

                // Handle popstate events (back/forward navigation) this will also initialize the router on page load
                window.addEventListener('popstate', JSLoader('router'));

                
            })
            .catch(err => {
                console.error('Error loading custom fetch tools:', err);
            });
    })
    .catch(err => {
        console.error('Error loading dynamic loader:', err);
    });
    