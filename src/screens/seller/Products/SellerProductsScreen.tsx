// src/screens/seller/Products/SellerProductsScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl,
  Alert, Image, TextInput, TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerProductsScreenProps, SellerStackParamList } from '../../../props/props';
import { Product } from '../../../types';
import { getMyProducts, archiveProduct, updateProduct } from '../../../services/productService';
import { useAuth } from '../../../context/AuthContext';
import { COLORS } from '../../../theme';
import { styles } from './SellerProductsScreen.styles';

type StatusFilter = 'All' | 'Active' | 'Archived';

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

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable
      style={({ pressed }) => [styles.productCard, pressed && styles.productCardPressed]}
      onPress={() => stackNav.navigate('AddProduct', { productId: item.id })}
    >
      {/* Thumbnail */}
      <View style={styles.imageWrap}>
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.imageActual} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📦</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        {/* Status badge */}
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

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
          onPress={() => stackNav.navigate('AddProduct', { productId: item.id })}
        >
          <Text style={styles.actionBtnText}>✎</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
          onPress={() => handleArchiveToggle(item)}
        >
          <Text style={styles.actionBtnText}>{item.isArchived ? '↩' : '⊗'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => stackNav.navigate('SellerNotifications')}
          >
            <Text style={styles.iconBtnText}>🔔</Text>
          </Pressable>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.slice(0, 3).toUpperCase() ?? 'ME'}
            </Text>
          </View>
        </View>
      </View>

      {/* Search row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#AAAAAA"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Pressable style={styles.iconSquare}>
          <Text style={styles.iconSquareText}>⧉</Text>
        </Pressable>
        <Pressable style={styles.iconSquare}>
          <Text style={styles.iconSquareText}>⊞</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, showStatusPicker && styles.filterChipActive]}
          onPress={() => { setShowStatusPicker(v => !v); setShowCategoryPicker(false); }}
        >
          <Text style={styles.filterChipText}>
            Status{statusFilter !== 'All' ? ` · ${statusFilter}` : ''}
          </Text>
          <Text style={styles.filterChipCaret}>▾</Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, showCategoryPicker && styles.filterChipActive]}
          onPress={() => { setShowCategoryPicker(v => !v); setShowStatusPicker(false); }}
        >
          <Text style={styles.filterChipText}>
            Category{categoryFilter !== 'All' ? ` · ${categoryFilter}` : ''}
          </Text>
          <Text style={styles.filterChipCaret}>▾</Text>
        </Pressable>
      </View>

      {/* Dropdowns */}
      {showStatusPicker && (
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
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showCategoryPicker && (
        <View style={[styles.dropdown, { left: 130 }]}>
          {categories.map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.dropdownItem, categoryFilter === c && styles.dropdownItemActive]}
              onPress={() => { setCategoryFilter(c); setShowCategoryPicker(false); }}
            >
              <Text style={[styles.dropdownItemText, categoryFilter === c && styles.dropdownItemTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Product list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#F97316']}
            tintColor="#F97316"
          />
        }
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptyText}>Tap "+" in the tab bar to add a listing</Text>
          </View>
        }
      />

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
    </View>
  );
}