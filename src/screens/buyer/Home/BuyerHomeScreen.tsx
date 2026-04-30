// src/screens/buyer/Home/BuyerHomeScreen.tsx
import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl,
  TextInput, Image, Animated, Modal, ScrollView,
  NativeSyntheticEvent, NativeScrollEvent, Dimensions,
  TouchableOpacity, Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerHomeScreenProps, BuyerStackParamList } from '../../../props/props';
import { Product } from '../../../types';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { styles, C } from './BuyerHomeScreen.styles';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'name_asc';
type SubTab  = 'For You' | 'New In' | 'Bestsellers';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance',  label: 'Relevance'        },
  { key: 'price_asc',  label: 'Price: Low → High' },
  { key: 'price_desc', label: 'Price: High → Low' },
  { key: 'newest',     label: 'Newest first'      },
  { key: 'name_asc',   label: 'Name A → Z'        },
];

const SUB_TABS: SubTab[] = ['For You', 'New In', 'Bestsellers'];

const BANNER_SLIDES = [
  { id: 'slide-0', headline: 'HIGHLY\nREVIEWED\nPICKS', cta: 'Shop Now',   accent: '#FFFFFF', thumbOffset: 0 },
  { id: 'slide-1', headline: 'HIGH\nSALES\nPICKS',      cta: 'See Trends', accent: '#F5E642', thumbOffset: 1 },
  { id: 'slide-2', headline: 'BEST\nVALUE\nTODAY',      cta: 'Grab Deals', accent: '#42F5A2', thumbOffset: 2 },
];

