// src/screens/buyer/Orders/BuyerOrderDetailScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import { BuyerOrderDetailScreenProps } from '../../../props/props';
import { OrderStatus } from '../../../types';
import { cancelOrder } from '../../../services/orderService';
import { styles } from './BuyerOrderDetailScreen.styles';

// Mirrors STATUS_BADGE_STYLE from BuyerOrdersScreen
const STATUS_BADGE_STYLE: Record<OrderStatus, { bg: string; text: string }> = {
  pending:   { bg: '#FFFBEB', text: '#92400E' },
  confirmed: { bg: '#EEF2FF', text: '#3730A3' },
  preparing: { bg: '#EEF2FF', text: '#3730A3' },
  shipped:   { bg: '#ECFDF5', text: '#065F46' },
  delivered: { bg: '#DCFCE7', text: '#14532D' },
  cancelled: { bg: '#F3F4F6', text: '#6B7280' },
  refunded:  { bg: '#F3F4F6', text: '#6B7280' },
};

// Mirrors STATUS_LABEL from BuyerOrdersScreen
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

export default function BuyerOrderDetailScreen({ navigation, route }: BuyerOrderDetailScreenProps) {
  const { order } = route.params;
  const badge = STATUS_BADGE_STYLE[order.status];
  const [cancelling, setCancelling] = useState(false);

  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';
  const currentStep = STATUS_STEPS.indexOf(order.status as OrderStatus);

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
              Alert.alert('Cancelled', 'Your order has been cancelled.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (e: any) {
              Alert.alert('Error', e.message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* ── Header (mirrors BuyerOrdersScreen header style) ── */}
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

        {/* ── Order ID + Status (mirrors cardHeader) ── */}
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={styles.orderIdRow}>
              <Text style={styles.orderId}>
                Order #{order.id.slice(0, 12).toUpperCase()}
              </Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>
                  {STATUS_LABEL[order.status]}
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

        {/* ── Progress Tracker (only for active orders) ── */}
        {!isCancelled && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order Progress</Text>
            </View>
            <View style={styles.sectionBody}>
              <View style={styles.progressRow}>
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = currentStep >= index;
                  const isActive = currentStep === index;
                  return (
                    <React.Fragment key={step}>
                      <View style={styles.progressStepWrap}>
                        <View style={[
                          styles.progressDot,
                          isCompleted && styles.progressDotCompleted,
                          isActive && styles.progressDotActive,
                        ]}>
                          {isCompleted && !isActive && (
                            <Text style={styles.progressCheck}>✓</Text>
                          )}
                          {isActive && (
                            <View style={styles.progressActiveDot} />
                          )}
                        </View>
                        <Text style={[
                          styles.progressLabel,
                          isCompleted && styles.progressLabelCompleted,
                          isActive && styles.progressLabelActive,
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

        {/* ── Items Ordered (mirrors cardBody) ── */}
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
                {ci.product.images?.[0] ? (
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
                  {ci.product.name}
                </Text>

                {/* ── Variant chip ── */}
                {(ci.selectedColor || ci.selectedSize) && (
                  <View style={styles.variantChip}>
                    <View style={styles.variantDot} />
                    <Text style={styles.variantText}>
                      {[ci.selectedColor, ci.selectedSize].filter(Boolean).join(' / ')}
                    </Text>
                  </View>
                )}

                <Text style={styles.itemUnit}>
                  ₱{ci.product.price.toLocaleString()} × {ci.quantity}
                </Text>
              </View>
              <Text style={styles.itemSubtotal}>
                ₱{(ci.product.price * ci.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
          </View>
        </View>

        {/* ── Order Summary (mirrors cardFooter) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ₱{order.totalAmount.toLocaleString()}
              </Text>
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
                {order.paymentStatus.toUpperCase()}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>
                ₱{order.totalAmount.toLocaleString()}
              </Text>
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

        {/* ── Cancel Button (pending only) ── */}
        {order.status === 'pending' && (
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