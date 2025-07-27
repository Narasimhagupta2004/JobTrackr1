# 🚀 JobTrackr Email System - Complete Setup Guide

## 📋 Overview
This guide provides step-by-step instructions to set up and test the complete email notification system for JobTrackr, including both backend and frontend components.

## 🎯 Features Implemented

### ✅ Backend Features
- **Welcome Email on Registration** - Personalized greeting sent automatically
- **Password Reset with OTP** - 6-digit verification code via email
- **Secure OTP Generation** - Using crypto.randomBytes() for security
- **Time-Limited OTPs** - 10-minute expiry for enhanced security
- **Email Retry Logic** - Up to 3 retry attempts for failed emails
- **Input Validation** - Comprehensive validation middleware
- **Error Handling** - User-friendly error messages

### ✅ Frontend Features
- **Forgot Password Flow** - Complete UI for password reset
- **OTP Verification** - User-friendly OTP input with timer
- **Real-time Countdown** - Visual timer showing OTP expiry
- **Resend Functionality** - Ability to request new OTP
- **Password Visibility Toggles** - Enhanced UX for password fields
- **Loading States** - Visual feedback during API calls
- **Responsive Design** - Mobile-friendly interface

## 🛠️ Prerequisites

### System Requirements
- **Node.js** v16+ 
- **npm** v8+
- **Gmail Account** with App Password enabled
- **MongoDB** (local or cloud)

### Email Setup (Gmail)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Save the 16-character password

## 📁 Project Structure
```
JobTrackr1/
├── Backend/
│   ├── controllers/authController.js    # Updated with email functions
│   ├── models/User.js                   # Added OTP fields
│   ├── routes/authRoutes.js             # Added password reset routes
│   ├── services/emailService.js         # Email handling service
│   ├── utils/otpUtils.js                # OTP generation utilities
│   ├── middleware/validationMiddleware.js # Input validation
│   ├── .env.example                     # Environment template
│   └── package.json                     # Updated dependencies
└── Frontned/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx                # Updated with forgot password link
    │   │   ├── ForgotPassword.jsx       # Request password reset
    │   │   └── ResetPassword.jsx        # OTP verification & reset
    │   ├── components/
    │   │   └── EmailTestDemo.jsx        # Testing component
    │   └── App.jsx                      # Updated routes
    └── package.json                     # All dependencies included
```

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd JobTrackr1/Backend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your credentials
nano .env
```

**Required .env Configuration:**
```env
# Database
MONGO_URI=mongodb://localhost:27017/jobtrackr
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/jobtrackr

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Server
PORT=5000
```

### 3. Start Backend Server
```bash
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
Email service initialized
```

### 4. Test Backend APIs
```bash
# Test welcome email (registration)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Test forgot password
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd JobTrackr1/Frontned
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.0.5  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 3. Access Application
Open your browser and navigate to: `http://localhost:5173`

## 🧪 Testing the Complete Flow

### 1. **Registration with Welcome Email**
1. Go to `http://localhost:5173/register`
2. Fill in user details and submit
3. Check email for welcome message
4. Verify successful login

### 2. **Forgot Password Flow**
1. Go to `http://localhost:5173/login`
2. Click "Forgot your password?"
3. Enter your email address
4. Click "Send Reset Code"
5. Check email for 6-digit OTP
6. Enter OTP and new password
7. Verify successful password reset

### 3. **Email Test Dashboard**
1. Go to `http://localhost:5173/email-test`
2. Use test buttons to verify API endpoints
3. Monitor results in the dashboard

## 🔍 Troubleshooting

### Common Issues & Solutions

#### **Backend Issues**

**❌ "Email service not configured"**
```bash
# Solution: Check .env file
cat Backend/.env | grep EMAIL
# Should show EMAIL_USER and EMAIL_PASS
```

**❌ "MongoDB connection failed"**
```bash
# Solution: Check MongoDB status
# For local MongoDB:
sudo systemctl status mongod

# For MongoDB Atlas: Check connection string
```

**❌ "Port 5000 already in use"**
```bash
# Solution: Kill process or change port
lsof -ti:5000 | xargs kill -9
# Or change PORT in .env file
```

#### **Frontend Issues**

**❌ "Network Error" in browser**
```bash
# Solution: Ensure backend is running
curl http://localhost:5000/api/auth/login
# Should return method not allowed (405)
```

**❌ "Module not found" errors**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### **Email Issues**

