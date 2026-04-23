// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, logout as logoutService, updateProfile as updateProfileService } from '../services/authService';
import { supabase } from '../services/supabaseClient'; // ← ADDED

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone' | 'address' | 'profilePicture'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
  refreshUser: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On app start, restore session from AsyncStorage
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  // ─── SUPABASE: Listen to Supabase auth state changes ─────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            // Fetch the full profile from Supabase profiles table
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!error && profile) {
              // Sync Supabase profile into local state if no local user is set yet
              setUser((prevUser) => prevUser ?? (profile as unknown as User));
            }
          }

          if (event === 'SIGNED_OUT') {
            setUser(null);
          }

          if (event === 'USER_UPDATED' && session?.user) {
            // Re-fetch profile on user update
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!error && profile) {
              setUser(profile as unknown as User);
            }
          }
        } catch (supabaseError) {
          console.warn('Supabase onAuthStateChange error:', supabaseError);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  // ─────────────────────────────────────────────────────────────

  const refreshUser = async () => {
    const u = await getCurrentUser();
    setUser(u);

    // ─── SUPABASE: Also refresh from Supabase profiles table ─────
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user?.id) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.session.user.id)
          .single();
        if (!error && profile) {
          setUser(profile as unknown as User);
        }
      }
    } catch (supabaseError) {
      console.warn('Supabase refreshUser error (local refresh succeeded):', supabaseError);
    }
    // ─────────────────────────────────────────────────────────────
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  const updateProfile = async (
    updates: Partial<Pick<User, 'name' | 'phone' | 'address' | 'profilePicture'>>
  ) => {
    if (!user) return;
    const updated = await updateProfileService(user.id, updates);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);