// src/services/pushNotificationService.ts
// Local push notifications using expo-notifications + expo-device

import * as Notifications from 'expo-notifications';
import { NotificationBehavior } from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ─── Handler: show alert + sound when notification arrives ───
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  } as NotificationBehavior),
});

// ─── Register device for push notifications ───────────────────
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E63946',
    });
  }

  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device.');
    return null;
  }

  const { granted: existingGranted } = await Notifications.getPermissionsAsync();
  let finalGranted = existingGranted;

  if (!existingGranted) {
    const { granted: newGranted } = await Notifications.requestPermissionsAsync();
    finalGranted = newGranted;
  }

  if (!finalGranted) {
    console.warn('Push notification permission denied.');
    return null;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      // Still works for local-only notifications without a project ID
      return null;
    }
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Expo Push Token:', token);
    return token;
  } catch {
    return null;
  }
}

// ─── Send an immediate local notification ────────────────────
export async function sendLocalNotification(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: null, // immediate
  });
}

// ─── Pre-built notification helpers ──────────────────────────

// Buyer: order placed confirmation
export const notifyOrderPlaced = (orderId: string, total: number) =>
  sendLocalNotification(
    'Order Placed! 🎉',
    `Your order #${orderId.slice(0, 8).toUpperCase()} for ₱${total.toLocaleString()} was placed successfully.`
  );

// Buyer: order status updated
export const notifyOrderStatusUpdate = (orderId: string, status: string) =>
  sendLocalNotification(
    'Order Update',
    `Your order #${orderId.slice(0, 8).toUpperCase()} is now ${status}.`
  );

// Seller: new order received
export const notifyNewOrder = (orderId: string, amount: number) =>
  sendLocalNotification(
    'New Order Received! 🛍️',
    `Order #${orderId.slice(0, 8).toUpperCase()} for ₱${amount.toLocaleString()} is waiting for confirmation.`
  );
