// src/screens/buyer/ProductDetail/ProductDetailScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, Alert,
  ActivityIndicator, Image, StyleSheet,
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

  const [product, setProduct]             = useState<Product | null>(null);
  const [loading, setLoading]             = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize]   = useState<string | null>(null);
  const [qty, setQty]                     = useState(1);
  const [added, setAdded]                 = useState(false);

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
    }, [productId]),
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (product.colors?.length && !selectedColor) {
      Alert.alert('Select a Color', 'Please choose a color before adding to cart.');
      return;
    }
    if (product.sizes?.length && !selectedSize) {
      Alert.alert('Select a Size', 'Please choose a size before adding to cart.');
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
        <ActivityIndicator size="large" color="#0A0A0A" />
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: 8 }]}
      >

        {/* ── Product Image ─────────────────────────────────────────────────── */}
        <View style={[styles.imageArea, { borderRadius: 8, overflow: 'hidden' }]}>
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
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 22, color: '#0A0A0A', lineHeight: 26 }}>‹</Text>
          </Pressable>
        </View>

        {/* ── Name & Price ──────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>
              <View style={[
                styles.stockBadge,
                { backgroundColor: inStock ? '#F0FDF4' : '#FEF2F2' },
              ]}>
                <Text style={[
                  styles.stockText,
                  { color: inStock ? '#166534' : '#991B1B' },
                ]}>
                  {inStock ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                </Text>
              </View>
            </View>
            <Text style={styles.name}>{product.name}</Text>
          </View>
        </View>

        {/* ── Variants ─────────────────────────────────────────────────────── */}
        {((product.colors && product.colors.length > 0) ||
          (product.sizes  && product.sizes.length  > 0)) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Variants</Text>
            </View>
            <View style={styles.sectionBody}>

              {/* Color picker */}
              {product.colors && product.colors.length > 0 && (
                <>
                  <View style={colorLabelRow}>
                    <Text style={styles.sectionLabel}>Colour</Text>
                    {colorLabel && (
                      <Text style={colorLabelValue}>{colorLabel}</Text>
                    )}
                  </View>
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
                          }}>✓</Text>
                        )}
                      </Pressable>
                    ))}
                  </View>

                  {product.sizes && product.sizes.length > 0 && (
                    <View style={styles.divider} />
                  )}
                </>
              )}

              {/* Size picker */}
              {product.sizes && product.sizes.length > 0 && (
                <>
                  <View style={colorLabelRow}>
                    <Text style={styles.sectionLabel}>Size</Text>
                    {selectedSize && (
                      <Text style={colorLabelValue}>{selectedSize}</Text>
                    )}
                  </View>
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
                </>
              )}

              {/* Selected variant summary */}
              {variantLabel ? (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionLabel}>Selected Variant</Text>
                  <View style={variantChip}>
                    <View style={variantDot} />
                    <Text style={variantChipText}>{variantLabel}</Text>
                  </View>
                </>
              ) : null}

            </View>
          </View>
        )}

        {/* ── Quantity ──────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quantity</Text>
          </View>
          <View style={[styles.sectionBody, qtyRow]}>
            <View>
              <Text style={qtyItemCount}>{qty} {qty === 1 ? 'item' : 'items'}</Text>
              <Text style={qtySubtotalText}>
                Subtotal  ₱{(product.price * qty).toLocaleString()}
              </Text>
            </View>
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
        </View>

        {/* ── Category ─────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.catRow}>
              <View style={styles.catBadge}>
                <Text style={styles.catText}>{product.category}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Description ──────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.desc}>{product.description}</Text>
          </View>
        </View>

        <View style={{ height: 12 }} />
      </ScrollView>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.footerPriceLabel}>Total</Text>
          <Text style={styles.footerPrice}>
            ₱{(product.price * qty).toLocaleString()}
          </Text>
        </View>

        {/* Add to Cart */}
        <Pressable
          style={({ pressed }) => [
            styles.cartBtn,
            !inStock && styles.cartBtnDisabled,
            pressed && inStock && { opacity: 0.75 },
          ]}
          onPress={handleAddToCart}
          disabled={!inStock}
        >
          <Text style={[styles.cartBtnText, !inStock && styles.cartBtnTextDisabled]}>
            {added ? '✓ Added' : 'Add to Cart'}
          </Text>
        </Pressable>

        {/* Buy Now */}
        <Pressable
          style={({ pressed }) => [
            styles.buyBtn,
            !inStock && styles.buyBtnDisabled,
            pressed && inStock && styles.buyBtnPressed,
          ]}
          onPress={() => {
            if (!inStock) return;
            if (product.colors?.length && !selectedColor) {
              Alert.alert('Select a Color', 'Please choose a color first.');
              return;
            }
            if (product.sizes?.length && !selectedSize) {
              Alert.alert('Select a Size', 'Please choose a size first.');
              return;
            }
            const buyNowItem = {
              product,
              quantity:      qty,
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

// ── Inline styles ─────────────────────────────────────────────────────────────
const {
  colorLabelRow, colorLabelValue,
  colorRow, colorDot, colorDotSelected,
  sizeRow, sizeBtn, sizeBtnActive, sizeBtnText, sizeBtnTextActive,
  variantChip, variantDot, variantChipText,
  qtyRow, qtyControls, qtyBtn, qtyBtnText, qtyValue,
  qtyItemCount, qtySubtotalText,
} = StyleSheet.create({

  // Colour label row
  colorLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  colorLabelValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#555555',
    letterSpacing: 0.2,
  },

  // Color dots
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 2 },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderColor: '#0A0A0A',
    borderWidth: 2.5,
  },

  // Size chips
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 2 },
  sizeBtn: {
    minWidth: 42,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  sizeBtnActive: {
    borderColor: '#0A0A0A',
    backgroundColor: '#0A0A0A',
    borderWidth: 1.5,
  },
  sizeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
    letterSpacing: 0.3,
  },
  sizeBtnTextActive: {
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Variant chip
  variantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    gap: 7,
  },
  variantDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#333333',
  },
  variantChipText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Quantity row
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyItemCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
    marginBottom: 2,
  },
  qtySubtotalText: {
    fontSize: 11,
    color: '#AAAAAA',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 22,
  },
  qtyValue: {
    width: 38,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#DCDCDC',
    height: 32,
    lineHeight: 30,
    letterSpacing: 0.2,
  },
});