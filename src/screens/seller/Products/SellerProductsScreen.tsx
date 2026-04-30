// src/screens/seller/Products/SellerProductsScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl,
  Alert, Image, TextInput, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerProductsScreenProps, SellerStackParamList } from '../../../props/props';
import { Product } from '../../../types';
import { getMyProducts, archiveProduct, updateProduct } from '../../../services/productService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './SellerProductsScreen.styles';

type StatusFilter = 'All' | 'Active' | 'Archived';
type ViewMode = 'list' | 'grid';

export default function SellerProductsScreen({ navigation }: SellerProductsScreenProps) {
  const { user } = useAuth();
  const stackNav = useNavigation<NativeStackNavigationProp<SellerStackParamList>>();

  const [products, setProducts]                     = useState<Product[]>([]);
  const [refreshing, setRefreshing]                 = useState(false);
  const [search, setSearch]                         = useState('');
  const [statusFilter, setStatusFilter]             = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter]         = useState<string>('All');
  const [showStatusPicker, setShowStatusPicker]     = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [viewMode, setViewMode]                     = useState<ViewMode>('list');
  const [toast, setToast]                           = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user?.id) return;
    setProducts(await getMyProducts(user.id));
  }, [user?.id]);

  useFocusEffect(useCallback(() => { fetchProducts(); }, [fetchProducts]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleArchiveToggle = (product: Product) => {
    const action = product.isArchived ? 'Restore' : 'Archive';
    Alert.alert(
      `${action} Product`,
      `Are you sure you want to ${action.toLowerCase()} "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          style: product.isArchived ? 'default' : 'destructive',
          onPress: async () => {
            try {
              if (product.isArchived) await updateProduct(product.id, { isArchived: false });
              else await archiveProduct(product.id);
              await fetchProducts();
              showToast(product.isArchived ? 'Product restored' : 'Product archived');
            } catch (e: any) { Alert.alert('Error', e.message); }
          },
        },
      ]
    );
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filtered = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus   =
      statusFilter === 'All'    ? true :
      statusFilter === 'Active' ? !p.isArchived :
      p.isArchived;
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const closeDropdowns = () => {
    setShowStatusPicker(false);
    setShowCategoryPicker(false);
  };

  // ── List (row) card ───────────────────────────────────────────────────────
  const renderListProduct = ({ item }: { item: Product }) => (
    <Pressable
      style={({ pressed }) => [styles.productCard, pressed && styles.productCardPressed]}
      onPress={() => { closeDropdowns(); stackNav.navigate('AddProduct', { productId: item.id }); }}
    >
      <View style={styles.imageWrap}>
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.imageActual} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📦</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={[styles.statusBadge, item.isArchived ? styles.statusBadgeArchived : styles.statusBadgeActive]}>
          <View style={[styles.statusDot, item.isArchived ? styles.statusDotArchived : styles.statusDotActive]} />
          <Text style={[styles.statusBadgeText, item.isArchived ? styles.statusBadgeTextArchived : styles.statusBadgeTextActive]}>
            {item.isArchived ? 'Archived' : 'Active'}
          </Text>
        </View>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₱{item.price.toLocaleString()}</Text>
          {item.colors && item.colors.length > 0 && (
            <>
              <Text style={styles.dotSeparator}>·</Text>
              <View style={[styles.colorDot, { backgroundColor: item.colors[0] }]} />
              <Text style={styles.colorLabel}>{item.colors[0]}</Text>
            </>
          )}
          <Text style={styles.dotSeparator}>·</Text>
          <Text style={styles.stockText}>{item.stock} stocks</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
          onPress={(e) => {
            e.stopPropagation();
            closeDropdowns();
            stackNav.navigate('AddProduct', { productId: item.id });
          }}
        >
          <Text style={styles.actionBtnText}>✎</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
          onPress={(e) => {
            e.stopPropagation();
            closeDropdowns();
            handleArchiveToggle(item);
          }}
        >
          <Text style={styles.actionBtnText}>{item.isArchived ? '↩' : '⊗'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  // ── Grid (square) card ────────────────────────────────────────────────────
  const renderGridProduct = ({ item }: { item: Product }) => (
    <Pressable
      style={({ pressed }) => [styles.gridCard, pressed && styles.gridCardPressed]}
      onPress={() => { closeDropdowns(); stackNav.navigate('AddProduct', { productId: item.id }); }}
    >
      <View style={styles.gridImageWrap}>
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.gridImageActual} resizeMode="cover" />
        ) : (
          <View style={styles.gridImagePlaceholder}>
            <Text style={styles.gridImagePlaceholderText}>📦</Text>
          </View>
        )}
      </View>

      <View style={styles.gridInfo}>
        <View style={[styles.statusBadge, item.isArchived ? styles.statusBadgeArchived : styles.statusBadgeActive]}>
          <View style={[styles.statusDot, item.isArchived ? styles.statusDotArchived : styles.statusDotActive]} />
          <Text style={[styles.statusBadgeText, item.isArchived ? styles.statusBadgeTextArchived : styles.statusBadgeTextActive]}>
            {item.isArchived ? 'Archived' : 'Active'}
          </Text>
        </View>
        <Text style={styles.gridProductName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.gridProductPrice}>₱{item.price.toLocaleString()}</Text>
        <Text style={styles.gridStockText}>{item.stock} stocks</Text>
      </View>

      <View style={styles.gridActions}>
        <Pressable
          style={({ pressed }) => [styles.gridActionBtn, pressed && { opacity: 0.7 }]}
          onPress={(e) => {
            e.stopPropagation();
            closeDropdowns();
            stackNav.navigate('AddProduct', { productId: item.id });
          }}
        >
          <Text style={styles.gridActionBtnText}>✎</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.gridActionBtn, pressed && { opacity: 0.7 }]}
          onPress={(e) => {
            e.stopPropagation();
            closeDropdowns();
            handleArchiveToggle(item);
          }}
        >
          <Text style={styles.gridActionBtnText}>{item.isArchived ? '↩' : '⊗'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  const emptyComponent = (
    <View style={styles.emptyWrap}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
        <Text style={styles.emptyIcon}>📦</Text>
      </View>
      <Text style={styles.emptyTitle}>No products yet</Text>
      <Text style={styles.emptyText}>Tap "+" in the tab bar to add a listing</Text>
    </View>
  );

  return (
    <Pressable style={styles.container} onPress={closeDropdowns}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <Pressable
          style={styles.iconBtn}
          onPress={() => { closeDropdowns(); stackNav.navigate('SellerNotifications'); }}
        >
          <Ionicons name="notifications-outline" size={20} color="#374151" />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      {/* Search row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            onFocus={closeDropdowns}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Text style={{ fontSize: 14, color: '#9CA3AF' }}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Grid view button — active when viewMode is 'grid' */}
        <Pressable
          style={[styles.iconSquare, viewMode === 'grid' && styles.iconSquareActive]}
          onPress={() => { closeDropdowns(); setViewMode('grid'); }}
        >
          <Text style={[styles.iconSquareText, viewMode === 'grid' && { color: '#FFFFFF' }]}>⊞</Text>
        </Pressable>

        {/* List view button — active when viewMode is 'list' */}
        <Pressable
          style={[styles.iconSquare, viewMode === 'list' && styles.iconSquareActive]}
          onPress={() => { closeDropdowns(); setViewMode('list'); }}
        >
          <Text style={[styles.iconSquareText, viewMode === 'list' && { color: '#FFFFFF' }]}>☰</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, showStatusPicker && styles.filterChipActive]}
          onPress={() => { setShowStatusPicker(v => !v); setShowCategoryPicker(false); }}
        >
          <Text style={[styles.filterChipText, showStatusPicker && { color: '#FFFFFF' }]}>
            Status{statusFilter !== 'All' ? ` · ${statusFilter}` : ''}
          </Text>
          <Text style={[styles.filterChipCaret, showStatusPicker && { color: '#FFFFFF' }]}>
            {showStatusPicker ? '▴' : '▾'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, showCategoryPicker && styles.filterChipActive]}
          onPress={() => { setShowCategoryPicker(v => !v); setShowStatusPicker(false); }}
        >
          <Text style={[styles.filterChipText, showCategoryPicker && { color: '#FFFFFF' }]}>
            Category{categoryFilter !== 'All' ? ` · ${categoryFilter}` : ''}
          </Text>
          <Text style={[styles.filterChipCaret, showCategoryPicker && { color: '#FFFFFF' }]}>
            {showCategoryPicker ? '▴' : '▾'}
          </Text>
        </Pressable>

        {(statusFilter !== 'All' || categoryFilter !== 'All') && (
          <Pressable
            style={styles.clearChip}
            onPress={() => { setStatusFilter('All'); setCategoryFilter('All'); }}
          >
            <Text style={styles.clearChipText}>Clear ✕</Text>
          </Pressable>
        )}
      </View>

      {/* Dropdowns — rendered at root level so they float above all content */}
      {showStatusPicker && (
        <View style={styles.dropdownWrapper} pointerEvents="box-none">
          <View style={styles.dropdown}>
            {(['All', 'Active', 'Archived'] as StatusFilter[]).map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.dropdownItem, statusFilter === s && styles.dropdownItemActive]}
                onPress={() => { setStatusFilter(s); setShowStatusPicker(false); }}
              >
                <Text style={[styles.dropdownItemText, statusFilter === s && styles.dropdownItemTextActive]}>
                  {s}
                </Text>
                {statusFilter === s && <Text style={{ color: '#111827', fontSize: 12 }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showCategoryPicker && (
        <View style={styles.dropdownWrapperCategory} pointerEvents="box-none">
          <View style={styles.dropdown}>
            {categories.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.dropdownItem, categoryFilter === c && styles.dropdownItemActive]}
                onPress={() => { setCategoryFilter(c); setShowCategoryPicker(false); }}
              >
                <Text style={[styles.dropdownItemText, categoryFilter === c && styles.dropdownItemTextActive]}>
                  {c}
                </Text>
                {categoryFilter === c && <Text style={{ color: '#111827', fontSize: 12 }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Product list — switches between list and grid */}
      {viewMode === 'list' ? (
        <FlatList
          key="list"
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, filtered.length === 0 && { flexGrow: 1 }]}
          style={{ flex: 1 }}
          onScrollBeginDrag={closeDropdowns}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#111827" />
          }
          renderItem={renderListProduct}
          ListEmptyComponent={emptyComponent}
        />
      ) : (
        <FlatList
          key="grid"
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[styles.gridList, filtered.length === 0 && { flexGrow: 1 }]}
          columnWrapperStyle={styles.gridColumnWrapper}
          style={{ flex: 1 }}
          onScrollBeginDrag={closeDropdowns}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#111827" />
          }
          renderItem={renderGridProduct}
          ListEmptyComponent={emptyComponent}
        />
      )}

      {/* Toast */}
      {toast && (
        <View style={styles.toast}>
          <View style={styles.toastCheckWrap}>
            <Text style={styles.toastCheck}>✓</Text>
          </View>
          <Text style={styles.toastText}>{toast}</Text>
          <Pressable onPress={() => setToast(null)}>
            <Text style={styles.toastClose}>✕</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}