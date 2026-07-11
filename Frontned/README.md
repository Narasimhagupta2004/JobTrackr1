# Frontend: JobTrackr React App

## Overview
This front-end is a React + Vite application for JobTrackr. It provides user authentication, job tracking, file uploads, password reset workflow, and dashboard views. It interacts with the backend API at `http://localhost:5000/api`.

## Key Features
- User signup and login
- Protected routes for authenticated users
- Dashboard to view job application summaries
- Job list management with create, edit, and delete actions
- Upload resumes and job descriptions when adding jobs
- Password reset via OTP email
- Change password and profile display
- Toast notifications for success/error messages

## Folder Structure
- `src/` — source code for the React app
  - `App.jsx` — main router and application layout
  - `main.jsx` — React app entry point
  - `api/authApi.js` — API wrapper for auth-related backend calls
  - `components/` — reusable UI components
    - `Navbar.jsx` — top navigation and auth links
    - `FormInput.jsx` — reusable input field component
    - `ProtectedRoute.jsx` — enforces authentication on private routes
    - `EmailTestDemo.jsx` — demo page for email-related functionality
  - `pages/` — app pages and route targets
    - `Signup.jsx` — sign-up form
    - `Register.jsx` — alternate registration page
    - `Login.jsx` — login form
    - `ForgotPassword.jsx` — request reset OTP
    - `ResetPassword.jsx` — submit OTP and new password
    - `Dashboard.jsx` — authenticated home page / overview
    - `JobForm.jsx` — add new job entry page
    - `JobList.jsx` — list user jobs and actions
    - `EditJob.jsx` — edit existing job entry
    - `Profile.jsx` — show user profile information
    - `Change-Password.jsx` — update current password
  - `assets/` — static assets used by the app
  - `App.css`, `index.css` — global styles

## Routes
- `/login` — login page
- `/signup` — signup page
- `/register` — registration page
- `/forgot-password` — request password reset OTP
- `/reset-password` — verify OTP and change password
- `/email-test` — demo email page
- `/` — protected dashboard
- `/profile` — protected profile page
- `/jobs` — protected job list page
- `/add-job` — protected create job page
- `/edit-job/:id` — protected edit job page
- `/change-password` — protected change-password page

## Backend Integration
The frontend uses `axios` and `authApi.js` to communicate with backend endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile`
- `POST /api/auth/change-password`

Protected pages require a JWT token stored in `localStorage` and sent in the `Authorization: Bearer <token>` header.

## Setup and Run
1. Install dependencies:
   ```bash
   cd Frontned
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. The app uses Vite and typically runs on `http://localhost:5173`.

## Notes
- The folder name is `Frontned` in this repository.
- The app is styled with Tailwind CSS and uses MUI icons, React Router, React Toastify, and Zustand.
- The frontend depends on the backend API for authentication and job CRUD operations.
