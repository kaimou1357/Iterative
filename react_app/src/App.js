import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import Auth from './Auth';
import WireframeTool from './WireframeTool';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './LandingPage';
import { SettingsProvider, useSettings } from './SettingsContext'; // Import the SettingsProvider and useSettings
import VersionBadge from './VersionBadge';
import Deployments from './Deployments';
import ShowDeployment from './ShowDeployment';

function App() {
  const { settings } = useSettings(); // Use the centralized settings

  useEffect(() => {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateColorScheme = () => {
      if (settings.color_scheme === 'SYSTEM') {
        if (colorSchemeQuery.matches) {
          document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-bs-theme', 'light');
        }
      } else {
        document.documentElement.setAttribute('data-bs-theme', settings.color_scheme.toLowerCase());
      }
    };

    // Initial update
    updateColorScheme();
    
    // Listen for changes if theme is SYSTEM
    if (settings.color_scheme === 'SYSTEM') {
      colorSchemeQuery.addEventListener('change', updateColorScheme);
      
      // Cleanup
      return () => {
        colorSchemeQuery.removeEventListener('change', updateColorScheme);
      };
    }
  }, [settings.color_scheme]);

  return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/deployments" element={<ProtectedRoute component={Deployments} />} />
          <Route path="/deployments/:id" element={<ShowDeployment />} />
          <Route path="/wireframe-tool" element={<ProtectedRoute component={WireframeTool} />} />
        </Routes>
      </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;