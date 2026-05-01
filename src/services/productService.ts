// src/services/productService.ts

import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { Product, ProductCondition, ShippingMethod } from '../types';
import { supabase } from './supabaseClient';

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─── Supabase row → Product ───────────────────────────────────────────────────

const mapRow = (row: any): Product => ({
  id:              row.id,
  sellerId:        row.seller_id      ?? row.sellerId,
  name:            row.name,
  description:     row.description,
  category:        row.category       ?? '',
  condition:       (row.condition     ?? 'new') as ProductCondition,
  sku:             row.sku            ?? null,
  price:           Number(row.price),
  comparePrice:    row.compare_price  != null ? Number(row.compare_price)  : null,
  costPrice:       row.cost_price     != null ? Number(row.cost_price)     : null,
  stock:           Number(row.stock),
  weight:          row.weight_kg      != null ? Number(row.weight_kg)      : null,
  images:          row.images         ?? [],
  colors:          row.colors         ?? [],
  sizes:           row.sizes          ?? [],
  shippingMethods: (row.shipping_methods ?? ['standard']) as ShippingMethod[],
  shippingNotes:   row.shipping_notes ?? null,
  returnPolicy:    row.return_policy  ?? null,
  isArchived:      row.is_archived    ?? row.isArchived  ?? false,
  isFeatured:      row.is_featured    ?? row.isFeatured  ?? false,
  createdAt:       row.created_at     ?? row.createdAt   ?? new Date().toISOString(),
  updatedAt:       row.updated_at     ?? row.updatedAt,
});

// ─── Product → Supabase insert/update row ─────────────────────────────────────

const toRow = (p: Partial<Product>): Record<string, any> => {
  const row: Record<string, any> = {};
  if (p.sellerId        !== undefined) row.seller_id        = p.sellerId;
  if (p.name            !== undefined) row.name             = p.name;
  if (p.description     !== undefined) row.description      = p.description;
  if (p.category        !== undefined) row.category         = p.category;
  if (p.condition       !== undefined) row.condition        = p.condition;
  if ('sku'             in p)          row.sku              = p.sku;
  if (p.price           !== undefined) row.price            = p.price;
  if ('comparePrice'    in p)          row.compare_price    = p.comparePrice;
  if ('costPrice'       in p)          row.cost_price       = p.costPrice;
  if (p.stock           !== undefined) row.stock            = p.stock;
  if ('weight'          in p)          row.weight_kg        = p.weight;
  if (p.images          !== undefined) row.images           = p.images;
  if (p.colors          !== undefined) row.colors           = p.colors;
  if (p.sizes           !== undefined) row.sizes            = p.sizes;
  if (p.shippingMethods !== undefined) row.shipping_methods = p.shippingMethods;
  if ('shippingNotes'   in p)          row.shipping_notes   = p.shippingNotes;
  if ('returnPolicy'    in p)          row.return_policy    = p.returnPolicy;
  if (p.isArchived      !== undefined) row.is_archived      = p.isArchived;
  if (p.isFeatured      !== undefined) row.is_featured      = p.isFeatured;
  return row;
};

// ─── UPLOAD: Local image URI → Supabase Storage → public URL ─────────────────

export const uploadProductImage = async (
  localUri: string,
  sellerId: string,
): Promise<string> => {
  if (localUri.startsWith('http://') || localUri.startsWith('https://')) {
    return localUri;
  }

  try {
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const filePath = `products/${sellerId}/${fileName}`;

    const response = await fetch(localUri);
    if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert:      false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.warn('uploadProductImage FAILED:', JSON.stringify(err));
    return localUri;
  }
};

export const uploadProductImages = async (
  uris: string[],
  sellerId: string,
): Promise<string[]> => {
  const results = await Promise.all(
    uris.map((uri) => uploadProductImage(uri, sellerId))
  );
  return results;
};

