import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FleetManager from './components/FleetManager';
import DeliveryManager from './components/DeliveryManager';
import MapView from './components/MapView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'fleet':
        return <FleetManager />;
      case 'deliveries':
        return <DeliveryManager />;
      case 'map':
        return <MapView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0c0c14] text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">FleetSight</h1>
            <p className="text-gray-400">AI Control Tower for Logistics</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm border border-green-500/20">
              ● System Live
            </span>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
