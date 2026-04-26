// src/context/FavoritesContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const FAVORITES_STORAGE_KEY = '@favorites';

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

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
      .then((json) => {
        if (json) setFavorites(JSON.parse(json));
      })
      .catch(console.error);
  }, []);

  // Save to AsyncStorage whenever favorites changes
  useEffect(() => {
    AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites)).catch(console.error);
  }, [favorites]);

  const addFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((p) => p.id === productId),
    [favorites]
  );

  const favoriteCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, clearFavorites, isFavorite, favoriteCount }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);