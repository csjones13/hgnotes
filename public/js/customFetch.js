const DB_NAME = window.__LOCAL_DB__ || 'offline-sync-db';
const STORE_NAME = window.__STORE_NAME_PENDING__ || 'pending-requests';

// Open IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { autoIncrement: true });
        };
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
  });
}

// Store request in IndexedDB
async function storeRequest(request) {
    // Clone the request to avoid consuming the body
    const clonedRequest = request.clone();
    
    // Read the body data BEFORE opening the database transaction
    let bodyData;
    try {
        bodyData = await clonedRequest.json();
    } catch (error) {
        // If it's not JSON, get it as text
        bodyData = await clonedRequest.text();
    }

    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const requestData = {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        body: bodyData,
        timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
        const storeRequest = store.add(requestData);
        storeRequest.onsuccess = () => resolve();
        storeRequest.onerror = () => reject(storeRequest.error);
        
        // Handle transaction errors
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted'));
    });
}

// Wrapper for fetch to store requests in IndexedDB
// This function will be used as middle ware for posting data to the server
// this function will post data to the indexDB and notify the service worker to sync the requests to the server
export async function customPost(url, options = {}) {
    // Post message here that we are starting the process
    console.log('ACTIVATE LOADING', 'customFetch called with URL:', url, 'and options:', options);

    // default method is POST
    !options.method ? options.method = 'POST' : options.method = options.method.toUpperCase();
    // default headers
    !options.headers ? options.headers = {} : options.headers = options.headers;
    !options.headers.Authorization ? options.headers.Authorization = `Bearer token-placeholder` : options.headers.Authorization = options.headers.Authorization;
    !options.headers['Content-Type'] ? options.headers['Content-Type'] = 'application/json' : options.headers['Content-Type'] = options.headers['Content-Type'];
    
    // create the request object
    const request = new Request(url, options);

    // store the request in IndexedDB -> always store locally and process to api in the background
    await storeRequest(request);


    console.log('see if we have a service worker registered', navigator.serviceWorker.controller);
    // Notify Service Worker to sync if we have a service worker registered
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {               
        console.log('Sending message to service worker to sync requests');
        navigator.serviceWorker.controller.postMessage({
            type: 'SYNC_REQUESTS',
            storeName: STORE_NAME,
            dbName: DB_NAME
        });
    }

    // Close the Loading sequence
    console.log('DEACTIVATE LOADING');

    // Return a response indicating the request was queued
    console.log('Request queued for offline processing:', url);
    return new Response(JSON.stringify({ status: 'queued' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
    });
}

// wrapper function to attempt to fetch data from the server and if not available attempt to fetch from the indexDB
// this function will be used as middle ware for fetching data from the server
// this function will store data in the indexDB after fetching it from the server to make it available offline
export async function customFetch(url, options = {}) {
    // Post message here that we are starting the process
    console.log('ACTIVATE LOADING', 'customFetch called with URL:', url, 'and options:', options);

    // default method is POST
    !options.method ? options.method = 'POST' : options.method = options.method.toUpperCase();
    // default headers
    !options.headers ? options.headers = {} : options.headers = options.headers;
    !options.headers.Authorization ? options.headers.Authorization = `Bearer token-placeholder` : options.headers.Authorization = options.headers.Authorization;
    !options.headers['Content-Type'] ? options.headers['Content-Type'] = 'application/json' : options.headers['Content-Type'] = options.headers['Content-Type'];
    
    // create the request object
    const request = new Request(url, options);

    try {
        // Attempt to fetch the data from the server
        const response = await fetch(request);

        // If the response is ok, return it
        if (response.ok) {
            // Store the response in IndexedDB for offline use
            const responseData = await response.json();
            await storeRequest(new Request(url, {
                method: options.method,
                headers: options.headers,
                body: JSON.stringify(responseData)
            }));
            console.log('Response fetched from server:', responseData);
            return new Response(JSON.stringify(responseData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            throw new Error(`Server responded with status ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch failed, attempting to retrieve from IndexedDB:', error);

        // If the fetch fails, try to retrieve the data from IndexedDB
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        
        return new Promise((resolve, reject) => {
            const getRequest = store.getAll(); // Get all requests stored in IndexedDB
            getRequest.onsuccess = () => {
                if (getRequest.result.length > 0) {
                    console.log('Data retrieved from IndexedDB:', getRequest.result);
                    resolve(new Response(JSON.stringify(getRequest.result), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                } else {
                    reject(new Error('No data found in IndexedDB'));
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }
}

export function makeid(params = {}) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let check = true;
    while(check) {
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        if(!document.getElementById(`i${text}`)) {
            check = false;
        }
    }
    return `i${text}`;
}