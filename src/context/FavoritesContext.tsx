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

  // ── Load favorites: AsyncStorage first, then merge with Supabase ──────────
  useEffect(() => {
    const load = async () => {
      setLoaded(false);

      console.log('[FavoritesContext] user.id:', user?.id);       // ✅ DEBUG
      console.log('[FavoritesContext] user.email:', user?.email); // ✅ DEBUG

      let merged: Product[] = [];

      // 1. Load from AsyncStorage first (instant, offline-safe)
      try {
        const json = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json);
          if (Array.isArray(parsed)) merged = parsed;
        }
      } catch (e) {
        console.warn('[FavoritesContext] AsyncStorage load failed:', e);
      }

      // 2. Try Supabase and merge (Supabase is source of truth if available)
      if (user?.id) {
        try {
          const remote = await getFavorites(user.id);
          console.log('[FavoritesContext] remote favorites:', remote.length); // ✅ DEBUG
          if (remote.length > 0) {
            // Supabase wins — use it and sync down to local cache
            merged = remote;
            await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(remote));
          }
          // If remote is empty but local has items, keep local
          // (Supabase insert may have failed previously)
        } catch (e) {
          console.warn('[FavoritesContext] Supabase load failed, using local:', e);
        }
      }

      setFavorites(merged);
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
    console.log('[FavoritesContext] addFavorite called:', product.name); // ✅ DEBUG
    console.log('[FavoritesContext] user.id:', user?.id);                // ✅ DEBUG
    console.log('[FavoritesContext] user.email:', user?.email);          // ✅ DEBUG

    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [product, ...prev];
    });

    // Sync to Supabase in background
    if (user?.id) {
      addFavoriteToSupabase(
        user.id,
        user.email ?? '',   // fallback to empty string — only buyer_id matters for RLS
        user.name ?? null,
        product,
      )
        .then(() => console.log('[FavoritesContext] ✅ Supabase sync OK:', product.name))
        .catch((e) => console.error('[FavoritesContext] ❌ Supabase sync FAILED:', e));
    } else {
      console.warn('[FavoritesContext] Skipping Supabase sync — no user.id'); // ✅ DEBUG
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