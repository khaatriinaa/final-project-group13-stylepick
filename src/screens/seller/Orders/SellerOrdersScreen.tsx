// src/screens/seller/Orders/SellerOrdersScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable,
  RefreshControl, ScrollView, Alert, Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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

const STATUS_BADGE_STYLE: Record<OrderStatus, { bg: string; text: string }> = {
  pending:   { bg: '#FFFBEB', text: '#92400E' },
  confirmed: { bg: '#EEF2FF', text: '#3730A3' },
  preparing: { bg: '#EEF2FF', text: '#3730A3' },
  shipped:   { bg: '#ECFDF5', text: '#065F46' },
  delivered: { bg: '#DCFCE7', text: '#14532D' },
  cancelled: { bg: '#FEF2F2', text: '#991B1B' },
  refunded:  { bg: '#F3F4F6', text: '#6B7280' },
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  shipped:   'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded:  'Refunded',
};

// ── Unified resolvers ─────────────────────────────────────────────────────────
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
  const [loading, setLoading]           = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    try {
      setOrders(await getMyOrdersAsSeller(user.id));
    } catch (e) {
      console.warn('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => {
    setLoading(true);
    fetchOrders();
  }, [fetchOrders]));

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

  // ── Filter + count badge helpers ──────────────────────────────────────────
  const isCancelledOrRefunded = (o: Order) =>
    o.status === 'cancelled' || o.status === 'refunded';

  const filtered =
    activeFilter === 'all'
      ? orders.filter((o) => !isCancelledOrRefunded(o))
      : orders.filter((o) => o.status === activeFilter);

  const getTabCount = (value: OrderStatus | 'all'): number => {
    if (value === 'all') return orders.filter((o) => !isCancelledOrRefunded(o)).length;
    return orders.filter((o) => o.status === value).length;
  };

  // ── Card renderer ─────────────────────────────────────────────────────────
  const renderOrder = ({ item }: { item: Order }) => {
    const badge      = STATUS_BADGE_STYLE[item.status] ?? { bg: '#F3F4F6', text: '#6B7280' };
    const nextStatus = NEXT_STATUS[item.status];
    const nextLabel  = NEXT_LABEL[item.status];

    const itemCount  = item.items.reduce((sum, ci) => sum + ci.quantity, 0);
    const firstItem  = item.items[0];

    const productImage       = firstItem ? resolveItemImage(firstItem) : undefined;
    const productDisplayName = firstItem ? resolveItemName(firstItem) : 'No items';
    const productName        = firstItem
      ? `${productDisplayName}${item.items.length > 1 ? ` +${item.items.length - 1} more` : ''}`
      : 'No items';

    const isCancelled = item.status === 'cancelled' || item.status === 'refunded';

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
          isCancelled && styles.cardCancelled,
        ]}
        onPress={() => stackNav.navigate('SellerOrderDetail', { orderId: item.id })}
      >
        {/* ── Card Header ── */}
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>
            Order #{item.id.slice(0, 12).toUpperCase()}
          </Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>
              {STATUS_LABEL[item.status]}
            </Text>
          </View>
        </View>

        {/* ── Card Body ── */}
        <View style={styles.cardBody}>
          <View style={styles.productImg}>
            {productImage ? (
              <Image
                source={{ uri: productImage }}
                style={[
                  styles.productImgImage,
                  isCancelled && { opacity: 0.45 },
                ]}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.productImgPlaceholder}>📦</Text>
            )}
          </View>

          <View style={styles.productInfo}>
            <Text
              style={[styles.productName, isCancelled && { color: '#9CA3AF' }]}
              numberOfLines={1}
            >
              {productName}
            </Text>

            {(firstItem?.selectedColor || firstItem?.selectedSize ||
              firstItem?.color        || firstItem?.size) && (
              <View style={styles.variantChip}>
                <View style={styles.variantDot} />
                <Text style={styles.variantText}>
                  {[
                    firstItem.selectedColor ?? firstItem.color,
                    firstItem.selectedSize  ?? firstItem.size,
                  ].filter(Boolean).join(' / ')}
                </Text>
              </View>
            )}

            <Text style={styles.productMeta}>
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </Text>
          </View>

          <Text style={[styles.orderTotal, isCancelled && { color: '#9CA3AF' }]}>
            ₱{item.totalAmount.toLocaleString()}
          </Text>
        </View>

        {/* ── Card Footer ── */}
        <View style={styles.cardFooter}>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('en-PH', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </Text>

          <View style={styles.footerRight}>
            {item.status === 'pending' && (
              <Pressable
                style={({ pressed }) => [
                  styles.actionBtnDanger,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={(e) => { e.stopPropagation(); handleCancel(item); }}
              >
                <Text style={styles.actionBtnDangerText}>Cancel</Text>
              </Pressable>
            )}

            {nextStatus && nextLabel && (
              <Pressable
                style={({ pressed }) => [
                  styles.actionBtnPrimary,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={(e) => { e.stopPropagation(); handleUpdateStatus(item, nextStatus); }}
              >
                <Text style={styles.actionBtnPrimaryText}>{nextLabel}</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.detailsBtn,
                pressed && styles.detailsBtnPressed,
                isCancelled && styles.detailsBtnCancelled,
              ]}
              onPress={() => stackNav.navigate('SellerOrderDetail', { orderId: item.id })}
            >
              <Text style={styles.detailsBtnText}>Details</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Orders</Text>
          <View style={styles.headerIcons}>
            <TouchableWithoutFeedback
              onPress={() => (navigation as any).navigate('SellerNotifications')}
            >
              <View style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={20} color="#374151" />
                <View style={styles.notifDot} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* ── Pill tabs ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsRow}>
            {FILTERS.map((tab) => {
              const count = getTabCount(tab.value);
              return (
                <Pressable
                  key={tab.value}
                  style={[styles.tab, activeFilter === tab.value && styles.tabActive]}
                  onPress={() => setActiveFilter(tab.value)}
                >
                  <View style={styles.tabInner}>
                    <Text style={[
                      styles.tabText,
                      activeFilter === tab.value && styles.tabTextActive,
                    ]}>
                      {tab.label}
                    </Text>
                    {count > 0 && (
                      <View style={[
                        styles.tabBadge,
                        activeFilter === tab.value && styles.tabBadgeActive,
                      ]}>
                        <Text style={[
                          styles.tabBadgeText,
                          activeFilter === tab.value && styles.tabBadgeTextActive,
                        ]}>
                          {count}
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* ── Orders list ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          filtered.length === 0 && { flexGrow: 1 },
        ]}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#111827"
          />
        }
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>
                {activeFilter === 'cancelled' ? '🚫' : '📋'}
              </Text>
            </View>
            <Text style={styles.emptyTitle}>
              {loading
                ? 'Loading orders…'
                : activeFilter === 'all'
                  ? 'No orders yet'
                  : `No ${activeFilter} orders`}
            </Text>
            <Text style={styles.emptyText}>
              {loading
                ? ''
                : activeFilter === 'all'
                  ? 'Orders from your customers will appear here'
                  : 'Orders in this status will appear here'}
            </Text>
          </View>
        }
      />
    </View>
  );
}