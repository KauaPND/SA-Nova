const express = require('express');
const { register, login, getUser } = require('../controller/authController');
const { verifyToken } = require('../authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getUser);

module.exports = router;
