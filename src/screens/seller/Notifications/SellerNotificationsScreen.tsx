// src/screens/seller/Notifications/SellerNotificationsScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import {
  getNotifications, markAsRead, markAllAsRead, deleteNotification,
} from '../../../services/notificationService';
import { Notification } from '../../../types';
import { COLORS } from '../../../theme';
import { styles } from './SellerNotificationsScreen.styles';

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function SellerNotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifs = useCallback(async () => {
    if (!user?.id) return;
    setNotifications(await getNotifications(user.id));
  }, [user?.id]);

  useFocusEffect(useCallback(() => { fetchNotifs(); }, [fetchNotifs]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true); await fetchNotifs(); setRefreshing(false);
  }, [fetchNotifs]);

  const handlePress = async (n: Notification) => {
    if (!n.isRead) {
      await markAsRead(n.id);
      setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, isRead: true } : x));
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Notification', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }},
    ]);
  };

  const handleMarkAll = async () => {
    if (!user?.id) return;
    await markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Notifications{unread > 0 ? ` (${unread})` : ''}
        </Text>
        {unread > 0 && (
          <Pressable style={styles.markAllBtn} onPress={handleMarkAll}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.secondary]} tintColor={COLORS.secondary} />
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.item, !item.isRead && styles.itemUnread, pressed && styles.itemPressed]}
            onPress={() => handlePress(item)}
            onLongPress={() => handleDelete(item.id)}
          >
            <View style={[styles.indicator, item.isRead && styles.indicatorRead]} />
            <View style={styles.itemBody}>
              <Text style={[styles.itemMessage, item.isRead && styles.itemMessageRead]}>
                {item.message}
              </Text>
              <Text style={styles.itemTime}>{timeAgo(item.createdAt)}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>◻</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>New order alerts will appear here</Text>
          </View>
        }
      />
    </View>
  );
}
