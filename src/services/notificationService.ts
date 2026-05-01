// src/services/notificationService.ts

import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { Notification } from '../types';
import { supabase } from './supabaseClient';

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

type CreatePayload = { userId: string; message: string; orderId?: string; type?: string };

// ─── Map Supabase row → Notification ─────────────────────────────────────────
const mapRow = (row: any): Notification => ({
  id:        row.id,
  userId:    row.user_id,
  message:   row.message,
  isRead:    row.is_read,
  orderId:   row.order_id ?? undefined,
  type:      row.type ?? 'order',
  createdAt: row.created_at,
});

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createNotification = async (payload: CreatePayload): Promise<void> => {
  // ── Supabase first (real-time source of truth) ────────────────────────
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id:  payload.userId,
      message:  payload.message,
      order_id: payload.orderId ?? null,
      type:     payload.type ?? 'order',
      is_read:  false,
    });
    if (error) throw error;
    return; // Supabase succeeded — skip local fallback
  } catch (e) {
    console.warn('[notificationService] Supabase insert failed, falling back to local:', e);
  }

  // ── Local fallback ────────────────────────────────────────────────────
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  const n: Notification = {
    id:        generateId(),
    userId:    payload.userId,
    message:   payload.message,
    isRead:    false,
    orderId:   payload.orderId,
    type:      payload.type ?? 'order',
    createdAt: new Date().toISOString(),
  };
  await Storage.set(KEYS.NOTIFICATIONS, [n, ...all]);
};

// ─── READ ─────────────────────────────────────────────────────────────────────
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  // ── Supabase first ────────────────────────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (data) return data.map(mapRow);
  } catch (e) {
    console.warn('[notificationService] Supabase fetch failed, falling back to local:', e);
  }

  // ── Local fallback ────────────────────────────────────────────────────
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  return all
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// ─── UNREAD COUNT ─────────────────────────────────────────────────────────────
export const getUnreadCount = async (userId: string): Promise<number> => {
  const notifs = await getNotifications(userId);
  return notifs.filter((n) => !n.isRead).length;
};

// ─── MARK AS READ ─────────────────────────────────────────────────────────────
export const markAsRead = async (notificationId: string): Promise<void> => {
  // ── Supabase ──────────────────────────────────────────────────────────
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;
    return;
  } catch (e) {
    console.warn('[notificationService] Supabase markAsRead failed, falling back to local:', e);
  }

  // ── Local fallback ────────────────────────────────────────────────────
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  await Storage.set(
    KEYS.NOTIFICATIONS,
    all.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
  );
};

// ─── MARK ALL AS READ ─────────────────────────────────────────────────────────
export const markAllAsRead = async (userId: string): Promise<void> => {
  // ── Supabase ──────────────────────────────────────────────────────────
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
    return;
  } catch (e) {
    console.warn('[notificationService] Supabase markAllAsRead failed, falling back to local:', e);
  }

  // ── Local fallback ────────────────────────────────────────────────────
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  await Storage.set(
    KEYS.NOTIFICATIONS,
    all.map((n) => (n.userId === userId ? { ...n, isRead: true } : n)),
  );
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteNotification = async (notificationId: string): Promise<void> => {
  // ── Supabase ──────────────────────────────────────────────────────────
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    if (error) throw error;
    return;
  } catch (e) {
    console.warn('[notificationService] Supabase delete failed, falling back to local:', e);
  }

  // ── Local fallback ────────────────────────────────────────────────────
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  await Storage.set(
    KEYS.NOTIFICATIONS,
    all.filter((n) => n.id !== notificationId),
  );
};

// ─── CLEAR ALL ────────────────────────────────────────────────────────────────
export const clearAllNotifications = async (userId: string): Promise<void> => {
  // ── Supabase ──────────────────────────────────────────────────────────
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
    return;
  } catch (e) {
    console.warn('[notificationService] Supabase clearAll failed, falling back to local:', e);
  }

  // ── Local fallback ────────────────────────────────────────────────────
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  await Storage.set(
    KEYS.NOTIFICATIONS,
    all.filter((n) => n.userId !== userId),
  );
};

// ─── REAL-TIME SUBSCRIPTION ───────────────────────────────────────────────────
// Call this in your notification screens to get instant updates across devices.
// Returns an unsubscribe function — call it on screen unmount.
export const subscribeToNotifications = (
  userId: string,
  onNew: (notification: Notification) => void,
): (() => void) => {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const notification = mapRow(payload.new);
        onNew(notification);
      },
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};