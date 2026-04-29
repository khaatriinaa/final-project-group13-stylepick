// src/screens/buyer/ProductDetail/ProductDetailScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, Alert,
  ActivityIndicator, Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ProductDetailScreenProps } from '../../../props/props';
import { Product } from '../../../types';
import { getProductById } from '../../../services/productService';
import { useCart } from '../../../context/CartContext';
import { PRESET_COLORS } from '../../../theme';
import { styles } from './ProductDetailScreen.styles';

export default function ProductDetailScreen({ navigation, route }: ProductDetailScreenProps) {
  const { productId } = route.params;
  const { addToCart } = useCart();

  const [product, setProduct]       = useState<Product | null>(null);
  const [loading, setLoading]       = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize]   = useState<string | null>(null);
  const [qty, setQty]               = useState(1);
  const [added, setAdded]           = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getProductById(productId)
        .then((p) => {
          setProduct(p);
          if (p?.colors?.length) setSelectedColor(p.colors[0]);
          if (p?.sizes?.length)  setSelectedSize(p.sizes[0]);
        })
        .catch((e) => Alert.alert('Error', e.message))
        .finally(() => setLoading(false));
    }, [productId])
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (product.colors?.length && !selectedColor) {
      Alert.alert('Select a color', 'Please choose a color before adding to cart.');
      return;
    }
    if (product.sizes?.length && !selectedSize) {
      Alert.alert('Select a size', 'Please choose a size before adding to cart.');
      return;
    }
    for (let i = 0; i < qty; i++) {
      addToCart(product, 1, selectedColor ?? undefined, selectedSize ?? undefined);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }
  if (!product) return null;

  const inStock      = product.stock > 0;
  const colorLabel   = selectedColor
    ? (PRESET_COLORS.find((c) => c.value === selectedColor)?.label ?? selectedColor)
    : null;
  const variantLabel = [colorLabel, selectedSize].filter(Boolean).join(' / ');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>

        {/* ── Image ── */}
        <View style={styles.imageArea}>
          {product.images?.[0] ? (
            <Image
              source={{ uri: product.images[0] }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderIcon}>👗</Text>
            </View>
          )}

          {/* Back button */}
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 22, color: '#111827', lineHeight: 26 }}>‹</Text>
          </Pressable>
        </View>

        <View style={styles.body}>

          {/* ── Price + stock ── */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>
          </View>

          <View style={[
            styles.stockBadge,
            { backgroundColor: inStock ? '#ECFDF5' : '#FEF2F2' },
          ]}>
            <Text style={[
              styles.stockText,
              { color: inStock ? '#065F46' : '#991B1B' },
            ]}>
              {inStock ? `${product.stock} in stock` : 'Out of Stock'}
            </Text>
          </View>

          {/* ── Name ── */}
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.divider} />

          {/* ── Color selector ── */}
          {product.colors && product.colors.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>
                Color
                {colorLabel ? (
                  <Text style={{ fontWeight: '400', color: '#6B7280' }}>  {colorLabel}</Text>
                ) : null}
              </Text>
              <View style={colorRow}>
                {product.colors.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      colorDot,
                      { backgroundColor: color },
                      selectedColor === color && colorDotSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Text style={{
                        fontSize: 11,
                        color: color === '#FFFFFF' || color === '#FFF' ? '#000' : '#FFF',
                        fontWeight: '700',
                      }}>
                        ✓
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* ── Size selector ── */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>
                Size
                {selectedSize ? (
                  <Text style={{ fontWeight: '400', color: '#6B7280' }}>  {selectedSize}</Text>
                ) : null}
              </Text>
              <View style={sizeRow}>
                {product.sizes.map((size) => (
                  <Pressable
                    key={size}
                    style={[sizeBtn, selectedSize === size && sizeBtnActive]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[sizeBtnText, selectedSize === size && sizeBtnTextActive]}>
                      {size}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* ── Selected variant chip ── */}
          {variantLabel ? (
            <>
              <Text style={styles.sectionLabel}>Selected Variant</Text>
              <View style={variantChip}>
                <View style={variantDot} />
                <Text style={variantChipText}>{variantLabel}</Text>
              </View>
              <View style={styles.divider} />
            </>
          ) : null}

          {/* ── Quantity ── */}
          <View style={qtyRow}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={qtyControls}>
              <Pressable
                style={qtyBtn}
                onPress={() => setQty(Math.max(1, qty - 1))}
              >
                <Text style={qtyBtnText}>−</Text>
              </Pressable>
              <Text style={qtyValue}>{qty}</Text>
              <Pressable
                style={[qtyBtn, !inStock && { opacity: 0.35 }]}
                onPress={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={!inStock}
              >
                <Text style={qtyBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── Category ── */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.catRow}>
            <View style={styles.catBadge}>
              <Text style={styles.catText}>{product.category}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── Description ── */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

        </View>
      </ScrollView>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 1 }}>Total</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
            ₱{(product.price * qty).toLocaleString()}
          </Text>
        </View>

        {/* Add to Cart (outline) */}
        <Pressable
          style={({ pressed }) => [
            styles.cartBtn,
            !inStock && { borderColor: '#D1D5DB' },
            pressed && inStock && { opacity: 0.8 },
          ]}
          onPress={handleAddToCart}
          disabled={!inStock}
        >
          <Text style={[styles.cartBtnText, !inStock && { color: '#9CA3AF' }]}>
            {added ? '✓ Added' : 'Add to Cart'}
          </Text>
        </Pressable>

        {/* Buy Now (filled) */}
        <Pressable
          style={({ pressed }) => [
            styles.buyBtn,
            !inStock && styles.buyBtnDisabled,
            pressed && inStock && styles.buyBtnPressed,
          ]}
          onPress={() => {
            if (!inStock) return;
            if (product.colors?.length && !selectedColor) {
              Alert.alert('Select a color', 'Please choose a color first.');
              return;
            }
            if (product.sizes?.length && !selectedSize) {
              Alert.alert('Select a size', 'Please choose a size first.');
              return;
            }
            // Build a single-item selectedItems array and go straight to Checkout
            const buyNowItem = {
              product,
              quantity: qty,
              selectedColor: selectedColor ?? undefined,
              selectedSize:  selectedSize  ?? undefined,
            };
            navigation.navigate('Checkout', { selectedItems: [buyNowItem] });
          }}
          disabled={!inStock}
        >
          <Text style={styles.buyBtnText}>
            {!inStock ? 'Out of Stock' : 'Buy Now'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── Inline styles not covered by styles file ───────────────────────────────────
import { StyleSheet } from 'react-native';

const {
  colorRow, colorDot, colorDotSelected,
  sizeRow, sizeBtn, sizeBtnActive, sizeBtnText, sizeBtnTextActive,
  variantChip, variantDot, variantChipText,
  qtyRow, qtyControls, qtyBtn, qtyBtnText, qtyValue,
} = StyleSheet.create({
  // Color
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  colorDot: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center',
  },
  colorDotSelected: { borderColor: '#111827', borderWidth: 2.5 },

  // Size
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  sizeBtn: {
    minWidth: 44, height: 36, paddingHorizontal: 10,
    borderRadius: 6, borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  sizeBtnActive: { borderColor: '#E63946', backgroundColor: '#FEF2F2' },
  sizeBtnText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  sizeBtnTextActive: { color: '#E63946' },

  // Variant chip — same style as cart/order screens
  variantChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 4, borderWidth: 0.5, borderColor: '#E5E7EB',
    paddingHorizontal: 8, paddingVertical: 4,
    alignSelf: 'flex-start', gap: 6, marginBottom: 4,
  },
  variantDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#374151' },
  variantChipText: { fontSize: 12, color: '#374151', fontWeight: '500' },

  // Qty
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyControls: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 32, height: 32,
    borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '400', color: '#374151', lineHeight: 22 },
  qtyValue: {
    width: 38, textAlign: 'center',
    fontSize: 15, fontWeight: '700', color: '#111827',
    borderTopWidth: 0.5, borderBottomWidth: 0.5,
    borderColor: '#E5E7EB', height: 32, lineHeight: 30,
  },
});