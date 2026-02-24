import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, Mail, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setEmail('admin@fleetsight.demo');
        setPassword('Password123!');
    };

    return (
        <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border border-[var(--glass-border)] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[var(--text-color)]">
                    <Truck size={200} />
                </div>
                
                <div className="text-center mb-10 relative">
                    <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-600/40 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Truck size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black gradient-text tracking-tight mb-2">FleetSight</h1>
                    <p className="text-[var(--text-muted)] font-medium tracking-wide uppercase text-xs">AI-Native Fleet Intelligence</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-in shake duration-300">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input 
                            required
                            type="email" 
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-4.5 pl-14 pr-5 focus:outline-none focus:border-primary-500 transition-all text-[var(--text-color)] placeholder:text-[var(--text-muted)] font-medium"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input 
                            required
                            type="password" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-4.5 pl-14 pr-5 focus:outline-none focus:border-primary-500 transition-all text-[var(--text-color)] placeholder:text-[var(--text-muted)] font-medium"
                        />
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <Link to="/signup" className="text-xs text-primary-400 hover:text-primary-300 font-bold">
                            Create Account
                        </Link>
                        <Link to="/forgot-password" size="sm" className="text-xs text-gray-500 hover:text-primary-400 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-500 hover:scale-[1.02] active:scale-95 py-4.5 rounded-2xl text-white font-black transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <LogIn size={20} />
                                <span>Sign In to Terminal</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[var(--glass-border)] text-center space-y-4">
                    <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="h-px bg-[var(--glass-border)] flex-1" />
                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Demo Access</span>
                        <div className="h-px bg-[var(--glass-border)] flex-1" />
                    </div>
                    
                    <button 
                        onClick={handleDemoLogin}
                        className="w-full bg-[var(--glass-bg)] hover:bg-[var(--glass-bg)] border border-[var(--glass-border)] py-3 rounded-xl text-[var(--text-color)] text-xs font-bold transition-all hover:border-[var(--card-hover-border)]"
                    >
                        Use Demo Credentials
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
