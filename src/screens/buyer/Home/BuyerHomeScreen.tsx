// src/screens/buyer/Home/BuyerHomeScreen.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl,
  TextInput, Image, Animated, TouchableWithoutFeedback, Modal, ScrollView,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'name_asc';
type PrimaryTab = 'All' | 'Women' | 'Curve' | 'Men' | 'Kids';
type SubTab = 'For You' | 'New In' | 'Deals' | 'Bestsellers';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance',  label: 'Relevance'        },
  { key: 'price_asc',  label: 'Price: Low → High' },
  { key: 'price_desc', label: 'Price: High → Low' },
  { key: 'newest',     label: 'Newest first'      },
  { key: 'name_asc',   label: 'Name A → Z'        },
];

const PRIMARY_TABS: PrimaryTab[] = ['All', 'Women', 'Curve', 'Men', 'Kids'];

const SUB_TABS: { key: SubTab; icon: string }[] = [
  { key: 'For You',     icon: '⭐' },
  { key: 'New In',      icon: '✨' },
  { key: 'Deals',       icon: '🏷️' },
  { key: 'Bestsellers', icon: '🏅' },
];

// Category circles with emoji icons
const CAT_CIRCLES = [
  { label: 'Women',     emoji: '👗' },
  { label: 'Curve',     emoji: '🌸' },
  { label: 'Kids',      emoji: '🧒' },
  { label: 'Men',       emoji: '👔' },
  { label: 'Sports',    emoji: '🏃' },
  { label: 'Jewelry',   emoji: '💎' },
  { label: 'Tops',      emoji: '👕' },
  { label: 'Baby',      emoji: '🍼' },
  { label: 'Beach',     emoji: '👙' },
  { label: 'Shoes',     emoji: '👠' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isNewProduct = (product: Product): boolean =>
  new Date(product.createdAt).getTime() >= Date.now() - 14 * 24 * 60 * 60 * 1000;

const isOnSale = (product: Product): boolean =>
  product.comparePrice != null && product.comparePrice > product.price;

const getDiscountPercent = (product: Product): number => {
  if (!product.comparePrice || product.comparePrice <= product.price) return 0;
  return Math.round((1 - product.price / product.comparePrice) * 100);
};

const sortProducts = (products: Product[], key: SortKey): Product[] => {
  const arr = [...products];
  switch (key) {
    case 'price_asc':  return arr.sort((a, b) => a.price - b.price);
    case 'price_desc': return arr.sort((a, b) => b.price - a.price);
    case 'newest':     return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'name_asc':   return arr.sort((a, b) => a.name.localeCompare(b.name));
    default:           return arr;
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BuyerHomeScreen({ navigation }: BuyerHomeScreenProps) {
  const { user }                                    = useAuth();
  const { addToCart, itemCount }                    = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const stackNav = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();

  const [allProducts, setAllProducts]       = useState<Product[]>([]);
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab]           = useState<PrimaryTab>('All');
  const [activeSubTab, setActiveSubTab]     = useState<SubTab>('For You');
  const [sortKey, setSortKey]               = useState<SortKey>('relevance');
  const [sortOpen, setSortOpen]             = useState(false);
  const [refreshing, setRefreshing]         = useState(false);
  const [searchFocused, setSearchFocused]   = useState(false);

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

  const toggleWishlist = (p: Product) =>
    isFavorite(p.id) ? removeFavorite(p.id) : addFavorite(p);

  const handleAddToCart = (item: Product) => { addToCart(item); bounce(); };

  const activeSortLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label ?? 'Relevance';

  // Filter → sort
  const filtered = sortProducts(
    allProducts.filter((p) => {
      const matchCat    = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSub    = activeSubTab === 'Deals' ? isOnSale(p) : true;
      return matchCat && matchSearch && matchSub;
    }),
    sortKey,
  );

  // ─── Product card ────────────────────────────────────────────────────────────

  const renderProduct = ({ item }: { item: Product }) => {
    const isWishlisted = isFavorite(item.id);
    const isSoldOut    = item.stock === 0;
    const showSale     = isOnSale(item) && !isSoldOut;
    const showNew      = isNewProduct(item) && !isSoldOut && !showSale;
    const discount     = getDiscountPercent(item);

    return (
      <View style={styles.productCard}>
        {/* Wishlist */}
        <Pressable style={styles.cardWishlistBtn} onPress={() => toggleWishlist(item)} hitSlop={10}>
          <Text style={[styles.cardWishlistIcon, isWishlisted && styles.cardWishlistIconActive]}>
            {isWishlisted ? '♥' : '♡'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
          onPress={() => stackNav.navigate('ProductDetail', { productId: item.id })}
        >
          <View style={styles.productImageWrap}>
            {item.images?.[0] ? (
              <Image source={{ uri: item.images[0] }} style={styles.productImage} resizeMode="cover" />
            ) : (
              <View style={styles.productImagePlaceholder}>
                <Text style={styles.productImageIcon}>👗</Text>
              </View>
            )}
            {isSoldOut && (
              <View style={styles.soldOutOverlay}>
                <Text style={styles.soldOutText}>SOLD OUT</Text>
              </View>
            )}
            {showSale && discount > 0 && (
              <View style={styles.discountTagBadge}>
                <Text style={styles.discountTagText}>-{discount}%</Text>
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
            <View style={styles.priceRow}>
              <Text style={styles.productPrice}>₱{item.price.toLocaleString()}</Text>
              {showSale && item.comparePrice != null && (
                <Text style={styles.comparePrice}>₱{item.comparePrice.toLocaleString()}</Text>
              )}
            </View>
            <View style={styles.productFooter}>
              {item.stock != null && item.stock > 0 && item.stock <= 20 && (
                <Text style={styles.soldLabel}>{item.stock} left</Text>
              )}
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

  // ─── Sort modal ──────────────────────────────────────────────────────────────

  const SortModal = () => (
    <Modal
      visible={sortOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setSortOpen(false)}
    >
      <Pressable style={styles.sortOverlay} onPress={() => setSortOpen(false)}>
        <View style={styles.sortSheet}>
          <View style={styles.sortHandle} />
          <Text style={styles.sortTitle}>Sort by</Text>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              style={[styles.sortRow, sortKey === opt.key && styles.sortRowActive]}
              onPress={() => { setSortKey(opt.key); setSortOpen(false); }}
            >
              <Text style={[styles.sortRowLabel, sortKey === opt.key && styles.sortRowLabelActive]}>
                {opt.label}
              </Text>
              {sortKey === opt.key && <View style={styles.sortCheck} />}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  // ─── List header (banner + categories + discount) ────────────────────────────

  const ListHeader = () => (
    <>
      {/* Banner */}
      <View style={styles.bannerWrap}>
        <View style={styles.bannerInner}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerStars}>
              {['⭐','⭐','⭐','⭐','⭐'].map((s, i) => (
                <Text key={i} style={styles.bannerStarText}>{s}</Text>
              ))}
              <Text style={styles.bannerStarLabel}>4.8+</Text>
            </View>
            <Text style={styles.bannerTitle}>
              HIGHLY{'\n'}REVIEWED{'\n'}PICKS
            </Text>
            <Pressable
              style={({ pressed }) => [styles.bannerCta, pressed && { opacity: 0.8 }]}
              onPress={() => stackNav.navigate('ProductList' as any)}
            >
              <Text style={styles.bannerCtaText}>Shop Now →</Text>
            </Pressable>
          </View>
          <View style={styles.bannerRight}>
            <View style={styles.bannerThumbWrap}>
              {filtered.slice(0, 2).map((p, i) => (
                <Pressable
                  key={p.id}
                  style={styles.bannerThumb}
                  onPress={() => stackNav.navigate('ProductDetail', { productId: p.id })}
                >
                  {p.images?.[0] ? (
                    <Image source={{ uri: p.images[0] }} style={styles.bannerThumbImg} resizeMode="cover" />
                  ) : (
                    <View style={styles.bannerThumbImgPlaceholder}>
                      <Text style={styles.bannerThumbPlaceholderText}>{i === 0 ? '👗' : '👒'}</Text>
                    </View>
                  )}
                  <View style={styles.bannerThumbPrice}>
                    <Text style={styles.bannerThumbPriceText}>₱{p.price.toLocaleString()}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.bannerDots}>
          {[0,1,2].map(i => (
            <View key={i} style={[styles.bannerDot, i === 0 && styles.bannerDotActive]} />
          ))}
        </View>
      </View>

      {/* Promo bar */}
      <View style={styles.promoBar}>
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeIcon}>🚚</Text>
          <View>
            <Text style={styles.promoBadgeMain}>Free Shipping</Text>
            <Text style={styles.promoBadgeSub}>On qualifying orders</Text>
          </View>
        </View>
        <View style={styles.promoDivider} />
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeIcon}>📋</Text>
          <View>
            <Text style={styles.promoBadgeMain}>Daily Check In</Text>
            <Text style={styles.promoBadgeSub}>To get points</Text>
          </View>
        </View>
      </View>

      {/* Category circles */}
      <View style={styles.catCirclesWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catCirclesContent}
        >
          {CAT_CIRCLES.map((cat) => (
            <Pressable
              key={cat.label}
              style={styles.catCircleItem}
              onPress={() => setActiveCategory(cat.label === activeCategory ? 'All' : cat.label)}
            >
              <View style={[styles.catCircle, activeCategory === cat.label && styles.catCircleActive]}>
                <Text style={styles.catCircleEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={[styles.catCircleLabel, activeCategory === cat.label && styles.catCircleLabelActive]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Discount draw banner */}
      <View style={styles.discountBanner}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgePercent}>99%</Text>
          <Text style={styles.discountBadgeOff}>OFF</Text>
        </View>
        <View>
          <Text style={styles.discountText}>DRAW YOUR EXCLUSIVE{'\n'}DISCOUNT</Text>
          <Text style={styles.discountPromoLabel}>Promotion</Text>
        </View>
        <Pressable style={styles.discountClaimBtn}>
          <Text style={styles.discountClaimText}>CLAIM NOW</Text>
        </Pressable>
      </View>

      {/* Super Deals section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Super<Text style={styles.sectionTitleAccent}> Deals</Text>
        </Text>
        <Pressable
          style={styles.seeAllBtn}
          onPress={() => stackNav.navigate('ProductList' as any)}
        >
          <Text style={styles.seeAll}>See all</Text>
          <Text style={styles.seeAllArrow}> ›</Text>
        </Pressable>
      </View>

      {/* Status + sort row */}
      <View style={styles.statusRow}>
        <Text style={styles.statusCount}>
          Showing <Text style={styles.statusCountBold}>{filtered.length} items</Text>
        </Text>
        <Pressable style={styles.sortBtn} onPress={() => setSortOpen(true)}>
          <Text style={styles.sortBtnIcon}>⊜</Text>
          <Text style={styles.sortBtnText}>{activeSortLabel}</Text>
          <Text style={styles.sortBtnChevron}> ⌄</Text>
        </Pressable>
      </View>
    </>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <SortModal />

      {/* ── Pink Header ──────────────────────────────────────────────────── */}
      <View style={styles.header}>

        {/* Top bar: icons + search + heart */}
        <View style={styles.topBar}>
          <View style={styles.topBarIcons}>
            <TouchableWithoutFeedback
              onPress={() => (navigation as any).navigate('BuyerNotifications')}
            >
              <View style={styles.topBarIcon}>
                <Text style={styles.topBarIconText}>✉️</Text>
                <View style={styles.notifDot} />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.topBarIcon}>
              <Text style={styles.topBarIconText}>📅</Text>
              <View style={styles.notifDot} />
            </View>
          </View>

          {/* Search */}
          <View style={[styles.searchWrap, searchFocused && { borderWidth: 1.5, borderColor: '#FF5C8D' }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products…"
              placeholderTextColor="#AAAACC"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Text style={styles.searchCamera}>📷</Text>
            <Pressable style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Search</Text>
            </Pressable>
          </View>

          {/* Wishlist / heart */}
          <Pressable style={styles.wishlistBtn}>
            <Text style={styles.wishlistBtnText}>🤍</Text>
          </Pressable>
        </View>

        {/* Primary nav tabs */}
        <View style={styles.navTabRow}>
          {PRIMARY_TABS.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.navTab, activeTab === tab && styles.navTabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.navTabText, activeTab === tab && styles.navTabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.navTabMore}>
            <Text style={styles.navTabMoreText}>☰</Text>
          </Pressable>
        </View>

        {/* Sub tabs: For You / New In / Deals / Bestsellers */}
        <View style={styles.subTabsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.subTabsRow as any}
          >
            {SUB_TABS.map(({ key, icon }) => (
              <Pressable
                key={key}
                style={[styles.subTab, activeSubTab === key && styles.subTabActive]}
                onPress={() => setActiveSubTab(key)}
              >
                <Text style={styles.subTabIcon}>{icon}</Text>
                <Text style={[styles.subTabText, activeSubTab === key && styles.subTabTextActive]}>
                  {key}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

      </View>

      {/* ── White body ──────────────────────────────────────────────────── */}
      <View style={styles.body}>
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
              colors={['#FF5C8D']}
              tintColor="#FF5C8D"
            />
          }
          ListHeaderComponent={<ListHeader />}
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
    </View>
  );
}