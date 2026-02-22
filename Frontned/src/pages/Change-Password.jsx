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
import { changePassword } from '../api/authApi'; // You'll create this API function

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    setLoading(true);

    try {
        const token = localStorage.getItem('token');
      await changePassword({ currentPassword, newPassword }, token); // API call with token authentication

      toast.success('Password changed successfully!', {
        position: "top-right",
        autoClose: 3000,
      });

      navigate('/'); 
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Password change failed';
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
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          Change Password
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
            label="Current Password"
            name="currentPassword"
            type="password"
            value={form.currentPassword}
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
            label="New Password"
            name="newPassword"
            type="password"
            value={form.newPassword}
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
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
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
            {loading ? 'Updating...' : 'Change Password'}
          </Button>
        </Box>

        {/* Back to Profile or Home */}
        <Typography sx={{ mt: 2, color: '#eee' }}>
          <Link
            onClick={() => navigate('/profile')}
            underline="hover"
            sx={{ 
              color: '#ff8a00', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              '&:hover': { color: '#e52e71' }
            }}
          >
            Back to Profile
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default ChangePassword;
