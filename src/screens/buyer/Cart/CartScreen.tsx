// src/screens/buyer/Cart/CartScreen.tsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, FlatList, Pressable, Alert, Image,
  Modal, ScrollView, StatusBar, Animated, PanResponder,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart, cartLineKey } from '../../../context/CartContext';
import { CartScreenProps, BuyerStackParamList } from '../../../props/props';
import { CartItem } from '../../../types';
import { styles } from './CartScreen.styles';

const SWIPE_THRESHOLD = -80;
const LOW_STOCK_THRESHOLD = 5;

function TrashIcon({ size = 16, color = '#9CA3AF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 11v5M14 11v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function HeartIcon({ size = 18, filled = false, color = '#6B7280' }: { size?: number; filled?: boolean; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.79 3.93 12 5C12.21 3.93 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14.5 12 21 12 21Z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 10, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronDownIcon({ size = 10, color = '#6B7280' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Swipeable Cart Item ────────────────────────────────────────────────────────
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
    }),
  ).current;

  const handleRemoveTap = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
    setTimeout(onRemove, 200);
  };

  const stockLeft = item.product.stock;
  const atMax = item.quantity >= stockLeft;
  const lowStock = stockLeft > 0 && stockLeft <= LOW_STOCK_THRESHOLD;

  const variantLabel = [item.selectedColor, item.selectedSize].filter(Boolean).join(' / ');

  return (
    <View style={styles.swipeWrapper}>
      {/* Swipe-to-delete background */}
      <View style={styles.deleteBackground}>
        <Pressable style={styles.deleteAction} onPress={handleRemoveTap}>
          <TrashIcon size={20} color="#FFFFFF" />
          <Text style={styles.deleteLabel}>Remove</Text>
        </Pressable>
      </View>

      <Animated.View
        style={[styles.cartItem, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Radio checkbox */}
        <Pressable style={styles.radioOuter} onPress={onToggleSelect} hitSlop={8}>
          {isSelected && <View style={styles.radioInner} />}
        </Pressable>

        {/* Product Image */}
        <Pressable onPress={onPressDetail} style={styles.itemImage}>
          {item.product.images?.[0] ? (
            <Image
              source={{ uri: item.product.images[0] }}
              style={styles.itemImageActual}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.itemImagePlaceholder}>
              <Text style={styles.itemImageIcon}>📦</Text>
            </View>
          )}
          {lowStock && (
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>Only {stockLeft} left!</Text>
            </View>
          )}
        </Pressable>

        {/* Item Info */}
        <View style={styles.itemInfo}>

          {/* Title row with trash icon top-right */}
          <View style={styles.itemTopRow}>
            <Pressable style={styles.itemNameWrapper} onPress={onPressDetail}>
              <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
            </Pressable>
            <Pressable onPress={onRemove} hitSlop={10} style={styles.trashBtn}>
              <TrashIcon size={14} color="#C0C4CC" />
            </Pressable>
          </View>

          {/* Variant chip — above price, matches reference image */}
          {variantLabel ? (
            <Pressable onPress={onPressDetail} style={styles.variantChip}>
              <View style={styles.variantDot} />
              <Text style={styles.variantText}>{variantLabel}</Text>
              <ChevronRightIcon size={10} color="#6B7280" />
            </Pressable>
          ) : null}

          {/* Low stock warning */}
          {lowStock && (
            <Text style={styles.stockWarning}>Only {stockLeft} items left!</Text>
          )}

          {/* Price + Qty stepper on same row */}
          <View style={styles.priceQtyRow}>
            <Text style={styles.itemPrice}>₱{item.product.price.toLocaleString()}</Text>

            <View style={styles.qtyControls}>
              <Pressable
                style={({ pressed }) => [styles.qtyBtn, pressed && styles.qtyBtnPressed]}
                onPress={onDecrease}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </Pressable>
              <Text style={styles.qtyValue}>{item.quantity}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.qtyBtn,
                  pressed && styles.qtyBtnPressed,
                  atMax && styles.qtyBtnDisabled,
                ]}
                onPress={onIncrease}
                disabled={atMax}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </Animated.View>
    </View>
  );
}

