// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, logout as logoutService, updateProfile as updateProfileService } from '../services/authService';

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

  const refreshUser = async () => {
    const u = await getCurrentUser();
    setUser(u);
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
