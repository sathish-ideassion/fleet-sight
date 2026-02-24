import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#0c0c14] text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black gradient-text tracking-tighter">FleetSight Terminal</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-gray-400 text-sm font-medium">
                    Operator: <span className="text-white">{profile?.full_name || user?.email}</span> 
                    <span className="mx-2 text-white/20">|</span> 
                    Clearance: <span className="text-primary-400 font-bold uppercase tracking-widest text-[10px]">{profile?.role}</span>
                </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">System Health</span>
                <span className="text-xs text-green-500 font-black">STABLE // 99.9%</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-black uppercase tracking-wider"
            >
              Logoff
            </button>
          </div>
        </header>
        
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;
