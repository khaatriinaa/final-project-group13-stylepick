// src/screens/buyer/Orders/BuyerOrderDetailScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import { BuyerOrderDetailScreenProps } from '../../../props/props';
import { OrderStatus } from '../../../types';
import { cancelOrder } from '../../../services/orderService';
import { styles } from './BuyerOrderDetailScreen.styles';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending:   { bg: '#FEF3C7', text: '#D97706' },
  confirmed: { bg: '#DBEAFE', text: '#2563EB' },
  preparing: { bg: '#EDE9FE', text: '#7C3AED' },
  shipped:   { bg: '#D1FAE5', text: '#059669' },
  delivered: { bg: '#DCFCE7', text: '#047857' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  refunded:  { bg: '#F3F4F6', text: '#6B7280' },
};

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'];

const STATUS_LABEL: Record<OrderStatus, string> = {
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
  const color = STATUS_COLORS[order.status];
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Order ID + Status */}
        <View style={styles.section}>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: color.bg }]}>
              <Text style={[styles.statusText, { color: color.text }]}>
                {order.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.orderDate}>
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-PH', {
              weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
            })}
          </Text>
        </View>

        {/* Progress tracker (only for active orders) */}
        {!isCancelled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Progress</Text>
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
                      </View>
                      <Text style={[
                        styles.progressLabel,
                        isActive && styles.progressLabelActive,
                        isCompleted && styles.progressLabelCompleted,
                      ]}>
                        {STATUS_LABEL[step]}
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
        )}

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {order.items.map((ci, i) => (
            <View key={i} style={[styles.itemRow, i < order.items.length - 1 && styles.itemRowBorder]}>
              {/* Product image from seller */}
              <View style={styles.itemImageWrap}>
                {ci.product.images?.[0] ? (
                  <Image
                    source={{ uri: ci.product.images[0] }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.itemImagePlaceholder}>
                    <Text style={styles.itemImageIcon}>🏷</Text>
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{ci.product.name}</Text>
                <Text style={styles.itemUnit}>₱{ci.product.price.toLocaleString()} × {ci.quantity}</Text>
              </View>

              {/* Subtotal */}
              <Text style={styles.itemSubtotal}>
                ₱{(ci.product.price * ci.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₱{order.totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={[styles.summaryValue, { color: '#059669' }]}>Free</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Status</Text>
            <Text style={styles.summaryValue}>{order.paymentStatus.toUpperCase()}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>₱{order.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.addressText}>{order.shippingAddress}</Text>
        </View>

        {/* Cancel button (pending only) */}
        {order.status === 'pending' && (
          <Pressable
            style={[styles.cancelBtn, cancelling && styles.cancelBtnDisabled]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            {cancelling
              ? <ActivityIndicator color="#EF4444" />
              : <Text style={styles.cancelBtnText}>Cancel Order</Text>
            }
          </Pressable>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}