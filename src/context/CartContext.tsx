// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = '@cart_items';
const LOW_STOCK_THRESHOLD = 5;

/** Stable key identifying a unique cart line: same product + same variant = same line */
export const cartLineKey = (productId: string, color?: string | null, size?: string | null) =>
  `${productId}__${color ?? ''}__${size ?? ''}`;

interface CartContextValue {
  cartItems:      CartItem[];
  addToCart:      (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart:      () => void;
  total:          number;
  itemCount:      number;
  isLowStock:     (product: Product) => boolean;
}

const CartContext = createContext<CartContextValue>({
  cartItems:      [],
  addToCart:      () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart:      () => {},
  total:          0,
  itemCount:      0,
  isLowStock:     () => false,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ── Persistence ────────────────────────────────────────────────────────────

  useEffect(() => {
    AsyncStorage.getItem(CART_STORAGE_KEY)
      .then((json) => { if (json) setCartItems(JSON.parse(json)); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems)).catch(console.error);
  }, [cartItems]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const addToCart = useCallback((product: Product, quantity = 1, color?: string, size?: string) => {
    // Guard: never add out-of-stock products
    if (product.stock <= 0) return;

    setCartItems((prev) => {
      const key = cartLineKey(product.id, color, size);
      const existing = prev.find(
        (i) => cartLineKey(i.product.id, i.selectedColor, i.selectedSize) === key,
      );

      if (existing) {
        // Same product + same variant → increment, respect stock ceiling
        return prev.map((i) =>
          cartLineKey(i.product.id, i.selectedColor, i.selectedSize) === key
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i,
        );
      }

      // New variant line
      return [
        ...prev,
        {
          product,
          quantity:      Math.min(quantity, product.stock),
          selectedColor: color ?? undefined,
          selectedSize:  size  ?? undefined,
        },
      ];
    });
  }, []);

  /**
   * removeFromCart is now variant-aware.
   * Passing color + size removes only that variant line.
   * Omitting them falls back to removing by productId only (backwards-compat).
   */
  const removeFromCart = useCallback((productId: string, color?: string, size?: string) => {
    setCartItems((prev) => {
      if (color !== undefined || size !== undefined) {
        const key = cartLineKey(productId, color, size);
        return prev.filter(
          (i) => cartLineKey(i.product.id, i.selectedColor, i.selectedSize) !== key,
        );
      }
      // Legacy: remove all lines for this productId
      return prev.filter((i) => i.product.id !== productId);
    });
  }, []);

  /**
   * updateQuantity is now variant-aware.
   * quantity <= 0 removes the line entirely.
   */
  const updateQuantity = useCallback(
    (productId: string, quantity: number, color?: string, size?: string) => {
      setCartItems((prev) => {
        if (color !== undefined || size !== undefined) {
          const key = cartLineKey(productId, color, size);
          if (quantity <= 0) {
            return prev.filter(
              (i) => cartLineKey(i.product.id, i.selectedColor, i.selectedSize) !== key,
            );
          }
          return prev.map((i) =>
            cartLineKey(i.product.id, i.selectedColor, i.selectedSize) === key
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i,
          );
        }

        // Legacy path: match by productId only
        if (quantity <= 0) {
          return prev.filter((i) => i.product.id !== productId);
        }
        return prev.map((i) =>
          i.product.id === productId
            ? { ...i, quantity: Math.min(quantity, i.product.stock) }
            : i,
        );
      });
    },
    [],
  );

  const clearCart = useCallback(() => setCartItems([]), []);

  // ── Derived values ─────────────────────────────────────────────────────────

  const total     = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  /** True when the product has stock but it's running low */
  const isLowStock = useCallback(
    (product: Product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD,
    [],
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount, isLowStock }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);