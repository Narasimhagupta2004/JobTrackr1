import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './pages/Signup';
import Register from './pages/Register';
import Login from './pages/Login'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import JobForm from './pages/JobForm'; 
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import JobList from './pages/JobList';
import EditJob from './pages/EditJob';
import Profile from './pages/Profile';
import EmailTestDemo from './components/EmailTestDemo';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
     <Navbar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-test" element={<EmailTestDemo />} />
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
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </BrowserRouter>
  );
}

export default App;
