const express = require('express');
const router = express.Router();
//const authController = require('../controllers/authController');
//const authMiddleware = require('../controllers/authMiddleware');


router.get('/auth/status', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

module.exports = router;