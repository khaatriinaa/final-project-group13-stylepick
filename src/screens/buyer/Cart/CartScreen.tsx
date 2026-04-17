// src/screens/buyer/Cart/CartScreen.tsx

import React from 'react';
import { View, Text, FlatList, Pressable, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { CartScreenProps, BuyerStackParamList } from '../../../props/props';
import { CartItem } from '../../../types';
import { styles } from './CartScreen.styles';

export default function CartScreen({}: CartScreenProps) {
  const { user } = useAuth();
  const { cartItems, updateQuantity, total, clearCart } = useCart();
  const stackNav = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();

  const handleDecrease = (item: CartItem) => {
    if (item.quantity === 1) {
      Alert.alert('Remove Item', `Remove "${item.product.name}" from cart?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => updateQuantity(item.product.id, 0) },
      ]);
    } else {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleIncrease = (item: CartItem) => {
    if (item.quantity < item.product.stock) {
      updateQuantity(item.product.id, item.quantity + 1);
    }
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearCart },
    ]);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImage}>
        {item.product.images?.[0] ? (
          <Image source={{ uri: item.product.images[0] }} style={styles.itemImageActual} resizeMode="cover" />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Text style={styles.itemImageIcon}>🏷</Text>
          </View>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.itemUnitPrice}>₱{item.product.price.toLocaleString()} / pc</Text>
        <Text style={styles.itemSubtotal}>₱{(item.product.price * item.quantity).toLocaleString()}</Text>
      </View>
      <View style={styles.qtyControls}>
        <Pressable style={({ pressed }) => [styles.qtyBtn, pressed && styles.qtyBtnPressed]} onPress={() => handleDecrease(item)}>
          <Text style={styles.qtyBtnText}>{item.quantity === 1 ? '×' : '−'}</Text>
        </Pressable>
        <Text style={styles.qtyValue}>{item.quantity}</Text>
        <Pressable
          style={({ pressed }) => [styles.qtyBtn, pressed && styles.qtyBtnPressed, item.quantity >= item.product.stock && styles.qtyBtnDisabled]}
          onPress={() => handleIncrease(item)} disabled={item.quantity >= item.product.stock}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart ({cartItems.length})</Text>
        {cartItems.length > 0 && (
          <Pressable style={styles.clearBtn} onPress={handleClearCart}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Browse products and add items to your cart</Text>
          </View>
        }
        renderItem={renderItem}
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</Text>
            <Text style={styles.summaryValue}>₱{total.toLocaleString()}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.checkoutBtn, pressed && styles.checkoutBtnPressed]}
            onPress={() => stackNav.navigate('Checkout')}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
