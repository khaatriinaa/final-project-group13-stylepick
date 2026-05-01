// src/services/favoritesService.ts

import { supabase } from './supabaseClient';
import { Product } from '../types';

export interface FavoriteRow {
  id:          string;
  buyer_id:    string;
  buyer_email: string;
  buyer_name:  string | null;
  product_id:  string;
  product:     Product;
  created_at:  string;
}

// ─── Fetch all favorites for a buyer ─────────────────────────────────────────
export const getFavorites = async (buyerId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[favoritesService] getFavorites error:', error.message);
    return [];
  }

  return (data as FavoriteRow[]).map((row) => row.product);
};

// ─── Add a favorite ───────────────────────────────────────────────────────────
export const addFavoriteToSupabase = async (
  buyerId:    string,
  buyerEmail: string,
  buyerName:  string | null,
  product:    Product,
): Promise<void> => {
  const { error } = await supabase.from('favorites').upsert(
    {
      buyer_id:    buyerId,
      buyer_email: buyerEmail,
      buyer_name:  buyerName ?? null,
      product_id:  product.id,
      product:     product,
    },
    { onConflict: 'buyer_id,product_id' },
  );

  if (error) {
    console.warn('[favoritesService] addFavorite error:', error.message);
  }
};

// ─── Remove a favorite ────────────────────────────────────────────────────────
export const removeFavoriteFromSupabase = async (
  buyerId:   string,
  productId: string,
): Promise<void> => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('buyer_id', buyerId)
    .eq('product_id', productId);

  if (error) {
    console.warn('[favoritesService] removeFavorite error:', error.message);
  }
};

// ─── Clear all favorites for a buyer ─────────────────────────────────────────
export const clearFavoritesFromSupabase = async (buyerId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('buyer_id', buyerId);

  if (error) {
    console.warn('[favoritesService] clearFavorites error:', error.message);
  }
};