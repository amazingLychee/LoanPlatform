const express = require('express');
const { register, login, getUserProfile,addFavorite, getFavorites, removeFavorite } = require('../controllers/userController');
const authMiddleware = require('../config/jwt');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile)

router.post('/favorites/add', authMiddleware, addFavorite);
router.post('/favorites/remove', authMiddleware, removeFavorite);
router.get('/favorites', authMiddleware, getFavorites);

module.exports = router;
