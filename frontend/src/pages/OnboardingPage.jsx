import React, { useState } from 'react';
import api from '../api';
import { UserPlus, ShieldCheck, Mail, Lock, User } from 'lucide-react';

const OnboardingPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('Driver');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const roles = ['Operations Specialist', 'Driver', 'Operations Head', 'Logistics Manager', 'Fleet Supervisor'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });
        
        try {
            const res = await api.post('/onboard', { email, password, full_name: fullName, role });
            setMsg({ text: res.data.message || 'Onboarded successfully', type: 'success' });
            setFullName(''); setEmail(''); setPassword('');
        } catch (error) {
            setMsg({ text: error.response?.data?.error || error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
             <div className="flex justify-between items-center px-4 mb-4">
               <div>
                 <h2 className="text-2xl font-black text-[var(--text-color)]">Team Onboarding Center</h2>
                 <p className="text-sm text-[var(--text-muted)] mt-1">Register new Operation Specialists, Drivers and Managers directly to your tenant.</p>
               </div>
            </div>

            <div className="max-w-xl mx-auto glass p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-xl mt-12 bg-[var(--bg-color)]">
                 <div className="text-center mb-8 relative">
                    <div className="w-14 h-14 bg-primary-600/20 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                        <UserPlus size={28} />
                    </div>
                </div>

                {msg.text && (
                    <div className={`p-4 rounded-2xl mb-6 text-sm flex gap-3 ${msg.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Full Legal Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                            <input 
                                required
                                type="text" 
                                placeholder="E.g. Jane Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary-500 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Assigned Role</label>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-[var(--sidebar-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary-500 transition-all appearance-none font-medium text-[var(--text-color)] text-sm"
                            >
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Corporate Email / Login ID</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                            <input 
                                required
                                type="email" 
                                placeholder="jane.doe@fleetsight.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary-500 transition-all font-medium text-[var(--text-color)] placeholder:text-[var(--text-muted)] text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Initial Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                            <input 
                                required
                                type="text"
                                placeholder="Temp password for employee"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary-500 transition-all font-medium text-[var(--text-color)] placeholder:text-[var(--text-muted)] text-sm"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full mt-4 bg-primary-600 hover:bg-primary-500 py-3.5 rounded-xl text-white font-black transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                    >
                        {loading ? 'Transmitting Data...' : 'Onboard Employee ->'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;
