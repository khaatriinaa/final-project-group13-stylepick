// src/screens/seller/Orders/SellerOrdersScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable,
  RefreshControl, ScrollView, Alert, Image,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerOrdersScreenProps, SellerStackParamList } from '../../../props/props';
import { Order, OrderStatus } from '../../../types';
import { getMyOrdersAsSeller, updateOrderStatus } from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';
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
  pending:   'Confirm',
  confirmed: 'Preparing',
  preparing: 'Shipped',
  shipped:   'Delivered',
};

const STATUS_STYLE: Record<string, { bg: string; dot: string; text: string }> = {
  pending:   { bg: '#FFF7ED', dot: '#F97316', text: '#C2410C' },
  confirmed: { bg: '#EFF6FF', dot: '#3B82F6', text: '#1D4ED8' },
  preparing: { bg: '#F5F3FF', dot: '#8B5CF6', text: '#6D28D9' },
  shipped:   { bg: '#ECFEFF', dot: '#06B6D4', text: '#0E7490' },
  delivered: { bg: '#F0FDF4', dot: '#22C55E', text: '#15803D' },
  cancelled: { bg: '#FFF1F2', dot: '#F43F5E', text: '#BE123C' },
};

// ── Unified resolvers (mirrors dashboard logic) ────────────────────────────
const resolveItemImage = (item: Order['items'][number]): string | undefined =>
  item.image ?? item.product?.images?.[0] ?? undefined;

const resolveItemName = (item: Order['items'][number]): string =>
  item.productName ?? item.product?.name ?? item.name ?? 'Item';

export default function SellerOrdersScreen({ navigation }: SellerOrdersScreenProps) {
  const { user } = useAuth();
  const stackNav = useNavigation<NativeStackNavigationProp<SellerStackParamList>>();

  const [orders, setOrders]             = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [refreshing, setRefreshing]     = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setOrders(await getMyOrdersAsSeller(user.id));
  }, [user?.id]);

  useFocusEffect(useCallback(() => { fetchOrders(); }, [fetchOrders]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
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
      `Cancel order #${order.id.slice(0, 8).toUpperCase()}?`,
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
    const s          = STATUS_STYLE[item.status] ?? { bg: '#F3F4F6', dot: '#9CA3AF', text: '#6B7280' };
    const nextStatus = NEXT_STATUS[item.status];
    const nextLabel  = NEXT_LABEL[item.status];

    const previewItems = item.items.slice(0, 3);
    const extraCount   = item.items.length - previewItems.length;

    // Use unified name resolver for every item
    const itemNames = item.items
      .slice(0, 2)
      .map((i) => resolveItemName(i))
      .join(', ');
    const moreNames = item.items.length > 2 ? ` +${item.items.length - 2} more` : '';

    return (
      <Pressable
        style={({ pressed }) => [styles.orderCard, pressed && { opacity: 0.97 }]}
        onPress={() => stackNav.navigate('SellerOrderDetail', { orderId: item.id })}
      >
        {/* ── Header: order ID + status ── */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>#{item.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString('en-PH', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: s.dot }]} />
            <Text style={[styles.statusText, { color: s.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* ── Item preview strip: thumbnails + names ── */}
        <View style={styles.itemsStrip}>
          {previewItems.map((orderItem, idx) => {
            const imageUri = resolveItemImage(orderItem);
            return (
              <View key={idx} style={styles.itemThumb}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.itemThumbImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.itemThumbPlaceholder}>
                    <Text style={styles.itemThumbPlaceholderText}>📦</Text>
                  </View>
                )}
              </View>
            );
          })}
          {extraCount > 0 && (
            <View style={styles.moreItemsBadge}>
              <Text style={styles.moreItemsText}>+{extraCount}</Text>
            </View>
          )}
          <View style={styles.itemsInfo}>
            <Text style={styles.itemsNames} numberOfLines={2}>
              {itemNames}{moreNames}
            </Text>
            <Text style={styles.itemsSubtext}>
              {item.items.length} item{item.items.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* ── Footer: amount + action buttons ── */}
        <View style={styles.cardFooter}>
          <View style={styles.amountWrap}>
            <Text style={styles.amount}>₱{item.totalAmount.toLocaleString()}</Text>
            <Text style={styles.codLabel}>Cash on Delivery</Text>
          </View>

          {item.status === 'pending' && (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.actionBtnDanger, pressed && styles.actionBtnPressed]}
              onPress={(e) => { e.stopPropagation(); handleCancel(item); }}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Cancel</Text>
            </Pressable>
          )}

          {nextStatus && nextLabel && (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && styles.actionBtnPressed]}
              onPress={(e) => { e.stopPropagation(); handleUpdateStatus(item, nextStatus); }}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>{nextLabel}</Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [styles.viewBtn, pressed && styles.actionBtnPressed]}
            onPress={() => stackNav.navigate('SellerOrderDetail', { orderId: item.id })}
          >
            <Text style={styles.viewBtnText}>›</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.orderCount}>
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
          </Text>
        </View>

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
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#F97316']} tintColor="#F97316" />
        }
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'all' ? 'You have no orders yet' : `No ${activeFilter} orders`}
            </Text>
          </View>
        }
      />
    </View>
  );
}