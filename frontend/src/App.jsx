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
import DeliveryManager from './components/DeliveryManager';
import MapView from './components/MapView';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

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
            <index element={<Dashboard />} />
            <Route index element={<Dashboard />} />
            <Route path="fleet" element={<FleetManager />} />
            <Route path="deliveries" element={<DeliveryManager />} />
            <Route path="map" element={<MapView />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
