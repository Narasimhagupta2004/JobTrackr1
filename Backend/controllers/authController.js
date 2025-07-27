const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const emailService = require('../services/emailService');
const otpUtils = require('../utils/otpUtils');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const user = await User.create({ name, email, password });
    
    // Send welcome email (non-blocking)
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError.message);
      // Don't fail registration if email fails
    }

    res.status(201).json({ token: generateToken(user), user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    res.json({ token: generateToken(user), user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate OTP and expiry
    const otp = otpUtils.generateOTP();
    const otpExpiry = otpUtils.generateOTPExpiry();

    // Store OTP in database (plain text for simplicity, can be hashed for enhanced security)
    user.resetOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    try {
      await emailService.sendPasswordResetOTP(user.email, otp);
      res.json({ msg: 'Password reset code sent to your email' });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError.message);
      // Clear OTP data if email fails
      user.resetOTP = undefined;
      user.otpExpiry = undefined;
      await user.save();
      res.status(500).json({ msg: 'Failed to send reset email. Please try again.' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if OTP exists
    if (!user.resetOTP || !user.otpExpiry) {
      return res.status(400).json({ msg: 'No password reset request found' });
    }

    // Check if OTP is expired
    if (otpUtils.isOTPExpired(user.otpExpiry)) {
      // Clear expired OTP
      user.resetOTP = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    if (user.resetOTP !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Update password
    user.password = newPassword;
    user.resetOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
