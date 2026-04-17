// src/services/productService.ts
// Seller writes → AsyncStorage → Buyer reads from same device storage

import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { Product } from '../types';

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─── READ: All active products (Buyer Home) ───────────────────
export const getProducts = async (): Promise<Product[]> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  return all.filter((p) => !p.isArchived);
};

// ─── READ: Single product by ID ──────────────────────────────
export const getProductById = async (productId: string): Promise<Product | null> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  return all.find((p) => p.id === productId) ?? null;
};

// ─── READ: Seller's own products (all, including archived) ────
export const getMyProducts = async (sellerId: string): Promise<Product[]> => {
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
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
};