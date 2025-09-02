import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { VtuProvider } from './contexts/VtuContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ServicesTest from './components/ServicesTest';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VtuProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-oxford-blue via-oxford-blue-light to-oxford-blue-dark">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/test-services" element={<ServicesTest />} />
              </Routes>
            </div>
          </Router>
        </VtuProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;