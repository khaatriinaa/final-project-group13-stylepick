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
import { FASHION_CATEGORIES } from '../../../theme';
import { styles } from './BuyerHomeScreen.styles';

export default function BuyerHomeScreen({ navigation }: BuyerHomeScreenProps) {
  const { user } = useAuth();
  const { addToCart, itemCount } = useCart();
  const stackNav = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const cartScale = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.timing(cartScale, { toValue: 1.5, duration: 140, useNativeDriver: true }),
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

  const filtered = allProducts.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable
      style={({ pressed }) => [styles.productCard, pressed && styles.productCardPressed]}
      onPress={() => stackNav.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.productImageWrap}>
        {item.images?.[0]
          ? <Image source={{ uri: item.images[0] }} style={styles.productImage} resizeMode="cover" />
          : <View style={styles.productImagePlaceholder}><Text style={styles.productImageIcon}>👕</Text></View>
        }
        {item.stock === 0 && (
          <View style={styles.soldOutOverlay}><Text style={styles.soldOutText}>SOLD OUT</Text></View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>₱{item.price.toLocaleString()}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.hiText}>Hello,</Text>
            <Text style={styles.nameText}>{user?.name?.split(' ')[0] ?? 'Shopper'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableWithoutFeedback onPress={() => (navigation as any).navigate('BuyerNotifications')}>
              <View style={styles.iconBtn}><Text style={{ fontSize: 16 }}>🔔</Text></View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => (navigation as any).navigate('Cart')}>
              <View style={styles.cartBadgeWrap}>
                <Animated.View style={[styles.iconBtn, { transform: [{ scale: cartScale }] }]}>
                  <Text style={{ fontSize: 16 }}>🛒</Text>
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
          <Text style={{ fontSize: 14, color: '#9CA3AF' }}>⌕</Text>
          <TextInput
            style={styles.searchInput} placeholder="Search products, brands..."
            placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={{ fontSize: 14, color: '#9CA3AF' }}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={FASHION_CATEGORIES}
        horizontal showsHorizontalScrollIndicator={false}
        keyExtractor={(c) => c}
        style={{ backgroundColor: '#FFF', maxHeight: 50 }}
        contentContainerStyle={styles.catContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.catChip, activeCategory === item && styles.catChipActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.catChipText, activeCategory === item && styles.catChipTextActive]}>{item}</Text>
          </Pressable>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#E63946']} tintColor="#E63946" />
        }
        ListHeaderComponent={
          <>
            <View style={[styles.banner]}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTag}>LIMITED OFFER</Text>
                <Text style={styles.bannerTitle}>New Arrivals{'\n'}This Week</Text>
                <Text style={styles.bannerSub}>Exclusive fashion picks</Text>
              </View>
              <Text style={{ fontSize: 48 }}>👗</Text>
            </View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>
                {activeCategory === 'All' ? 'All Products' : activeCategory}
              </Text>
              <Text style={styles.sectionCount}>{filtered.length} items</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 40 }}>👗</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? `No results for "${searchQuery}"` : 'Check back for new arrivals'}
            </Text>
          </View>
        }
        renderItem={renderProduct}
      />
    </View>
  );
}
