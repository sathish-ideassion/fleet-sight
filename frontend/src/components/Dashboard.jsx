import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Truck, Package, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    idleVehicles: 0,
    delayedShipments: 0,
    completionRate: 85
  });

  const chartData = [
    { name: 'Mon', completed: 40, delayed: 4 },
    { name: 'Tue', completed: 30, delayed: 2 },
    { name: 'Wed', completed: 45, delayed: 8 },
    { name: 'Thu', completed: 50, delayed: 5 },
    { name: 'Fri', completed: 60, delayed: 6 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      // Mock stats for demo if database is empty
      const { data: vData } = await supabase.from('vehicles').select('*');
      const { data: dData } = await supabase.from('deliveries').select('*');
      
      setStats({
        activeDeliveries: dData?.filter(d => d.status === 'In Transit').length || 12,
        idleVehicles: vData?.filter(v => v.status === 'Idle').length || 5,
        delayedShipments: dData?.filter(d => d.status === 'Delayed').length || 2,
        completionRate: 92
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Active Deliveries', value: stats.activeDeliveries, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Idle Vehicles', value: stats.idleVehicles, icon: Truck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Delayed At Risk', value: stats.delayedShipments, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Avg Lead Time', value: '4.2h', icon: Clock, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <card.icon className={card.color} size={24} />
              </div>
              <span className="text-green-500 text-sm flex items-center gap-1 font-medium">
                <TrendingUp size={16} /> +12%
              </span>
            </div>
            <h3 className="text-gray-400 font-medium mb-1">{card.label}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Delivery Performance</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-3 h-3 bg-primary-500 rounded-full" /> Completed
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-3 h-3 bg-red-500 rounded-full" /> Delayed
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2d', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="completed" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Alerts Panel */}
        <div className="glass p-8 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold mb-6">AI Risk Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="text-red-500" size={18} />
                <span className="font-bold text-red-100">Delay Prediction</span>
              </div>
              <p className="text-sm text-red-200/70">
                Vehicle #V422 (Route A-12) has a <span className="text-red-400 font-bold">82% probability</span> of delay due to traffic at Sector 4.
              </p>
              <button className="mt-3 text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                Re-route Now
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="text-amber-500" size={18} />
                <span className="font-bold text-amber-100">Idle Detection</span>
              </div>
              <p className="text-sm text-amber-200/70">
                Vehicle #V109 idle for 45 mins. Recommend assigning Delivery #342 (3km away).
              </p>
              <button className="mt-3 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors">
                Assign Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
