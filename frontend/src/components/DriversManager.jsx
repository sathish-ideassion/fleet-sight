import React, { useState, useEffect } from 'react';
import api from '../api';
import AddDriver from './AddDriver';
import { ShieldCheck, User, Phone, Clipboard, Trash2, X, Plus } from 'lucide-react';

const DriversManager = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchDrivers = async () => {
        try {
            const { data } = await api.get('/drivers');
            setDrivers(data);
        } catch (err) {
            console.error('Failed to sync driver database');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-700 relative">
            <div className="flex items-center justify-between px-2 mb-2">
                <div>
                    <h2 className="text-lg font-black text-[var(--text-color)]">Active Personnel</h2>
                    <span className="text-xs text-primary-400 font-bold bg-primary-400/10 px-3 py-1 rounded-full border border-primary-400/20 mt-2 inline-block">
                        {drivers.length} Units Online
                    </span>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="bg-primary-600 hover:bg-primary-500 px-5 py-2.5 rounded-xl text-white font-black transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                    <Plus size={16} /> Register Operator
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
                    <h2 className="text-xl font-black gradient-text">New Operator</h2>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 rounded-xl hover:bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    <AddDriver onDriverAdded={() => { fetchDrivers(); setIsSidebarOpen(false); }} />
                    
                    <div className="glass mt-8 p-6 rounded-3xl border border-[var(--glass-border)] opacity-50">
                        <div className="flex items-center gap-2 mb-2">
                            <Clipboard size={14} className="text-[var(--text-muted)]" />
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Compliance Status</span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                            All operators must undergo neural calibration and route safety certification before deployment.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                    ) : drivers.length === 0 ? (
                        <div className="glass p-12 rounded-[2rem] text-center border-dashed border-[var(--glass-border)]">
                            <User className="mx-auto text-gray-700 mb-4" size={48} />
                            <p className="text-[var(--text-muted)] font-black uppercase text-xs tracking-widest">No Personnel Detected</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {drivers.map(driver => (
                                <div key={driver.id} className="glass p-6 rounded-3xl border border-[var(--glass-border)] hover:border-primary-500/30 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-600/10 transition-colors" />
                                    
                                    <div className="flex items-start gap-4 mb-4 relative z-10">
                                        <div className="w-12 h-12 bg-[var(--sidebar-bg)] rounded-2xl flex items-center justify-center border border-[var(--glass-border)] group-hover:scale-110 transition-transform">
                                            <ShieldCheck size={24} className="text-primary-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-[var(--text-color)] group-hover:text-primary-300 transition-colors">{driver.name}</h3>
                                            <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest">{driver.license_number}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-[var(--text-muted)] text-sm font-medium relative z-10">
                                        <Phone size={14} className="text-[var(--text-muted)]" />
                                        <span>{driver.contact_number}</span>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex justify-between items-center relative z-10">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase">Clearance: ACTIVE</span>
                                        </div>
                                        <button className="p-2 hover:bg-red-500/10 text-gray-600 hover:text-red-500 rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default DriversManager;
