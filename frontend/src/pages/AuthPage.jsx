import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Truck, Mail, Lock, User, ShieldCheck } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('Dispatch Coordinator');
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
            } else {
                const { error } = await signUp(email, password, { full_name: fullName, role });
                if (error) throw error;
                alert('Check your email for confirmation!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c0c14] flex items-center justify-center p-4">
            <div className="w-full max-w-md glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Truck size={120} />
                </div>
                
                <div className="text-center mb-8 relative">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-600/20">
                        <Truck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black gradient-text">FleetSight</h1>
                    <p className="text-gray-400 mt-2">{isLogin ? 'Welcome Back' : 'Join the Force'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select 
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-[#12121e] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all appearance-none"
                                >
                                    <option>Logistics Manager</option>
                                    <option>Fleet Supervisor</option>
                                    <option>Dispatch Coordinator</option>
                                    <option>Operations Head</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            required
                            type="email" 
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            required
                            type="password" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500 transition-all"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

                    <button 
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 py-4 rounded-2xl text-white font-bold transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