// ── Shop Group Header ──────────────────────────────────────────────────────────
function ShopGroupHeader({
  shopName, isSelected, onToggle,
}: {
  shopName: string;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.shopHeader}>
      <Pressable style={styles.radioOuter} onPress={onToggle} hitSlop={8}>
        {isSelected && <View style={styles.radioInner} />}
      </Pressable>
      <Text style={styles.shopIcon}>🏪</Text>
      <Text style={styles.shopName}>{shopName}</Text>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function CartScreen({}: CartScreenProps) {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const stackNav = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(cartItems.map((i) => cartLineKey(i.product.id, i.selectedColor, i.selectedSize))),
  );
  const [detailItem, setDetailItem] = useState<CartItem | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const getItemKey = (item: CartItem) =>
    cartLineKey(item.product.id, item.selectedColor, item.selectedSize);

  const toggleSelect = useCallback((key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const allSelected = cartItems.length > 0 && selectedKeys.size === cartItems.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedKeys(new Set());
    else setSelectedKeys(new Set(cartItems.map(getItemKey)));
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, CartItem[]> = {};
    cartItems.forEach((item) => {
      const shop = (item.product as any).sellerName || item.product.category || 'Shop';
      if (!groups[shop]) groups[shop] = [];
      groups[shop].push(item);
    });
    return groups;
  }, [cartItems]);

  const selectedItems = useMemo(
    () => cartItems.filter((i) => selectedKeys.has(getItemKey(i))),
    [cartItems, selectedKeys],
  );
  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [selectedItems],
  );

  const handleDecrease = (item: CartItem) => {
    if (item.quantity === 1) handleRemoveItem(item);
    else updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize);
  };

  const handleIncrease = (item: CartItem) => {
    if (item.quantity < item.product.stock)
      updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize);
  };

  const handleRemoveItem = (item: CartItem) => {
    Alert.alert('Remove Item', `Remove "${item.product.name}" from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: () => {
          updateQuantity(item.product.id, 0, item.selectedColor, item.selectedSize);
          setSelectedKeys((prev) => {
            const next = new Set(prev);
            next.delete(getItemKey(item));
            return next;
          });
        },
      },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All', style: 'destructive',
        onPress: () => { clearCart(); setSelectedKeys(new Set()); },
      },
    ]);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to checkout.');
      return;
    }
    stackNav.navigate('Checkout', { selectedItems });
  };

  const toggleShopSelect = (shopName: string) => {
    const shopItems = groupedItems[shopName] || [];
    const allShopSelected = shopItems.every((i) => selectedKeys.has(getItemKey(i)));
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      shopItems.forEach((i) => {
        allShopSelected ? next.delete(getItemKey(i)) : next.add(getItemKey(i));
      });
      return next;
    });
  };

  const isShopSelected = (shopName: string) => {
    const shopItems = groupedItems[shopName] || [];
    return shopItems.length > 0 && shopItems.every((i) => selectedKeys.has(getItemKey(i)));
  };

  type ListRow =
    | { type: 'shopHeader'; shopName: string; key: string }
    | { type: 'item'; item: CartItem; key: string };

  const listData = useMemo((): ListRow[] => {
    const rows: ListRow[] = [];
    Object.entries(groupedItems).forEach(([shopName, items]) => {
      rows.push({ type: 'shopHeader', shopName, key: `header-${shopName}` });
      items.forEach((item) => {
        rows.push({ type: 'item', item, key: `item-${getItemKey(item)}` });
      });
    });
    return rows;
  }, [groupedItems]);

  const renderRow = ({ item: row }: { item: ListRow }) => {
    if (row.type === 'shopHeader') {
      return (
        <ShopGroupHeader
          shopName={row.shopName}
          isSelected={isShopSelected(row.shopName)}
          onToggle={() => toggleShopSelect(row.shopName)}
        />
      );
    }
    if (row.type === 'item') {
      const { item } = row;
      const key = getItemKey(item);
      return (
        <SwipeableCartItem
          item={item}
          isSelected={selectedKeys.has(key)}
          onToggleSelect={() => toggleSelect(key)}
          onDecrease={() => handleDecrease(item)}
          onIncrease={() => handleIncrease(item)}
          onRemove={() => handleRemoveItem(item)}
          onPressDetail={() => setDetailItem(item)}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>
            My Cart
            {cartItems.length > 0 && (
              <Text style={styles.headerCount}> ({cartItems.length})</Text>
            )}
          </Text>
          <View style={styles.headerRight}>
            <Pressable
              style={({ pressed }) => [styles.headerIconBtn, pressed && styles.headerIconBtnPressed]}
              onPress={() => {
                setIsFavorited((v) => !v);
                stackNav.navigate('Favorites');
              }}
            >
              <HeartIcon size={18} filled={isFavorited} color={isFavorited ? '#EF4444' : '#374151'} />
            </Pressable>
            {cartItems.length > 0 && (
              <Pressable
                style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.7 }]}
                onPress={handleClearCart}
              >
                <Text style={styles.clearBtnText}>Clear All</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={cartItems.length === 0 ? [] : listData}
        keyExtractor={(row) => row.key}
        contentContainerStyle={styles.list}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>🛒</Text>
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Browse products and add items to your cart</Text>
          </View>
        }
        renderItem={renderRow}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={styles.footerLeft} onPress={toggleSelectAll}>
          <Pressable style={styles.radioOuter} onPress={toggleSelectAll} hitSlop={8}>
            {allSelected && <View style={styles.radioInner} />}
          </Pressable>
          <Text style={styles.footerAllLabel}>All</Text>
        </Pressable>
        <View style={styles.footerRight}>
          <Text style={styles.footerTotal}>₱{selectedTotal.toLocaleString()}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.checkoutBtn,
              pressed && styles.checkoutBtnPressed,
              selectedKeys.size === 0 && styles.checkoutBtnDisabled,
            ]}
            onPress={handleCheckout}
            disabled={selectedKeys.size === 0}
          >
            <Text style={styles.checkoutText}>
              Checkout{selectedKeys.size > 0 ? ` (${selectedKeys.size})` : ''}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Detail Modal */}
      <Modal
        visible={!!detailItem}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailItem(null)}
      >
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
                  <View style={styles.modalImagePlaceholder}>
                    <Text style={{ fontSize: 64 }}>📦</Text>
                  </View>
                )}
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalProductName}>{detailItem.product.name}</Text>
                <View style={styles.modalPriceRow}>
                  <Text style={styles.modalPrice}>₱{detailItem.product.price.toLocaleString()}</Text>
                  <Text style={styles.modalPriceUnit}> / pc</Text>
                </View>
                {(detailItem.selectedColor || detailItem.selectedSize) && (
                  <View style={styles.modalVariantChip}>
                    <View style={styles.variantDot} />
                    <Text style={styles.modalVariantText}>
                      {[detailItem.selectedColor, detailItem.selectedSize].filter(Boolean).join(' / ')}
                    </Text>
                    <ChevronRightIcon size={10} color="#6B7280" />
                  </View>
                )}
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
                {detailItem.product.stock <= LOW_STOCK_THRESHOLD && detailItem.product.stock > 0 && (
                  <View style={styles.modalDetailRow}>
                    <Text style={[styles.modalDetailLabel, { color: '#F59E0B' }]}>⚠ Low Stock Warning</Text>
                    <Text style={[styles.modalDetailValue, { color: '#F59E0B' }]}>Only {detailItem.product.stock} left</Text>
                  </View>
                )}
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
                style={({ pressed }) => [
                  styles.modalSelectBtn,
                  selectedKeys.has(getItemKey(detailItem)) && styles.modalDeselectBtn,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => toggleSelect(getItemKey(detailItem))}
              >
                <Text style={styles.modalSelectBtnText}>
                  {selectedKeys.has(getItemKey(detailItem)) ? '✓ Selected for Checkout' : 'Select for Checkout'}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}