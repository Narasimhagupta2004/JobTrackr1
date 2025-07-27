import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Color palette
const COLORS = ['#4caf50', '#2196f3', '#f44336', '#ff9800'];

const statusColors = {
  Applied: '#2196f3',
  Interview: '#ff9800',
  Rejected: '#f44336',
  Offer: '#4caf50',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const resJobs = await axios.get('http://localhost:5000/api/jobs', config);
        setJobs(resJobs.data);

        // Decode user from token for greeting (simple)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.name || 'User');
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, config);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    );

  // Summary counts
  const totalJobs = jobs.length;
  const countByStatus = jobs.reduce(
    (acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    },
    { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 }
  );

  // Bar chart data
  const barData = Object.entries(countByStatus).map(([status, count]) => ({
    status,
    count,
  }));

  // Pie chart by source
  const sourceCounts = jobs.reduce((acc, job) => {
    const src = job.source || 'Unknown';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(sourceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Latest 5 jobs sorted by createdAt desc
  const latestJobs = jobs
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      {/* Welcome & Action */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Welcome back, {userName} 👋
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/add-job')}>
          + Add New Job
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={5}>
        {[
          { label: 'Total Applications', count: totalJobs, color: '#1976d2' },
          { label: 'Offers', count: countByStatus.Offer, color: '#4caf50' },
          { label: 'Interviews', count: countByStatus.Interview, color: '#ff9800' },
          { label: 'Rejected', count: countByStatus.Rejected, color: '#f44336' },
        ].map(({ label, count, color }) => (
          <Grid item xs={6} sm={3} key={label}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                boxShadow: `0 6px 15px ${color}33`,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {label}
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color }}>
                {count}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4} mb={6}>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} textAlign="center">
              Applications by Status
            </Typography>
            {barData.length === 0 ? (
              <Typography align="center">No data available</Typography>
            ) : (
              <BarChart width={350} height={250} data={barData}>
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} textAlign="center">
              Applications by Source
            </Typography>
            {pieData.length === 0 ? (
              <Typography align="center">No data available</Typography>
            ) : (
              <PieChart width={350} height={250}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Applications */}
      <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Recent Applications
        </Typography>

        {latestJobs.length === 0 ? (
          <Typography>No recent job applications.</Typography>
        ) : (
          <List>
            {latestJobs.map((job) => (
              <ListItem
                key={job._id}
                divider
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                      title="Edit Job"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDelete(job._id)}
                      title="Delete Job"
                      sx={{ ml: 1 }}
                    >
                      <Delete />
                    </IconButton>
                    <Chip
                      label={job.status}
                      sx={{
                        bgcolor: statusColors[job.status],
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: 90,
                        textAlign: 'center',
                        ml: 2,
                      }}
                    />
                  </>
                }
              >
                <ListItemText
                  primary={`${job.position} at ${job.company}`}
                  secondary={`Applied on ${new Date(job.createdAt).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
