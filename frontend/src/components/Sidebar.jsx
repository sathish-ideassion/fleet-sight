import React from 'react';
import { LayoutDashboard, Truck, Package, Map as MapIcon, Settings, BarChart3 } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet Mgmt', icon: Truck },
    { id: 'deliveries', label: 'Deliveries', icon: Package },
    { id: 'map', label: 'Live Map', icon: MapIcon },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#12121e] border-r border-white/5 flex flex-col">
      <div className="p-6">
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Truck size={20} />
          </div>
          <span>FleetSight</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="glass p-4 rounded-2xl border border-white/5">
          <p className="text-xs text-gray-400 mb-2">AI ENGINE STATUS</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Predicting Delays</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
