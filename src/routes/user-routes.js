const express = require('express');
const userController = require('../controllers/user-controller');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const router = express.Router();

router.get('/dashboard', isLoggedIn, userController.getDashboard);

router.get('/events', userController.addReminder);

router.post('/sendCode', userController.sendCode.bind());

router.post('/verify', userController.verify.bind());

module.exports = router;
