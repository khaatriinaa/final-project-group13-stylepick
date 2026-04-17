// src/screens/buyer/Notifications/BuyerNotificationsScreen.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../../services/notificationService';
import { Notification } from '../../../types';
import { styles } from './BuyerNotificationsScreen.styles';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function BuyerNotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifs = useCallback(async () => {
    if (!user?.id) return;
    const data = await getNotifications(user.id);
    setNotifications(data);
  }, [user?.id]);

  useFocusEffect(useCallback(() => { fetchNotifs(); }, [fetchNotifs]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifs();
    setRefreshing(false);
  }, [fetchNotifs]);

  const handlePress = async (notif: Notification) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n)
      );
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    await markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
        </Text>
        {unreadCount > 0 && (
          <Pressable style={styles.markAllBtn} onPress={handleMarkAllRead}>
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
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#E63946']} tintColor="#E63946" />
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.item,
              !item.isRead && styles.itemUnread,
              pressed && styles.itemPressed,
            ]}
            onPress={() => handlePress(item)}
            onLongPress={() =>
              Alert.alert('Delete', 'Remove this notification?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
              ])
            }
          >
            <View style={[styles.dot, item.isRead && styles.dotRead]} />
            <View style={styles.itemBody}>
              <Text style={[styles.itemMessage, item.isRead && styles.itemMessageRead]}>
                {item.message}
              </Text>
              <Text style={styles.itemTime}>{timeAgo(item.createdAt)}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>You'll see order updates here</Text>
          </View>
        }
      />
    </View>
  );
}
