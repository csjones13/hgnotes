const crypto = require('crypto');
//require('dotenv').config();
const { jParse, jEncode } = require('./jsonParse');

const generateCSP = () => {
    const nonce = crypto.randomBytes(16).toString('base64');
    const csp = [
        `default-src 'self'`,
        `script-src 'self' 'nonce-${nonce}'`,
        `style-src 'self'`,
        `img-src 'self' data:`,
        `connect-src 'self'`,
        `font-src 'self'`,
        `object-src 'none'`,
        `frame-src 'none'`,
    ].join('; ');

    return{ csp, nonce };
}

const generateIndexHtml = (req, csp, nonce, fileHashes) => {
    const metaTags = [
        `<meta charset="UTF-8">`,
        `<meta http-equiv="Content-Security-Policy" content="${csp}">`,
    ].join('\n   ');

    let html = '';

    let fH = jParse(fileHashes);;

    html = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>My App - ${req.path || 'Home'}</title>
                    ${metaTags}
                    
                    <!-- Set the favicon -->
                    <link rel="icon" href="/favicon.png">
                    <! -- set the manifest for PWA -->
                    <link rel="manifest" href="/manifest.json?v=${fH["manifest.json"].hash}">

                    <script nonce="${nonce}">
                        window.__FILE_HASHES__ = ${fileHashes};
                        window.__NODE_ENV__ = "${process.env.NODE_ENV}";
                        window.__LOCAL_DB__ = "${process.env.LOCAL_DB}";
                        window.__STORE_NAME_PENDING__ = "${process.env.STORE_NAME_PENDING}";

                        window.__APP_TITLE__ = "HG";
                        
                        // Initialize global variables
                        window.__CLASSES__ = {};
                        window.__FUNCTIONS__ = {};
                        window.__COMPONENTS__ = {};
                    </script>
                    
                    <link async rel="preload" as="style" id="custom-bootstrap" href="/css/custom-bootstrap.css?v=${fH["custom-bootstrap.css"].hash}">
                    <link async rel="preload" as="style" id="grid-templates" href="/css/grid-templates.css?v=${fH["grid-templates.css"].hash}">
                    <link async rel="preload" as="style" id="generic" href="/css/generic.css?v=${fH["generic.css"].hash}">
                    <link async rel="preload" as="style" id="styles" href="/css/styles.css?v=${fH["styles.css"].hash}">

                    <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                </head>
                <body>
                    <div id="nav"></div>
                    <div id="root"></div>
                    <div id="footer"></div>
                    <script type="module" nonce="${nonce}" src="/js/app.js?v=${fH["app.js"].hash}"></script>
                    <script type="text/javascript" nonce="${nonce}">
                        

                        document.addEventListener('DOMContentLoaded', function() {
                            document.getElementById("custom-bootstrap").rel = "stylesheet";
                            document.getElementById("grid-templates").rel = "stylesheet";
                            document.getElementById("generic").rel = "stylesheet";
                            document.getElementById("styles").rel = "stylesheet";
                        });
                    </script>
                </body>
            </html>`;

    return html;
}

module.exports = { generateCSP, generateIndexHtml };