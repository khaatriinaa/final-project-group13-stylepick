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
  cancelled: { bg: '#F3F4F6', text: '#6B7280' },
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
];

export default function BuyerOrdersScreen({ navigation }: BuyerOrdersScreenProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    const data = await getMyOrdersAsBuyer(user.id);
    setOrders(data);
  }, [user?.id]);

  useFocusEffect(useCallback(() => { fetchOrders(); }, [fetchOrders]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const filtered = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);

  const renderOrder = ({ item }: { item: Order }) => {
    const badge = STATUS_BADGE_STYLE[item.status];
    const itemCount = item.items.reduce((sum, ci) => sum + ci.quantity, 0);
    const firstItem = item.items[0];
    const productImage = firstItem?.product?.images?.[0] ?? null;
    const productName = firstItem
      ? `${firstItem.product.name}${item.items.length > 1 ? ` +${item.items.length - 1} more` : ''}`
      : 'No items';

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => navigation.navigate('BuyerOrderDetail', { order: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order #{item.id.slice(0, 12).toUpperCase()}</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>
              {STATUS_LABEL[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.productImg}>
            {productImage ? (
              <Image source={{ uri: productImage }} style={styles.productImgImage} resizeMode="cover" />
            ) : (
              <Text style={styles.productImgPlaceholder}>📦</Text>
            )}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>{productName}</Text>

            {/* ── Variant of first item ── */}
            {(firstItem?.selectedColor || firstItem?.selectedSize) && (
              <View style={styles.variantChip}>
                <View style={styles.variantDot} />
                <Text style={styles.variantText}>
                  {[firstItem.selectedColor, firstItem.selectedSize].filter(Boolean).join(' / ')}
                </Text>
              </View>
            )}

            <Text style={styles.productMeta}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('en-PH', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </Text>
          <View style={styles.footerRight}>
            <Text style={styles.orderTotal}>₱{item.totalAmount.toLocaleString()}</Text>
            <Pressable
              style={({ pressed }) => [styles.detailsBtn, pressed && styles.detailsBtnPressed]}
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerIcons}>
            {/* Formal Notification Icon (Using Unicode bell for maximum compatibility) */}
            <TouchableWithoutFeedback onPress={() => (navigation as any).navigate('BuyerNotifications')}>
              <View style={styles.iconBtn}>
                {/* Swapped emoji for a formal vector icon */}
                <Ionicons name="notifications-outline" size={20} color="#374151" />
                
                <View style={styles.notifDot} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsRow}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.value}
                style={[styles.tab, activeTab === tab.value && styles.tabActive]}
                onPress={() => setActiveTab(tab.value)}
              >
                <Text style={[styles.tabText, activeTab === tab.value && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#111827" />
        }
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>📦</Text>
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Your placed orders will appear here</Text>
          </View>
        }
      />
    </View>
  );
}