// ─── Internal: sync a fresh product list into local AsyncStorage ──────────────
// Call this whenever we get a trusted list from Supabase so the local
// fallback stays warm and accurate.

const _syncLocalProducts = async (products: Product[]): Promise<void> => {
  try {
    await Storage.set(KEYS.PRODUCTS, products);
  } catch (err) {
    console.warn('_syncLocalProducts failed:', err);
  }
};

// ─── READ: All active products (Buyer Home) ───────────────────────────────────

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // FIX: Trust Supabase even when it returns an empty array — an empty
    // catalogue is valid. Only fall back to local storage on a hard error.
    const mapped = (data ?? []).map(mapRow);
    // Keep local storage warm so future offline reads are accurate.
    await _syncLocalProducts(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase getProducts error (falling back to local):', err);
  }

  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  return all.filter((p) => !p.isArchived);
};

// ─── READ: Single product by ID ───────────────────────────────────────────────

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;

    if (data) {
      const mapped = mapRow(data);
      // FIX: Update just this product in local storage so the local cache
      // reflects the latest stock from Supabase (important after checkout).
      await _syncSingleLocalProduct(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase getProductById error (falling back to local):', err);
  }

  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  return all.find((p) => p.id === productId) ?? null;
};

// ─── Internal: upsert a single product into local AsyncStorage ────────────────

const _syncSingleLocalProduct = async (product: Product): Promise<void> => {
  try {
    const all = await Storage.getList<Product>(KEYS.PRODUCTS);
    const exists = all.some((p) => p.id === product.id);
    const updated = exists
      ? all.map((p) => (p.id === product.id ? product : p))
      : [...all, product];
    await Storage.set(KEYS.PRODUCTS, updated);
  } catch (err) {
    console.warn('_syncSingleLocalProduct failed:', err);
  }
};

// ─── READ: Seller's own products ─────────────────────────────────────────────

export const getMyProducts = async (sellerId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data.map(mapRow);
  } catch (err) {
    console.warn('Supabase getMyProducts error (falling back to local):', err);
  }

  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  return all.filter((p) => p.sellerId === sellerId);
};

// ─── CREATE ───────────────────────────────────────────────────────────────────

export type CreateProductPayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isArchived' | 'isFeatured'>;

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  let uploadedImages = payload.images;
  try {
    uploadedImages = await uploadProductImages(payload.images, payload.sellerId);
  } catch (err) {
    console.warn('Image upload failed, using local URIs:', err);
  }

  const newProduct: Product = {
    ...payload,
    images:     uploadedImages,
    id:         generateId(),
    isArchived: false,
    isFeatured: false,
    createdAt:  new Date().toISOString(),
  };

  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  await Storage.set(KEYS.PRODUCTS, [...all, newProduct]);

  try {
    const { error } = await supabase
      .from('products')
      .insert({ ...toRow(newProduct), id: newProduct.id, created_at: newProduct.createdAt });
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase createProduct error (local save succeeded):', err);
  }

  return newProduct;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export type UpdateProductPayload = Partial<Omit<Product, 'id' | 'sellerId' | 'createdAt'>>;

export const updateProduct = async (
  productId: string,
  updates: UpdateProductPayload,
  sellerId?: string,
): Promise<Product> => {
  if (updates.images && sellerId) {
    try {
      updates.images = await uploadProductImages(updates.images, sellerId);
    } catch (err) {
      console.warn('Image upload on update failed, keeping existing images:', err);
    }
  }

  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  let updated: Product | null = null;

  const newList = all.map((p) => {
    if (p.id === productId) {
      updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
      return updated;
    }
    return p;
  });

  if (!updated) throw new Error('Product not found.');
  await Storage.set(KEYS.PRODUCTS, newList);

  try {
    const { error } = await supabase
      .from('products')
      .update({ ...toRow(updates), updated_at: new Date().toISOString() })
      .eq('id', productId);
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase updateProduct error (local update succeeded):', err);
  }

  return updated;
};

