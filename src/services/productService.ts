// src/services/productService.ts
// Seller writes → AsyncStorage → Buyer reads from same device storage

import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { Product } from '../types';
import { supabase } from './supabaseClient'; // ← ADDED

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─── Map Supabase snake_case rows → camelCase Product ────────
const mapRow = (row: any): Product => ({
  id:          row.id,
  sellerId:    row.seller_id   ?? row.sellerId,
  name:        row.name,
  price:       row.price,
  description: row.description,
  stock:       row.stock,
  images:      row.images      ?? [],
  category:    row.category    ?? '',
  isArchived:  row.is_archived ?? row.isArchived ?? false,
  createdAt:   row.created_at  ?? row.createdAt  ?? new Date().toISOString(),
  colors:      row.colors      ?? [],
  sizes:       row.sizes       ?? [],
});

// ─── READ: All active products (Buyer Home) ───────────────────
export const getProducts = async (): Promise<Product[]> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);

  // ─── SUPABASE: Fetch all active products from Supabase ───────
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_archived', false);
    if (error) throw error;
    if (data && data.length > 0) return data.map(mapRow);
  } catch (supabaseError) {
    console.warn('Supabase getProducts error (falling back to local):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────

  return all.filter((p) => !p.isArchived);
};

// ─── READ: Single product by ID ──────────────────────────────
export const getProductById = async (productId: string): Promise<Product | null> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);

  // ─── SUPABASE: Fetch single product from Supabase ────────────
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    if (error) throw error;
    if (data) return mapRow(data);
  } catch (supabaseError) {
    console.warn('Supabase getProductById error (falling back to local):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────

  return all.find((p) => p.id === productId) ?? null;
};

// ─── READ: Seller's own products (all, including archived) ────
export const getMyProducts = async (sellerId: string): Promise<Product[]> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);

  // ─── SUPABASE: Fetch seller's own products from Supabase ─────
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId);
    if (error) throw error;
    if (data && data.length > 0) return data.map(mapRow);
  } catch (supabaseError) {
    console.warn('Supabase getMyProducts error (falling back to local):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────

  return all.filter((p) => p.sellerId === sellerId);
};

// ─── CREATE ──────────────────────────────────────────────────
export type CreateProductPayload = Omit<Product, 'id' | 'createdAt' | 'isArchived'>;

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  const newProduct: Product = {
    ...payload,
    id:         generateId(),
    isArchived: false,
    createdAt:  new Date().toISOString(),
  };
  await Storage.set(KEYS.PRODUCTS, [...all, newProduct]);

  // ─── SUPABASE: Insert new product into Supabase ──────────────
  try {
    const { error } = await supabase.from('products').insert({
      id:          newProduct.id,
      seller_id:   newProduct.sellerId,
      name:        newProduct.name,
      description: newProduct.description,
      price:       newProduct.price,
      stock:       newProduct.stock,
      images:      newProduct.images,
      category:    newProduct.category,
      colors:      newProduct.colors ?? [],
      sizes:       newProduct.sizes  ?? [],
      is_archived: newProduct.isArchived,
      created_at:  newProduct.createdAt,
    });
    if (error) throw error;
  } catch (supabaseError) {
    console.warn('Supabase createProduct error (local save succeeded):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────

  return newProduct;
};

// ─── UPDATE ──────────────────────────────────────────────────
export const updateProduct = async (
  productId: string,
  updates: Partial<Omit<Product, 'id' | 'sellerId' | 'createdAt'>>
): Promise<Product> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  let updated: Product | null = null;

  const newList = all.map((p) => {
    if (p.id === productId) {
      updated = { ...p, ...updates };
      return updated;
    }
    return p;
  });

  if (!updated) throw new Error('Product not found.');
  await Storage.set(KEYS.PRODUCTS, newList);

  // ─── SUPABASE: Update product in Supabase ────────────────────
  try {
    const supabaseUpdates: Record<string, any> = {};
    if (updates.name        !== undefined) supabaseUpdates.name        = updates.name;
    if (updates.description !== undefined) supabaseUpdates.description = updates.description;
    if (updates.price       !== undefined) supabaseUpdates.price       = updates.price;
    if (updates.stock       !== undefined) supabaseUpdates.stock       = updates.stock;
    if (updates.images      !== undefined) supabaseUpdates.images      = updates.images;
    if (updates.category    !== undefined) supabaseUpdates.category    = updates.category;
    if (updates.colors      !== undefined) supabaseUpdates.colors      = updates.colors;
    if (updates.sizes       !== undefined) supabaseUpdates.sizes       = updates.sizes;
    if (updates.isArchived  !== undefined) supabaseUpdates.is_archived = updates.isArchived;

    const { error } = await supabase
      .from('products')
      .update(supabaseUpdates)
      .eq('id', productId);
    if (error) throw error;
  } catch (supabaseError) {
    console.warn('Supabase updateProduct error (local update succeeded):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────

  return updated;
};

// ─── ARCHIVE (soft delete) ───────────────────────────────────
export const archiveProduct = async (productId: string): Promise<void> => {
  await updateProduct(productId, { isArchived: true });
};

// ─── DECREMENT STOCK after purchase ──────────────────────────
export const decrementStock = async (productId: string, qty: number): Promise<void> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  const newList = all.map((p) => {
    if (p.id === productId) {
      const newStock = Math.max(0, p.stock - qty);
      return { ...p, stock: newStock };
    }
    return p;
  });
  await Storage.set(KEYS.PRODUCTS, newList);

  // ─── SUPABASE: Decrement stock in Supabase ───────────────────
  try {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();
    if (fetchError) throw fetchError;

    const newStock = Math.max(0, (data.stock ?? 0) - qty);
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId);
    if (updateError) throw updateError;
  } catch (supabaseError) {
    console.warn('Supabase decrementStock error (local update succeeded):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────
};