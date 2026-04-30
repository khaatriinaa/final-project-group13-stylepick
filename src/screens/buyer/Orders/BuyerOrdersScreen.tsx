// src/screens/buyer/Orders/BuyerOrdersScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl,
  ScrollView, Image, TouchableWithoutFeedback,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BuyerOrdersScreenProps } from '../../../props/props';
import { Order, OrderStatus } from '../../../types';
import { getMyOrdersAsBuyer } from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './BuyerOrdersScreen.styles';

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
  confirmed: 'Processing',
  preparing: 'Processing',
  shipped:   'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded:  'Refunded',
};

const TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All',        value: 'all' },
  { label: 'Pending',    value: 'pending' },
  { label: 'Processing', value: 'confirmed' },
  { label: 'Shipped',    value: 'shipped' },
  { label: 'Delivered',  value: 'delivered' },
  { label: 'Cancelled',  value: 'cancelled' },
];

export default function BuyerOrdersScreen({ navigation }: BuyerOrdersScreenProps) {
  const { user } = useAuth();
  const [orders, setOrders]         = useState<Order[]>([]);
  const [activeTab, setActiveTab]   = useState<OrderStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getMyOrdersAsBuyer(user.id);
      setOrders(data);
    } catch (e) {
      console.warn('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Re-fetches every time screen gains focus — picks up cancellations
  // made in BuyerOrderDetailScreen automatically
  useFocusEffect(useCallback(() => {
    setLoading(true);
    fetchOrders();
  }, [fetchOrders]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const filtered = activeTab === 'all'
    ? orders
    : activeTab === 'confirmed'
      ? orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing')
      : orders.filter((o) => o.status === activeTab);

  // ── Tab count badges ────────────────────────────────────────────────────────
  const getTabCount = (value: OrderStatus | 'all'): number => {
    if (value === 'all') return orders.length;
    if (value === 'confirmed') return orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing').length;
    return orders.filter((o) => o.status === value).length;
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const badge       = STATUS_BADGE_STYLE[item.status];
    const itemCount   = item.items.reduce((sum, ci) => sum + ci.quantity, 0);
    const firstItem   = item.items[0];

    // Guard against Supabase jsonb items that may be denormalized snapshots
    const productImage =
      firstItem?.product?.images?.[0] ??
      (firstItem?.image ? firstItem.image : null);

    const productDisplayName =
      firstItem?.product?.name ??
      firstItem?.productName ??
      firstItem?.name ??
      'No items';

    const productName = firstItem
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
        onPress={() => navigation.navigate('BuyerOrderDetail', { order: item })}
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

            {/* Variant chip — guard both field naming conventions */}
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
        </View>

        {/* ── Card Footer ── */}
        <View style={styles.cardFooter}>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('en-PH', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </Text>
          <View style={styles.footerRight}>
            <Text style={[styles.orderTotal, isCancelled && { color: '#9CA3AF' }]}>
              ₱{item.totalAmount.toLocaleString()}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.detailsBtn,
                pressed && styles.detailsBtnPressed,
                isCancelled && styles.detailsBtnCancelled,
              ]}
              onPress={() => navigation.navigate('BuyerOrderDetail', { order: item })}
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
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerIcons}>
            <TouchableWithoutFeedback
              onPress={() => (navigation as any).navigate('BuyerNotifications')}
            >
              <View style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={20} color="#374151" />
                <View style={styles.notifDot} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* ── Tabs ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsRow}>
            {TABS.map((tab) => {
              const count = getTabCount(tab.value);
              return (
                <Pressable
                  key={tab.value}
                  style={[styles.tab, activeTab === tab.value && styles.tabActive]}
                  onPress={() => setActiveTab(tab.value)}
                >
                  <View style={styles.tabInner}>
                    <Text style={[
                      styles.tabText,
                      activeTab === tab.value && styles.tabTextActive,
                    ]}>
                      {tab.label}
                    </Text>
                    {count > 0 && (
                      <View style={[
                        styles.tabBadge,
                        activeTab === tab.value && styles.tabBadgeActive,
                      ]}>
                        <Text style={[
                          styles.tabBadgeText,
                          activeTab === tab.value && styles.tabBadgeTextActive,
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
                {activeTab === 'cancelled' ? '🚫' : '📦'}
              </Text>
            </View>
            <Text style={styles.emptyTitle}>
              {loading
                ? 'Loading orders…'
                : activeTab === 'all'
                  ? 'No orders yet'
                  : `No ${activeTab === 'confirmed' ? 'processing' : activeTab} orders`}
            </Text>
            <Text style={styles.emptyText}>
              {loading
                ? ''
                : activeTab === 'all'
                  ? 'Your placed orders will appear here'
                  : 'Orders in this status will appear here'}
            </Text>
          </View>
        }
      />
    </View>
  );
}