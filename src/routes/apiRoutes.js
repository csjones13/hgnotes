const express = require('express');
const router = express.Router();
//const authController = require('../controllers/authController');
//const authMiddleware = require('../controllers/authMiddleware');


router.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

module.exports = router;