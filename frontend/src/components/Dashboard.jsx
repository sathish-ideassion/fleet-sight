import React, { useState, useEffect } from 'react';
import api from '../api';
import { Truck, Package, Clock, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    idleVehicles: 0,
    delayedShipments: 0,
    totalVehicles: 0,
    totalDeliveries: 0,
    driverStats: []
  });

  const isDriver = profile?.role === 'Driver';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats({
          activeDeliveries: data.activeDeliveries,
          idleVehicles: data.idleVehicles,
          delayedShipments: data.delayedShipments,
          totalVehicles: data.totalVehicles,
          totalDeliveries: data.totalDeliveries,
          driverStats: data.driverStats || []
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const cards = isDriver ? [
    { label: 'My Active Missions', value: stats.activeDeliveries, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Compliance Score', value: '98%', icon: ShieldAlert, color: 'text-primary-500', bg: 'bg-primary-500/10' },
    { label: 'Recent Delays', value: stats.delayedShipments, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Total Completed', value: stats.totalDeliveries, icon: Clock, color: 'text-green-500', bg: 'bg-green-500/10' },
  ] : [
    { label: 'Active Deliveries', value: stats.activeDeliveries, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Idle Vehicles', value: stats.idleVehicles, icon: Truck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Delayed At Risk', value: stats.delayedShipments, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Total Assets', value: stats.totalVehicles, icon: ShieldAlert, color: 'text-primary-500', bg: 'bg-primary-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-[var(--glass-border)] hover:border-[var(--card-hover-border)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <card.icon className={card.color} size={24} />
              </div>
              <span className="text-green-500 text-sm flex items-center gap-1 font-medium">
                <TrendingUp size={16} /> +12%
              </span>
            </div>
            <h3 className="text-[var(--text-muted)] font-medium mb-1">{card.label}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {!isDriver && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-3xl border border-[var(--glass-border)]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Driver Performance Metrics</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <div className="w-3 h-3 bg-green-500 rounded-full" /> Completed
                </span>
                <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" /> Active
                </span>
                <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <div className="w-3 h-3 bg-red-500 rounded-full" /> Delayed
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.driverStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-color)' }}
                  />
                  <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Active" />
                  <Bar dataKey="delayed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Delayed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-[var(--glass-border)]">
            <h3 className="text-xl font-bold mb-6">AI Predictive Alerts</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="text-red-500" size={18} />
                  <span className="font-bold text-red-700 dark:text-red-100">ETA Violation Risk</span>
                </div>
                <p className="text-sm text-red-800/70 dark:text-red-200/70">
                  Critical traffic congestion detected on Interstate 80. <span className="text-red-600 dark:text-red-400 font-bold">3 missions</span> high risk.
                </p>
                <button className="mt-3 text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                  Authorize Reroute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
