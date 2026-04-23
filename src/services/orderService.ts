// src/services/orderService.ts

import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { Order, OrderStatus, CartItem } from '../types';
import { decrementStock } from './productService';
import { createNotification } from './notificationService';
import {
  notifyOrderPlaced,
  notifyNewOrder,
  notifyOrderStatusUpdate,
} from './pushNotificationService';
import { supabase } from './supabaseClient'; // ← ADDED

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─── READ: Buyer's orders ─────────────────────────────────────
export const getMyOrdersAsBuyer = async (buyerId: string): Promise<Order[]> => {
  const all = await Storage.getList<Order>(KEYS.ORDERS);

  // ─── SUPABASE: Fetch buyer's orders from Supabase ────────────
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data as unknown as Order[];
  } catch (supabaseError) {
    console.warn('Supabase getMyOrdersAsBuyer error (falling back to local):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────

  return all
    .filter((o) => o.buyerId === buyerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// ─── READ: Seller's orders ────────────────────────────────────
export const getMyOrdersAsSeller = async (sellerId: string): Promise<Order[]> => {
  const all = await Storage.getList<Order>(KEYS.ORDERS);

  // ─── SUPABASE: Fetch seller's orders from Supabase ───────────
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data as unknown as Order[];
  } catch (supabaseError) {
    console.warn('Supabase getMyOrdersAsSeller error (falling back to local):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────

  return all
    .filter((o) => o.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// ─── READ: Dashboard stats ────────────────────────────────────
export const getSellerStats = async (sellerId: string) => {
  const orders = await getMyOrdersAsSeller(sellerId);
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  return { totalOrders, totalRevenue, pendingOrders };
};

// ─── CREATE: Buyer places an order ───────────────────────────
export type PlaceOrderPayload = {
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  shippingAddress: string;
};

export const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
  const all = await Storage.getList<Order>(KEYS.ORDERS);
  const now = new Date().toISOString();
  const totalAmount = payload.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const newOrder: Order = {
    id:              generateId(),
    buyerId:         payload.buyerId,
    sellerId:        payload.sellerId,
    items:           payload.items,
    status:          'pending',
    paymentStatus:   'pending',
    paymentMethod:   'COD',
    shippingAddress: payload.shippingAddress,
    totalAmount,
    createdAt:       now,
    updatedAt:       now,
  };

  await Storage.set(KEYS.ORDERS, [...all, newOrder]);

  for (const item of payload.items) {
    await decrementStock(item.product.id, item.quantity);
  }

  // AsyncStorage notification (in-app)
  await createNotification({
    userId:  payload.sellerId,
    message: `New order #${newOrder.id.slice(0, 8).toUpperCase()} received! ₱${totalAmount.toLocaleString()}`,
    orderId: newOrder.id,
  });

  // Push notification (phone alert) — buyer confirms, seller gets notified
  await notifyOrderPlaced(newOrder.id, totalAmount);
  await notifyNewOrder(newOrder.id, totalAmount);

  // ─── SUPABASE: Insert new order + order items into Supabase ──
  try {
    const { error: orderError } = await supabase.from('orders').insert({
      id:               newOrder.id,
      buyer_id:         newOrder.buyerId,
      seller_id:        newOrder.sellerId,
      status:           newOrder.status,
      payment_status:   newOrder.paymentStatus,
      payment_method:   newOrder.paymentMethod,
      shipping_address: newOrder.shippingAddress,
      total_amount:     newOrder.totalAmount,
      created_at:       newOrder.createdAt,
      updated_at:       newOrder.updatedAt,
    });
    if (orderError) throw orderError;

    const orderItems = payload.items.map((item) => ({
      order_id:   newOrder.id,
      product_id: item.product.id,
      quantity:   item.quantity,
      price:      item.product.price,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;
  } catch (supabaseError) {
    console.warn('Supabase placeOrder error (local save succeeded):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────

  return newOrder;
};

// ─── UPDATE: Seller updates order status ─────────────────────
export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
  buyerId: string
): Promise<void> => {
  const all = await Storage.getList<Order>(KEYS.ORDERS);
  const now = new Date().toISOString();

  const newList = all.map((o) => {
    if (o.id !== orderId) return o;
    const paymentStatus =
      newStatus === 'delivered' ? 'paid' :
      newStatus === 'cancelled' ? 'cancelled' :
      newStatus === 'refunded'  ? 'refunded' :
      o.paymentStatus;
    return { ...o, status: newStatus, paymentStatus, updatedAt: now };
  });

  await Storage.set(KEYS.ORDERS, newList);

  const statusLabels: Partial<Record<OrderStatus, string>> = {
    confirmed: 'confirmed by the seller',
    preparing: 'being prepared',
    shipped:   'on its way',
    delivered: 'delivered',
    cancelled: 'cancelled',
  };
  const label = statusLabels[newStatus];
  if (label) {
    await createNotification({
      userId:  buyerId,
      message: `Your order #${orderId.slice(0, 8).toUpperCase()} is now ${label}.`,
      orderId,
    });
    // Push notification to buyer's phone
    await notifyOrderStatusUpdate(orderId, label);
  }

  // ─── SUPABASE: Update order status in Supabase ───────────────
  try {
    const paymentStatus =
      newStatus === 'delivered' ? 'paid' :
      newStatus === 'cancelled' ? 'cancelled' :
      newStatus === 'refunded'  ? 'refunded' :
      undefined;

    const supabaseUpdates: Record<string, any> = {
      status:     newStatus,
      updated_at: now,
    };
    if (paymentStatus !== undefined) {
      supabaseUpdates.payment_status = paymentStatus;
    }

    const { error } = await supabase
      .from('orders')
      .update(supabaseUpdates)
      .eq('id', orderId);
    if (error) throw error;
  } catch (supabaseError) {
    console.warn('Supabase updateOrderStatus error (local update succeeded):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────
};

// ─── UPDATE: Buyer cancels a pending order ───────────────────
export const cancelOrder = async (orderId: string, sellerId: string): Promise<void> => {
  const all = await Storage.getList<Order>(KEYS.ORDERS);
  const order = all.find((o) => o.id === orderId);
  if (!order) throw new Error('Order not found.');
  if (order.status !== 'pending') throw new Error('Only pending orders can be cancelled.');

  const now = new Date().toISOString();
  const newList = all.map((o) =>
    o.id === orderId
      ? { ...o, status: 'cancelled' as OrderStatus, paymentStatus: 'cancelled' as const, updatedAt: now }
      : o
  );
  await Storage.set(KEYS.ORDERS, newList);

  await createNotification({
    userId:  sellerId,
    message: `Order #${orderId.slice(0, 8).toUpperCase()} was cancelled by the buyer.`,
    orderId,
  });

  // ─── SUPABASE: Cancel order in Supabase ──────────────────────
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status:         'cancelled',
        payment_status: 'cancelled',
        updated_at:     now,
      })
      .eq('id', orderId);
    if (error) throw error;
  } catch (supabaseError) {
    console.warn('Supabase cancelOrder error (local update succeeded):', supabaseError);
  }
  // ─────────────────────────────────────────────────────────────
};