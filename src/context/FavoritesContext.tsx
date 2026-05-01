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

// ✅ FIXED — per-user key so favorites don't bleed across accounts
const getFavoritesKey = (userId: string) => `@favorites_v2_${userId}`;

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

      // ✅ FIXED — clear favorites when user changes so previous user's
      //            favorites don't flash on screen before new ones load
      setFavorites([]);

      console.log('[FavoritesContext] user.id:', user?.id);       // ✅ DEBUG
      console.log('[FavoritesContext] user.email:', user?.email); // ✅ DEBUG

      if (user?.id) {
        // Logged-in buyer → load from Supabase
        try {
          const remote = await getFavorites(user.id);
          console.log('[FavoritesContext] remote favorites:', remote.length); // ✅ DEBUG
          if (remote.length > 0) {
            setFavorites(remote);
            // Sync Supabase data down to local cache using per-user key
            await AsyncStorage.setItem(
              getFavoritesKey(user.id), // ✅ FIXED
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
        // ✅ FIXED — use per-user key or a guest key
        const storageKey = user?.id ? getFavoritesKey(user.id) : '@favorites_v2_guest';
        const json = await AsyncStorage.getItem(storageKey);
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
    // ✅ FIXED — use per-user key
    const storageKey = user?.id ? getFavoritesKey(user.id) : '@favorites_v2_guest';
    AsyncStorage.setItem(
      storageKey,
      JSON.stringify(favorites),
    ).catch(console.warn);
  }, [favorites, loaded, user?.id]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const addFavorite = useCallback((product: Product) => {
    console.log('[FavoritesContext] addFavorite called:', product.name); // ✅ DEBUG
    console.log('[FavoritesContext] user.id:', user?.id);                // ✅ DEBUG
    console.log('[FavoritesContext] user.email:', user?.email);          // ✅ DEBUG

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
    } else {
      console.warn('[FavoritesContext] Skipping Supabase sync — no user.id or user.email'); // ✅ DEBUG
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