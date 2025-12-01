const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController'); // Check the file path and extension

// Define the routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.signin); // Rename the signin controller function

module.exports = router;
