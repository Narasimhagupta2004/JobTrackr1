import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Email,
  Security,
  Timer,
  CheckCircle,
  Info,
  Warning,
  Code
} from '@mui/icons-material';

const EmailTestDemo = () => {
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
  };

  const testWelcomeEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'password123'
        })
      });
      
      if (response.ok) {
        addTestResult('Welcome Email', 'success', 'User registered successfully - Welcome email should be sent');
      } else {
        const error = await response.json();
        addTestResult('Welcome Email', 'error', error.msg || 'Registration failed');
      }
    } catch (error) {
      addTestResult('Welcome Email', 'error', 'Network error: ' + error.message);
    }
  };

  const testForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        addTestResult('Forgot Password', 'success', result.msg);
      } else {
        const error = await response.json();
        addTestResult('Forgot Password', 'error', error.msg || 'Request failed');
      }
    } catch (error) {
      addTestResult('Forgot Password', 'error', 'Network error: ' + error.message);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        📧 Email System Test Dashboard
      </Typography>

      {/* Feature Overview */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            ✨ Email Notification Features
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Email sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText 
                primary="Welcome Email on Registration"
                secondary="Personalized greeting sent automatically when users sign up"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Security sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText 
                primary="Password Reset with OTP"
                secondary="Secure 6-digit verification code sent via email"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Timer sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText 
                primary="Time-Limited Security"
                secondary="OTP expires after 10 minutes for enhanced security"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🧪 Test Email Functions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Email />}
              onClick={testWelcomeEmail}
              sx={{ background: 'linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)' }}
            >
              Test Welcome Email
            </Button>
            <Button
              variant="contained"
              startIcon={<Security />}
              onClick={testForgotPassword}
              sx={{ background: 'linear-gradient(90deg, #4caf50 0%, #2196f3 100%)' }}
            >
              Test Forgot Password
            </Button>
            <Button
              variant="outlined"
              onClick={clearResults}
              color="secondary"
            >
              Clear Results
            </Button>
          </Box>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Note:</strong> Make sure your backend server is running on port 5000 and email credentials are configured in the .env file.
          </Alert>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              📊 Test Results
            </Typography>
            {testResults.map((result, index) => (
              <Alert 
                key={index}
                severity={result.status === 'success' ? 'success' : 'error'}
                sx={{ mb: 1 }}
              >
                <strong>{result.test}:</strong> {result.message}
                <br />
                <small>Time: {result.timestamp.toLocaleTimeString()}</small>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* API Endpoints Documentation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🔗 API Endpoints
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Chip label="POST" color="success" size="small" sx={{ mr: 1 }} />
            <Typography variant="h6" component="span">
              /api/auth/register
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, ml: 2 }}>
              Register new user and send welcome email
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Chip label="POST" color="success" size="small" sx={{ mr: 1 }} />
            <Typography variant="h6" component="span">
              /api/auth/forgot-password
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, ml: 2 }}>
              Request password reset OTP via email
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Chip label="POST" color="success" size="small" sx={{ mr: 1 }} />
            <Typography variant="h6" component="span">
              /api/auth/reset-password
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, ml: 2 }}>
              Verify OTP and reset password
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Frontend Routes */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🛣️ Frontend Routes
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><Code /></ListItemIcon>
              <ListItemText 
                primary="/login"
                secondary="Login page with 'Forgot Password' link"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Code /></ListItemIcon>
              <ListItemText 
                primary="/forgot-password"
                secondary="Request password reset OTP"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Code /></ListItemIcon>
              <ListItemText 
                primary="/reset-password"
                secondary="Verify OTP and set new password"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🔒 Security Features
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText 
                primary="Secure OTP Generation"
                secondary="6-digit codes generated using crypto.randomBytes()"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText 
                primary="Time-Limited Codes"
                secondary="OTP expires after 10 minutes"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText 
                primary="Single-Use Codes"
                secondary="OTP is cleared after successful password reset"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText 
                primary="Input Validation"
                secondary="All inputs validated on both frontend and backend"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText 
                primary="Email Retry Logic"
                secondary="Failed emails are retried up to 3 times"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmailTestDemo;