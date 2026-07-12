import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Recommendation = () => {
  const [profileText, setProfileText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setRecommendations([]);

    if (!profileText.trim()) {
      setError('Please enter your profile or resume summary first.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        'http://localhost:5000/api/recommendations',
        { profileText },
        config
      );

      setRecommendations(response.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            AI Job Shortlist
          </Typography>
          <Typography color="text.secondary">
            Paste your profile summary or resume highlights to rank your current jobs by fit.
          </Typography>
        </div>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>Go to Dashboard</Button>
      </Box>

      <Paper elevation={6} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Enter your profile or resume summary
        </Typography>
        <TextField
          label="Profile / Resume Summary"
          fullWidth
          multiline
          rows={6}
          value={profileText}
          onChange={(e) => setProfileText(e.target.value)}
          placeholder="Example: 3 years experience in fullstack JavaScript development, React, Node.js, MongoDB, and agile teams."
          sx={{ mb: 2 }}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analyzing...' : 'Get Shortlist'}
        </Button>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {recommendations.length > 0 && (
        <Paper elevation={6} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Recommended Jobs ({recommendations.length})
          </Typography>
          <List>
            {recommendations.map((job) => (
              <React.Fragment key={job._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${job.position} at ${job.company}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Fit score: {job.fitScore}%
                        </Typography>
                        <br />
                        {job.source && <span>Source: {job.source} · </span>}
                        {job.status && <span>Status: {job.status}</span>}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default Recommendation;
