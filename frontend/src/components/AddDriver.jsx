import React, { useState } from 'react';
import api from '../api';
import { UserPlus, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const AddDriver = ({ onDriverAdded }) => {
    const [name, setName] = useState('');
    const [license, setLicense] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/drivers', {
                name, license_number: license, contact_number: phone
            });
            setStatus({ type: 'success', text: 'Driver clearance granted.' });
            setName('');
            setLicense('');
            setPhone('');
            if (onDriverAdded) onDriverAdded();
        } catch (err) {
            setStatus({ type: 'error', text: 'Clearance denied. Policy violation.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} className="text-purple-400" />
                </div>
                <div>
                    <h2 className="text-xl font-black gradient-text">Personnel Clearance</h2>
                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Register Fleet Operator</p>
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
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Operator Full Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Maverick Mitchell"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 px-5 focus:outline-none focus:border-purple-500 transition-all font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">License ID</label>
                        <input 
                            type="text" 
                            placeholder="LIC-12003"
                            value={license}
                            onChange={(e) => setLicense(e.target.value)}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 px-5 focus:outline-none focus:border-purple-500 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Priority Link (Phone)</label>
                        <input 
                            type="text" 
                            placeholder="+1 234 567 89"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 px-5 focus:outline-none focus:border-purple-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl text-[var(--text-color)] font-black transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    {loading ? 'Processing...' : (
                        <>
                            <UserPlus size={18} />
                            <span>Authenticate Operator</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddDriver;
