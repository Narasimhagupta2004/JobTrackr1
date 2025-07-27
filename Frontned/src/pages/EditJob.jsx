import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const statusOptions = ['Applied', 'Interview', 'Rejected', 'Offer'];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    source: '',
    deadline: '',
    notes: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`, config);
        const job = res.data;
        setFormData({
          company: job.company || '',
          position: job.position || '',
          status: job.status || 'Applied',
          source: job.source || '',
          deadline: job.deadline ? job.deadline.slice(0, 10) : '',
          notes: job.notes || '',
        });
      } catch (err) {
        setError('Failed to load job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/jobs/${id}`, formData, config);
      setSuccess('Job updated successfully!');
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update job');
    }
  };

  if (loading)
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Edit Job
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {statusOptions.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          fullWidth
          margin="normal"
          placeholder="e.g. LinkedIn, Referral"
        />
        <TextField
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          margin="normal"
        />

        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 3 }}>
          Update Job
        </Button>
      </Box>
    </Container>
  );
};

export default EditJob;