**❌ "Authentication failed" for Gmail**
```bash
# Solution: Verify App Password
# 1. Check 2FA is enabled
# 2. Generate new App Password
# 3. Use 16-character password (no spaces)
```

**❌ "Email not received"**
```bash
# Solution: Check multiple locations
# 1. Inbox
# 2. Spam/Junk folder
# 3. Backend logs for errors
# 4. Gmail "Sent" folder
```

## 📊 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register + Welcome Email | `{name, email, password}` |
| POST | `/api/auth/login` | User Login | `{email, password}` |
| POST | `/api/auth/forgot-password` | Request OTP | `{email}` |
| POST | `/api/auth/reset-password` | Reset Password | `{email, otp, newPassword}` |
| GET | `/api/auth/profile` | Get Profile | Headers: `Authorization: Bearer <token>` |

### Response Examples

**Successful Registration:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "2025-07-27T10:30:00.000Z"
  }
}
```

**Forgot Password Success:**
```json
{
  "msg": "Password reset code sent to your email"
}
```

**Reset Password Success:**
```json
{
  "msg": "Password reset successfully"
}
```

## 🔒 Security Features

### Backend Security
- **Secure OTP Generation** using `crypto.randomBytes()`
- **Time-Limited OTPs** (10-minute expiry)
- **Single-Use OTPs** (cleared after successful reset)
- **Input Validation** on all endpoints
- **Password Hashing** using bcrypt
- **JWT Authentication** with 7-day expiry
- **Rate Limiting** (can be added)

### Frontend Security
- **Input Sanitization** (trimming, validation)
- **Password Masking** with visibility toggles
- **Auto-Clear Sensitive Data** after operations
- **HTTPS Enforcement** (in production)
- **XSS Protection** via React's built-in escaping

## 🚀 Production Deployment

### Environment Configuration
```env
# Production .env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/jobtrackr
JWT_SECRET=super-secure-production-secret
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=production-app-password
PORT=5000
```

### Build Commands
```bash
# Backend (no build needed)
cd Backend
npm install --production

# Frontend
cd Frontned
npm run build
# Serve dist/ folder with nginx or similar
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Email credentials verified
- [ ] HTTPS certificates installed
- [ ] Domain DNS configured
- [ ] Firewall rules set
- [ ] Monitoring tools configured

## 📈 Performance Optimization

### Backend Optimizations
- **Email Queue System** (Redis + Bull)
- **Database Indexing** on email fields
- **Caching** for frequently accessed data
- **Rate Limiting** to prevent abuse
- **Connection Pooling** for MongoDB

### Frontend Optimizations
- **Code Splitting** for route-based chunks
- **Lazy Loading** for non-critical components
- **Image Optimization** and compression
- **Service Worker** for offline functionality
- **Bundle Analysis** to identify bottlenecks

## 🔄 Maintenance

### Regular Tasks
- **Monitor email delivery rates**
- **Check error logs** for issues
- **Update dependencies** regularly
- **Backup database** regularly
- **Review security** practices

### Monitoring
- **Email delivery success rate**
- **API response times**
- **Error rates and types**
- **User registration/login patterns**
- **OTP usage statistics**

## 📞 Support & Resources

### Documentation
- **Backend API**: `Backend/API_DOCUMENTATION.md`
- **Frontend Guide**: `Frontned/FRONTEND_EMAIL_SYSTEM.md`
- **Email Setup**: `Backend/EMAIL_SYSTEM_README.md`

### Testing Tools
- **Postman Collection**: Available for API testing
- **Frontend Test Dashboard**: `http://localhost:5173/email-test`
- **Backend Test Script**: `Backend/test-email.js` (removed in production)

### Common Commands
```bash
# Start both servers
cd Backend && npm start &
cd Frontned && npm run dev

# Check logs
tail -f Backend/logs/app.log

# Test email configuration
cd Backend && node -e "console.log(process.env.EMAIL_USER)"

# Build for production
cd Frontned && npm run build
```

## ✅ Success Criteria

Your email system is working correctly when:

1. **✅ Registration sends welcome email**
2. **✅ Forgot password sends OTP email**
3. **✅ OTP verification works correctly**
4. **✅ Password reset completes successfully**
5. **✅ All frontend components render properly**
6. **✅ Error handling works as expected**
7. **✅ Email delivery is reliable**
8. **✅ Security measures are in place**

---

**🎉 Congratulations!** You now have a complete, production-ready email notification system for JobTrackr!

**Last Updated**: July 27, 2025  
**Version**: 1.0.0  
**Support**: Check documentation files for detailed troubleshooting