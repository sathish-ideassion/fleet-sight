import React, { useState, useEffect } from 'react';
import api from '../api';
import AddVehicle from './AddVehicle';
import { Truck, Search, Plus, User, Activity, Settings2, X } from 'lucide-react';

const FleetManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/fleet');
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Idle': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Under Maintenance': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-[var(--text-muted)] border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 relative">
        <div className="flex items-center justify-between px-2 mb-2">
            <div>
                <h2 className="text-lg font-black text-[var(--text-color)]">Registered Assets</h2>
                <span className="text-xs text-primary-400 font-bold bg-primary-400/10 px-3 py-1 rounded-full border border-primary-400/20 mt-2 inline-block">
                    {vehicles.length} Units Active
                </span>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="bg-primary-600 hover:bg-primary-500 px-5 py-2.5 rounded-xl text-white font-black transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
            >
                <Plus size={16} /> Register Asset
            </button>
        </div>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        {/* Sidebar Drawer */}
        <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-[var(--bg-color)] border-l border-[var(--glass-border)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto flex flex-col`}>
            <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
                <h2 className="text-xl font-black gradient-text">New Operation</h2>
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-xl hover:bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div className="p-6">
                <AddVehicle onVehicleAdded={() => { fetchVehicles(); setIsSidebarOpen(false); }} />
                
                <div className="glass mt-8 p-6 rounded-3xl border border-[var(--glass-border)] opacity-50">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={14} className="text-[var(--text-muted)]" />
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Asset tracking</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                        Heavy assets are continuously monitored by the neural engine for route deviations and maintenance alerts.
                    </p>
                </div>
            </div>
        </div>

        <div className="w-full">
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                </div>
                ) : vehicles.length === 0 ? (
                    <div className="glass p-12 rounded-[2rem] text-center border-dashed border-[var(--glass-border)]">
                        <Truck className="mx-auto text-gray-700 mb-4" size={48} />
                        <p className="text-[var(--text-muted)] font-black uppercase text-xs tracking-widest">No Vehicles Registered</p>
                    </div>
                ) : (
                    <div className="glass rounded-[2rem] border border-[var(--glass-border)] overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Identity / Type</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Operator</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Tonnage</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--glass-border)]">
                                {vehicles.map((v) => (
                                    <tr key={v.id} className="hover:bg-white/[0.02] transition-colors relative group">
                                        <td className="px-6 py-4 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary-600/10 text-primary-400 rounded-xl flex items-center justify-center">
                                                    <Truck size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm text-[var(--text-color)]">{v.vin}</p>
                                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">{v.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xs ring-2 ring-blue-500/10">
                                                    {v.drivers?.name?.charAt(0) || <User size={12}/>}
                                                </div>
                                                <span className="font-bold text-sm text-[var(--text-color)]">{v.drivers?.name || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[var(--text-muted)] text-sm font-medium">{v.capacity}T</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(v.status)}`}>
                                                {v.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
        </div>
    </div>
  );
};

export default FleetManager;
