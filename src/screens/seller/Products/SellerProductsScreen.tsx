// src/screens/seller/Products/SellerProductsScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, RefreshControl, Alert, Image,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerProductsScreenProps, SellerStackParamList } from '../../../props/props';
import { Product } from '../../../types';
import { getMyProducts, archiveProduct, updateProduct } from '../../../services/productService';
import { useAuth } from '../../../context/AuthContext';
import { COLORS } from '../../../theme';
import { styles } from './SellerProductsScreen.styles';

export default function SellerProductsScreen({ navigation }: SellerProductsScreenProps) {
  const { user } = useAuth();
  const stackNav = useNavigation<NativeStackNavigationProp<SellerStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!user?.id) return;
    setProducts(await getMyProducts(user.id));
  }, [user?.id]);

  useFocusEffect(useCallback(() => { fetchProducts(); }, [fetchProducts]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true); await fetchProducts(); setRefreshing(false);
  }, [fetchProducts]);

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
            } catch (e: any) { Alert.alert('Error', e.message); }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable
      style={({ pressed }) => [styles.productCard, pressed && styles.productCardPressed]}
      onPress={() => stackNav.navigate('AddProduct', { productId: item.id })}
    >
      <View style={styles.imageWrap}>
        {item.images?.[0]
          ? <Image source={{ uri: item.images[0] }} style={styles.imageActual} resizeMode="cover" />
          : <View style={styles.imagePlaceholder}><Text style={styles.imagePlaceholderText}>◻</Text></View>
        }
      </View>
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>₱{item.price.toLocaleString()}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.stockText}>Stock: {item.stock}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          {item.isArchived && (
            <View style={styles.archivedBadge}>
              <Text style={styles.archivedText}>ARCHIVED</Text>
            </View>
          )}
        </View>
        {item.colors && item.colors.length > 0 && (
          <View style={styles.colorRow}>
            {item.colors.slice(0, 5).map((c) => (
              <View key={c} style={[styles.colorPreview, { backgroundColor: c }]} />
            ))}
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={() => stackNav.navigate('AddProduct', { productId: item.id })}>
          <Text style={styles.actionBtnText}>✎</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => handleArchiveToggle(item)}>
          <Text style={styles.actionBtnText}>{item.isArchived ? '↩' : '⊗'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Products ({products.length})</Text>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          onPress={() => stackNav.navigate('AddProduct', {})}
        >
          <Text style={styles.addBtnText}>+ Add Product</Text>
        </Pressable>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.secondary]} tintColor={COLORS.secondary} />
        }
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>◻</Text>
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptyText}>Tap "+ Add Product" to create your first listing</Text>
          </View>
        }
      />
    </View>
  );
}
