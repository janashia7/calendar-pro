const express = require('express');
const userController = require('../controllers/user-controller');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const router = express.Router();

router.get('/dashboard', isLoggedIn, userController.getDashboard);

router.get('/events', userController.getEvents);

module.exports = router;
