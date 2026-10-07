import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AccessibilityBar from './components/AccessibilityBar';
import GlobalTTSPlayer from './components/GlobalTTSPlayer';
import LandingPage from './pages/LandingPage';
import TransformWizardPage from './pages/TransformWizardPage';
import CommunicationBridgePage from './pages/CommunicationBridgePage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col transition-colors duration-150">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/transform" element={<TransformWizardPage />} />
                <Route path="/bridge" element={<CommunicationBridgePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/profile" element={<ProfileSettingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
            <AccessibilityBar />
            <GlobalTTSPlayer />
          </div>
        </Router>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