// ─── ARCHIVE (soft delete) ────────────────────────────────────────────────────

export const archiveProduct = async (productId: string): Promise<void> => {
  await updateProduct(productId, { isArchived: true });
};

// ─── DECREMENT STOCK after purchase ──────────────────────────────────────────

export const decrementStock = async (productId: string, qty: number): Promise<void> => {
  console.log(`[decrementStock] START — productId: ${productId}, qty: ${qty}`);

  // ── Step 1: Try RPC ───────────────────────────────────────────────────────
  try {
    const { error } = await supabase.rpc('decrement_product_stock', {
      p_id:  productId,
      p_qty: qty,
    });
    if (error) throw error;
    console.log(`[decrementStock] ✅ RPC succeeded for ${productId}`);

    // FIX: After a successful RPC, fetch the authoritative stock value from
    // Supabase and write it into local storage. This ensures the Home screen
    // and ProductDetail screen see the correct count on next focus, even if
    // they read from the local cache.
    await _syncStockFromSupabase(productId);
    return;
  } catch (rpcErr) {
    console.warn(`[decrementStock] ⚠️ RPC failed for ${productId}:`, rpcErr);
  }

  // ── Step 2: Fallback — fetch current stock, then update ──────────────────
  console.log(`[decrementStock] Trying fallback UPDATE for ${productId}...`);
  try {
    const { data: row, error: fetchErr } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (fetchErr) throw fetchErr;

    const currentStock = Number(row?.stock ?? 0);
    const newStock = Math.max(0, currentStock - qty);

    console.log(`[decrementStock] currentStock=${currentStock}, newStock=${newStock}`);

    const { error: updateErr } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId);

    if (updateErr) throw updateErr;

    console.log(`[decrementStock] ✅ Fallback UPDATE succeeded for ${productId}. New stock: ${newStock}`);

    // FIX: Write the known-good new stock value directly to local storage
    // instead of re-fetching, since we just computed it.
    await _setLocalStock(productId, newStock);
  } catch (fallbackErr) {
    console.error(`[decrementStock] ❌ ALL strategies failed for ${productId}:`, fallbackErr);
    // Last resort: apply the decrement locally so the UI isn't completely stale.
    await _decrementLocalStock(productId, qty);
  }
};

// ─── Internal: fetch authoritative stock from Supabase → write to local ──────

const _syncStockFromSupabase = async (productId: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (error) throw error;

    const newStock = Number(data?.stock ?? 0);
    await _setLocalStock(productId, newStock);
    console.log(`[decrementStock] ✅ Local storage synced from Supabase for ${productId}: stock=${newStock}`);
  } catch (err) {
    console.warn(`[decrementStock] ⚠️ _syncStockFromSupabase failed for ${productId}:`, err);
  }
};

// ─── Internal: set an exact stock value in local AsyncStorage ─────────────────

const _setLocalStock = async (productId: string, stock: number): Promise<void> => {
  try {
    const all = await Storage.getList<Product>(KEYS.PRODUCTS);
    const updated = all.map((p) =>
      p.id === productId ? { ...p, stock } : p
    );
    await Storage.set(KEYS.PRODUCTS, updated);
  } catch (err) {
    console.warn(`[decrementStock] ⚠️ _setLocalStock failed for ${productId}:`, err);
  }
};

// ─── Internal: update local AsyncStorage stock (decrement path) ───────────────

const _decrementLocalStock = async (productId: string, qty: number): Promise<void> => {
  try {
    const all = await Storage.getList<Product>(KEYS.PRODUCTS);
    const updated = all.map((p) =>
      p.id === productId ? { ...p, stock: Math.max(0, p.stock - qty) } : p
    );
    await Storage.set(KEYS.PRODUCTS, updated);
    console.log(`[decrementStock] ✅ Local storage decremented for ${productId}`);
  } catch (localErr) {
    console.warn(`[decrementStock] ⚠️ Local storage update failed for ${productId}:`, localErr);
  }
};