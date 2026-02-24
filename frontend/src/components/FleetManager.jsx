import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Truck, Search, Plus, Filter, User } from 'lucide-react';

const FleetManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase.from('vehicles').select('*, drivers(*)');
      if (data) setVehicles(data);
      setLoading(false);
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
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-all">
            <Filter size={18} /> Filter
          </button>
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
               [1,2,3].map(i => (
                 <tr key={i} className="animate-pulse">
                   <td colSpan="5" className="h-16 px-6"></td>
                 </tr>
               ))
            ) : vehicles.length === 0 ? (
              [
                { vin: 'V-LNX-9921', type: 'Heavy Truck', capacity: '12 Tons', status: 'Active', driver: 'John Doe' },
                { vin: 'V-LNX-4410', type: 'Delivery Van', capacity: '2 Tons', status: 'Idle', driver: 'Jane Smith' },
                { vin: 'V-LNX-3301', type: 'Refrigerated', capacity: '5 Tons', status: 'Under Maintenance', driver: 'None' },
              ].map((v, i) => (
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
                       <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                         <User size={14} className="text-primary-400" />
                       </div>
                       <span className="font-medium">{v.driver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-300">{v.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-400 hover:text-primary-300 font-medium text-sm">View Details</button>
                  </td>
                </tr>
              ))
            ) : vehicles.map((v, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                {/* ... similar mapping for real data ... */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FleetManager;
