import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Email, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: email.trim()
      });
      
      setMessage(res.data.msg);
      // Navigate to reset password page after 2 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email: email.trim() } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset email');
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
            onClick={() => navigate('/login')}
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
            Back to Login
          </Link>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Email sx={{ fontSize: 60, color: '#ff8a00' }} />
        </Box>

        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          Forgot Password?
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0', lineHeight: 1.6 }}>
          No worries! Enter your email address and we'll send you a verification code to reset your password.
        </Typography>

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            margin="normal"
            disabled={loading}
            placeholder="Enter your registered email"
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !email.trim()}
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
                Sending Reset Code...
              </Box>
            ) : (
              'Send Reset Code'
            )}
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

export default ForgotPassword;