import React, { useState } from 'react';
import api from '../api';
import { Package, Plus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const AddDelivery = ({ onDeliveryAdded }) => {
    const [customer, setCustomer] = useState('');
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [eta, setEta] = useState('');
    const [locations, setLocations] = useState({
        pickup: { lat: null, lng: null },
        drop: { lat: null, lng: null }
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const geocode = async (address, type) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setLocations(prev => ({
                    ...prev,
                    [type]: { lat: parseFloat(lat), lng: parseFloat(lon) }
                }));
            }
        } catch (e) {
            console.error("Geocoding failed", e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/deliveries', {
                customer_name: customer, 
                pickup_location: pickup, 
                drop_location: drop, 
                eta,
                pickup_lat: locations.pickup.lat,
                pickup_lng: locations.pickup.lng,
                drop_lat: locations.drop.lat,
                drop_lng: locations.drop.lng
            });
            setStatus({ type: 'success', text: 'Operation initialized. Geospatial routes calculated.' });
            setCustomer(''); setPickup(''); setDrop(''); setEta('');
            setLocations({ pickup: { lat: null, lng: null }, drop: { lat: null, lng: null } });
            if (onDeliveryAdded) onDeliveryAdded();
        } catch (err) {
            setStatus({ type: 'error', text: 'Operation failed. Terminal error.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-xl bg-[var(--bg-color)]">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                    <Package size={24} className="text-blue-400" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-[var(--text-color)]">Ops Initiation</h2>
                    <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Create Strategic Delivery</p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Client Identifier</label>
                    <input 
                        required
                        type="text" 
                        placeholder="e.g. Acme Corp Terminal"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 px-5 focus:outline-none focus:border-blue-500 transition-all font-medium text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Extraction Point (Pickup)</label>
                        <div className="relative">
                            <input 
                                required
                                type="text" 
                                placeholder="Address or City"
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                onBlur={() => geocode(pickup, 'pickup')}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 px-5 focus:outline-none focus:border-blue-500 transition-all font-medium text-sm"
                            />
                            {locations.pickup.lat && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-tighter">
                                    GPS Locked
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Target Node (Dropoff)</label>
                        <div className="relative">
                            <input 
                                required
                                type="text" 
                                placeholder="Target Destination"
                                value={drop}
                                onChange={(e) => setDrop(e.target.value)}
                                onBlur={() => geocode(drop, 'drop')}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 px-5 focus:outline-none focus:border-blue-500 transition-all font-medium text-sm"
                            />
                            {locations.drop.lat && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-tighter">
                                    GPS Locked
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Strategic ETA</label>
                    <div className="relative">
                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                        <input 
                            required
                            type="datetime-local" 
                            value={eta}
                            onChange={(e) => setEta(e.target.value)}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 pl-12 pr-5 focus:outline-none focus:border-blue-500 transition-all font-medium text-[var(--text-color)] text-sm"
                        />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl text-white font-black transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    {loading ? 'Calculating Trajectory...' : (
                        <>
                            <Plus size={18} />
                            <span>Validate & Dispatch</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddDelivery;
