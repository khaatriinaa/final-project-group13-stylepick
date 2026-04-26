// src/screens/buyer/Home/BuyerHomeScreen.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl,
  TextInput, Image, Animated, TouchableWithoutFeedback,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerHomeScreenProps, BuyerStackParamList } from '../../../props/props';
import { Product } from '../../../types';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { FASHION_CATEGORIES } from '../../../theme';
import { styles } from './BuyerHomeScreen.styles';

const isNewProduct = (product: Product): boolean => {
  const createdAt = new Date(product.createdAt).getTime();
  const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
  return createdAt >= fourteenDaysAgo;
};

const isOnSale = (product: Product): boolean =>
  product.comparePrice != null && product.comparePrice > product.price;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function BuyerHomeScreen({ navigation }: BuyerHomeScreenProps) {
  const { user } = useAuth();
  const { addToCart, itemCount } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const stackNav = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const cartScale = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.timing(cartScale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.spring(cartScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const fetchProducts = useCallback(async () => {
    try { setAllProducts(await getProducts()); } catch {}
  }, []);

  useFocusEffect(useCallback(() => { fetchProducts(); }, [fetchProducts]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true); await fetchProducts(); setRefreshing(false);
  }, [fetchProducts]);

  const toggleWishlist = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = (item: Product) => {
    addToCart(item);
    bounce();
  };

  const filtered = allProducts.filter((p) => {
    const matchCat =
      activeCategory === 'All' ||
      p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const renderProduct = ({ item }: { item: Product }) => {
    const isWishlisted = isFavorite(item.id);
    const isSoldOut    = item.stock === 0;
    const showSale     = isOnSale(item) && !isSoldOut;
    const showNew      = isNewProduct(item) && !isSoldOut && !showSale;

    return (
      <View style={styles.productCard}>

        {/* ✅ Wishlist button rendered FIRST so it sits on top of the nav Pressable */}
        <Pressable
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(item)}
          hitSlop={10}
        >
          <Text style={[styles.wishlistIcon, isWishlisted && styles.wishlistIconActive]}>
            {isWishlisted ? '♥' : '♡'}
          </Text>
        </Pressable>

        {/* Nav pressable covers image + info */}
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
          onPress={() => stackNav.navigate('ProductDetail', { productId: item.id })}
        >
          <View style={styles.productImageWrap}>
            {item.images?.[0] ? (
              <Image
                source={{ uri: item.images[0] }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.productImagePlaceholder}>
                <Text style={styles.productImageIcon}>👕</Text>
              </View>
            )}

            {isSoldOut && (
              <View style={styles.soldOutOverlay}>
                <Text style={styles.soldOutText}>SOLD OUT</Text>
              </View>
            )}
            {showSale && (
              <View style={[styles.tagBadge, styles.tagBadgeSale]}>
                <Text style={styles.tagBadgeText}>SALE</Text>
              </View>
            )}
            {showNew && (
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>NEW</Text>
              </View>
            )}
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
            {showSale && item.comparePrice != null && (
              <Text style={styles.comparePrice}>₱{item.comparePrice.toLocaleString()}</Text>
            )}
            <View style={styles.productFooter}>
              <Text style={[styles.productPrice, showSale && styles.productPriceSale]}>
                ₱{item.price.toLocaleString()}
              </Text>
              {!isSoldOut && (
                <Pressable
                  style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
                  onPress={() => handleAddToCart(item)}
                  hitSlop={4}
                >
                  <Text style={styles.addBtnText}>+</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Pressable>

      </View>
    );
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'S';

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.headerLeft}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.nameText}>
                {user?.name?.split(' ')[0] ?? 'Shopper'} 👋
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableWithoutFeedback
              onPress={() => (navigation as any).navigate('BuyerNotifications')}
            >
              <View style={styles.iconBtn}>
                <Text style={styles.iconBtnEmoji}>🔔</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => (navigation as any).navigate('Cart')}>
              <View style={styles.cartBadgeWrap}>
                <Animated.View style={[styles.iconBtn, { transform: [{ scale: cartScale }] }]}>
                  <Text style={styles.iconBtnEmoji}>🛒</Text>
                </Animated.View>
                {itemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{itemCount}</Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Text style={styles.searchClear}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Category chips ── */}
      <FlatList
        data={FASHION_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(c) => c}
        style={styles.catStrip}
        contentContainerStyle={styles.catContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.catChip, activeCategory === item && styles.catChipActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.catChipText, activeCategory === item && styles.catChipTextActive]}>
              {item}
            </Text>
          </Pressable>
        )}
      />

      {/* ── Product list ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#C8102E']}
            tintColor="#C8102E"
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.banner}>
              <View style={styles.bannerDeco} />
              <View style={styles.bannerDeco2} />
              <View style={styles.bannerTextWrap}>
                <Text style={styles.bannerTag}>FREE SHIPPING</Text>
                <Text style={styles.bannerTitle}>
                  Style for{'\n'}
                  <Text style={styles.bannerTitleAccent}>Every Season</Text>
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.bannerCta, pressed && { opacity: 0.8 }]}
                  onPress={() => stackNav.navigate('ProductList' as any)}
                >
                  <Text style={styles.bannerCtaText}>Browse all →</Text>
                </Pressable>
              </View>
              <Text style={styles.bannerEmoji}>✨</Text>
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>
                {activeCategory === 'All' ? 'Popular Now' : activeCategory}
              </Text>
              <Pressable onPress={() => stackNav.navigate('ProductList' as any)}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 40 }}>👗</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? `No results for "${searchQuery}"`
                : 'Check back for new arrivals'}
            </Text>
          </View>
        }
        renderItem={renderProduct}
      />
    </View>
  );
}