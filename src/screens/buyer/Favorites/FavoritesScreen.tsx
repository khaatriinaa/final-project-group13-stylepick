// src/screens/buyer/Favorites/FavoritesScreen.tsx
import React, { useCallback, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  StatusBar,
  Modal,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerStackParamList } from '../../../props/props';
import { useFavorites } from '../../../context/FavoritesContext';
import { useCart } from '../../../context/CartContext';
import { getProductById } from '../../../services/productService';
import { styles } from './FavoritesScreen.styles';
import { Product } from '../../../types';

const SWIPE_THRESHOLD = -80;
const LOW_STOCK_THRESHOLD = 5;

// ─── Icons ────────────────────────────────────────────────────────────────────

function TrashIcon({ size = 16, color = '#9CA3AF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 11v5M14 11v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function HeartFilledIcon({ size = 18, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeartOutlineIcon({ size = 18, color = '#374151' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
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

function CartIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 6h18M16 10a4 4 0 01-8 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Swipeable Favorite Item ──────────────────────────────────────────────────

function SwipeableFavoriteItem({
  item,
  isSelected,
  onToggleSelect,
  onRemove,
  onAddToCart,
  onPressDetail,
}: {
  item: Product;
  isSelected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
  onAddToCart: () => void;
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

  const isSoldOut = item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD;

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
        style={[styles.favoriteItem, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Radio checkbox */}
        <Pressable style={styles.radioOuter} onPress={onToggleSelect} hitSlop={8}>
          {isSelected && <View style={styles.radioInner} />}
        </Pressable>

        {/* Product Image */}
        <Pressable onPress={onPressDetail} style={styles.itemImage}>
          {item.images?.[0] ? (
            <Image
              source={{ uri: item.images[0] }}
              style={styles.itemImageActual}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.itemImagePlaceholder}>
              <Text style={styles.itemImageIcon}>🏷</Text>
            </View>
          )}
          {isSoldOut && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutBadgeText}>Sold Out</Text>
            </View>
          )}
          {isLowStock && !isSoldOut && (
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>Only {item.stock} left!</Text>
            </View>
          )}
        </Pressable>

        {/* Item Info */}
        <View style={styles.itemInfo}>

          {/* Title row with trash icon top-right */}
          <View style={styles.itemTopRow}>
            <Pressable style={styles.itemNameWrapper} onPress={onPressDetail}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            </Pressable>
            <Pressable onPress={onRemove} hitSlop={10} style={styles.trashBtn}>
              <TrashIcon size={14} color="#C0C4CC" />
            </Pressable>
          </View>

          {/* Category chip */}
          {item.category ? (
            <Pressable onPress={onPressDetail} style={styles.variantChip}>
              <View style={styles.variantDot} />
              <Text style={styles.variantText}>{item.category}</Text>
              <ChevronRightIcon size={10} color="#6B7280" />
            </Pressable>
          ) : null}

          {/* Stock warning */}
          {isLowStock && !isSoldOut && (
            <Text style={styles.stockWarning}>Only {item.stock} items left!</Text>
          )}

          {/* Price + Add to Cart on same row */}
          <View style={styles.priceCartRow}>
            <Text style={styles.itemPrice}>₱{item.price.toLocaleString()}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.addCartBtn,
                pressed && !isSoldOut && styles.addCartBtnPressed,
                isSoldOut && styles.addCartBtnDisabled,
              ]}
              onPress={onAddToCart}
              disabled={isSoldOut}
            >
              <CartIcon size={13} color={isSoldOut ? '#9CA3AF' : '#FFFFFF'} />
              <Text style={[styles.addCartBtnText, isSoldOut && { color: '#9CA3AF' }]}>
                {isSoldOut ? 'Sold Out' : 'Add'}
              </Text>
            </Pressable>
          </View>

        </View>
      </Animated.View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();
  const { favorites, removeFavorite, clearFavorites, addFavorite } = useFavorites();
  const { addToCart } = useCart();

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(favorites.map((p) => p.id)),
  );
  const [detailItem, setDetailItem] = useState<Product | null>(null);

  // ── Refresh live stock from Supabase each time the screen gains focus ──────
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const refreshStocks = async () => {
        for (const fav of favorites) {
          try {
            const live = await getProductById(fav.id);
            if (!cancelled && live && live.stock !== fav.stock) {
              removeFavorite(fav.id);
              addFavorite({ ...fav, stock: live.stock });
            }
          } catch {
            // Non-fatal — keep the cached stock value
          }
        }
      };

      refreshStocks();
      return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // ── Selection ─────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const allSelected = favorites.length > 0 && selectedKeys.size === favorites.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedKeys(new Set());
    else setSelectedKeys(new Set(favorites.map((p) => p.id)));
  };

  // ── Selected items summary ────────────────────────────────────────────────
  const selectedItems = useMemo(
    () => favorites.filter((p) => selectedKeys.has(p.id)),
    [favorites, selectedKeys],
  );

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, p) => sum + p.price, 0),
    [selectedItems],
  );

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleRemove = (product: Product) => {
    Alert.alert('Remove Favorite', `Remove "${product.name}" from favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeFavorite(product.id);
          setSelectedKeys((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
        },
      },
    ]);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      Alert.alert('Out of Stock', `"${product.name}" is currently out of stock.`);
      return;
    }
    addToCart(product, 1);
    Alert.alert('Added to Cart', `"${product.name}" has been added to your cart.`);
  };

  const handleAddSelectedToCart = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to add to cart.');
      return;
    }
    const inStock = selectedItems.filter((p) => p.stock > 0);
    const outOfStock = selectedItems.filter((p) => p.stock <= 0);

    inStock.forEach((p) => addToCart(p, 1));

    if (outOfStock.length > 0 && inStock.length > 0) {
      Alert.alert(
        'Partially Added',
        `${inStock.length} item(s) added to cart. ${outOfStock.length} item(s) were out of stock and skipped.`,
      );
    } else if (inStock.length > 0) {
      Alert.alert('Added to Cart', `${inStock.length} item(s) added to your cart.`);
    } else {
      Alert.alert('Out of Stock', 'All selected items are currently out of stock.');
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear Favorites', 'Remove all items from your favorites?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => { clearFavorites(); setSelectedKeys(new Set()); },
      },
    ]);
  };

  // ── Render item ───────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: Product }) => (
    <SwipeableFavoriteItem
      item={item}
      isSelected={selectedKeys.has(item.id)}
      onToggleSelect={() => toggleSelect(item.id)}
      onRemove={() => handleRemove(item)}
      onAddToCart={() => handleAddToCart(item)}
      onPressDetail={() => setDetailItem(item)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={8}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Favorites
            {favorites.length > 0 && (
              <Text style={styles.headerCount}> ({favorites.length})</Text>
            )}
          </Text>

          <View style={styles.headerRight}>
            {favorites.length > 0 && (
              <Pressable
                style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.7 }]}
                onPress={handleClearAll}
              >
                <Text style={styles.clearBtnText}>Clear All</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <HeartOutlineIcon size={28} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart on any product to save it here
            </Text>
            <Pressable
              style={styles.browseBtn}
              onPress={() =>
                navigation.navigate('BuyerTabs', { screen: 'Home' } as any)
              }
            >
              <Text style={styles.browseBtnText}>Browse Products</Text>
            </Pressable>
          </View>
        }
        renderItem={renderItem}
      />

      {/* Footer — mirrors CartScreen's footer */}
      {favorites.length > 0 && (
        <View style={styles.footer}>
          <Pressable style={styles.footerLeft} onPress={toggleSelectAll}>
            <Pressable style={styles.radioOuter} onPress={toggleSelectAll} hitSlop={8}>
              {allSelected && <View style={styles.radioInner} />}
            </Pressable>
            <Text style={styles.footerAllLabel}>All</Text>
          </Pressable>
          <View style={styles.footerRight}>
            <View>
              <Text style={styles.footerTotalLabel}>Total value</Text>
              <Text style={styles.footerTotal}>₱{selectedTotal.toLocaleString()}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.addToCartBtn,
                pressed && styles.addToCartBtnPressed,
                selectedKeys.size === 0 && styles.addToCartBtnDisabled,
              ]}
              onPress={handleAddSelectedToCart}
              disabled={selectedKeys.size === 0}
            >
              <CartIcon size={15} color={selectedKeys.size === 0 ? '#9CA3AF' : '#FFFFFF'} />
              <Text style={styles.addToCartBtnText}>
                Add to Cart{selectedKeys.size > 0 ? ` (${selectedKeys.size})` : ''}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Detail Modal — mirrors CartScreen's detail modal */}
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
                {detailItem.images?.[0] ? (
                  <Image source={{ uri: detailItem.images[0] }} style={styles.modalImage} resizeMode="cover" />
                ) : (
                  <View style={styles.modalImagePlaceholder}>
                    <Text style={{ fontSize: 64 }}>🏷</Text>
                  </View>
                )}
                {detailItem.stock <= 0 && (
                  <View style={styles.modalSoldOutOverlay}>
                    <Text style={styles.modalSoldOutText}>OUT OF STOCK</Text>
                  </View>
                )}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalProductName}>{detailItem.name}</Text>
                <View style={styles.modalPriceRow}>
                  <Text style={styles.modalPrice}>₱{detailItem.price.toLocaleString()}</Text>
                  <Text style={styles.modalPriceUnit}> / pc</Text>
                </View>
                {detailItem.category && (
                  <View style={styles.modalVariantChip}>
                    <View style={styles.variantDot} />
                    <Text style={styles.modalVariantText}>{detailItem.category}</Text>
                    <ChevronRightIcon size={10} color="#6B7280" />
                  </View>
                )}
              </View>

              <View style={styles.modalCard}>
                <Text style={styles.modalCardTitle}>Stock Info</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Available Stock</Text>
                  <Text style={styles.modalDetailValue}>{detailItem.stock} pcs</Text>
                </View>
                {detailItem.stock <= LOW_STOCK_THRESHOLD && detailItem.stock > 0 && (
                  <View style={styles.modalDetailRow}>
                    <Text style={[styles.modalDetailLabel, { color: '#F59E0B' }]}>⚠ Low Stock Warning</Text>
                    <Text style={[styles.modalDetailValue, { color: '#F59E0B' }]}>Only {detailItem.stock} left</Text>
                  </View>
                )}
                <View style={[styles.modalDetailRow, styles.modalDetailRowLast]}>
                  <Text style={styles.modalDetailLabel}>Status</Text>
                  <Text style={[
                    styles.modalDetailValue,
                    detailItem.stock > 0 ? styles.inStock : styles.outOfStock,
                  ]}>
                    {detailItem.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              </View>

              {detailItem.description && (
                <View style={styles.modalCard}>
                  <Text style={styles.modalCardTitle}>Description</Text>
                  <Text style={styles.modalDescription}>{detailItem.description}</Text>
                </View>
              )}

              <View style={styles.modalActionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalFavBtn,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => {
                    handleRemove(detailItem);
                    setDetailItem(null);
                  }}
                >
                  <HeartFilledIcon size={16} color="#EF4444" />
                  <Text style={styles.modalFavBtnText}>Remove</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.modalAddCartBtn,
                    detailItem.stock <= 0 && styles.modalAddCartBtnDisabled,
                    pressed && detailItem.stock > 0 && { opacity: 0.85 },
                  ]}
                  onPress={() => {
                    handleAddToCart(detailItem);
                    setDetailItem(null);
                  }}
                  disabled={detailItem.stock <= 0}
                >
                  <CartIcon size={16} color={detailItem.stock <= 0 ? '#9CA3AF' : '#FFFFFF'} />
                  <Text style={[styles.modalAddCartBtnText, detailItem.stock <= 0 && { color: '#9CA3AF' }]}>
                    {detailItem.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}