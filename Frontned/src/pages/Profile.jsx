import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Avatar } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState({ name: 'User', email: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          name: payload.name || 'User',
          email: payload.email || 'Email not available',
        });
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  return (
    <Container sx={{ mt: 6 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
          {user.name[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="h5" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Email: {user.email}
        </Typography>
      </Box>
    </Container>
  );
};

export default Profile;
