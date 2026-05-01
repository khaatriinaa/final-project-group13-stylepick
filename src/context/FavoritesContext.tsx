// src/context/FavoritesContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import {
  getFavorites,
  addFavoriteToSupabase,
  removeFavoriteFromSupabase,
  clearFavoritesFromSupabase,
} from '../services/favoritesService';

const FAVORITES_STORAGE_KEY = '@favorites_v2';

interface FavoritesContextValue {
  favorites:      Product[];
  addFavorite:    (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
  isFavorite:     (productId: string) => boolean;
  favoriteCount:  number;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites:      [],
  addFavorite:    () => {},
  removeFavorite: () => {},
  clearFavorites: () => {},
  isFavorite:     () => false,
  favoriteCount:  0,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loaded, setLoaded]       = useState(false);

  // ── Load favorites: Supabase first, fallback to AsyncStorage ─────────────
  useEffect(() => {
    const load = async () => {
      setLoaded(false);

      if (user?.id) {
        // Logged-in buyer → load from Supabase
        try {
          const remote = await getFavorites(user.id);
          if (remote.length > 0) {
            setFavorites(remote);
            // Sync Supabase data down to local cache
            await AsyncStorage.setItem(
              FAVORITES_STORAGE_KEY,
              JSON.stringify(remote),
            );
            setLoaded(true);
            return;
          }
        } catch (e) {
          console.warn('[FavoritesContext] Supabase load failed, using local:', e);
        }
      }

      // Fallback to AsyncStorage (offline / not logged in)
      try {
        const json = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json);
          if (Array.isArray(parsed)) setFavorites(parsed);
        }
      } catch (e) {
        console.warn('[FavoritesContext] AsyncStorage load failed:', e);
      }

      setLoaded(true);
    };

    load();
  }, [user?.id]); // Re-runs when user logs in or switches account

  // ── Persist to AsyncStorage whenever favorites change ────────────────────
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites),
    ).catch(console.warn);
  }, [favorites, loaded]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const addFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [product, ...prev];
    });

    // Sync to Supabase in background
    if (user?.id && user?.email) {
      addFavoriteToSupabase(
        user.id,
        user.email,
        user.name ?? null,
        product,
      ).catch(console.warn);
    }
  }, [user]);

  // ── Remove ────────────────────────────────────────────────────────────────
  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));

    // Sync to Supabase in background
    if (user?.id) {
      removeFavoriteFromSupabase(user.id, productId).catch(console.warn);
    }
  }, [user]);

  // ── Clear all ─────────────────────────────────────────────────────────────
  const clearFavorites = useCallback(() => {
    setFavorites([]);

    if (user?.id) {
      clearFavoritesFromSupabase(user.id).catch(console.warn);
    }
  }, [user]);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((p) => p.id === productId),
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite,
        favoriteCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);