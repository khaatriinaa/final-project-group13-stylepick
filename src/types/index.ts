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

  name:        string;
  description: string;
  category:    string;
  condition:   ProductCondition;
  sku?:        string | null;

  price:         number;
  comparePrice?: number | null;
  costPrice?:    number | null;

  stock:   number;
  weight?: number | null;

  images: string[];
  colors: string[];
  sizes:  string[];

  shippingMethods: ShippingMethod[];
  shippingNotes?:  string | null;
  returnPolicy?:   string | null;

  isArchived: boolean;
  isFeatured: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product:        Product;
  quantity:       number;
  selectedColor?: string;
  selectedSize?:  string;

  // Denormalized snapshot fields (populated when order is placed / returned from Supabase)
  productName?:   string;
  name?:          string;
  price?:         number;
  image?:         string;
  color?:         string;
  size?:          string;
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
  shippingFee?:    number;
  buyerName?:      string;
  buyerPhone?:     string;
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