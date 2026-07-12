# Backend: JobTrackr API

## Overview
This backend implements the API for JobTrackr, a personal job application tracker. It is built with Node.js, Express, MongoDB, and includes authentication, job management, file uploads, password reset by OTP, and email notifications.

## Key Features
- User registration and login with JWT authentication
- Password reset using one-time password (OTP) delivered via email
- Password change for authenticated users
- Create, read, update, delete (CRUD) job entries
- Upload and serve resume and job description files
- User profile retrieval with authentication
- MongoDB data models for users and jobs

## Folder Structure
- `server.js` - Express application entry point
- `controllers/` - Route handler logic
  - `authController.js` - register, login, forgot/reset password, change password, profile
  - `jobController.js` - create, list, retrieve, update, delete jobs
- `routes/` - Express route definitions
  - `authRoutes.js` - `/api/auth/*`
  - `jobRoutes.js` - `/api/jobs/*`
- `models/` - Mongoose schemas
  - `User.js` - user data, password hashing, OTP fields
  - `Job.js` - job application data, file paths, status, notes
- `middleware/` - request validation and auth handling
  - `authMiddleware.js` - validates JWT tokens and attaches user ID to `req.user`
  - `uploadMiddleware.js` - handles file uploads with Multer for `resume` and `jd`
- `services/` - reusable service logic
  - `emailService.js` - sends emails via Nodemailer (welcome email, password reset OTP)
- `utils/` - utility helpers
  - `otpUtils.js` - OTP generation, expiry, and verification logic
- `uploads/` - uploaded files served as static assets
- `.env.example` - environment variable template

## API Endpoints
### Authentication
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive JWT token
- `POST /api/auth/forgot-password` — request a password reset OTP
- `POST /api/auth/reset-password` — verify OTP and set a new password
- `POST /api/auth/change-password` — change password for logged-in user
- `GET /api/auth/profile` — get current authenticated user profile

### Jobs
- `POST /api/jobs` — create a job entry with optional file uploads (`resume`, `jd`)
- `GET /api/jobs` — list jobs for the authenticated user
- `GET /api/jobs/:id` — retrieve job details by ID
- `PUT /api/jobs/:id` — update a job entry
- `DELETE /api/jobs/:id` — delete a job entry

### Recommendations
- `POST /api/recommendations` — generate a ranked shortlist for the authenticated user's saved jobs based on a profile or resume summary

> All `/api/jobs` and `/api/recommendations` routes require a valid `Authorization: Bearer <token>` header.

## Data Models
### User
- `name`: string, required
- `email`: string, unique, required
- `password`: string, required (hashed automatically)
- `resetOTP`: string
- `otpExpiry`: Date

### Job
- `user`: ObjectId reference to `User`
- `company`: string, required
- `position`: string, required
- `status`: enum `[Applied, Interview, Rejected, Offer]`
- `source`: string
- `deadline`: Date
- `notes`: string
- `resumePath`: string filename
- `jdPath`: string filename

## Environment Variables
Copy `.env.example` to `.env` and configure the following values:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used for signing JWT tokens
- `OPENAI_API_KEY` — OpenAI API key for job shortlist recommendations
- `EMAIL_USER` — Gmail sender email
- `EMAIL_PASS` — Gmail app password or SMTP password

## Run Locally
1. Install dependencies:
   ```bash
   cd Backend
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Backend runs on port `5000` by default and exposes APIs under `/api`.

## Notes
- Uploaded files are stored in `Backend/uploads` and served at `/uploads/*`.
- Passwords are hashed with bcrypt when a user is created or when password changes.
- The email service is configured for Gmail and expects credentials in environment variables.
