import React, { useState, useEffect } from 'react';
import api from '../api';
import { Truck, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

const AddVehicle = ({ onVehicleAdded }) => {
    const [vin, setVin] = useState('');
    const [type, setType] = useState('Heavy Truck');
    const [capacity, setCapacity] = useState('');
    const [driverId, setDriverId] = useState('');
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const { data } = await api.get('/drivers');
            setDrivers(data);
        } catch (err) {
            console.error('Failed to fetch drivers');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/fleet/vehicles', {
                vin, type, capacity: parseInt(capacity), driver_id: driverId || null
            });
            setStatus({ type: 'success', text: 'Vehicle registered in neural network.' });
            setVin('');
            setCapacity('');
            if (onVehicleAdded) onVehicleAdded();
        } catch (err) {
            setStatus({ type: 'error', text: 'Registration failed. Cluster unavailable.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center">
                    <Truck size={24} className="text-primary-400" />
                </div>
                <div>
                    <h2 className="text-xl font-black gradient-text">Asset Registration</h2>
                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Add New Fleet Vehicle</p>
                </div>
            </div>

            {status && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
                    status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {status.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Vehicle ID (VIN)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. TRK-9902"
                            value={vin}
                            onChange={(e) => setVin(e.target.value)}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3 px-5 focus:outline-none focus:border-primary-500 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Classification</label>
                        <select 
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-[var(--sidebar-bg)] border border-[var(--glass-border)] rounded-2xl py-3 px-5 focus:outline-none focus:border-primary-500 transition-all font-medium text-[var(--text-color)] appearance-none"
                        >
                            <option>Heavy Truck</option>
                            <option>Van</option>
                            <option>Container Carrier</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Payload (Tons)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 12"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3 px-5 focus:outline-none focus:border-primary-500 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Assign Primary Driver</label>
                        <select 
                            value={driverId}
                            onChange={(e) => setDriverId(e.target.value)}
                            className="w-full bg-[var(--sidebar-bg)] border border-[var(--glass-border)] rounded-2xl py-3 px-5 focus:outline-none focus:border-primary-500 transition-all font-medium text-[var(--text-color)] appearance-none"
                        >
                            <option value="">Unassigned</option>
                            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-500 py-4 rounded-2xl text-[var(--text-color)] font-black transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    {loading ? 'Processing...' : (
                        <>
                            <Plus size={18} />
                            <span>Register Asset</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddVehicle;
