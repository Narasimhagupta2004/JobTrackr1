const crypto = require('crypto');

class OTPUtils {
  /**
   * Generate a secure 6-digit OTP
   * @returns {string} 6-digit OTP
   */
  generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  /**
   * Generate OTP expiry time (10 minutes from now)
   * @returns {Date} Expiry date
   */
  generateOTPExpiry() {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // 10 minutes from now
    return expiry;
  }

  /**
   * Check if OTP is expired
   * @param {Date} expiryDate - The expiry date to check
   * @returns {boolean} True if expired, false otherwise
   */
  isOTPExpired(expiryDate) {
    return new Date() > expiryDate;
  }

  /**
   * Hash OTP for secure storage (optional - for enhanced security)
   * @param {string} otp - The OTP to hash
   * @returns {string} Hashed OTP
   */
  hashOTP(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Verify OTP against hash (optional - for enhanced security)
   * @param {string} otp - The OTP to verify
   * @param {string} hashedOTP - The hashed OTP to compare against
   * @returns {boolean} True if OTP matches, false otherwise
   */
  verifyOTP(otp, hashedOTP) {
    const otpHash = this.hashOTP(otp);
    return otpHash === hashedOTP;
  }
}

module.exports = new OTPUtils();