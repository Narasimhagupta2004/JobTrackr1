const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/jobtrackr')
  .then(async () => {
    const user = await User.findOne({ email: 'john.doe@example.com' });
    if (user) {
      console.log('User found:');
      console.log('- Email:', user.email);
      console.log('- Has OTP:', !!user.resetOTP);
      console.log('- OTP Expiry:', user.otpExpiry);
      if (user.otpExpiry) {
        const now = new Date();
        const isExpired = now > user.otpExpiry;
        console.log('- OTP Status:', isExpired ? 'EXPIRED' : 'VALID');
        console.log('- Time remaining:', isExpired ? '0 minutes' : Math.ceil((user.otpExpiry - now) / 60000) + ' minutes');
      }
    } else {
      console.log('User not found');
    }
    mongoose.disconnect();
  })
  .catch(err => console.error('Error:', err));