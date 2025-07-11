export function cssLoader(key) {
    if (!key) {
        throw new Error('No key provided for dynamic import.');
    }

    //load the hashes json
    const fileHashes = window.__FILE_HASHES__;

    //ensure the hash exists
    if (!fileHashes || !fileHashes[`${key}.css`]) {
        throw new Error(`No file hash found for key: ${key}`);
    }

    //set the import path as via minimized files all min files are in one folder
    let src = `/css/min/${key}.min.css?v=${fileHashes[`${key}.css`].hash}`;

    if(window.__NODE_ENV__ === 'development') {
        // In development, load the non-minified version which will have subfolders
        src = `/css/${fileHashes[`${key}.css`].path}?v=${fileHashes[`${key}.css`].hash}`;
    }

    let id = `${key}-css-stylesheet`;

     let p = new Promise(function(resolve, reject) {
        console.log(`Attempting to load module from: ${src}`, 'loading with key:', key);
        if((key && document.getElementById(id))) {
            console.log(`Module ${key} already loaded, returning existing instance.`);
            resolve(true); // CSS is already loaded, resolve with true
        } else {
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = src;
            link.id = id;

            document.head.appendChild(link);
            link.onload = function() {
                resolve(true); // CSS loaded successfully
            }

            link.onerror = function() {
                resolve(false);
            }
        }

    });

    return p;
}
