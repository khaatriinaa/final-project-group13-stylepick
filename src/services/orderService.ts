import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { Order, OrderStatus, CartItem } from '../types';
import { createNotification } from './notificationService';
import {
  notifyOrderPlaced,
  notifyNewOrder,
  notifyOrderStatusUpdate,
} from './pushNotificationService';
import { supabase } from './supabaseClient';

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─── Supabase row → Order ─────────────────────────────────────────────────────
const mapRow = (row: any): Order => ({
  id:              row.id,
  buyerId:         row.buyer_id,
  sellerId:        row.seller_id,
  items:           row.items ?? [],
  status:          row.status          as OrderStatus,
  paymentStatus:   row.payment_status  as any,
  paymentMethod:   row.payment_method  as any,
  shippingAddress: row.shipping_address ?? '',
  buyerName:       row.buyer_name      ?? undefined,
  buyerPhone:      row.buyer_phone     ?? undefined,
  totalAmount:     Number(row.total_amount),
  createdAt:       row.created_at,
  updatedAt:       row.updated_at,
});

// ─── NEW: READ Single Order ──────────────────────────────────────────────────
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data ? mapRow(data) : null;
  } catch (supabaseError) {
    console.warn('Supabase getOrderById error (falling back to local):', supabaseError);
    const all = await Storage.getList<Order>(KEYS.ORDERS);
    return all.find((o) => o.id === orderId) || null;
  }
};

// ─── READ: Buyer's orders ─────────────────────────────────────────────────────
export const getMyOrdersAsBuyer = async (buyerId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data) return data.map(mapRow);
  } catch (supabaseError) {
    console.warn('Supabase getMyOrdersAsBuyer error (falling back to local):', supabaseError);
  }
  const all = await Storage.getList<Order>(KEYS.ORDERS);
  return all
    .filter((o) => o.buyerId === buyerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// ─── READ: Seller's orders ────────────────────────────────────────────────────
export const getMyOrdersAsSeller = async (sellerId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data) return data.map(mapRow);
  } catch (supabaseError) {
    console.warn('Supabase getMyOrdersAsSeller error (falling back to local):', supabaseError);
  }
  const all = await Storage.getList<Order>(KEYS.ORDERS);
  return all
    .filter((o) => o.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// ─── READ: Dashboard stats ────────────────────────────────────────────────────
export const getSellerStats = async (sellerId: string) => {
  const orders = await getMyOrdersAsSeller(sellerId);
  const totalOrders   = orders.length;
  const totalRevenue  = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  return { totalOrders, totalRevenue, pendingOrders };
};

// ─── CREATE: Buyer places an order ───────────────────────────────────────────
export type PlaceOrderPayload = {
  buyerId:         string;
  sellerId:        string;
  items:           CartItem[];
  shippingAddress: string;
  buyerName?:      string;
  buyerPhone?:     string;
};

export const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
  const all  = await Storage.getList<Order>(KEYS.ORDERS);
  const now  = new Date().toISOString();
  const totalAmount = payload.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  const newOrder: Order = {
    id:               generateId(),
    buyerId:          payload.buyerId,
    sellerId:         payload.sellerId,
    items:            payload.items,
    status:           'pending',
    paymentStatus:    'pending',
    paymentMethod:    'COD',
    shippingAddress:  payload.shippingAddress,
    buyerName:        payload.buyerName,
    buyerPhone:       payload.buyerPhone,
    totalAmount,
    createdAt:        now,
    updatedAt:        now,
  };

  await Storage.set(KEYS.ORDERS, [...all, newOrder]);

  await createNotification({
    userId:  payload.sellerId,
    message: `New order #${newOrder.id.slice(0, 8).toUpperCase()} received! ₱${totalAmount.toLocaleString()}`,
    orderId: newOrder.id,
  });

  await notifyOrderPlaced(newOrder.id, totalAmount);
  await notifyNewOrder(newOrder.id, totalAmount);

  try {
    const { error: orderError } = await supabase.from('orders').insert({
      id:               newOrder.id,
      buyer_id:         newOrder.buyerId,
      seller_id:        newOrder.sellerId,
      items:            newOrder.items,
      status:           newOrder.status,
      payment_status:   newOrder.paymentStatus,
      payment_method:   newOrder.paymentMethod,
      shipping_address: newOrder.shippingAddress,
      buyer_name:       newOrder.buyerName  ?? null,
      buyer_phone:      newOrder.buyerPhone ?? null,
      total_amount:     newOrder.totalAmount,
      created_at:       newOrder.createdAt,
      updated_at:       newOrder.updatedAt,
    });
    if (orderError) throw orderError;
  } catch (supabaseError) {
    console.warn('Supabase placeOrder error:', supabaseError);
  }
  return newOrder;
};

