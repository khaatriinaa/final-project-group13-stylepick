// src/screens/seller/Orders/SellerOrdersScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable,
  RefreshControl, ScrollView, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SellerOrdersScreenProps } from '../../../props/props';
import { Order, OrderStatus } from '../../../types';
import { getMyOrdersAsSeller, updateOrderStatus } from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';
import { COLORS, STATUS_COLORS, FONTS } from '../../../theme';
import { styles } from './SellerOrdersScreen.styles';

const FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Shipped',   value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:   'confirmed',
  confirmed: 'preparing',
  preparing: 'shipped',
  shipped:   'delivered',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:   'Confirm Order',
  confirmed: 'Mark Preparing',
  preparing: 'Mark Shipped',
  shipped:   'Mark Delivered',
};

export default function SellerOrdersScreen({ navigation }: SellerOrdersScreenProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setOrders(await getMyOrdersAsSeller(user.id));
  }, [user?.id]);

  useFocusEffect(useCallback(() => { fetchOrders(); }, [fetchOrders]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true); await fetchOrders(); setRefreshing(false);
  }, [fetchOrders]);

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus) => {
    const label = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    Alert.alert(
      'Update Order Status',
      `Change order #${order.id.slice(0, 8).toUpperCase()} to "${label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateOrderStatus(order.id, newStatus, order.buyerId);
              await fetchOrders();
            } catch (e: any) { Alert.alert('Error', e.message); }
          },
        },
      ]
    );
  };

  const handleCancel = (order: Order) => {
    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel order #${order.id.slice(0, 8).toUpperCase()}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateOrderStatus(order.id, 'cancelled', order.buyerId);
              await fetchOrders();
            } catch (e: any) { Alert.alert('Error', e.message); }
          },
        },
      ]
    );
  };

  const filtered = activeFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const renderOrder = ({ item }: { item: Order }) => {
    const color = STATUS_COLORS[item.status] ?? { bg: '#F3F4F6', text: '#6B7280' };
    const nextStatus = NEXT_STATUS[item.status];
    const nextLabel = NEXT_LABEL[item.status];
    const showActions = nextStatus || item.status === 'pending';

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>#{item.id.slice(0, 8).toUpperCase()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: color.bg }]}>
            <Text style={[styles.statusText, { color: color.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <Text style={styles.amount}>₱{item.totalAmount.toLocaleString()}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {new Date(item.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{item.shippingAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Items</Text>
            <Text style={styles.infoValue}>
              {item.items.length} item{item.items.length !== 1 ? 's' : ''} · Cash on Delivery
            </Text>
          </View>
        </View>

        {/* Actions */}
        {showActions && (
          <>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
              {nextStatus && nextLabel && (
                <Pressable
                  style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && styles.actionBtnPressed]}
                  onPress={() => handleUpdateStatus(item, nextStatus)}
                >
                  <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>{nextLabel}</Text>
                </Pressable>
              )}
              {item.status === 'pending' && (
                <Pressable
                  style={({ pressed }) => [styles.actionBtn, styles.actionBtnDanger, pressed && styles.actionBtnPressed]}
                  onPress={() => handleCancel(item)}
                >
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Cancel</Text>
                </Pressable>
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.orderCount}>{filtered.length} order{filtered.length !== 1 ? 's' : ''}</Text>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {FILTERS.map((f) => (
                <Pressable
                  key={f.value}
                  style={[styles.filterTab, activeFilter === f.value && styles.filterTabActive]}
                  onPress={() => setActiveFilter(f.value)}
                >
                  <Text style={[styles.filterTabText, activeFilter === f.value && styles.filterTabTextActive]}>
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={styles.flatList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.secondary]} tintColor={COLORS.secondary} />
        }
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>◻</Text>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'all' ? 'No orders yet' : `No ${activeFilter} orders`}
            </Text>
          </View>
        }
      />
    </View>
  );
}
