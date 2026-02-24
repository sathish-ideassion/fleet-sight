import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Package, MapPin, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const DeliveryManager = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const { data } = await supabase.from('deliveries').select('*, vehicles(*)');
      if (data) setDeliveries(data);
      setLoading(false);
    };
    fetchDeliveries();
  }, []);

  const deliveriesPlaceholder = [
    { id: 'ORD-998', customer: 'Global Logix', status: 'In Transit', pickup: 'New York, NY', drop: 'Boston, MA', eta: '2:30 PM', risk: 'Low' },
    { id: 'ORD-997', customer: 'Amazon Hub', status: 'Pending', pickup: 'Austin, TX', drop: 'Houston, TX', eta: 'Tomorrow', risk: '--' },
    { id: 'ORD-996', customer: 'Tesla Giga', status: 'Delayed', pickup: 'Berlin, DE', drop: 'Munich, DE', eta: 'Overdue', risk: 'High' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Delivery Operations</h2>
        <button className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-2xl text-white font-bold transition-all shadow-xl shadow-primary-600/30">
          Create New Delivery
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deliveriesPlaceholder.map((d, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                d.status === 'Delayed' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                <Package size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{d.id}</h3>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-black ${
                    d.status === 'Delayed' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-gray-400 font-medium">{d.customer}</p>
              </div>
            </div>

            <div className="flex-[2] grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Pickup</p>
                  <p className="font-medium">{d.pickup}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-gray-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Destination</p>
                  <p className="font-medium">{d.drop}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 border-l border-white/5 pl-8">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-gray-400" size={16} />
                <span className="text-sm font-bold">{d.eta}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">AI Risk:</span>
                <span className={`text-sm font-black px-2 py-0.5 rounded-md ${
                  d.risk === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {d.risk}
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