// ─── Category Circles ─────────────────────────────────────────────────────────
// These values must match exactly what sellers set as `product.category`
// (i.e. the FASHION_CATEGORIES from AddProductScreen):
// 'Dress' | 'Tops' | 'Bottoms' | 'Footwear' | 'Outerwear' | 'Accessories' | 'Bags' | 'Activewear'
const CAT_CIRCLES = [
  { label: 'Dress',       emoji: '👗' },
  { label: 'Tops',        emoji: '👕' },
  { label: 'Bottoms',     emoji: '👖' },
  { label: 'Footwear',    emoji: '👟' },
  { label: 'Outerwear',   emoji: '🧥' },
  { label: 'Accessories', emoji: '💍' },
  { label: 'Bags',        emoji: '👜' },
  { label: 'Activewear',  emoji: '🩱' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function BellIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CartIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 6h18" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 10a4 4 0 0 1-8 0"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
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

function PlusIcon({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
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

// ─── Swipeable Banner ─────────────────────────────────────────────────────────

interface SwipeableBannerProps {
  products: Product[];
  onShopNow: () => void;
  onProductPress: (id: string) => void;
}

function SwipeableBanner({ products, onShopNow, onProductPress }: SwipeableBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const BANNER_W = SCREEN_W - 28;

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_W);
    setActiveIndex(Math.max(0, Math.min(idx, BANNER_SLIDES.length - 1)));
  };

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * BANNER_W, animated: true });
    setActiveIndex(idx);
  };

  return (
    <View style={styles.bannerContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={BANNER_W}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
      >
        {BANNER_SLIDES.map((slide) => {
          const product = products[slide.thumbOffset];
          return (
            <View key={slide.id} style={[styles.bannerSlide, { width: BANNER_W }]}>
              <View style={styles.bannerLeft}>
                <Text style={[styles.bannerHeadline, { color: slide.accent }]}>
                  {slide.headline}
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.bannerCta,
                    { backgroundColor: slide.accent },
                    pressed && { opacity: 0.82 },
                  ]}
                  onPress={onShopNow}
                >
                  <Text style={styles.bannerCtaText}>{slide.cta} →</Text>
                </Pressable>
              </View>
              <View style={styles.bannerRight}>
                {product ? (
                  <Pressable
                    style={({ pressed }) => [styles.bannerThumb, { opacity: pressed ? 0.88 : 1 }]}
                    onPress={() => onProductPress(product.id)}
                  >
                    {product.images?.[0] ? (
                      <Image
                        source={{ uri: product.images[0] }}
                        style={styles.bannerThumbImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.bannerThumbEmpty}>
                        <Text style={{ fontSize: 42 }}>👗</Text>
                      </View>
                    )}
                    <View style={styles.bannerPriceTag}>
                      <Text style={styles.bannerPriceTagText}>
                        ₱{product.price.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.bannerNameTag}>
                      <Text style={styles.bannerNameTagText} numberOfLines={1}>
                        {product.name}
                      </Text>
                    </View>
                  </Pressable>
                ) : (
                  <View style={[styles.bannerThumb, styles.bannerThumbEmpty]}>
                    <Text style={{ fontSize: 42 }}>👗</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.bannerDots}>
        {BANNER_SLIDES.map((_, i) => (
          <Pressable key={i} hitSlop={8} onPress={() => goTo(i)}>
            <View style={[styles.bannerDot, i === activeIndex && styles.bannerDotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  item: Product;
  onNavigate: (id: string) => void;
  onToggleWishlist: (item: Product) => void;
  onAddToCart: (item: Product) => void;
  isWishlisted: boolean;
}

function ProductCard({ item, onNavigate, onToggleWishlist, onAddToCart, isWishlisted }: ProductCardProps) {
  const isSoldOut  = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock <= 5;
  const showSale   = isOnSale(item) && !isSoldOut;
  const showNew    = isNewProduct(item) && !isSoldOut && !showSale;
  const discount   = getDiscountPercent(item);

  return (
    <View style={styles.productCard}>

      {/* Nav Pressable — NO overflow:hidden so it never clips siblings */}
      <Pressable
        onPress={() => onNavigate(item.id)}
        style={{ flex: 1, borderRadius: 10 }}
        android_ripple={{ color: 'rgba(0,0,0,0.04)', borderless: false }}
      >
        <View style={[
          styles.productImageWrap,
          { borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden' },
        ]}>
          {item.images?.[0] ? (
            <Image
              source={{ uri: item.images[0] }}
              style={styles.productImage}
              resizeMode="cover"
            />
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
          <View style={[styles.productFooter, { minHeight: 18 }]}>
            {isLowStock ? (
              <Text style={[styles.soldLabel, { color: '#F59E0B' }]}>Only {item.stock} left</Text>
            ) : (
              item.stock > 0 && item.stock <= 20 && (
                <Text style={styles.soldLabel}>{item.stock} left</Text>
              )
            )}
          </View>
        </View>
      </Pressable>

      {/* Heart button — absolute sibling AFTER nav Pressable */}
      <TouchableOpacity
        onPress={() => onToggleWishlist(item)}
        activeOpacity={0.75}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 20,
          elevation: 20,
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: 'rgba(255,255,255,0.95)',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 3,
        }}
      >
        <HeartIcon
          size={15}
          filled={isWishlisted}
          color={isWishlisted ? '#E63946' : '#9B95A5'}
        />
      </TouchableOpacity>

      {/* Add to cart button */}
      <TouchableOpacity
        onPress={() => !isSoldOut && onAddToCart(item)}
        disabled={isSoldOut}
        activeOpacity={0.8}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 20,
          elevation: 20,
          width: 30,
          height: 30,
          borderRadius: 8,
          backgroundColor: isSoldOut ? '#D1D5DB' : '#2D2B55',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isSoldOut ? 0.5 : 1,
          shadowColor: '#2D2B55',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.28,
          shadowRadius: 5,
        }}
      >
        <PlusIcon size={16} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BuyerHomeScreen({ navigation }: BuyerHomeScreenProps) {
  const { user }                                           = useAuth();
  const { addToCart, itemCount }                           = useCart();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const stackNav = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();

  const [allProducts, setAllProducts]       = useState<Product[]>([]);
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubTab, setActiveSubTab]     = useState<SubTab>('For You');
  const [sortKey, setSortKey]               = useState<SortKey>('relevance');
  const [sortOpen, setSortOpen]             = useState(false);
  const [refreshing, setRefreshing]         = useState(false);
  const [searchFocused, setSearchFocused]   = useState(false);

  const searchInputRef = useRef<TextInput>(null);
  const listRef        = useRef<FlatList<Product>>(null);
  const gridOffset     = useRef<number>(0);
  const cartScale      = useRef(new Animated.Value(1)).current;

  // Derive a stable Set of favorited IDs from the favorites array
  const favoriteIds = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites],
  );

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

  const toggleWishlist = useCallback((p: Product) => {
    isFavorite(p.id) ? removeFavorite(p.id) : addFavorite(p);
  }, [isFavorite, removeFavorite, addFavorite]);

  const handleAddToCart = useCallback((item: Product) => {
    addToCart(item);
    bounce();
  }, [addToCart]);

  const scrollToGrid = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: gridOffset.current, animated: true });
  }, []);

  const activeSortLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label ?? 'Relevance';

  const avatarInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? '?';

  const filtered = sortProducts(
    allProducts.filter((p) => {
      // Case-insensitive match against product.category
      const matchCat    = activeCategory === 'All'
        || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = !searchQuery.trim()
        || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSub    = activeSubTab === 'New In' ? isNewProduct(p) : true;
      return matchCat && matchSearch && matchSub;
    }),
    sortKey,
  );

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <ProductCard
      item={item}
      isWishlisted={favoriteIds.has(item.id)}
      onNavigate={(id) => stackNav.navigate('ProductDetail', { productId: id })}
      onToggleWishlist={toggleWishlist}
      onAddToCart={handleAddToCart}
    />
  ), [favoriteIds, toggleWishlist, handleAddToCart, stackNav]);

  // ─── Sort modal ───────────────────────────────────────────────────────────

  const SortModal = () => (
    <Modal visible={sortOpen} transparent animationType="slide" onRequestClose={() => setSortOpen(false)}>
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
      <SwipeableBanner
        products={filtered}
        onShopNow={scrollToGrid}
        onProductPress={(id) => stackNav.navigate('ProductDetail', { productId: id })}
      />

      {/* Category circles — now maps directly to FASHION_CATEGORIES */}
      <View style={styles.catCirclesWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catCirclesContent}
        >
          {/* "All" pill first */}
          <Pressable
            style={styles.catCircleItem}
            onPress={() => setActiveCategory('All')}
          >
            <View style={[styles.catCircle, activeCategory === 'All' && styles.catCircleActive]}>
              <Text style={styles.catCircleEmoji}>🛍️</Text>
            </View>
            <Text style={[styles.catCircleLabel, activeCategory === 'All' && styles.catCircleLabelActive]}>
              All
            </Text>
          </Pressable>

          {CAT_CIRCLES.map((cat) => (
            <Pressable
              key={cat.label}
              style={styles.catCircleItem}
              onPress={() =>
                setActiveCategory(activeCategory === cat.label ? 'All' : cat.label)
              }
            >
              <View style={[
                styles.catCircle,
                activeCategory === cat.label && styles.catCircleActive,
              ]}>
                <Text style={styles.catCircleEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={[
                styles.catCircleLabel,
                activeCategory === cat.label && styles.catCircleLabelActive,
              ]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View
        style={styles.sectionHeader}
        onLayout={(e) => { gridOffset.current = e.nativeEvent.layout.y; }}
      >
        <Text style={styles.sectionTitle}>
          Super<Text style={styles.sectionTitleAccent}> Deals</Text>
        </Text>
        <Pressable
          style={styles.seeAllBtn}
          onPress={() => stackNav.navigate('ProductList' as any)}
        />
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusCount}>
          Showing <Text style={styles.statusCountBold}>{filtered.length} items</Text>
          {activeCategory !== 'All' && (
            <Text style={styles.statusCountBold}> in {activeCategory}</Text>
          )}
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

      <View style={styles.header}>
        <View style={styles.topBar}>
          <Pressable
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Profile' as any)}
          >
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatarBtnImg} />
            ) : (
              <Text style={styles.avatarFallbackText}>{avatarInitial}</Text>
            )}
          </Pressable>

          <TouchableOpacity
            activeOpacity={1}
            style={[styles.searchWrap, searchFocused && styles.searchWrapFocused]}
            onPress={() => searchInputRef.current?.focus()}
          >
            <SearchIcon size={14} color={C.placeholder} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search products…"
              placeholderTextColor={C.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={styles.searchBtn}
              onPressIn={() => searchInputRef.current?.focus()}
              activeOpacity={0.75}
            >
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.topBarRightIcons}>
            <Pressable
              style={styles.iconPill}
              onPress={() => (navigation as any).navigate('BuyerNotifications')}
            >
              <BellIcon size={18} color={C.white} />
              <View style={styles.notifDot} />
            </Pressable>
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

        <View style={styles.subTabsWrap}>
          <View style={styles.subTabsRow}>
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
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <FlatList
          ref={listRef}
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
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
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : activeCategory !== 'All'
                    ? `No items in ${activeCategory} yet`
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