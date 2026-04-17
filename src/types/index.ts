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

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  category: string;
  isArchived: boolean;
  createdAt: string;
  // Fashion-specific
  colors?: string[];   // e.g. ['#000000', '#FFFFFF', '#FF0000']
  sizes?: string[];    // e.g. ['XS', 'S', 'M', 'L', 'XL', 'XXL']
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

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
  id: string;
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'COD';
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  orderId?: string;
  createdAt: string;
}
