// src/screens/buyer/Checkout/CheckoutScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform, TextInput,
  Alert, ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as Location from 'expo-location';
import { CheckoutScreenProps } from '../../../props/props';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { placeOrder } from '../../../services/orderService';
import { styles } from './CheckoutScreen.styles';

const Schema = Yup.object().shape({
  address: Yup.string().min(10, 'Please enter a complete address').required('Address is required'),
});

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating]     = useState(false);

  // Group by seller
  const bySeller = cartItems.reduce<Record<string, typeof cartItems>>((acc, item) => {
    const sid = item.product.sellerId;
    if (!acc[sid]) acc[sid] = [];
    acc[sid].push(item);
    return acc;
  }, {});

  // ─── Location: auto-fill address ─────────────────────────────────────────
  const getLocation = async (setFieldValue: (field: string, value: string) => void) => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is needed to auto-fill your address.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      const { latitude, longitude } = loc.coords;
      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = [
        place.street,
        place.city ?? place.subregion,
        place.region,
      ].filter(Boolean).join(', ');
      setFieldValue('address', address);
    } catch (err) {
      Alert.alert('Error', 'Could not get your location. Please enter address manually.');
    } finally {
      setLocating(false);
    }
  };

  // ─── Place order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async (values: { address: string }) => {
    if (!user?.id || cartItems.length === 0) return;
    setSubmitting(true);
    try {
      for (const [sellerId, items] of Object.entries(bySeller)) {
        await placeOrder({
          buyerId:         user.id,
          sellerId,
          items,
          shippingAddress: values.address,
          buyerName:       user.name,   // ← ADDED
          buyerPhone:      user.phone,  // ← ADDED
        });
      }
      clearCart();
      Alert.alert('🎉 Order Placed!', 'Your order was sent to the seller. Track it in My Orders.', [
        { text: 'View Orders', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'BuyerTabs' }] }) },
      ]);
    } catch (err: any) {
      Alert.alert('Failed', err.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]} onPress={() => navigation.goBack()}>
              <Text>←</Text>
            </Pressable>
            <Text style={styles.title}>Checkout</Text>
          </View>

          <View style={styles.inner}>
            {/* Order Summary */}
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.card}>
              {cartItems.map((item, i) => (
                <View key={item.product.id} style={[styles.orderItem, i === cartItems.length - 1 && styles.orderItemLast]}>
                  <Text style={styles.orderItemName} numberOfLines={1}>{item.product.name}</Text>
                  <Text style={styles.orderItemQty}>×{item.quantity}</Text>
                  <Text style={styles.orderItemPrice}>₱{(item.product.price * item.quantity).toLocaleString()}</Text>
                </View>
              ))}
            </View>

            {/* Payment */}
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.card}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentIcon}>💵</Text>
                <Text style={styles.paymentLabel}>Cash on Delivery (COD)</Text>
                <View style={styles.paymentBadge}><Text style={styles.paymentBadgeText}>Selected</Text></View>
              </View>
            </View>

            {/* Shipping address with location auto-fill */}
            <Formik initialValues={{ address: user?.address ?? '' }} validationSchema={Schema} onSubmit={handlePlaceOrder}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
                    <Text style={[styles.sectionTitle, { flex: 1, marginTop: 0, marginBottom: 0 }]}>Shipping Address</Text>
                    <Pressable
                      onPress={() => getLocation(setFieldValue)}
                      disabled={locating}
                      style={({ pressed }) => [{
                        flexDirection: 'row', alignItems: 'center', gap: 4,
                        backgroundColor: '#EFF6FF', borderRadius: 8,
                        paddingHorizontal: 10, paddingVertical: 6,
                        opacity: pressed ? 0.7 : 1,
                      }]}
                    >
                      {locating
                        ? <ActivityIndicator size="small" color="#2563EB" />
                        : <Text style={{ fontSize: 12 }}>📍</Text>
                      }
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#2563EB' }}>
                        {locating ? 'Getting...' : 'Use Location'}
                      </Text>
                    </Pressable>
                  </View>

                  <View style={styles.card}>
                    <TextInput
                      style={[styles.input, touched.address && errors.address ? styles.inputError : null]}
                      placeholder="Enter your complete delivery address"
                      placeholderTextColor="#9CA3AF" multiline numberOfLines={3}
                      onChangeText={handleChange('address')} onBlur={handleBlur('address')} value={values.address}
                    />
                    {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                  </View>

                  {/* Total */}
                  <View style={styles.totalCard}>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Subtotal</Text>
                      <Text style={styles.totalValue}>₱{total.toLocaleString()}</Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Shipping</Text>
                      <Text style={[styles.totalValue, { color: '#16A34A' }]}>Free</Text>
                    </View>
                    <View style={[styles.totalRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' }]}>
                      <Text style={styles.grandTotalLabel}>Total</Text>
                      <Text style={styles.grandTotalValue}>₱{total.toLocaleString()}</Text>
                    </View>
                  </View>

                  <Pressable
                    style={({ pressed }) => [styles.placeOrderBtn, pressed && styles.placeOrderBtnPressed, submitting && styles.placeOrderBtnDisabled]}
                    onPress={() => handleSubmit()} disabled={submitting}
                  >
                    {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.placeOrderText}>Place Order 🎉</Text>}
                  </Pressable>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}