import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass text-center p-12 rounded-[2.5rem] border border-[var(--glass-border)] space-y-6">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-500/20 animate-pulse">
                    <ShieldAlert size={40} />
                </div>
                <div>
                     <h1 className="text-3xl font-black text-[var(--text-color)] mb-2">Access Denied</h1>
                     <p className="text-[var(--text-muted)] font-medium">Your current clearance level (Role) does not authorize access to this terminal sector.</p>
                </div>
                <div className="pt-4">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg)] border border-[var(--glass-border)] px-6 py-3 rounded-2xl text-sm font-bold text-[var(--text-color)] transition-all"
                    >
                        <ArrowLeft size={16} /> Return to Command Hub
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
