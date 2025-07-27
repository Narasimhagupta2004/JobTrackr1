import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  Grid,
  Paper,
  Stack,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const statusOptions = ['Applied', 'Interview', 'Rejected', 'Offer'];

const JobForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    position: '',
    company: '',
    status: 'Applied',
    source: '',
    deadline: '',
    notes: '',
  });
  const [files, setFiles] = useState({ resume: null, jd: null });
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = e => {
    const { name, files: selectedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in');

      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });

      if (files.resume) formData.append('resume', files.resume);
      if (files.jd) formData.append('jd', files.jd);

      const config = {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('http://localhost:5000/api/jobs', formData, config);

      setSuccessOpen(true);
      setLoading(false);
      setTimeout(() => {
      navigate('/');
      }, 1000); 
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to create job');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={6}
        sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
      >
        <Typography
          variant="h4"
          mb={3}
          fontWeight="bold"
          align="center"
          color="primary"
        >
          Add New Job Application
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, fontWeight: 'medium' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />

            <TextField
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />

            <TextField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              select
              fullWidth
              variant="outlined"
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
              value={form.source}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="e.g., LinkedIn, Referral"
            />

            <TextField
              label="Deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Add any additional notes here"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Resume (PDF)
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {files.resume && (
                  <Typography
                    variant="caption"
                    mt={0.5}
                    display="block"
                    textAlign="center"
                  >
                    {files.resume.name}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Job Description (PDF)
                  <input
                    type="file"
                    name="jd"
                    accept=".pdf"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {files.jd && (
                  <Typography
                    variant="caption"
                    mt={0.5}
                    display="block"
                    textAlign="center"
                  >
                    {files.jd.name}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, fontWeight: 'bold', letterSpacing: 1.2 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add Job'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* ✅ Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Job application added successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobForm;

