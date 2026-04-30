// src/screens/seller/Orders/SellerOrderDetailScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable,
  Image, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerStackParamList } from '../../../props/props';
import { Order, OrderStatus } from '../../../types';
import { getOrderById, updateOrderStatus } from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';
import { detailStyles as styles } from './SellerOrderDetailScreen.styles';

// ── Unified resolvers ──────────────────────────────────────────────────────
const resolveItemImage = (item: Order['items'][number]): string | undefined =>
  item.image ?? item.product?.images?.[0] ?? undefined;

const resolveItemName = (item: Order['items'][number]): string =>
  item.productName ?? item.product?.name ?? item.name ?? 'Item';

const resolveItemPrice = (item: Order['items'][number]): number =>
  item.price ?? item.product?.price ?? 0;

const resolveItemQty = (item: Order['items'][number]): number =>
  item.quantity ?? 1;

// ── Status timeline definition ─────────────────────────────────────────────
const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'];

const STATUS_META: Record<string, { label: string; sub: string }> = {
  pending:   { label: 'Pending',   sub: 'Waiting for seller confirmation' },
  confirmed: { label: 'Confirmed', sub: 'Order accepted by seller'        },
  preparing: { label: 'Preparing', sub: 'Seller is packing the order'     },
  shipped:   { label: 'Shipped',   sub: 'Package is on the way'           },
  delivered: { label: 'Delivered', sub: 'Order received by buyer'         },
  cancelled: { label: 'Cancelled', sub: 'This order was cancelled'        },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:   'confirmed',
  confirmed: 'preparing',
  preparing: 'shipped',
  shipped:   'delivered',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:   'Confirm Order',
  confirmed: 'Mark as Preparing',
  preparing: 'Mark as Shipped',
  shipped:   'Mark as Delivered',
};

const STATUS_BADGE_STYLE: Record<string, { bg: string; text: string }> = {
  pending:   { bg: '#FFFBEB', text: '#92400E' },
  confirmed: { bg: '#EEF2FF', text: '#3730A3' },
  preparing: { bg: '#EEF2FF', text: '#3730A3' },
  shipped:   { bg: '#ECFDF5', text: '#065F46' },
  delivered: { bg: '#DCFCE7', text: '#14532D' },
  cancelled: { bg: '#FEF2F2', text: '#991B1B' },
};

type RouteT = RouteProp<SellerStackParamList, 'SellerOrderDetail'>;

