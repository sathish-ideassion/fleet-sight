import React, { useState, useEffect } from 'react';
import api from '../api';
import AddDelivery from './AddDelivery';
import { Package, MapPin, Clock, Truck, ChevronRight, AlertCircle, CheckCircle2, X, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DeliveryManager = () => {
  const { profile } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdminOrOps = profile?.role === 'Admin' || profile?.role === 'Operations Specialist' || profile?.role === 'Logistics Manager';

  const fetchData = async () => {
    try {
      const [delRes, vehRes] = await Promise.all([
        api.get('/deliveries'),
        isAdminOrOps ? api.get('/fleet') : Promise.resolve({ data: [] })
      ]);
      setDeliveries(delRes.data);
      if (isAdminOrOps) {
        setVehicles(vehRes.data.filter(v => v.status === 'Idle'));
      }
    } catch (err) {
      console.error('Ops sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile]);

  const handleAssign = async (deliveryId) => {
    if (!selectedVehicle) return;
    try {
      await api.post(`/deliveries/${deliveryId}/assign`, {
        vehicle_id: selectedVehicle
      });
      setAssigningId(null);
      setSelectedVehicle('');
      fetchData();
    } catch (err) {
      alert('Strategic assignment failed.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 relative">
      <div className="flex items-center justify-between px-2 mb-2">
        <div>
            <h2 className="text-lg font-black text-[var(--text-color)]">{isAdminOrOps ? 'Operations Queue' : 'My Assigned Missions'}</h2>
            <span className="text-xs text-blue-400 font-bold bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20 mt-2 inline-block">
              {deliveries.length} {isAdminOrOps ? 'Missions Logged' : 'Active Tasks'}
            </span>
        </div>
        {isAdminOrOps && (
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl text-[var(--text-color)] font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 text-xs uppercase tracking-widest"
            >
                <Plus size={16} /> Init Operation
            </button>
        )}
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
              <h2 className="text-xl font-black gradient-text">New Logistics Op</h2>
              <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-xl hover:bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
              >
                  <X size={20} />
              </button>
          </div>
          
          <div className="p-6">
              <AddDelivery onDeliveryAdded={() => { fetchData(); setIsSidebarOpen(false); }} />
              
              <div className="glass mt-8 p-6 rounded-3xl border border-[var(--glass-border)] bg-blue-500/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-blue-400" size={16} />
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Temporal Logistics</p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                  Assignments are locked in real-time. The neural engine predicts route efficacy based on asset positioning.
                  </p>
              </div>
          </div>
      </div>

      <div className="w-full">
          {loading ? (
             <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
             </div>
          ) : deliveries.length === 0 ? (
            <div className="glass p-12 rounded-[2rem] text-center border-dashed border-[var(--glass-border)]">
                <Package className="mx-auto text-gray-700 mb-4" size={48} />
                <p className="text-[var(--text-muted)] font-black uppercase text-xs tracking-widest">No Active Missions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map(d => (
                <div key={d.id} className="glass p-6 rounded-[2rem] border border-[var(--glass-border)] hover:border-blue-500/20 transition-all relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-[var(--glass-border)] transition-colors ${
                        d.status === 'Delayed' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        <Package size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-[var(--text-color)]">ORD-{d.id.slice(0, 5)}</h3>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                            d.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/10' :
                            d.status === 'Pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/10' :
                            'bg-green-500/20 text-green-500 border border-green-500/10'
                          }`}>
                            {d.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] font-bold mt-1 uppercase tracking-wide">{d.customer_name}</p>
                      </div>
                    </div>

                    <div className="flex-[2] grid grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-[var(--text-muted)]" size={16} />
                        <div>
                          <p className="text-[9px] text-[var(--text-muted)] font-black uppercase">Pickup Node</p>
                          <p className="text-xs text-[var(--text-color)] font-bold truncate max-w-[120px]">{d.pickup_location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ChevronRight className="text-gray-600" size={16} />
                        <div>
                          <p className="text-[9px] text-[var(--text-muted)] font-black uppercase">Target Node</p>
                          <p className="text-xs text-[var(--text-color)] font-bold truncate max-w-[120px]">{d.drop_location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-end gap-2 pr-4 border-l border-[var(--glass-border)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">AI Trust:</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                          d.aiAssessment?.status === 'CRITICAL' ? 'text-red-500 bg-red-500/10' :
                          d.aiAssessment?.status === 'WARNING' ? 'text-amber-500 bg-amber-500/10' :
                          'text-green-500 bg-green-500/10'
                        }`}>
                          {d.aiAssessment?.score}%
                        </span>
                      </div>
                      <p className="text-[9px] text-[var(--text-muted)] font-bold italic text-right leading-tight max-w-[150px]">
                        {d.aiAssessment?.prediction}
                      </p>
                    </div>
                  </div>

                  {d.status === 'Pending' && isAdminOrOps && (
                    <div className="mt-6 pt-6 border-t border-[var(--glass-border)] flex items-center justify-between">
                      {assigningId === d.id ? (
                        <div className="flex items-center gap-3 w-full animate-in slide-in-from-left-4">
                          <select 
                            value={selectedVehicle}
                            onChange={(e) => setSelectedVehicle(e.target.value)}
                            className="flex-1 bg-[var(--sidebar-bg)] border border-[var(--glass-border)] rounded-xl py-2 px-4 text-xs font-bold text-[var(--text-color)] focus:border-blue-500 outline-none"
                          >
                            <option value="">Select Deployment Asset</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.vin} ({v.type})</option>
                                ))}
                          </select>
                          <button 
                            onClick={() => handleAssign(d.id)}
                            className="bg-primary-600 hover:bg-primary-500 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-color)] transition-all shadow-lg shadow-primary-600/20"
                          >
                            Lock Assignment
                          </button>
                          <button 
                            onClick={() => setAssigningId(null)}
                            className="text-[var(--text-muted)] hover:text-[var(--text-color)] px-2 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setAssigningId(d.id)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--glass-bg)] hover:hover:bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] transition-all group-hover:border-blue-500/30 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-color)]"
                        >
                          <Truck size={14} />
                          Initialize Asset Deployment
                        </button>
                      )}
                    </div>
                  )}

                  {d.status === 'In Transit' && (
                    <div className="mt-6 pt-6 border-t border-[var(--glass-border)] flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Truck size={14} />
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Deployed Asset</p>
                            <p className="text-xs font-bold text-[var(--text-color)]">{d.vehicles?.vin} // Driver Active</p>
                         </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default DeliveryManager;
