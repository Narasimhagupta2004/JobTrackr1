import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'; 
import JobForm from './pages/JobForm'; 
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import JobList from './pages/JobList';
import EditJob from './pages/EditJob';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
     <Navbar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <JobList />
          </ProtectedRoute>
        } />
        <Route path="/add-job" element={
          <ProtectedRoute>
            <JobForm />
          </ProtectedRoute>
        } />
        <Route path="/edit-job/:id" element={
          <ProtectedRoute>
            <EditJob />
          </ProtectedRoute>
        } />
      </Routes>
      </Navbar>
    </BrowserRouter>
  );
}

export default App;
