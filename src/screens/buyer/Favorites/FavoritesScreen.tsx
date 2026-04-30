// src/screens/buyer/Favorites/FavoritesScreen.tsx
import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerStackParamList } from '../../../props/props';
import { useFavorites } from '../../../context/FavoritesContext';
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
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFavorite(product.id),
      },
    ]);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) return;
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
    /*
      FIX: card must NOT have overflow:hidden — that clips the absolutely-
      positioned heart button on Android (same root cause as BuyerHomeScreen).
      Instead we clip only the image wrapper, and keep the card overflow:visible.
      Border radius is applied to each child section individually so the visual
      rounding is preserved without a clipping ancestor.
    */
    <View style={[styles.card, { overflow: 'visible' }]}>

      {/* Image area — overflow:hidden lives here so the image is clipped */}
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
        </Pressable>

        {/*
          FIX: heart button is now a SIBLING of the image Pressable, not a
          child. When it was nested inside the Pressable, Android routed all
          touches to the outer Pressable first, making the heart unreachable.
          elevation:20 puts it above the image layer in Android's hit-test stack.
        */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => handleRemove(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.75}
        >
          <Text style={styles.heartIcon}>❤️</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <Pressable
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      >
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.price}>₱{item.price.toLocaleString()}</Text>
          <Text style={styles.stock}>
            {item.stock > 0 ? `${item.stock} pcs available` : 'Out of stock'}
          </Text>
        </View>
      </Pressable>

      {/* Add to cart */}
      <Pressable
        style={({ pressed }) => [
          styles.addBtn,
          pressed && styles.addBtnPressed,
          item.stock === 0 && styles.addBtnDisabled,
        ]}
        onPress={() => handleAddToCart(item)}
        disabled={item.stock === 0}
      >
        <Text style={styles.addBtnText}>
          {item.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
        </Text>
      </Pressable>
    </View>
  );

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
        // Prevents scroll from stealing taps on the heart/cart buttons
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
              onPress={() => navigation.goBack()}
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