import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { VtuProvider } from './contexts/VtuContext';
import { BrandingProvider } from './contexts/BrandingContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ServicesTest from './components/ServicesTest';
import AuthCallback from './components/AuthCallback';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NotificationPermissionPrompt from './components/NotificationPermissionPrompt';
import ResellerAdmin from './components/ResellerAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import SmspoolPage from './components/SmspoolPage';
import DassyPage from './components/DassyPage';
import FiveSimPage from './components/FiveSimPage';
import TigerPage from './components/TigerPage';
import TextVerifiedPage from './components/TextVerifiedPage';
import './index.css';

function App() {
  return (
    <BrandingProvider>
      <ThemeProvider>
        <AuthProvider>
          <VtuProvider>
            <Router>
            <div className="min-h-screen bg-gradient-to-br from-oxford-blue via-oxford-blue-light to-oxford-blue-dark">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/reseller-admin" element={
                  <ProtectedRoute>
                    <ResellerAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/test-services" element={<ServicesTest />} />
                <Route path="/faddedpool" element={
                  <ProtectedRoute>
                    <SmspoolPage />
                  </ProtectedRoute>
                } />
                <Route path="/faddedusaonly" element={
                  <ProtectedRoute>
                    <DassyPage />
                  </ProtectedRoute>
                } />
                <Route path="/faddedsim" element={
                  <ProtectedRoute>
                    <FiveSimPage />
                  </ProtectedRoute>
                } />
                <Route path="/faddedglobal" element={
                  <ProtectedRoute>
                    <TigerPage />
                  </ProtectedRoute>
                } />
                <Route path="/faddedverified" element={
                  <ProtectedRoute>
                    <TextVerifiedPage />
                  </ProtectedRoute>
                } />
              </Routes>
              <PWAInstallPrompt />
              <NotificationPermissionPrompt />
            </div>
          </Router>
        </VtuProvider>
      </AuthProvider>
    </ThemeProvider>
    </BrandingProvider>
  );
}

export default App;