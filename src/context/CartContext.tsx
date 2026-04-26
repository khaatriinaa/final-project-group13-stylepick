// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = '@cart_items';

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue>({
  cartItems: [], addToCart: () => {}, removeFromCart: () => {},
  updateQuantity: () => {}, clearCart: () => {}, total: 0, itemCount: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(CART_STORAGE_KEY)
      .then((json) => {
        if (json) setCartItems(JSON.parse(json));
      })
      .catch(console.error);
  }, []);

  // Save to AsyncStorage whenever cartItems changes
  useEffect(() => {
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems)).catch(console.error);
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantity = 1, color?: string, size?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((i) =>
        i.product.id === product.id &&
        i.selectedColor === (color ?? null) &&
        i.selectedSize === (size ?? null)
      );
      if (existing) {
        return prev.map((i) =>
          i === existing
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCartItems((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);
  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);