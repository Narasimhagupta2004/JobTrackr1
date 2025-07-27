# JobTrackr API Documentation - Email System

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user and send welcome email

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-07-27T13:54:45.123Z",
    "updatedAt": "2025-07-27T13:54:45.123Z"
  }
}
```

**Error Responses:**
- `400`: User already exists
- `400`: Validation errors (invalid email, weak password, missing name)
- `500`: Server error

---

### 2. Login User
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and return JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-07-27T13:54:45.123Z",
    "updatedAt": "2025-07-27T13:54:45.123Z"
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `400`: Validation errors (invalid email format)
- `500`: Server error

---

### 3. Forgot Password
**Endpoint:** `POST /auth/forgot-password`

**Description:** Request password reset OTP via email

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "msg": "Password reset code sent to your email"
}
```

**Error Responses:**
- `404`: User not found
- `400`: Invalid email format
- `500`: Failed to send reset email / Server error

---

### 4. Reset Password
**Endpoint:** `POST /auth/reset-password`

**Description:** Verify OTP and reset user password

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "msg": "Password reset successfully"
}
```

**Error Responses:**
- `404`: User not found
- `400`: No password reset request found
- `400`: OTP has expired. Please request a new one.
- `400`: Invalid OTP
- `400`: Validation errors (invalid email, invalid OTP format, weak password)
- `500`: Server error

---

### 5. Get User Profile
**Endpoint:** `GET /auth/profile`

**Description:** Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Success Response (200):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-07-27T13:54:45.123Z",
  "updatedAt": "2025-07-27T13:54:45.123Z"
}
```

**Error Responses:**
- `401`: No token provided / Invalid token
- `404`: User not found
- `500`: Server error

## Email Templates

### Welcome Email
- **Subject:** "Welcome to JobTrackr!"
- **Trigger:** User registration
- **Content:** Personalized welcome message

### Password Reset Email
- **Subject:** "JobTrackr Password Reset Code"
- **Trigger:** Forgot password request
- **Content:** 6-digit OTP with 10-minute expiry notice

## Validation Rules

### Email
- Must be valid email format
- Required for all email-related operations

### Password
- Minimum 6 characters
- Required for registration and password reset

### Name
- Cannot be empty or whitespace only
- Required for registration

### OTP
- Must be exactly 6 digits
- Required for password reset

## Error Handling

All errors follow this format:
```json
{
  "msg": "Error message description"
}
```

## Rate Limiting & Security

- OTP expires after 10 minutes
- OTP is single-use (cleared after successful reset)
- Email delivery has retry mechanism (up to 3 attempts)
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "newPassword": "newpassword123"
  }'
```