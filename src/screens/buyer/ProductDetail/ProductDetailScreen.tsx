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
import { COLORS, FONTS, RADIUS, SHADOW, STATUS_COLORS, PRESET_COLORS } from '../../../theme';

export default function ProductDetailScreen({ navigation, route }: ProductDetailScreenProps) {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getProductById(productId)
        .then((p) => {
          setProduct(p);
          if (p?.colors?.length) setSelectedColor(p.colors[0]);
          if (p?.sizes?.length) setSelectedSize(p.sizes[0]);
        })
        .catch((e) => Alert.alert('Error', e.message))
        .finally(() => setLoading(false));
    }, [productId])
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (product.colors?.length && !selectedColor) { Alert.alert('Please select a color'); return; }
    if (product.sizes?.length && !selectedSize) { Alert.alert('Please select a size'); return; }
    for (let i = 0; i < qty; i++) addToCart(product, 1, selectedColor ?? undefined, selectedSize ?? undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <View style={[s.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={s.imageWrap}>
          {product.images?.[0]
            ? <Image source={{ uri: product.images[0] }} style={s.image} resizeMode="cover" />
            : <View style={s.imagePlaceholder}><Text style={{ fontSize: 72 }}>👗</Text></View>
          }
          <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 20, color: COLORS.text }}>‹</Text>
          </Pressable>
        </View>

        <View style={s.body}>
          <Text style={s.name}>{product.name}</Text>

          <View style={s.priceRow}>
            <Text style={s.price}>₱{product.price.toLocaleString()}</Text>
            <View style={[s.stockBadge, { backgroundColor: inStock ? COLORS.successLight : COLORS.errorLight }]}>
              <Text style={[s.stockText, { color: inStock ? COLORS.success : COLORS.error }]}>
                {inStock ? `${product.stock} available` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          <View style={s.divider} />

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>
                Color: <Text style={s.sectionValue}>
                  {selectedColor
                    ? PRESET_COLORS.find(c => c.value === selectedColor)?.label ?? selectedColor
                    : 'Select'
                  }
                </Text>
              </Text>
              <View style={s.colorRow}>
                {product.colors.map((color) => (
                  <Pressable
                    key={color}
                    style={[s.colorDot, { backgroundColor: color }, selectedColor === color && s.colorDotSelected]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Text style={{ fontSize: 12, color: color === '#FFFFFF' ? '#000' : '#FFF', fontWeight: '700' }}>✓</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>Size: <Text style={s.sectionValue}>{selectedSize ?? 'Select'}</Text></Text>
              <View style={s.sizeRow}>
                {product.sizes.map((size) => (
                  <Pressable
                    key={size}
                    style={[s.sizeBtn, selectedSize === size && s.sizeBtnActive]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[s.sizeBtnText, selectedSize === size && s.sizeBtnTextActive]}>{size}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={s.divider} />

          {/* Qty */}
          <View style={s.qtyRow}>
            <Text style={s.sectionLabel}>Quantity</Text>
            <View style={s.qtyControls}>
              <Pressable style={s.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Text style={s.qtyBtnText}>−</Text>
              </Pressable>
              <Text style={s.qtyValue}>{qty}</Text>
              <Pressable style={s.qtyBtn} onPress={() => setQty(Math.min(product.stock, qty + 1))} disabled={!inStock}>
                <Text style={s.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={s.divider} />

          {/* Category & Description */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Category</Text>
            <View style={s.catBadge}><Text style={s.catBadgeText}>{product.category}</Text></View>
          </View>

          <View style={[s.section, { marginTop: 14 }]}>
            <Text style={s.sectionLabel}>Description</Text>
            <Text style={s.desc}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalPrice}>₱{(product.price * qty).toLocaleString()}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [s.addBtn, !inStock && s.addBtnDisabled, pressed && inStock && { opacity: 0.88 }]}
          onPress={handleAddToCart} disabled={!inStock}
        >
          <Text style={s.addBtnText}>{!inStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  imageWrap: { width: '100%', aspectRatio: 1, backgroundColor: COLORS.background, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  backBtn: {
    position: 'absolute', top: 52, left: 14,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', ...SHADOW.sm,
  },
  body: { padding: 18 },
  name: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text, lineHeight: 26, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  price: { fontSize: 24, fontWeight: FONTS.extraBold, color: COLORS.primary },
  stockBadge: { borderRadius: RADIUS.xs, paddingHorizontal: 10, paddingVertical: 4 },
  stockText: { fontSize: 12, fontWeight: FONTS.semiBold },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  section: { marginBottom: 4 },
  sectionLabel: { fontSize: 14, fontWeight: FONTS.semiBold, color: COLORS.text, marginBottom: 10 },
  sectionValue: { fontWeight: FONTS.regular, color: COLORS.textSecondary },
  // Color
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorDot: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  colorDotSelected: { borderColor: COLORS.primary, borderWidth: 2.5 },
  // Size
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeBtn: {
    minWidth: 46, height: 38, paddingHorizontal: 10,
    borderRadius: RADIUS.sm, borderWidth: 1.5,
    borderColor: COLORS.borderDark, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  sizeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  sizeBtnText: { fontSize: 13, fontWeight: FONTS.semiBold, color: COLORS.textSecondary },
  sizeBtnTextActive: { color: COLORS.primary },
  // Qty
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  qtyBtn: {
    width: 34, height: 34, borderRadius: RADIUS.sm,
    borderWidth: 1.5, borderColor: COLORS.borderDark,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text, lineHeight: 22 },
  qtyValue: { width: 40, textAlign: 'center', fontSize: 16, fontWeight: FONTS.bold, color: COLORS.text },
  // Category
  catBadge: {
    alignSelf: 'flex-start', backgroundColor: COLORS.background,
    borderRadius: RADIUS.xs, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  catBadgeText: { fontSize: 12, fontWeight: FONTS.semiBold, color: COLORS.textSecondary },
  desc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  // Footer
  footer: {
    backgroundColor: COLORS.white, padding: 16, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  totalRow: { flex: 1 },
  totalLabel: { fontSize: 12, color: COLORS.textSecondary },
  totalPrice: { fontSize: 20, fontWeight: FONTS.extraBold, color: COLORS.text },
  addBtn: {
    flex: 2, height: 48, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: COLORS.borderDark },
  addBtnText: { fontSize: 15, fontWeight: FONTS.bold, color: COLORS.white },
});
