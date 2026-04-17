// src/screens/buyer/Orders/BuyerOrdersScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BuyerOrdersScreenProps } from '../../../props/props';
import { Order, OrderStatus } from '../../../types';
import { getMyOrdersAsBuyer } from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './BuyerOrdersScreen.styles';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending:   { bg: '#FEF3C7', text: '#D97706' },
  confirmed: { bg: '#DBEAFE', text: '#2563EB' },
  preparing: { bg: '#EDE9FE', text: '#7C3AED' },
  shipped:   { bg: '#D1FAE5', text: '#059669' },
  delivered: { bg: '#DCFCE7', text: '#047857' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  refunded:  { bg: '#F3F4F6', text: '#6B7280' },
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
    const color = STATUS_COLORS[item.status];
    const itemCount = item.items.reduce((sum, ci) => sum + ci.quantity, 0);
    const firstItem = item.items[0];

    return (
      <Pressable
        style={({ pressed }) => [styles.orderCard, pressed && styles.orderCardPressed]}
        onPress={() => navigation.navigate('BuyerOrderDetail', { order: item })}
      >
        {/* Card header */}
        <View style={styles.orderCardHeader}>
          <Text style={styles.orderSeller}>Order #{item.id.slice(0, 8).toUpperCase()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: color.bg }]}>
            <Text style={[styles.statusText, { color: color.text }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Summary row */}
        <View style={styles.orderSummaryRow}>
          <Text style={styles.orderSummaryText} numberOfLines={1}>
            {firstItem
              ? `${firstItem.product.name}${item.items.length > 1 ? ` +${item.items.length - 1} more` : ''}`
              : 'No items'}
          </Text>
          <Text style={styles.orderSummaryQty}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
        </View>

        {/* Footer */}
        <View style={styles.orderCardFooter}>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('en-PH', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </Text>
          <Text style={styles.orderTotal}>₱{item.totalAmount.toLocaleString()}</Text>
        </View>

        {/* Tap hint */}
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to view details →</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.value}
                style={[styles.filterTab, activeTab === tab.value && styles.filterTabActive]}
                onPress={() => setActiveTab(tab.value)}
              >
                <Text style={[styles.filterTabText, activeTab === tab.value && styles.filterTabTextActive]}>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#E63946']}
            tintColor="#E63946"
          />
        }
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Your placed orders will appear here</Text>
          </View>
        }
      />
    </View>
  );
}