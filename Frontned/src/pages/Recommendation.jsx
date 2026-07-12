import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Recommendation = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.get('http://localhost:5000/api/jobs', config);
        setJobs(response.data || []);
      } catch (err) {
        console.error('Failed to load jobs', err);
      }
    };

    fetchJobs();
  }, []);

  const handleSubmit = async () => {
    setError('');
    setResult(null);

    const selectedJob = jobs.find((job) => job._id === selectedJobId);

    if (!selectedJobId && !resumeText.trim()) {
      setError('Please enter your resume or profile summary first when no saved job is selected.');
      return;
    }

    if (!selectedJobId && !jobDescription.trim()) {
      setError('Please paste the job description when no saved job is selected.');
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
        {
          selectedJobId: selectedJobId || null,
          resumeText,
          jobDescription,
          profileText: resumeText,
        },
        config
      );

      const matchJob = response.data.job || response.data.jobs?.[0] || null;
      setResult(matchJob ? { ...response.data, job: matchJob } : null);
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
            Resume to Job Match
          </Typography>
          <Typography color="text.secondary">
            If you select a saved job, its resume and JD details will be used automatically. Otherwise, enter your profile summary and paste the job description.
          </Typography>
        </div>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Go to Dashboard
        </Button>
      </Box>

      <Paper elevation={6} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Choose a job and add your resume details
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="job-select-label">Saved Job</InputLabel>
          <Select
            labelId="job-select-label"
            value={selectedJobId}
            label="Saved Job"
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <MenuItem value="">None - I will paste the job description</MenuItem>
            {jobs.map((job) => (
              <MenuItem key={job._id} value={job._id}>
                {job.company} - {job.position}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Select a saved job to use its attached resume and JD automatically. If you leave this blank, provide your profile summary and job description manually.
          </FormHelperText>
        </FormControl>

        <TextField
          label={selectedJobId ? 'Resume / Profile Summary (optional when a job is selected)' : 'Resume / Profile Summary'}
          fullWidth
          multiline
          rows={6}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Example: 3 years experience in fullstack JavaScript development, React, Node.js, MongoDB, and agile teams."
          sx={{ mb: 2 }}
        />

        <TextField
          label={selectedJobId ? 'Job Description (optional when a job is selected)' : 'Job Description'}
          fullWidth
          multiline
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here if you do not have a saved JD or want to compare against custom details."
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </Button>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {result && (
        <Paper elevation={6} sx={{ p: 3 }}>
          <Typography variant="h6" mb={1}>
            Match Result
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {result.job?.position || 'Selected role'} at {result.job?.company || 'Provided company'}
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Fit score: {result.fitScore}%
          </Typography>
          <Typography mb={2}>{result.summary}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Strengths
          </Typography>
          <ul>
            {(result.strengths || []).map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>

          <Typography variant="subtitle2" gutterBottom>
            Gaps to Improve
          </Typography>
          <ul>
            {(result.gaps || []).map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </Paper>
      )}
    </Container>
  );
};

export default Recommendation;
