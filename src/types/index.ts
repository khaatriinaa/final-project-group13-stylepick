// src/types/index.ts

export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  address?: string;
  phone?: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';
export type ShippingMethod   = 'standard' | 'express' | 'same_day' | 'pickup';

export interface Product {
  id:        string;
  sellerId:  string;
  createdAt: string;
  updatedAt?: string;

  // Core Info
  name:        string;
  description: string;
  category:    string;
  condition:   ProductCondition;
  sku?:        string | null;

  // Pricing
  price:         number;
  comparePrice?: number | null;  // slashed/original price shown to buyers
  costPrice?:    number | null;  // private, for seller margin tracking only

  // Inventory
  stock:   number;
  weight?: number | null;        // in kg, used for shipping calculation

  // Variants
  images: string[];
  colors: string[];              // hex values e.g. ['#1A1A1A', '#FFFFFF']
  sizes:  string[];              // e.g. ['XS','S','M'] or ['39','40','41']

  // Shipping & Policy
  shippingMethods: ShippingMethod[];
  shippingNotes?:  string | null;
  returnPolicy?:   string | null;

  // Status
  isArchived: boolean;
  isFeatured: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product:        Product;
  quantity:       number;
  selectedColor?: string;
  selectedSize?:  string;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';

export interface Order {
  id:              string;
  buyerId:         string;
  sellerId:        string;
  items:           CartItem[];
  status:          OrderStatus;
  paymentStatus:   PaymentStatus;
  paymentMethod:   'COD';
  shippingAddress: string;
  totalAmount:     number;
  createdAt:       string;
  updatedAt:       string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id:        string;
  userId:    string;
  message:   string;
  isRead:    boolean;
  orderId?:  string;
  createdAt: string;
}