import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Package, Map as MapIcon, Settings, BarChart3, ShieldAlert, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { profile } = useAuth();
  
  const isAdmin = profile?.role === 'Admin';
  const isDriver = profile?.role === 'Driver';
  
  let menuItems = [];
  if (isAdmin) {
    menuItems = [
      { path: '/', label: 'System Analytics', icon: LayoutDashboard },
      { path: '/fleet', label: 'Fleet Assets', icon: Truck },
      { path: '/drivers', label: 'Driver Squad', icon: ShieldAlert },
      { path: '/deliveries', label: 'Active Ops', icon: Package },
      { path: '/map', label: 'Live Tracking', icon: MapIcon },
      { path: '/onboarding', label: 'Team Onboarding', icon: Users },
    ];
  } else if (isDriver) {
    menuItems = [
      { path: '/', label: 'My Hub', icon: LayoutDashboard },
      { path: '/deliveries', label: 'My Missions', icon: Package },
      { path: '/map', label: 'Navigation', icon: MapIcon },
    ];
  } else {
    menuItems = [
      { path: '/', label: 'Ops Dashboard', icon: LayoutDashboard },
      { path: '/deliveries', label: 'Active Ops', icon: Package },
      { path: '/fleet', label: 'Fleet Visibility', icon: Truck },
      { path: '/drivers', label: 'Operators view', icon: ShieldAlert },
      { path: '/map', label: 'Live Tracking', icon: MapIcon },
    ];
  }

  return (
    <aside className="w-72 bg-[var(--sidebar-bg)] border-r border-[var(--glass-border)] flex flex-col relative z-10 transition-colors duration-300">
      <div className="p-8 pb-12">
        <div className="text-2xl font-black flex items-center gap-3 tracking-tighter">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
            <Truck size={24} className="text-[var(--text-color)]" />
          </div>
          <span className="gradient-text">FleetSight</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden
              ${isActive 
                ? 'bg-primary-600/10 text-primary-500 font-bold' 
                : 'text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-500/5'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-500 rounded-full" />
                )}
                <item.icon size={22} className={`${isActive ? 'text-primary-500' : 'group-hover:text-primary-500'} transition-colors`} />
                <span className="text-sm tracking-wide">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-6">
        <div className="glass p-5 rounded-3xl border border-[var(--glass-border)] bg-primary-500/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="text-primary-500" size={16} />
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">AI Core Active</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
                <div className="w-1 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-xs font-bold text-[var(--text-color)]">Neural Network Syncing...</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
