import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LockReset, 
  ArrowBack, 
  Visibility, 
  VisibilityOff,
  Timer,
  CheckCircle
} from '@mui/icons-material';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // Clear error when user types
  };

  const handleResendOTP = async () => {
    if (!formData.email) {
      setError('Email is required to resend OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: formData.email
      });
      setMessage('New verification code sent to your email');
      setTimeLeft(600); // Reset timer
      setCanResend(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.otp.trim()) {
      setError('Verification code is required');
      return false;
    }
    if (formData.otp.length !== 6) {
      setError('Verification code must be 6 digits');
      return false;
    }
    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        newPassword: formData.newPassword
      });
      
      setMessage(res.data.msg);
      // Navigate to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          p: 4,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        {/* Back to Login Link */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Link
            onClick={() => navigate('/forgot-password')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#ff8a00',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': { color: '#e52e71' }
            }}
          >
            <ArrowBack sx={{ mr: 1, fontSize: 20 }} />
            Back
          </Link>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <LockReset sx={{ fontSize: 60, color: '#ff8a00' }} />
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          Reset Password
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0', lineHeight: 1.6 }}>
          Enter the 6-digit verification code sent to your email and create a new password.
        </Typography>

        {/* Timer Display */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 2,
          p: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 1
        }}>
          <Timer sx={{ mr: 1, color: timeLeft > 60 ? '#4caf50' : '#ff6b6b' }} />
          <Typography variant="body2" sx={{ color: timeLeft > 60 ? '#4caf50' : '#ff6b6b' }}>
            Code expires in: {formatTime(timeLeft)}
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ 
              mb: 2, 
              backdropFilter: 'blur(8px)', 
              backgroundColor: 'rgba(244, 67, 54, 0.2)', 
              color: '#fff',
              '& .MuiAlert-icon': { color: '#ff6b6b' }
            }}
          >
            {error}
          </Alert>
        )}

        {message && (
          <Alert
            severity="success"
            icon={<CheckCircle />}
            sx={{ 
              mb: 2, 
              backdropFilter: 'blur(8px)', 
              backgroundColor: 'rgba(76, 175, 80, 0.2)', 
              color: '#fff',
              '& .MuiAlert-icon': { color: '#4caf50' }
            }}
          >
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            required
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="filled"
            margin="normal"
            disabled={loading}
            InputLabelProps={{ style: { color: '#e0e0e0' } }}
            InputProps={{
              style: { color: '#fff' },
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
                '&.Mui-disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Verification Code"
            name="otp"
            type="text"
            value={formData.otp}
            onChange={handleChange}
            variant="filled"
            margin="normal"
            disabled={loading}
            placeholder="Enter 6-digit code"
            inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
            InputLabelProps={{ style: { color: '#e0e0e0' } }}
            InputProps={{
              style: { color: '#fff', fontSize: '1.2rem', letterSpacing: '0.2em', textAlign: 'center' },
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
                '&.Mui-disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="New Password"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            variant="filled"
            margin="normal"
            disabled={loading}
            InputLabelProps={{ style: { color: '#e0e0e0' } }}
            InputProps={{
              style: { color: '#fff' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#e0e0e0' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
                '&.Mui-disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            variant="filled"
            margin="normal"
            disabled={loading}
            InputLabelProps={{ style: { color: '#e0e0e0' } }}
            InputProps={{
              style: { color: '#fff' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: '#e0e0e0' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
                '&.Mui-disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              background: loading 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)',
              fontWeight: 'bold',
              py: 1.5,
              boxShadow: '0 4px 15px rgba(229, 46, 113, 0.6)',
              '&:hover': {
                background: loading 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'linear-gradient(90deg, #e52e71 0%, #ff8a00 100%)',
                boxShadow: '0 6px 20px rgba(255, 138, 0, 0.7)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
                Resetting Password...
              </Box>
            ) : (
              'Reset Password'
            )}
          </Button>

          {/* Resend OTP Button */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            disabled={!canResend || loading}
            onClick={handleResendOTP}
            sx={{
              mt: 2,
              borderColor: canResend ? '#ff8a00' : 'rgba(255, 255, 255, 0.3)',
              color: canResend ? '#ff8a00' : 'rgba(255, 255, 255, 0.5)',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: canResend ? '#e52e71' : 'rgba(255, 255, 255, 0.3)',
                backgroundColor: canResend ? 'rgba(229, 46, 113, 0.1)' : 'transparent',
              },
              '&:disabled': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            {canResend ? 'Resend Verification Code' : `Resend in ${formatTime(timeLeft)}`}
          </Button>
        </Box>

        <Typography sx={{ mt: 3, color: '#eee' }}>
          Remember your password?{' '}
          <Link
            onClick={() => navigate('/login')}
            underline="hover"
            sx={{ 
              color: '#ff8a00', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              '&:hover': { color: '#e52e71' }
            }}
          >
            Sign in here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default ResetPassword;