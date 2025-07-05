const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const fH = require('./utils/fileHashes');
const { jParse, jEncode } = require('./utils/jsonParse');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the public directory and cache them
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1y', // Cache static files for 1 year
  etag: true,
  lastModified: true,
  setHeaders: function (res, path) {
    // Different cache strategies for different file types
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
  }
}));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get(/^\/(?!api|auth).*/, (req, res, next) => {
  console.log(`Handling request for: ${req.originalUrl}`);
  const url = (req.originalUrl || '').toLowerCase();

  // Let /api/* fall through to 404 if not matched
  if (url.startsWith('/api')) {
    return res.status(404).json({ error: 'API Route not found' });
  }

  // Let /auth/* fall through to 404 if not matched
  if (url.startsWith('/auth')) {
    return res.status(404).json({ error: 'API Route not found' });
  }

  // Render SPA frontend
  try {
    let fileHashes = fH.fileHashParser('./fileHashes.json')
    console.log('File hashes:', fileHashes);
    const b = require('./utils/buildIndexHtml');
    const { csp, nonce } = b.generateCSP();
    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('Content-Type', 'text/html');
    const html = b.generateIndexHtml(req, csp, nonce, jEncode(fileHashes));
    res.send(html);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

module.exports = app;