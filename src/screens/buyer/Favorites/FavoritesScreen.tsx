// src/screens/buyer/Favorites/FavoritesScreen.tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  StatusBar,
  TouchableOpacity,
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

// ─── SVG heart icon (consistent with BuyerHomeScreen favorited state) ────────

function HeartFilledIcon({ size = 15 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="#FFFFFF">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();
  const { favorites, removeFavorite, clearFavorites, addFavorite } = useFavorites();
  const { addToCart } = useCart();

  // ── Refresh live stock from Supabase each time the screen gains focus ──────
  // This keeps stock counts accurate after a purchase. We replace stale
  // favorite entries with their live counterparts so the "Out of Stock"
  // label and add-to-cart guard reflect reality.
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
    }, []) // Run only on focus, not on every favorites change (would cause a loop)
  );

  const handleRemove = (product: Product) => {
    Alert.alert('Remove Favorite', `Remove "${product.name}" from favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFavorite(product.id),
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

  const handleClearAll = () => {
    Alert.alert('Clear Favorites', 'Remove all items from your favorites?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearFavorites },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => {
    const isSoldOut = item.stock <= 0;
    const isLowStock = item.stock > 0 && item.stock <= 5;

    return (
      <View style={[styles.card, { overflow: 'visible' }]}>

        {/* Image area — overflow:hidden scoped here only */}
        <View style={styles.imageWrapper}>
          <Pressable
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            style={{ width: '100%', height: '100%' }}
          >
            {item.images?.[0] ? (
              <Image
                source={{ uri: item.images[0] }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>🏷</Text>
              </View>
            )}

            {isSoldOut && (
              <View style={styles.soldOutOverlay}>
                <Text style={styles.soldOutText}>Sold Out</Text>
              </View>
            )}
          </Pressable>

          {/*
            Heart button: black background with white SVG heart — matches the
            favorited state of BuyerHomeScreen. Sits as a sibling (not child)
            of the image Pressable so Android routes touches correctly.
          */}
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => handleRemove(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.75}
          >
            <HeartFilledIcon size={15} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <Pressable
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.price}>₱{item.price.toLocaleString()}</Text>
            <Text style={[
              styles.stock,
              isSoldOut  && { color: '#EF4444', fontWeight: '600' },
              isLowStock && { color: '#F59E0B', fontWeight: '600' },
            ]}>
              {isSoldOut
                ? 'Out of stock'
                : isLowStock
                  ? `Only ${item.stock} left!`
                  : `${item.stock} pcs available`}
            </Text>
          </View>
        </Pressable>

        {/* Add to cart */}
        <Pressable
          style={({ pressed }) => [
            styles.addBtn,
            pressed && !isSoldOut && styles.addBtnPressed,
            isSoldOut && styles.addBtnDisabled,
          ]}
          onPress={() => handleAddToCart(item)}
          disabled={isSoldOut}
        >
          <Text style={[styles.addBtnText, isSoldOut && { color: '#9CA3AF' }]}>
            {isSoldOut ? 'Out of Stock' : '+ Add to Cart'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Text style={styles.title}>
          Favorites
          {favorites.length > 0 && (
            <Text style={{ fontWeight: '500', color: '#9CA3AF' }}>
              {' '}({favorites.length})
            </Text>
          )}
        </Text>

        {favorites.length > 0 && (
          <Pressable style={styles.clearBtn} onPress={handleClearAll}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart on any product to save it here
            </Text>
            <Pressable
              style={styles.browseBtn}
              onPress={() =>
                navigation.navigate('BuyerTabs', {
                  screen: 'Home',
                } as any)
              }
            >
              <Text style={styles.browseBtnText}>Browse Products</Text>
            </Pressable>
          </View>
        }
        renderItem={renderItem}
      />
    </View>
  );
}