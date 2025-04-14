const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware
const User = require('../models/User'); // Import the User model

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Protected route to get current user details
router.get('/user', authMiddleware, async (req, res) => {
    try {
        // Fetch user details from the database using the user ID from the JWT payload
        const user = await User.findById(req.user.userId).select('-password'); // Don't include the password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
