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
  stock:           row.stock,
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
  // If already a remote URL skip upload
  if (localUri.startsWith('http://') || localUri.startsWith('https://')) {
    return localUri;
  }

  try {
    // ─── Step 1: Build unique file name ──────────────────────────
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const filePath = `products/${sellerId}/${fileName}`;

    console.log('Fetching local image URI:', localUri); // ✅ DEBUG

    // ─── Step 2: Fetch local file as ArrayBuffer ──────────────────
    const response = await fetch(localUri);
    if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();

    console.log('ArrayBuffer size:', arrayBuffer.byteLength); // ✅ DEBUG
    console.log('Uploading to Supabase Storage path:', filePath); // ✅ DEBUG

    // ─── Step 3: Upload ArrayBuffer directly to Supabase ─────────
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert:      false,
      });

    if (uploadError) {
      console.warn('Supabase Storage upload error:', JSON.stringify(uploadError)); // ✅ DEBUG
      throw uploadError;
    }

    // ─── Step 4: Return public URL ────────────────────────────────
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('Upload success! Public URL:', data.publicUrl); // ✅ DEBUG
    return data.publicUrl;

  } catch (err) {
    console.warn('uploadProductImage FAILED:', JSON.stringify(err)); // ✅ DEBUG
    return localUri; // fallback — keeps app from crashing
  }
};

// ─── UPLOAD: Upload all images and return array of public URLs ────────────────

export const uploadProductImages = async (
  uris: string[],
  sellerId: string,
): Promise<string[]> => {
  const results = await Promise.all(
    uris.map((uri) => uploadProductImage(uri, sellerId))
  );
  return results;
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
    if (data && data.length > 0) return data.map(mapRow);
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
    if (data) return mapRow(data);
  } catch (err) {
    console.warn('Supabase getProductById error (falling back to local):', err);
  }

  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  return all.find((p) => p.id === productId) ?? null;
};

// ─── READ: Seller's own products (all, including archived) ───────────────────

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
  // ─── Upload images to Supabase Storage before saving ─────────────
  let uploadedImages = payload.images;
  try {
    uploadedImages = await uploadProductImages(payload.images, payload.sellerId);
    console.log('All images uploaded:', uploadedImages); // ✅ DEBUG
  } catch (err) {
    console.warn('Image upload failed, using local URIs:', err);
  }
  // ─────────────────────────────────────────────────────────────────

  const newProduct: Product = {
    ...payload,
    images:     uploadedImages, // ← Supabase public URLs
    id:         generateId(),
    isArchived: false,
    isFeatured: false,
    createdAt:  new Date().toISOString(),
  };

  // Persist locally first (offline-safe)
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  await Storage.set(KEYS.PRODUCTS, [...all, newProduct]);

  // Sync to Supabase
  try {
    const { error } = await supabase
      .from('products')
      .insert({ ...toRow(newProduct), id: newProduct.id, created_at: newProduct.createdAt });
    if (error) throw error;
    console.log('Product saved to Supabase:', newProduct.id); // ✅ DEBUG
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
  // ─── Upload any new local images before updating ──────────────────
  if (updates.images && sellerId) {
    try {
      updates.images = await uploadProductImages(updates.images, sellerId);
      console.log('Updated images uploaded:', updates.images); // ✅ DEBUG
    } catch (err) {
      console.warn('Image upload on update failed, keeping existing images:', err);
    }
  }
  // ─────────────────────────────────────────────────────────────────

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

  // Sync to Supabase
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
  // Local update
  const all = await Storage.getList<Product>(KEYS.PRODUCTS);
  const newList = all.map((p) =>
    p.id === productId ? { ...p, stock: Math.max(0, p.stock - qty) } : p,
  );
  await Storage.set(KEYS.PRODUCTS, newList);

  // Supabase: prefer RPC to avoid race conditions on concurrent purchases
  try {
    const { error } = await supabase.rpc('decrement_product_stock', {
      p_id:  productId,
      p_qty: qty,
    });
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase decrementStock RPC error, trying fallback:', err);
    try {
      const { data, error: fetchErr } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();
      if (fetchErr) throw fetchErr;
      await supabase
        .from('products')
        .update({ stock: Math.max(0, (data.stock ?? 0) - qty) })
        .eq('id', productId);
    } catch (fallbackErr) {
      console.warn('Supabase decrementStock fallback also failed:', fallbackErr);
    }
  }
};