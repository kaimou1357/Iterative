import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import Auth from './Auth';
import WireframeTool from './WireframeTool';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './LandingPage';
import { SettingsProvider, useSettings } from './SettingsContext'; // Import the SettingsProvider and useSettings
import Deployments from './Deployments';
import ShowDeployment from './ShowDeployment';

function App() {
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