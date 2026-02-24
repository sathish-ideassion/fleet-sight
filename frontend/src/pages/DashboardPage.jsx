import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black gradient-text tracking-tighter">FleetSight Terminal</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[var(--text-muted)] text-sm font-medium">
                    Operator: <span className="text-[var(--text-color)]">{profile?.full_name || user?.email}</span> 
                    <span className="mx-2 opacity-20">|</span> 
                    Clearance: <span className="text-primary-400 font-bold uppercase tracking-widest text-[10px]">{profile?.role}</span>
                </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none mb-1">System Health</span>
                <span className="text-xs text-green-500 font-black">STABLE // 99.9%</span>
            </div>
            
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-500" />}
            </button>

            <button 
              onClick={handleSignOut}
              className="px-6 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all text-xs font-black uppercase tracking-wider"
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
