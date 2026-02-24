import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FleetManager from './components/FleetManager';
import DeliveryManager from './components/DeliveryManager';
import MapView from './components/MapView';
import AuthPage from './pages/AuthPage';

const FleetSightApp = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return (
    <div className="min-h-screen bg-[#0c0c14] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) return <AuthPage />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'fleet': return <FleetManager />;
      case 'deliveries': return <DeliveryManager />;
      case 'map': return <MapView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0c0c14] text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black gradient-text tracking-tight">FleetSight</h1>
            <p className="text-gray-400 font-medium">Hello, {profile?.full_name || user.email} • <span className="text-primary-400">{profile?.role}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => signOut()}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold"
            >
              Sign Out
            </button>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <FleetSightApp />
    </AuthProvider>
  );
}

export default App;
