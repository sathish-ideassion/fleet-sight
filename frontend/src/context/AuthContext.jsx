import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const signUp = (email, password, metadata) => 
    supabase.auth.signUp({ email, password, options: { data: metadata } });

  const signIn = (email, password) => 
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  const resetPassword = (email) => 
    supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' });

  return (
    <AuthContext.Provider value={{ user, profile, signUp, signIn, signOut, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