export default function SellerOrderDetailScreen() {
  const navigation  = useNavigation<NativeStackNavigationProp<SellerStackParamList>>();
  const route       = useRoute<RouteT>();
  const { orderId } = route.params;
  const { user }    = useAuth();

  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useFocusEffect(useCallback(() => { fetchOrder(); }, [fetchOrder]));

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!order) return;
    const label = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    Alert.alert(
      'Update Order Status',
      `Change this order to "${label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateOrderStatus(order.id, newStatus, order.buyerId);
              await fetchOrder();
            } catch (e: any) { Alert.alert('Error', e.message); }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (!order) return;
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateOrderStatus(order.id, 'cancelled', order.buyerId);
              await fetchOrder();
            } catch (e: any) { Alert.alert('Error', e.message); }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#9CA3AF' }}>Order not found.</Text>
      </View>
    );
  }

  const badge       = STATUS_BADGE_STYLE[order.status] ?? { bg: '#F3F4F6', text: '#6B7280' };
  const nextStatus  = NEXT_STATUS[order.status];
  const nextLabel   = NEXT_LABEL[order.status];
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const isFinal     = isCancelled || isDelivered;

  const timelineSteps = isCancelled
    ? [...STATUS_FLOW.slice(0, STATUS_FLOW.indexOf('pending') + 1), 'cancelled' as OrderStatus]
    : STATUS_FLOW;

  const currentIdx = isCancelled
    ? timelineSteps.length - 1
    : STATUS_FLOW.indexOf(order.status);

  const subtotal = order.items.reduce((sum, i) => sum + resolveItemPrice(i) * resolveItemQty(i), 0);
  const shipping  = order.shippingFee ?? 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── Hero header ── */}
        <View style={styles.hero}>
          <Pressable style={styles.heroBack} onPress={() => navigation.goBack()}>
            <Text style={styles.heroBackText}>‹ Orders</Text>
          </Pressable>

          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroOrderId}>
                Order #{order.id.slice(0, 12).toUpperCase()}
              </Text>
              <Text style={styles.heroDate}>
                {new Date(order.createdAt).toLocaleDateString('en-PH', {
                  weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.heroAmountWrap}>
              <Text style={styles.heroAmount}>₱{order.totalAmount.toLocaleString()}</Text>
              <Text style={styles.heroAmountLabel}>Total Amount</Text>
            </View>
          </View>

          <View style={styles.heroBadgeWrap}>
            <View style={[styles.heroBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.heroBadgeText, { color: badge.text }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Status Timeline ── */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Order Progress</Text>
          {timelineSteps.map((step, idx) => {
            const isDone   = idx < currentIdx;
            const isActive = idx === currentIdx;
            const isLast   = idx === timelineSteps.length - 1;
            const meta     = STATUS_META[step];
            const isCxStep = step === 'cancelled';

            return (
              <View key={step}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    {isCxStep ? (
                      <View style={styles.timelineNodeCancelled}>
                        <Text style={styles.timelineNodeText}>✕</Text>
                      </View>
                    ) : isDone ? (
                      <View style={styles.timelineNodeDone}>
                        <Text style={styles.timelineNodeText}>✓</Text>
                      </View>
                    ) : isActive ? (
                      <View style={styles.timelineNodeActive}>
                        <View style={styles.timelineNodeActiveDot} />
                      </View>
                    ) : (
                      <View style={styles.timelineNodePending} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.timelineLabel,
                      isDone   && styles.timelineLabelDone,
                      isActive && styles.timelineLabelActive,
                    ]}>
                      {meta.label}
                    </Text>
                    <Text style={[styles.timelineSub, isDone && styles.timelineSubDone]}>
                      {meta.sub}
                    </Text>
                  </View>
                </View>

                {!isLast && (
                  <View style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                      <View style={[
                        styles.timelineConnector,
                        isDone && styles.timelineConnectorDone,
                      ]} />
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── Items ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
            <Text style={styles.sectionCount}>
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </Text>
          </View>
          {order.items.map((item, idx) => {
            const imageUri = resolveItemImage(item);
            const itemName = resolveItemName(item);
            const price    = resolveItemPrice(item);
            const qty      = resolveItemQty(item);
            return (
              <View key={idx} style={[
                styles.itemRow,
                idx === order.items.length - 1 && { borderBottomWidth: 0 },
              ]}>
                <View style={styles.itemImage}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.itemImageActual} resizeMode="cover" />
                  ) : (
                    <View style={styles.itemImagePlaceholder}>
                      <Text style={styles.itemImagePlaceholderText}>📦</Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>{itemName}</Text>
                  <Text style={styles.itemMeta}>
                    Qty: {qty}
                    {item.color ? `  ·  ${item.color}` : ''}
                    {item.size  ? `  ·  ${item.size}`  : ''}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  ₱{(price * qty).toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Delivery Info ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Info</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Shipping Address</Text>
              <Text style={styles.infoValue}>{order.shippingAddress}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💳</Text>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>Cash on Delivery</Text>
            </View>
          </View>
          {order.buyerName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👤</Text>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Buyer</Text>
                <Text style={styles.infoValue}>{order.buyerName}</Text>
              </View>
            </View>
          )}
          {order.buyerPhone && (
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoIcon}>📞</Text>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Contact</Text>
                <Text style={styles.infoValue}>{order.buyerPhone}</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Order Summary ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₱{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee</Text>
            <Text style={styles.summaryValue}>
              {shipping > 0 ? `₱${shipping.toLocaleString()}` : 'Free'}
            </Text>
          </View>
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>₱{order.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Sticky action footer ── */}
      {!isFinal && (
        <View style={styles.footer}>
          {order.status === 'pending' && (
            <Pressable
              style={({ pressed }) => [styles.footerBtnSecondary, pressed && styles.footerBtnPressed]}
              onPress={handleCancel}
            >
              <Text style={styles.footerBtnSecondaryText}>Cancel</Text>
            </Pressable>
          )}
          {nextStatus && nextLabel && (
            <Pressable
              style={({ pressed }) => [styles.footerBtnPrimary, pressed && styles.footerBtnPressed]}
              onPress={() => handleUpdateStatus(nextStatus)}
            >
              <Text style={styles.footerBtnPrimaryText}>{nextLabel}</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}