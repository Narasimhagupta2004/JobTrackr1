import axios from "axios";

// Base URL for API calls
const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API functions
export const authApi = {
  // User registration with welcome email
  signup: (data) => api.post("/auth/register", data),
  
  // User login
  login: (data) => api.post("/auth/login", data),
  
  // Request OTP for password reset
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  
  // Verify OTP and reset password
  verifyOtp: (data) => api.post("/auth/reset-password", data),
  
  // Get user profile
  getProfile: (token) => api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// Export individual functions for convenience
export const { signup, login, forgotPassword, verifyOtp, getProfile } = authApi;

export default authApi;