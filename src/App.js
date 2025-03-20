import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import InstagramAILeaderboard from './components/InstagramAILeaderboard';
import About from './components/About';
import SubmitAccount from './components/SubmitAccount';
import AdminLogin from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import AccountReview from './components/admin/AccountReview';
import AdminLeaderboard from './components/admin/AdminLeaderboard';
import DirectApiTool from './components/admin/DirectApiTool';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<InstagramAILeaderboard />} />
          <Route path="/submit" element={<SubmitAccount />} />
          <Route path="/about" element={<About />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/review" 
            element={
              <PrivateRoute>
                <AccountReview />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/leaderboard" 
            element={
              <PrivateRoute>
                <AdminLeaderboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/api-tool" 
            element={
              <PrivateRoute>
                <DirectApiTool />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;