// ─── UPDATE: Seller updates order status ─────────────────────────────────────
export const updateOrderStatus = async (
  orderId:   string,
  newStatus: OrderStatus,
  buyerId:   string,
): Promise<void> => {
  const now = new Date().toISOString();
  const paymentStatus =
    newStatus === 'delivered' ? 'paid'      :
    newStatus === 'cancelled' ? 'cancelled' :
    newStatus === 'refunded'  ? 'refunded'  :
    undefined;

  try {
    const supabaseUpdates: Record<string, any> = {
      status:     newStatus,
      updated_at: now,
    };
    if (paymentStatus !== undefined) supabaseUpdates.payment_status = paymentStatus;

    const { error } = await supabase
      .from('orders')
      .update(supabaseUpdates)
      .eq('id', orderId);
    if (error) throw error;
  } catch (supabaseError) {
    console.warn('Supabase updateOrderStatus error:', supabaseError);
  }

  // Sync local storage
  try {
    const all = await Storage.getList<Order>(KEYS.ORDERS);
    const newList = all.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status: newStatus,
        paymentStatus: (paymentStatus ?? o.paymentStatus) as any,
        updatedAt: now,
      };
    });
    await Storage.set(KEYS.ORDERS, newList);
  } catch (localError) {
    console.warn('Local storage sync failed:', localError);
  }

  // Notifications
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
    await notifyOrderStatusUpdate(orderId, label);
  }
};

// ─── CANCEL: Buyer cancels a pending order ────────────────────────────────────
export const cancelOrder = async (orderId: string, sellerId: string): Promise<void> => {
  const now = new Date().toISOString();
  const { data: statusData, error: statusError } = await supabase
    .from('orders')
    .select('status, buyer_id')
    .eq('id', orderId)
    .single();

  if (statusError || !statusData) throw new Error('Could not fetch order status...');

  const currentStatus = statusData.status as OrderStatus;
  if (currentStatus !== 'pending') {
    throw new Error(`Orders with status "${currentStatus}" can no longer be cancelled.`);
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'cancelled', payment_status: 'cancelled', updated_at: now })
    .eq('id', orderId);

  if (updateError) throw new Error('Failed to cancel order.');

  try {
    const all = await Storage.getList<Order>(KEYS.ORDERS);
    const newList = all.map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled', paymentStatus: 'cancelled', updatedAt: now } : o
    );
    await Storage.set(KEYS.ORDERS, newList);
  } catch (e) { console.warn('Local sync failed'); }

  await createNotification({
    userId:  sellerId,
    message: `Order #${orderId.slice(0, 8).toUpperCase()} was cancelled by the buyer.`,
    orderId,
  });
  await notifyOrderStatusUpdate(orderId, 'cancelled');
};

// ─── READ: Top 4 Bestseller Products ─────────────────────────────────────────
export const getBestsellerProductIds = async (): Promise<{ productId: string; count: number }[]> => {
  try {
    const { data, error } = await supabase.from('orders').select('items');
    if (error) throw error;
    const countMap: Record<string, number> = {};
    for (const row of data ?? []) {
      for (const item of row.items ?? []) {
        const id = item.product?.id;
        if (id) countMap[id] = (countMap[id] ?? 0) + item.quantity;
      }
    }
    return Object.entries(countMap)
      .map(([productId, count]) => ({ productId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  } catch (err) { return []; }
};