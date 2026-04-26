// src/screens/buyer/Cart/CartScreen.tsx

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, FlatList, Pressable, Alert, Image,
  Modal, ScrollView, StatusBar, Animated, PanResponder, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { CartScreenProps, BuyerStackParamList } from '../../../props/props';
import { CartItem } from '../../../types';
import { styles } from './CartScreen.styles';

const SWIPE_THRESHOLD = -80;

// ── Swipeable Cart Item ───────────────────────────────────────────────────────
function SwipeableCartItem({
  item, isSelected, onToggleSelect, onDecrease,
  onIncrease, onRemove, onPressDetail,
}: {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  onPressDetail: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        const dx = Math.max(g.dx, -100);
        if (dx <= 0) translateX.setValue(dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_THRESHOLD) {
          Animated.spring(translateX, { toValue: -80, useNativeDriver: true }).start();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleRemoveTap = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
    setTimeout(onRemove, 200);
  };

  return (
    <View style={styles.swipeWrapper}>
      <View style={styles.deleteBackground}>
        <Pressable style={styles.deleteAction} onPress={handleRemoveTap}>
          <Text style={styles.deleteIcon}>🗑</Text>
          <Text style={styles.deleteLabel}>Remove</Text>
        </Pressable>
      </View>
      <Animated.View
        style={[styles.cartItem, isSelected && styles.cartItemSelected, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Pressable style={[styles.checkbox, isSelected && styles.checkboxChecked]} onPress={onToggleSelect} hitSlop={8}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
        <Pressable onPress={onPressDetail} style={styles.itemImage}>
          {item.product.images?.[0] ? (
            <Image source={{ uri: item.product.images[0] }} style={styles.itemImageActual} resizeMode="cover" />
          ) : (
            <View style={styles.itemImagePlaceholder}>
              <Text style={styles.itemImageIcon}>🏷</Text>
            </View>
          )}
        </Pressable>
        <Pressable style={styles.itemInfo} onPress={onPressDetail}>
          <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
          <Text style={styles.itemUnitPrice}>₱{item.product.price.toLocaleString()} / pc</Text>
          <Text style={styles.itemSubtotal}>₱{(item.product.price * item.quantity).toLocaleString()}</Text>
          {item.quantity >= item.product.stock && (
            <Text style={styles.stockWarning}>Max stock reached</Text>
          )}
        </Pressable>
        <View style={styles.qtyControls}>
          <Pressable style={({ pressed }) => [styles.qtyBtn, pressed && styles.qtyBtnPressed]} onPress={onDecrease}>
            <Text style={styles.qtyBtnText}>−</Text>
          </Pressable>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <Pressable
            style={({ pressed }) => [styles.qtyBtn, pressed && styles.qtyBtnPressed, item.quantity >= item.product.stock && styles.qtyBtnDisabled]}
            onPress={onIncrease} disabled={item.quantity >= item.product.stock}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CartScreen({}: CartScreenProps) {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const stackNav = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(cartItems.map((i) => i.product.id))
  );
  const [detailItem, setDetailItem] = useState<CartItem | null>(null);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const allSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(cartItems.map((i) => i.product.id)));
  };

  const selectedItems = useMemo(
    () => cartItems.filter((i) => selectedIds.has(i.product.id)),
    [cartItems, selectedIds]
  );
  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [selectedItems]
  );

  const handleDecrease = (item: CartItem) => {
    if (item.quantity === 1) handleRemoveItem(item);
    else updateQuantity(item.product.id, item.quantity - 1);
  };

  const handleIncrease = (item: CartItem) => {
    if (item.quantity < item.product.stock) updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleRemoveItem = (item: CartItem) => {
    Alert.alert('Remove Item', `Remove "${item.product.name}" from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: () => {
          updateQuantity(item.product.id, 0);
          setSelectedIds((prev) => { const next = new Set(prev); next.delete(item.product.id); return next; });
        },
      },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => { clearCart(); setSelectedIds(new Set()); } },
    ]);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to checkout.');
      return;
    }
    stackNav.navigate('Checkout', { selectedItems });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <View style={styles.headerRight}>
          {/* Favorites button */}
          <Pressable
            style={({ pressed }) => [styles.headerIconBtn, pressed && styles.headerIconBtnPressed]}
            onPress={() => stackNav.navigate('Favorites')}
          >
            <Text style={styles.headerIconEmoji}>🤍</Text>
          </Pressable>

          {/* Notifications button */}
          <Pressable
            style={({ pressed }) => [styles.headerIconBtn, pressed && styles.headerIconBtnPressed]}
            onPress={() => stackNav.navigate('BuyerNotifications')}
          >
            <Text style={styles.headerIconEmoji}>🔔</Text>
            {/* Unread badge — wire up your own unread count */}
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>!</Text>
            </View>
          </Pressable>

          {cartItems.length > 0 && (
            <Pressable style={styles.clearBtn} onPress={handleClearCart}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Select All bar ── */}
      {cartItems.length > 0 && (
        <Pressable style={styles.selectAllBar} onPress={toggleSelectAll}>
          <View style={[styles.checkbox, allSelected && styles.checkboxChecked]}>
            {allSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.selectAllText}>{allSelected ? 'Deselect All' : 'Select All'}</Text>
          <Text style={styles.selectedCount}>{selectedIds.size} of {cartItems.length} selected</Text>
        </Pressable>
      )}

      {/* ── List ── */}
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
        renderItem={({ item }) => (
          <SwipeableCartItem
            item={item}
            isSelected={selectedIds.has(item.product.id)}
            onToggleSelect={() => toggleSelect(item.product.id)}
            onDecrease={() => handleDecrease(item)}
            onIncrease={() => handleIncrease(item)}
            onRemove={() => handleRemoveItem(item)}
            onPressDetail={() => setDetailItem(item)}
          />
        )}
      />

      {/* ── Footer ── */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected ({selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''})</Text>
            <Text style={styles.summaryValue}>₱{selectedTotal.toLocaleString()}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.checkoutBtn, pressed && styles.checkoutBtnPressed, selectedIds.size === 0 && styles.checkoutBtnDisabled]}
            onPress={handleCheckout} disabled={selectedIds.size === 0}
          >
            <Text style={styles.checkoutText}>Checkout{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}</Text>
          </Pressable>
        </View>
      )}

      {/* ── Detail Modal ── */}
      <Modal visible={!!detailItem} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetailItem(null)}>
        {detailItem && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Product Details</Text>
              <Pressable onPress={() => setDetailItem(null)} style={styles.modalCloseBtn} hitSlop={10}>
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalImageWrapper}>
                {detailItem.product.images?.[0] ? (
                  <Image source={{ uri: detailItem.product.images[0] }} style={styles.modalImage} resizeMode="cover" />
                ) : (
                  <View style={styles.modalImagePlaceholder}><Text style={{ fontSize: 64 }}>🏷</Text></View>
                )}
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalProductName}>{detailItem.product.name}</Text>
                <View style={styles.modalPriceRow}>
                  <Text style={styles.modalPrice}>₱{detailItem.product.price.toLocaleString()}</Text>
                  <Text style={styles.modalPriceUnit}> / pc</Text>
                </View>
              </View>
              <View style={styles.modalCard}>
                <Text style={styles.modalCardTitle}>In Your Cart</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Quantity</Text>
                  <Text style={styles.modalDetailValue}>{detailItem.quantity} pc{detailItem.quantity !== 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Unit Price</Text>
                  <Text style={styles.modalDetailValue}>₱{detailItem.product.price.toLocaleString()}</Text>
                </View>
                <View style={[styles.modalDetailRow, styles.modalDetailRowLast]}>
                  <Text style={styles.modalDetailLabel}>Subtotal</Text>
                  <Text style={styles.modalDetailTotal}>₱{(detailItem.product.price * detailItem.quantity).toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.modalCard}>
                <Text style={styles.modalCardTitle}>Stock Info</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Available Stock</Text>
                  <Text style={styles.modalDetailValue}>{detailItem.product.stock} pcs</Text>
                </View>
                <View style={[styles.modalDetailRow, styles.modalDetailRowLast]}>
                  <Text style={styles.modalDetailLabel}>Status</Text>
                  <Text style={[styles.modalDetailValue, detailItem.product.stock > 0 ? styles.inStock : styles.outOfStock]}>
                    {detailItem.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              </View>
              {detailItem.product.description && (
                <View style={styles.modalCard}>
                  <Text style={styles.modalCardTitle}>Description</Text>
                  <Text style={styles.modalDescription}>{detailItem.product.description}</Text>
                </View>
              )}
              <Pressable
                style={({ pressed }) => [styles.modalSelectBtn, selectedIds.has(detailItem.product.id) && styles.modalDeselectBtn, pressed && { opacity: 0.8 }]}
                onPress={() => toggleSelect(detailItem.product.id)}
              >
                <Text style={styles.modalSelectBtnText}>
                  {selectedIds.has(detailItem.product.id) ? '✓ Selected for Checkout' : 'Select for Checkout'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}