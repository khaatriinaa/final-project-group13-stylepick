// src/services/notificationService.ts

import { Storage } from '../storage/storage';
import { KEYS } from '../storage/keys';
import { Notification } from '../types';

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

type CreatePayload = { userId: string; message: string; orderId?: string };

export const createNotification = async (payload: CreatePayload): Promise<void> => {
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  const n: Notification = {
    id:        generateId(),
    userId:    payload.userId,
    message:   payload.message,
    isRead:    false,
    orderId:   payload.orderId,
    createdAt: new Date().toISOString(),
  };
  await Storage.set(KEYS.NOTIFICATIONS, [n, ...all]);
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  return all
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  const notifs = await getNotifications(userId);
  return notifs.filter((n) => !n.isRead).length;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  const updated = all.map((n) => n.id === notificationId ? { ...n, isRead: true } : n);
  await Storage.set(KEYS.NOTIFICATIONS, updated);
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  const updated = all.map((n) => n.userId === userId ? { ...n, isRead: true } : n);
  await Storage.set(KEYS.NOTIFICATIONS, updated);
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  await Storage.set(KEYS.NOTIFICATIONS, all.filter((n) => n.id !== notificationId));
};

export const clearAllNotifications = async (userId: string): Promise<void> => {
  const all = await Storage.getList<Notification>(KEYS.NOTIFICATIONS);
  await Storage.set(KEYS.NOTIFICATIONS, all.filter((n) => n.userId !== userId));
};
