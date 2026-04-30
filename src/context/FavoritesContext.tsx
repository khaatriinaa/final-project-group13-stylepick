// src/context/FavoritesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const FAVORITES_STORAGE_KEY = '@favorites_v2';

interface FavoritesContextValue {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
  favoriteCount: number;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  clearFavorites: () => {},
  isFavorite: () => false,
  favoriteCount: 0,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // ── Load from AsyncStorage once on mount ─────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
      .then((json) => {
        if (json) {
          try {
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed)) setFavorites(parsed);
          } catch {
            // corrupted data — start fresh
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  // ── Persist to AsyncStorage whenever favorites changes ───────────────────
  const isFirstSave = useRef(true);
  useEffect(() => {
    if (!loaded) return;
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites)).catch(console.error);
  }, [favorites, loaded]);

  const addFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // ── FIX: read directly from state, not a stale ref ───────────────────────
  // The ref approach caused isFavorite to return stale values in the same
  // render cycle as addFavorite/removeFavorite, because the ref is updated
  // in a useEffect (which runs AFTER render). Reading from the state value
  // directly via a closure is always in sync with the current render.
  const favoritesRef = useRef(favorites);
  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((p) => p.id === productId),
    [favorites], // ← depends on favorites state, not the ref
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