import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, logout as logoutService, updateProfile as updateProfileService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

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

  // Helper to fetch full profile and sync state
  const syncUserProfile = async (userId: string, email?: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && profile) {
      setUser({
        ...(profile as unknown as User),
        email: email ?? profile.email ?? '',
      });
    }
  };

  useEffect(() => {
    // 1. Initial Session Check: Explicitly handle the "Invalid Refresh Token" case
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          // This catches the 'Refresh Token Not Found' error on startup
          console.warn("Session initialization error, clearing auth:", error.message);
          await supabase.auth.signOut();
          setUser(null);
        } else if (session?.user) {
          await syncUserProfile(session.user.id, session.user.email);
        } else {
          // Fallback to your local service if no supabase session
          const localUser = await getCurrentUser();
          setUser(localUser);
        }
      } catch (err) {
        console.error("Auth init failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          // Handle Sign In or Token Refresh success
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
            await syncUserProfile(session.user.id, session.user.email);
          }

          // Handle Sign Out or session invalidation
          if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        } catch (supabaseError) {
          console.warn('Supabase onAuthStateChange error:', supabaseError);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        throw new Error("No active session to refresh");
      }

      await syncUserProfile(session.user.id, session.user.email);
    } catch (supabaseError) {
      console.warn('Supabase refreshUser error, checking local:', supabaseError);
      const u = await getCurrentUser();
      setUser(u);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase first to clear storage
      await supabase.auth.signOut();
      await logoutService();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
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