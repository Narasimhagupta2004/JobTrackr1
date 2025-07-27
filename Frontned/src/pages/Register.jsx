import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signup } from '../api/authApi';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signup(form);
      localStorage.setItem('token', res.data.token);
      
      // Show success message with welcome email confirmation
      toast.success('Account created successfully! 🎉 A welcome email has been sent to your inbox.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
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
        <Typography variant="h3" fontWeight="bold" mb={3} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          Join JobTrackr
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            required
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            variant="filled"
            margin="normal"
            InputLabelProps={{ style: { color: '#e0e0e0' } }}
            InputProps={{
              style: { color: '#fff' },
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            variant="filled"
            margin="normal"
            InputLabelProps={{ style: { color: '#e0e0e0' } }}
            InputProps={{
              style: { color: '#fff' },
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            variant="filled"
            margin="normal"
            InputLabelProps={{ style: { color: '#e0e0e0' } }}
            InputProps={{
              style: { color: '#fff' },
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
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
              background:
                'linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)',
              fontWeight: 'bold',
              py: 1.5,
              boxShadow: '0 4px 15px rgba(229, 46, 113, 0.6)',
              '&:hover': {
                background:
                  'linear-gradient(90deg, #e52e71 0%, #ff8a00 100%)',
                boxShadow: '0 6px 20px rgba(255, 138, 0, 0.7)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>

        <Typography sx={{ mt: 3, color: '#eee' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            underline="hover"
            sx={{ color: '#ff8a00', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Log In
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Register;
