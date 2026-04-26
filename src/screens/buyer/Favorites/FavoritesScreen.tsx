// src/screens/buyer/Favorites/FavoritesScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, FlatList, Pressable, Image,
  Alert, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerStackParamList } from '../../../props/props';
import { useFavorites } from '../../../context/FavoritesContext'; // wire up your own context
import { useCart } from '../../../context/CartContext';
import { styles } from './FavoritesScreen.styles';
import { Product } from '../../../types';

export default function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleRemove = (product: Product) => {
    Alert.alert('Remove Favorite', `Remove "${product.name}" from favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(product.id) },
    ]);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    Alert.alert('Added to Cart', `"${product.name}" has been added to your cart.`);
  };

  const handleClearAll = () => {
    Alert.alert('Clear Favorites', 'Remove all items from your favorites?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearFavorites },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      {/* Image */}
      <Pressable onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} style={styles.imageWrapper}>
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderIcon}>🏷</Text>
          </View>
        )}
        {/* Remove heart */}
        <Pressable style={styles.heartBtn} onPress={() => handleRemove(item)} hitSlop={6}>
          <Text style={styles.heartIcon}>❤️</Text>
        </Pressable>
      </Pressable>

      {/* Info */}
      <View style={styles.info}>
        <Pressable onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        </Pressable>
        <Text style={styles.price}>₱{item.price.toLocaleString()}</Text>
        <Text style={styles.stock}>{item.stock > 0 ? `${item.stock} pcs available` : 'Out of stock'}</Text>
      </View>

      {/* Add to cart */}
      <Pressable
        style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed, item.stock === 0 && styles.addBtnDisabled]}
        onPress={() => handleAddToCart(item)}
        disabled={item.stock === 0}
      >
        <Text style={styles.addBtnText}>{item.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Favorites</Text>
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>Tap the heart on any product to save it here</Text>
            <Pressable style={styles.browseBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.browseBtnText}>Browse Products</Text>
            </Pressable>
          </View>
        }
        renderItem={renderItem}
      />
    </View>
  );
}