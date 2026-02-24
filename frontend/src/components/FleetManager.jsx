import React, { useState, useEffect } from 'react';
import api from '../api';
import { Truck, Search, Plus, Filter, User } from 'lucide-react';

const FleetManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchVehicles();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Idle': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Under Maintenance': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search VIN, Driver or Type..."
            className="w-full bg-[#12121e] border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all font-medium"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-6 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg shadow-primary-600/20">
            <Plus size={18} /> Add Vehicle
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-gray-400 font-medium">VEHICLE INFO</th>
              <th className="px-6 py-4 text-gray-400 font-medium">DRIVER</th>
              <th className="px-6 py-4 text-gray-400 font-medium">CAPACITY</th>
              <th className="px-6 py-4 text-gray-400 font-medium">STATUS</th>
              <th className="px-6 py-4 text-gray-400 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
               [1,2,3].map(i => <tr key={i} className="animate-pulse"><td colSpan="5" className="h-16 px-6 bg-white/5"></td></tr>)
            ) : vehicles.length === 0 ? (
                <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                        No vehicles found. Add your first asset to start tracking.
                    </td>
                </tr>
            ) : vehicles.map((v, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                      <Truck size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold">{v.vin}</p>
                      <p className="text-xs text-gray-400">{v.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold text-[10px]">
                        {v.drivers?.name?.charAt(0) || <User size={12}/>}
                     </div>
                     <span className="font-medium">{v.drivers?.name || 'Unassigned'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-gray-300">{v.capacity}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(v.status)}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary-400 hover:text-primary-300 font-medium text-sm">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FleetManager;
