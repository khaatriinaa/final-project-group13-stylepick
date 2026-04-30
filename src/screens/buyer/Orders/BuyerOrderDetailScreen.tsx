// src/screens/buyer/Orders/BuyerOrderDetailScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Image, Pressable, Alert,
  ActivityIndicator,
} from 'react-native';
import { BuyerOrderDetailScreenProps } from '../../../props/props';
import { Order, OrderStatus } from '../../../types';
import { cancelOrder, getOrderById } from '../../../services/orderService';
import { styles } from './BuyerOrderDetailScreen.styles';

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

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'];

const STEP_LABEL: Record<OrderStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  shipped:   'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded:  'Refunded',
};

const CANCELLABLE_STATUSES: OrderStatus[] = ['pending'];

export default function BuyerOrderDetailScreen({ navigation, route }: BuyerOrderDetailScreenProps) {
  const { order: paramOrder } = route.params;

  const [order, setOrder]                 = useState<Order>(paramOrder);
  const [cancelling, setCancelling]       = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Prevents the background fetch from overwriting a user-initiated cancel
  const userCancelledRef = useRef(false);

  // ── Fetch live order from Supabase on mount ─────────────────────────────
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const fresh = await getOrderById(paramOrder.id);
        console.log('[DetailScreen] Fresh order status from Supabase:', fresh?.status);
        if (isMounted && fresh && !userCancelledRef.current) {
          setOrder(fresh);
        }
      } catch (e) {
        console.warn('Could not refresh order:', e);
      } finally {
        if (isMounted) setLoadingStatus(false);
      }
    })();
    return () => { isMounted = false; };
  }, [paramOrder.id]);

  const currentStatus = order.status;
  const badge         = STATUS_BADGE_STYLE[currentStatus];
  const isCancelled   = currentStatus === 'cancelled' || currentStatus === 'refunded';
  // Only allow cancelling after live status is confirmed loaded
  const isCancellable = !loadingStatus && CANCELLABLE_STATUSES.includes(currentStatus);
  const currentStep   = STATUS_STEPS.indexOf(currentStatus);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel order #${order.id.slice(0, 8).toUpperCase()}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelOrder(order.id, order.sellerId);

              // Lock before setOrder so no stale fetch can overwrite
              userCancelledRef.current = true;

              setOrder((prev) => ({
                ...prev,
                status:        'cancelled' as OrderStatus,
                paymentStatus: 'cancelled' as any,
                updatedAt:     new Date().toISOString(),
              }));

              Alert.alert(
                'Order Cancelled',
                'Your order has been successfully cancelled.',
                [{ text: 'OK', onPress: () => navigation.goBack() }],
              );
            } catch (e: any) {
              console.log('[handleCancel] Error:', e.message);
              Alert.alert('Error', e.message ?? 'Something went wrong. Please try again.');
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Order ID + Status ── */}
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={styles.orderIdRow}>
              <Text style={styles.orderId}>
                Order #{order.id.slice(0, 12).toUpperCase()}
              </Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>
                  {loadingStatus ? '…' : STATUS_LABEL[currentStatus]}
                </Text>
              </View>
            </View>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString('en-PH', {
                weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* ── Loading skeleton ── */}
        {loadingStatus && (
          <View style={[styles.section, { padding: 20, alignItems: 'center' }]}>
            <ActivityIndicator size="small" color="#9CA3AF" />
          </View>
        )}

        {/* ── Cancelled Banner ── */}
        {!loadingStatus && isCancelled && (
          <View style={styles.cancelledBanner}>
            <Text style={styles.cancelledBannerIcon}>✕</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cancelledBannerTitle}>Order Cancelled</Text>
              <Text style={styles.cancelledBannerSub}>
                This order has been cancelled and will no longer be processed.
              </Text>
            </View>
          </View>
        )}

        {/* ── Progress Tracker (active orders only) ── */}
        {!loadingStatus && !isCancelled && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order Progress</Text>
            </View>
            <View style={styles.sectionBody}>
              <View style={styles.progressRow}>
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = currentStep >= index;
                  const isActive    = currentStep === index;
                  return (
                    <React.Fragment key={step}>
                      <View style={styles.progressStepWrap}>
                        <View style={[
                          styles.progressDot,
                          isCompleted && styles.progressDotCompleted,
                          isActive    && styles.progressDotActive,
                        ]}>
                          {isCompleted && !isActive && (
                            <Text style={styles.progressCheck}>✓</Text>
                          )}
                          {isActive && <View style={styles.progressActiveDot} />}
                        </View>
                        <Text style={[
                          styles.progressLabel,
                          isCompleted && styles.progressLabelCompleted,
                          isActive    && styles.progressLabelActive,
                        ]}>
                          {STEP_LABEL[step]}
                        </Text>
                      </View>
                      {index < STATUS_STEPS.length - 1 && (
                        <View style={[
                          styles.progressLine,
                          currentStep > index && styles.progressLineCompleted,
                        ]} />
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* ── Items Ordered ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
          </View>
          <View style={styles.sectionBody}>
            {order.items.map((ci, i) => (
              <View
                key={i}
                style={[
                  styles.itemRow,
                  i < order.items.length - 1 && styles.itemRowBorder,
                ]}
              >
                <View style={styles.itemImageWrap}>
                  {ci.product?.images?.[0] ? (
                    <Image
                      source={{ uri: ci.product.images[0] }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.itemImagePlaceholder}>🏷</Text>
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {ci.product?.name ?? ci.productName ?? ci.name ?? '—'}
                  </Text>
                  {(ci.selectedColor || ci.selectedSize || ci.color || ci.size) && (
                    <View style={styles.variantChip}>
                      <View style={styles.variantDot} />
                      <Text style={styles.variantText}>
                        {[
                          ci.selectedColor ?? ci.color,
                          ci.selectedSize  ?? ci.size,
                        ].filter(Boolean).join(' / ')}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.itemUnit}>
                    ₱{(ci.product?.price ?? ci.price ?? 0).toLocaleString()} × {ci.quantity}
                  </Text>
                </View>
                <Text style={styles.itemSubtotal}>
                  ₱{((ci.product?.price ?? ci.price ?? 0) * ci.quantity).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Order Summary ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₱{order.totalAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryFreeText}>Free</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method</Text>
              <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
            </View>
            <View style={[styles.summaryRow, { marginBottom: 0 }]}>
              <Text style={styles.summaryLabel}>Payment Status</Text>
              <Text style={styles.summaryValue}>
                {(isCancelled ? 'CANCELLED' : order.paymentStatus ?? '').toUpperCase()}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>₱{order.totalAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* ── Shipping Address ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.addressText}>{order.shippingAddress}</Text>
          </View>
        </View>

        {/* ── Cancel Button — only shown when live status is loaded and pending ── */}
        {isCancellable && (
          <Pressable
            style={[styles.cancelBtn, cancelling && styles.cancelBtnDisabled]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            {cancelling
              ? <ActivityIndicator color="#EF4444" size="small" />
              : <Text style={styles.cancelBtnText}>Cancel Order</Text>
            }
          </Pressable>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}