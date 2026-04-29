// src/screens/buyer/Home/BuyerHomeScreen.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl,
  TextInput, Image, Animated, TouchableWithoutFeedback, Modal, ScrollView,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerHomeScreenProps, BuyerStackParamList } from '../../../props/props';
import { Product } from '../../../types';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { styles, C } from './BuyerHomeScreen.styles';

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
const SUB_TABS: SubTab[] = ['For You', 'New In', 'Deals', 'Bestsellers'];

const CAT_CIRCLES = [
  { label: 'Women',   emoji: '👗' },
  { label: 'Curve',   emoji: '🌸' },
  { label: 'Kids',    emoji: '🧒' },
  { label: 'Men',     emoji: '👔' },
  { label: 'Sports',  emoji: '🏃' },
  { label: 'Jewelry', emoji: '💎' },
  { label: 'Tops',    emoji: '👕' },
  { label: 'Baby',    emoji: '🍼' },
  { label: 'Beach',   emoji: '👙' },
  { label: 'Shoes',   emoji: '👠' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function BellIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function CartIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path d="M3 6h18" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M16 10a4 4 0 0 1-8 0"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function SearchIcon({ size = 14, color = '#B8B4C0' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
      <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function HeartIcon({ size = 14, filled = false, color = '#9B95A5' }: { size?: number; filled?: boolean; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

function GridMenuIcon({ size = 18, color = 'rgba(255,255,255,0.5)' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={1.8} />
      <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={1.8} />
      <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={1.8} />
      <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function SortIcon({ size = 12, color = '#5C5767' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M7 12h10M11 18h2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon({ size = 11, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronDownIcon({ size = 11, color = '#9B95A5' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ size = 12, color = '#2D2B55' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlusIcon({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function StarIcon({ size = 11, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={color}
      />
    </Svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isNewProduct = (p: Product): boolean =>
  new Date(p.createdAt).getTime() >= Date.now() - 14 * 24 * 60 * 60 * 1000;

const isOnSale = (p: Product): boolean =>
  p.comparePrice != null && p.comparePrice > p.price;

const getDiscountPercent = (p: Product): number => {
  if (!p.comparePrice || p.comparePrice <= p.price) return 0;
  return Math.round((1 - p.price / p.comparePrice) * 100);
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
      Animated.timing(cartScale, { toValue: 1.35, duration: 110, useNativeDriver: true }),
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

  const avatarInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? '?';

  const filtered = sortProducts(
    allProducts.filter((p) => {
      const matchCat    = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSub    = activeSubTab === 'Deals' ? isOnSale(p) : true;
      return matchCat && matchSearch && matchSub;
    }),
    sortKey,
  );

  // ─── Product card ──────────────────────────────────────────────────────────

  const renderProduct = ({ item }: { item: Product }) => {
    const isWishlisted = isFavorite(item.id);
    const isSoldOut    = item.stock === 0;
    const isLowStock   = item.stock > 0 && item.stock <= 5;
    const showSale     = isOnSale(item) && !isSoldOut;
    const showNew      = isNewProduct(item) && !isSoldOut && !showSale;
    const discount     = getDiscountPercent(item);

    return (
      <View style={styles.productCard}>
        <Pressable style={styles.cardWishlistBtn} onPress={() => toggleWishlist(item)} hitSlop={10}>
          <HeartIcon size={13} filled={isWishlisted} color={isWishlisted ? C.ink : C.textMuted} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.93 : 1 }]}
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
                <Text style={styles.soldOutText}>Sold Out</Text>
              </View>
            )}
            {showSale && discount > 0 && (
              <View style={styles.discountTagBadge}>
                <Text style={styles.discountTagText}>-{discount}%</Text>
              </View>
            )}
            {showNew && (
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>New</Text>
              </View>
            )}
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.productPrice}>₱{item.price.toLocaleString()}</Text>
              {showSale && item.comparePrice != null && (
                <>
                  <Text style={styles.comparePrice}>₱{item.comparePrice.toLocaleString()}</Text>
                  <Text style={styles.discountPercent}>-{discount}%</Text>
                </>
              )}
            </View>
            <View style={styles.productFooter}>
              {isLowStock ? (
                <Text style={[styles.soldLabel, { color: '#F59E0B' }]}>
                  Only {item.stock} left
                </Text>
              ) : (
                item.stock > 0 && item.stock <= 20 && (
                  <Text style={styles.soldLabel}>{item.stock} left</Text>
                )
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.addBtn,
                  pressed && !isSoldOut && styles.addBtnPressed,
                  isSoldOut && { backgroundColor: '#D1D5DB', opacity: 0.5 },
                ]}
                onPress={() => !isSoldOut && handleAddToCart(item)}
                disabled={isSoldOut}
                hitSlop={4}
              >
                <PlusIcon size={16} color="#fff" />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  // ─── Sort modal ───────────────────────────────────────────────────────────

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
              {sortKey === opt.key && (
                <View style={styles.sortCheck}>
                  <CheckIcon size={11} color="#fff" />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  // ─── List header ──────────────────────────────────────────────────────────

  const ListHeader = () => (
    <>
      {/* Banner */}
      <View style={styles.bannerWrap}>
        <View style={styles.bannerInner}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerStars}>
              {[0,1,2,3,4].map((i) => (
                <StarIcon key={i} size={11} color={C.white} />
              ))}
              <Text style={styles.bannerStarLabel}>4.8+</Text>
            </View>
            <Text style={styles.bannerTitle}>
              HIGHLY{'\n'}REVIEWED{'\n'}PICKS
            </Text>
            <Pressable
              style={({ pressed }) => [styles.bannerCta, pressed && { opacity: 0.85 }]}
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

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Super<Text style={styles.sectionTitleAccent}> Deals</Text>
        </Text>
        <Pressable
          style={styles.seeAllBtn}
          onPress={() => stackNav.navigate('ProductList' as any)}
        >
          <Text style={styles.seeAll}>See all</Text>
          <ChevronRightIcon size={12} color={C.violet} />
        </Pressable>
      </View>

      {/* Status + sort row */}
      <View style={styles.statusRow}>
        <Text style={styles.statusCount}>
          Showing <Text style={styles.statusCountBold}>{filtered.length} items</Text>
        </Text>
        <Pressable style={styles.sortBtn} onPress={() => setSortOpen(true)}>
          <SortIcon size={12} color={C.textSecond} />
          <Text style={styles.sortBtnText}>{activeSortLabel}</Text>
          <ChevronDownIcon size={11} color={C.textMuted} />
        </Pressable>
      </View>
    </>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <SortModal />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <View style={styles.header}>

        {/* Top bar */}
        <View style={styles.topBar}>
          {/* Avatar */}
          <Pressable
            style={styles.avatarBtn}
            onPress={() => (navigation as any).navigate('BuyerProfile')}
          >
            <Text style={styles.avatarFallbackText}>{avatarInitial}</Text>
          </Pressable>

          {/* Search */}
          <View style={[styles.searchWrap, searchFocused && styles.searchWrapFocused]}>
            <SearchIcon size={14} color={C.placeholder} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products…"
              placeholderTextColor={C.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Pressable style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Search</Text>
            </Pressable>
          </View>

          {/* Notification + Cart */}
          <View style={styles.topBarRightIcons}>
            {/* Bell */}
            <Pressable
              style={styles.iconPill}
              onPress={() => (navigation as any).navigate('BuyerNotifications')}
            >
              <BellIcon size={18} color={C.white} />
              <View style={styles.notifDot} />
            </Pressable>

            {/* Cart */}
            <Pressable
              style={styles.iconPill}
              onPress={() => (navigation as any).navigate('Cart')}
            >
              <Animated.View style={{ transform: [{ scale: cartScale }] }}>
                <CartIcon size={18} color={C.white} />
              </Animated.View>
              {itemCount > 0 && (
                <View style={styles.cartCount}>
                  <Text style={styles.cartCountText}>{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
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
            <GridMenuIcon size={16} color="rgba(255,255,255,0.45)" />
          </Pressable>
        </View>

        {/* Sub tabs — no icons */}
        <View style={styles.subTabsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.subTabsRow as any}
          >
            {SUB_TABS.map((key) => (
              <Pressable
                key={key}
                style={[styles.subTab, activeSubTab === key && styles.subTabActive]}
                onPress={() => setActiveSubTab(key)}
              >
                <Text style={[styles.subTabText, activeSubTab === key && styles.subTabTextActive]}>
                  {key}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* ── White body ───────────────────────────────────────────────────── */}
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
              colors={[C.ink]}
              tintColor={C.ink}
            />
          }
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize: 38 }}>👗</Text>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Check back for new arrivals'}
              </Text>
            </View>
          }
          renderItem={renderProduct}
        />
      </View>
    </View>
  );
}