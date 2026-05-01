// src/screens/buyer/Checkout/CheckoutScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Image,
  Alert, ActivityIndicator, StatusBar,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { placeOrder } from '../../../services/orderService';
import { decrementStock, getProductById } from '../../../services/productService';
import { CheckoutScreenProps } from '../../../props/props';
import { styles } from './CheckoutScreen.styles';

export default function CheckoutScreen({ navigation, route }: CheckoutScreenProps) {
  const { user } = useAuth();
  const { updateQuantity } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const selectedItems = route.params?.selectedItems ?? [];

  const total = selectedItems.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );

  const validate = (): string | null => {
    if (!user?.name?.trim()) return 'Your profile is missing a name. Please update your profile.';
    if (!user?.phone?.trim()) return 'Your profile is missing a phone number. Please update your profile.';
    if (!user?.address?.trim()) return 'Your profile is missing a delivery address. Please update your profile.';
    if (selectedItems.length === 0) return 'No items selected for checkout.';
    return null;
  };

  const bySeller = selectedItems.reduce<Record<string, typeof selectedItems>>(
    (acc: Record<string, typeof selectedItems>, item: any) => {
      const sid = item.product.sellerId;
      if (!acc[sid]) acc[sid] = [];
      acc[sid].push(item);
      return acc;
    },
    {}
  );

  const removeCheckedOutItems = () => {
    selectedItems.forEach((item: any) => {
      updateQuantity(item.product.id, 0, item.selectedColor, item.selectedSize);
    });
  };

  const verifyStockAvailability = async (): Promise<string | null> => {
    for (const item of selectedItems) {
      try {
        const liveProduct = await getProductById(item.product.id);
        if (!liveProduct) {
          return `"${item.product.name}" is no longer available.`;
        }
        if (liveProduct.stock < item.quantity) {
          return `"${item.product.name}" only has ${liveProduct.stock} unit${liveProduct.stock === 1 ? '' : 's'} left, but you ordered ${item.quantity}.`;
        }
      } catch {
        return `Failed to verify stock for "${item.product.name}". Please try again.`;
      }
    }
    return null;
  };

  // ─── Single owner of stock decrement ─────────────────────────────────────
  // placeOrder() no longer calls decrementStock internally, so this is the
  // one and only place stock is reduced after a successful checkout.
  const updateAllStocks = async (): Promise<void> => {
    const results = await Promise.allSettled(
      selectedItems.map((item: any) =>
        decrementStock(item.product.id, item.quantity)
      )
    );

    const failed = results
      .map((r, i) => ({ r, item: selectedItems[i] }))
      .filter(({ r }) => r.status === 'rejected');

    if (failed.length > 0) {
      const names = failed.map(({ item }) => item.product.name).join(', ');
      console.error(`Stock decrement failed for: ${names}`);
    }
  };

  const handlePlaceOrder = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Cannot Place Order', validationError);
      return;
    }

    setSubmitting(true);

    try {
      // 1. Re-check live stock right before placing the order.
      const stockError = await verifyStockAvailability();
      if (stockError) {
        Alert.alert('Stock Unavailable', stockError);
        return;
      }

      // 2. Place orders grouped by seller.
      for (const [sellerId, items] of Object.entries(bySeller)) {
        await placeOrder({
          buyerId: user!.id,
          sellerId,
          items,
          shippingAddress: user!.address!,
          buyerName: user!.name,
          buyerPhone: user!.phone,
        });
      }

      // 3. Deduct stock ONCE here — placeOrder() no longer does this
      //    internally, so there is no double-decrement. Awaited before
      //    navigation so the local cache is warm when BuyerHomeScreen's
      //    useFocusEffect fires getProducts().
      await updateAllStocks();

      // 4. Remove items from cart.
      removeCheckedOutItems();

      // 5. Navigate to the Orders tab.
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'BuyerTabs',
            state: {
              routes: [
                { name: 'Home' },
                { name: 'Cart' },
                { name: 'Orders' },
                { name: 'Profile' },
              ],
              index: 2,
            },
          },
        ],
      });

      // Alert after navigation so it doesn't block the nav reset.
      setTimeout(() => {
        Alert.alert(
          'Order Placed Successfully!',
          'Thank you for your purchase.',
        );
      }, 300);

    } catch (err: any) {
      console.error('Checkout error:', err);
      Alert.alert(
        'Order Failed',
        err.message || 'Failed to place your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const missingFields: string[] = [];
  if (!user?.name?.trim()) missingFields.push('Name');
  if (!user?.phone?.trim()) missingFields.push('Phone Number');
  if (!user?.address?.trim()) missingFields.push('Delivery Address');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={16}
          style={styles.backBtn}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Checkout ({selectedItems.length})</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {missingFields.length > 0 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠ Incomplete Profile</Text>
            <Text style={styles.warningText}>
              Missing: {missingFields.join(', ')}. Please update your profile before checking out.
            </Text>
            <Pressable
              style={styles.warningBtn}
              onPress={() => navigation.navigate('EditProfile' as never)}
            >
              <Text style={styles.warningBtnText}>Update Profile</Text>
            </Pressable>
          </View>
        )}

        {/* Delivery Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.sectionHeader}>Delivery Details</Text>
          </View>

          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Name</Text>
            <Text style={[styles.addressValue, !user?.name && styles.missingValue]}>
              {user?.name?.trim() || 'Not set'}
            </Text>
          </View>

          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Phone</Text>
            <Text style={[styles.addressValue, !user?.phone && styles.missingValue]}>
              {user?.phone?.trim() || 'Not set'}
            </Text>
          </View>

          <View style={[styles.addressRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.addressLabel}>Address</Text>
            <Text style={[styles.addressValue, !user?.address && styles.missingValue, { flex: 1 }]}>
              {user?.address?.trim() || 'Not set'}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>
            Order Items ({selectedItems.length})
          </Text>

          {selectedItems.map((item: any) => (
            <View
              key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}
              style={styles.productRow}
            >
              <Image
                source={{ uri: item.product.images?.[0] }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.product.name}
                </Text>
                <Text style={styles.productPrice}>₱{item.product.price.toFixed(2)}</Text>
                <Text style={styles.productQty}>
                  Qty: {item.quantity}
                  {(item.selectedColor || item.selectedSize) &&
                    ` • ${[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}`}
                </Text>
              </View>
              <Text style={styles.productSubtotal}>
                ₱{(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Payment Method</Text>
          <View style={styles.paymentOption}>
            <View style={styles.radioSelected}>
              <View style={styles.radioInner} />
            </View>
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({selectedItems.length})</Text>
            <Text style={styles.summaryValue}>₱{total.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee</Text>
            <Text style={styles.freeText}>FREE</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Order Total</Text>
            <Text style={styles.totalValue}>₱{total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceInfo}>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.finalPrice}>₱{total.toFixed(2)}</Text>
        </View>
        <Pressable
          style={[
            styles.placeOrderBtn,
            (submitting || missingFields.length > 0 || selectedItems.length === 0) &&
              styles.placeOrderBtnDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={submitting || missingFields.length > 0 || selectedItems.length === 0}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}