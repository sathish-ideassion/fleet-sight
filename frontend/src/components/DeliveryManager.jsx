import React, { useState, useEffect } from 'react';
import api from '../api';
import { Package, MapPin, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const DeliveryManager = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const { data } = await api.get('/deliveries');
        setDeliveries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Delivery Operations</h2>
        <button className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-2xl text-white font-bold transition-all shadow-xl shadow-primary-600/30">
          Create New Delivery
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
             [1,2,3].map(i => <div key={i} className="h-32 glass rounded-3xl animate-pulse" />)
        ) : deliveries.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10">
                <Package className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 font-medium">No active deliveries. New orders will appear here.</p>
            </div>
        ) : deliveries.map((d, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                d.status === 'Delayed' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                <Package size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">ORD-{d.id.slice(0,4)}</h3>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-black ${
                    d.status === 'Delayed' ? 'bg-red-500/20 text-red-500' : 
                    d.status === 'In Transit' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-gray-400 font-medium">{d.customer_name}</p>
              </div>
            </div>

            <div className="flex-[2] grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Pickup</p>
                  <p className="font-medium truncate max-w-[150px]">{d.pickup_location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-gray-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Destination</p>
                  <p className="font-medium truncate max-w-[150px]">{d.drop_location}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 border-l border-white/5 pl-8">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-gray-400" size={16} />
                <span className="text-sm font-bold">{new Date(d.eta).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">AI Risk:</span>
                <span className={`text-sm font-black px-2 py-0.5 rounded-md ${
                  d.aiRisk?.category === 'High' ? 'bg-red-500/10 text-red-500' : 
                  d.aiRisk?.category === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {d.aiRisk?.category || '--'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryManager;
