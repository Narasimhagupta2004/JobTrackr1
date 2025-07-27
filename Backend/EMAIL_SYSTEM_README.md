# JobTrackr Email Notification System

This document describes the email notification system implemented for the JobTrackr application according to the Software Requirements Specification (SRS).

## Features Implemented

### 1. Welcome Email on User Registration
- **Trigger**: Automatically sent when a new user successfully registers
- **Subject**: "Welcome to JobTrackr!"
- **Content**: Personalized welcome message with user's name
- **Non-blocking**: Registration succeeds even if email fails

### 2. Password Reset with OTP
- **Forgot Password**: User can request password reset by providing email
- **OTP Generation**: Secure 6-digit OTP with 10-minute expiry
- **Email Delivery**: OTP sent via styled HTML email
- **Verification**: OTP validation before allowing password reset

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Request/Response Examples

#### Register User (with Welcome Email)
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Forgot Password
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password with OTP
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

## Configuration

### Environment Variables
Add the following to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password as `EMAIL_PASS`

## Database Schema Updates

The User model now includes:
```javascript
{
  name: String,
  email: String,
  password: String,
  resetOTP: String,        // 6-digit OTP for password reset
  otpExpiry: Date,         // OTP expiration timestamp
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## Security Features

### OTP Security
- **Random Generation**: Cryptographically secure 6-digit OTP
- **Time-Limited**: 10-minute expiry window
- **Single Use**: OTP cleared after successful reset
- **Auto-Cleanup**: Expired OTPs are automatically cleared

### Input Validation
- Email format validation
- Password strength requirements (minimum 6 characters)
- OTP format validation (exactly 6 digits)

### Error Handling
- Graceful email failure handling
- Secure error messages (no sensitive data exposure)
- Retry mechanism for email delivery (up to 3 attempts)

## File Structure

```
Backend/
├── controllers/
│   └── authController.js      # Updated with email functionality
├── middleware/
│   └── validationMiddleware.js # Input validation
├── models/
│   └── User.js               # Updated with OTP fields
├── routes/
│   └── authRoutes.js         # Updated with new endpoints
├── services/
│   └── emailService.js       # Email sending service
├── utils/
│   └── otpUtils.js          # OTP generation and validation
└── test-email.js            # Testing script (remove in production)
```

## Testing

### Manual Testing
1. Run the test script:
```bash
node test-email.js
```

2. Test the API endpoints using Postman or curl

### Test Cases Covered
- ✅ TC01: Signup → Welcome Email
- ✅ TC02: Forgot Password → OTP Email
- ✅ TC03: Invalid Email → Error Response
- ✅ TC04: Valid OTP → Password Reset Success
- ✅ TC05: Invalid/Expired OTP → Error Response

## Performance Considerations

- **Non-blocking Email**: Registration/login don't wait for email delivery
- **Retry Logic**: Failed emails are retried up to 3 times with exponential backoff
- **Database Optimization**: OTP fields are indexed for quick lookups
- **Memory Efficient**: OTPs are automatically cleaned up after use/expiry

## Compliance & Best Practices

- **GDPR Compliant**: Transactional emails (no marketing consent required)
- **Email Best Practices**: Proper HTML formatting, clear unsubscribe info
- **Security**: No sensitive data in email content
- **Accessibility**: HTML emails with proper structure

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check EMAIL_USER and EMAIL_PASS in .env
   - Verify Gmail App Password is correct
   - Check console logs for detailed error messages

2. **OTP expired**
   - OTPs expire after 10 minutes
   - Request a new OTP if expired

3. **Invalid OTP**
   - Ensure OTP is exactly 6 digits
   - Check for typos in email/OTP

### Logs
The system logs all email attempts and errors to the console for debugging.

## Future Enhancements

- Email templates with better styling
- Support for other email providers (SendGrid, AWS SES)
- Email verification for new registrations
- Notification preferences for users
- Email analytics and tracking