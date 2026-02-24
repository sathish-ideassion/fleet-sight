import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Components
import Dashboard from './components/Dashboard';
import FleetManager from './components/FleetManager';
import DriversManager from './components/DriversManager';
import DeliveryManager from './components/DeliveryManager';
import MapView from './components/MapView';
import OnboardingPage from './pages/OnboardingPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Area */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Nested Routes */}
            <Route index element={<Dashboard />} />
            <Route 
              path="fleet" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Operations Specialist', 'Logistics Manager', 'Fleet Supervisor', 'Operations Head']}>
                  <FleetManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="drivers" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Operations Specialist', 'Logistics Manager', 'Fleet Supervisor', 'Operations Head']}>
                  <DriversManager />
                </ProtectedRoute>
              } 
            />
            <Route path="deliveries" element={<DeliveryManager />} />
            <Route path="map" element={<MapView />} />
            <Route 
              path="onboarding" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <OnboardingPage />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
