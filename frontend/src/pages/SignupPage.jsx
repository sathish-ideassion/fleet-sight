import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, Mail, Lock, User, ShieldCheck, UserPlus } from 'lucide-react';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('Dispatch Coordinator');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const roles = [
        'Admin',
        'Logistics Manager',
        'Fleet Supervisor',
        'Dispatch Coordinator',
        'Operations Head'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await signUp(email, password, { full_name: fullName, role });
            if (error) throw error;
            alert('Registration request sent. Please check your email for verification!');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c0c14] flex items-center justify-center p-4">
            <div className="w-full max-w-lg glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="text-center mb-10 relative">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black gradient-text tracking-tight">Access Registration</h1>
                    <p className="text-gray-400 mt-2">Request access to the FleetSight Command Center</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                required
                                type="text" 
                                placeholder="Display Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all font-medium"
                            />
                        </div>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-[#12121e] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all appearance-none font-medium text-white"
                            >
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            required
                            type="email" 
                            placeholder="Corporate Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all font-medium"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            required
                            type="password" 
                            placeholder="Secure Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all font-medium"
                        />
                    </div>

                    <p className="text-[10px] text-gray-500 px-2 italic">
                        * Access requests are audited. Unauthorized entry attempts are logged.
                    </p>

                    <button 
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-500 py-4.5 rounded-2xl text-white font-black transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : 'Submit Access Request'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                        Already have access? <span className="text-primary-400 font-bold underline underline-offset-4">Sign In</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
