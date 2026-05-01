// src/screens/buyer/Notifications/BuyerNotificationsScreen.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, Pressable,
  RefreshControl, Alert, AppState, AppStateStatus,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../../context/AuthContext';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  subscribeToNotifications,
} from '../../../services/notificationService';
import { Notification } from '../../../types';
import { styles } from './BuyerNotificationsScreen.styles';

const POLL_INTERVAL_MS = 5_000; // polling as backup to real-time

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_META: Record<string, { icon: string; accent: string; bg: string }> = {
  order:   { icon: '🛍️', accent: '#C8102E', bg: '#FFF0F2' },
  payment: { icon: '💳', accent: '#22C55E', bg: '#F0FDF4' },
  alert:   { icon: '⚠️', accent: '#EAB308', bg: '#FEFCE8' },
  system:  { icon: '⚙️', accent: '#6B7280', bg: '#F9FAFB' },
  default: { icon: '🔔', accent: '#C8102E', bg: '#FFF0F2' },
};

const getMeta = (type?: string) =>
  TYPE_META[type ?? 'default'] ?? TYPE_META.default;

export default function BuyerNotificationsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing]       = useState(false);

  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFocusedRef   = useRef(false);
  const appStateRef    = useRef<AppStateStatus>(AppState.currentState);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ── Core fetch ─────────────────────────────────────────────────────────
  const fetchNotifs = useCallback(async () => {
    if (!user?.id) return;
    const fresh = await getNotifications(user.id);
    setNotifications((prev) => {
      const prevJson = JSON.stringify(prev);
      const nextJson = JSON.stringify(fresh);
      return prevJson === nextJson ? prev : fresh;
    });
  }, [user?.id]);

  // ── Real-time: prepend new notification instantly ──────────────────────
  const handleNewNotification = useCallback((notif: Notification) => {
    setNotifications((prev) => {
      // Avoid duplicates
      if (prev.some((n) => n.id === notif.id)) return prev;
      return [notif, ...prev];
    });
  }, []);

  // ── Start / stop polling (backup for real-time) ────────────────────────
  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(fetchNotifs, POLL_INTERVAL_MS);
  }, [fetchNotifs]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Subscribe / unsubscribe real-time ──────────────────────────────────
  const startRealtime = useCallback(() => {
    if (!user?.id || unsubscribeRef.current) return;
    unsubscribeRef.current = subscribeToNotifications(
      user.id,
      handleNewNotification,
    );
  }, [user?.id, handleNewNotification]);

  const stopRealtime = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  // ── AppState: pause when backgrounded ─────────────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      appStateRef.current = next;
      if (next === 'active' && isFocusedRef.current) {
        fetchNotifs();
        startPolling();
        startRealtime();
      } else if (next !== 'active') {
        stopPolling();
        stopRealtime();
      }
    });
    return () => sub.remove();
  }, [fetchNotifs, startPolling, stopPolling, startRealtime, stopRealtime]);

  // ── Screen focus: start everything, stop on blur ───────────────────────
  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      fetchNotifs();
      if (AppState.currentState === 'active') {
        startPolling();
        startRealtime();
      }
      return () => {
        isFocusedRef.current = false;
        stopPolling();
        stopRealtime();
      };
    }, [fetchNotifs, startPolling, stopPolling, startRealtime, stopRealtime]),
  );

  // ── Pull-to-refresh ────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifs();
    setRefreshing(false);
  }, [fetchNotifs]);

  // ── Actions ────────────────────────────────────────────────────────────
  const handlePress = async (notif: Notification) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Notification', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteNotification(id);
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        },
      },
    ]);
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    await markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Render item ────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: Notification }) => {
    const meta = getMeta((item as any).type);
    return (
      <Pressable
        style={({ pressed }) => [
          styles.item,
          !item.isRead && styles.itemUnread,
          !item.isRead && { borderLeftColor: meta.accent },
          pressed && styles.itemPressed,
        ]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleDelete(item.id)}
      >
        <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
          <Text style={styles.iconText}>{meta.icon}</Text>
          {!item.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: meta.accent }]} />
          )}
        </View>

        <View style={styles.itemBody}>
          <Text
            style={[styles.itemMessage, item.isRead && styles.itemMessageRead]}
            numberOfLines={3}
          >
            {item.message}
          </Text>
          <View style={styles.itemFooter}>
            <Text style={styles.itemTime}>{timeAgo(item.createdAt)}</Text>
            {!item.isRead && (
              <View style={[styles.newBadge, { backgroundColor: meta.accent }]}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}
          </View>
        </View>

        <Pressable
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => handleDelete(item.id)}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backBtnText}>‹</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <Pressable
            style={({ pressed }) => [styles.markAllBtn, pressed && { opacity: 0.6 }]}
            onPress={handleMarkAllRead}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        ) : (
          <View style={styles.markAllBtn} />
        )}
      </View>

      {notifications.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            {unreadCount > 0 ? ` · ${unreadCount} unread` : ' · all read'}
          </Text>
          <Text style={styles.summaryHint}>Long press to delete</Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#C8102E']}
            tintColor="#C8102E"
          />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>🔔</Text>
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>Order updates and alerts will appear here</Text>
          </View>
        }
      />
    </View>
  );
}