// Input validation middleware for email-related endpoints

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateOTP = (otp) => {
  // Must be exactly 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

exports.validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ msg: 'Name is required' });
  }

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }

  if (!password) {
    return res.status(400).json({ msg: 'Password is required' });
  }

  next();
};

exports.validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }

  next();
};

exports.validateResetPassword = (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ msg: 'Valid email is required' });
  }

  if (!otp || !validateOTP(otp)) {
    return res.status(400).json({ msg: 'Valid 6-digit OTP is required' });
  }

  if (!newPassword || !validatePassword(newPassword)) {
    return res.status(400).json({ msg: 'New password must be at least 6 characters long' });
  }

  next();
};