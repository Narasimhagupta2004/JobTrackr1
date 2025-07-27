const express = require('express');
const { register, login, forgotPassword, verifyOTPAndResetPassword } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin, validateForgotPassword, validateResetPassword } = require('../middleware/validationMiddleware');
const User = require('../models/User');

// Authentication routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Password reset routes
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, verifyOTPAndResetPassword);

// Profile route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // req.user.id is set by authMiddleware
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
