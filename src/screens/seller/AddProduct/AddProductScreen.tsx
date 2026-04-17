// src/screens/seller/AddProduct/AddProductScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform, Pressable,
  Alert, ActivityIndicator, Image, Modal, StyleSheet,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { AddProductScreenProps } from '../../../props/props';
import { createProduct, getProductById, updateProduct } from '../../../services/productService';
import { useAuth } from '../../../context/AuthContext';
import { styles, modalStyles as ms } from './AddProductScreen.styles';

// ─── Constants ────────────────────────────────────────────────
const FASHION_CATEGORIES = [
  'Dress', 'Tops', 'Bottoms', 'Footwear',
  'Outerwear', 'Accessories', 'Bags', 'Activewear',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

const PRESET_COLORS = [
  { label: 'Black',  value: '#1A1A1A' },
  { label: 'White',  value: '#FFFFFF' },
  { label: 'Red',    value: '#DC2626' },
  { label: 'Navy',   value: '#1D3557' },
  { label: 'Pink',   value: '#F472B6' },
  { label: 'Beige',  value: '#D4B896' },
  { label: 'Brown',  value: '#92400E' },
  { label: 'Gray',   value: '#6B7280' },
  { label: 'Green',  value: '#059669' },
  { label: 'Yellow', value: '#F59E0B' },
  { label: 'Purple', value: '#7C3AED' },
  { label: 'Blue',   value: '#2563EB' },
];

// ─── Types ────────────────────────────────────────────────────
type FormValues = {
  name: string;
  price: string;
  costPrice: string;
  description: string;
  stock: string;
};

// ─── Validation ───────────────────────────────────────────────
const Schema = Yup.object().shape({
  name:        Yup.string().min(2, 'Too short').required('Product name is required'),
  price:       Yup.number().typeError('Must be a number').positive('Must be > 0').required('Price is required'),
  description: Yup.string().min(10, 'Too short').required('Description is required'),
  stock:       Yup.number().typeError('Must be a number').integer().min(0).required('Stock is required'),
});

// ─── Category Modal ───────────────────────────────────────────
function CategoryModal({
  visible, selected, onSave, onClose,
}: {
  visible: boolean;
  selected: string[];
  onSave: (v: string[]) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<string[]>(selected);
  const toggle = (c: string) =>
    setLocal((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ms.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={ms.sheet}>
          <View style={ms.sheetHeader}>
            <Text style={ms.sheetTitle}>Category</Text>
            <Pressable onPress={onClose}><Text style={ms.closeBtn}>✕</Text></Pressable>
          </View>
          <ScrollView contentContainerStyle={ms.chipGrid}>
            {FASHION_CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={local.includes(cat) ? ms.chipActive : ms.chip}
                onPress={() => toggle(cat)}
              >
                <Text style={local.includes(cat) ? ms.chipTextActive : ms.chipText}>{cat}</Text>
                {local.includes(cat) && <Text style={ms.chipX}> ✕</Text>}
              </Pressable>
            ))}
          </ScrollView>
          <View style={ms.footer}>
            <Pressable style={ms.cancelBtn} onPress={onClose}>
              <Text style={ms.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={ms.saveBtn} onPress={() => { onSave(local); onClose(); }}>
              <Text style={ms.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Stock Modal ──────────────────────────────────────────────
function StockModal({
  visible, value, onSave, onClose,
}: {
  visible: boolean;
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(parseInt(value) || 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ms.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={ms.sheet}>
          <View style={ms.sheetHeader}>
            <Text style={ms.sheetTitle}>Stock Quantity</Text>
            <Pressable onPress={onClose}><Text style={ms.closeBtn}>✕</Text></Pressable>
          </View>
          <View style={ms.stockBody}>
            <Text style={ms.stockLabel}>Stock In Hand</Text>
            <Text style={ms.stockSub}>Available stock ready for sale.</Text>
            <View style={ms.qtyRow}>
              <Pressable style={ms.qtyBtn} onPress={() => setQty(Math.max(0, qty - 1))}>
                <Text style={ms.qtyBtnText}>−</Text>
              </Pressable>
              <TextInput
                style={ms.qtyInput}
                keyboardType="number-pad"
                value={String(qty)}
                onChangeText={(v) => setQty(parseInt(v) || 0)}
              />
              <Pressable style={ms.qtyBtn} onPress={() => setQty(qty + 1)}>
                <Text style={ms.qtyBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={ms.footer}>
            <Pressable style={ms.cancelBtn} onPress={onClose}>
              <Text style={ms.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={ms.saveBtn} onPress={() => { onSave(String(qty)); onClose(); }}>
              <Text style={ms.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Pricing Modal ────────────────────────────────────────────
function PricingModal({
  visible, price, onSave, onClose,
}: {
  visible: boolean;
  price: string;
  onSave: (price: string, cost: string) => void;
  onClose: () => void;
}) {
  const [p, setP] = useState(price);
  const [cost, setCost] = useState('');
  const numP = parseFloat(p) || 0;
  const numC = parseFloat(cost) || 0;
  const margin = numP && numC ? (numP - numC).toFixed(2) : '—';
  const profit = numP && numC ? (numP - numC).toFixed(2) : '—';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ms.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={ms.sheet}>
          <View style={ms.sheetHeader}>
            <Text style={ms.sheetTitle}>Pricing</Text>
            <Pressable onPress={onClose}><Text style={ms.closeBtn}>✕</Text></Pressable>
          </View>
          <View style={ms.stockBody}>
            {[
              { label: 'Price',         val: p,    set: setP },
              { label: 'Cost per item', val: cost, set: setCost },
            ].map(({ label, val, set }) => (
              <View key={label} style={{ marginBottom: 14 }}>
                <Text style={ms.stockLabel}>{label}</Text>
                <View style={ms.priceInput}>
                  <Text style={ms.priceCurrency}>₱</Text>
                  <TextInput
                    style={ms.priceTextInput}
                    keyboardType="decimal-pad"
                    value={val}
                    onChangeText={set}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            ))}
            <View style={ms.calcRow}>
              <View style={ms.calcBox}>
                <Text style={ms.calcLabel}>Margin</Text>
                <Text style={ms.calcValue}>₱{margin}</Text>
              </View>
              <View style={ms.calcBox}>
                <Text style={ms.calcLabel}>Profit</Text>
                <Text style={ms.calcValue}>₱{profit}</Text>
              </View>
            </View>
          </View>
          <View style={ms.footer}>
            <Pressable style={ms.cancelBtn} onPress={onClose}>
              <Text style={ms.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={ms.saveBtn} onPress={() => { onSave(p, cost); onClose(); }}>
              <Text style={ms.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────
export default function AddProductScreen({ navigation, route }: AddProductScreenProps) {
  const { user } = useAuth();
  const { productId } = route.params;
  const isEditing = Boolean(productId);

  const [loading, setLoading]               = useState(false);
  const [images, setImages]                 = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes]   = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [categories, setCategories]         = useState<string[]>([]);
  const [isActive, setIsActive]             = useState(true);
  const [showCatModal, setShowCatModal]     = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [initialValues, setInitialValues]   = useState<FormValues>({
    name: '', price: '', costPrice: '', description: '', stock: '0',
  });

  useFocusEffect(useCallback(() => {
    if (isEditing && productId) {
      getProductById(productId).then((p) => {
        if (p) {
          setInitialValues({
            name:        p.name,
            price:       String(p.price),
            costPrice:   '',
            description: p.description,
            stock:       String(p.stock),
          });
          setImages(p.images ?? []);
          setSelectedSizes(p.sizes ?? []);
          setSelectedColors(p.colors ?? []);
          setCategories(p.category ? [p.category] : []);
          setIsActive(!p.isArchived);
        }
      });
    }
  }, [isEditing, productId]));

  const pickImages = async (useCamera: boolean) => {
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission Denied', 'Camera permission is required.'); return; }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
      if (!result.canceled) setImages((prev) => [...prev, result.assets[0].uri].slice(0, 5));
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission Denied', 'Gallery permission is required.'); return; }
      const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 1 });
      if (!result.canceled) setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 5));
    }
  };

  const handleAddMedia = () => {
    Alert.alert('Add Media', 'Choose source', [
      { text: 'Camera',  onPress: () => pickImages(true) },
      { text: 'Gallery', onPress: () => pickImages(false) },
      { text: 'Cancel',  style: 'cancel' },
    ]);
  };

  const handleSubmit = async (values: FormValues) => {
    if (categories.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one category.');
      return;
    }
    if (!user?.id) return;
    setLoading(true);
    try {
      const payload = {
        name:        values.name,
        price:       parseFloat(values.price),
        description: values.description,
        stock:       parseInt(values.stock, 10),
        category:    categories[0] ?? 'Other',
        images,
        colors:      selectedColors,
        sizes:       selectedSizes,
        isArchived:  !isActive,
      };
      if (isEditing && productId) {
        await updateProduct(productId, payload);
        Alert.alert('Success', 'Product updated successfully.');
      } else {
        await createProduct({ sellerId: user.id, ...payload });
        Alert.alert('Success', 'Product added. Buyers can now see it.');
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSize  = (v: string) => setSelectedSizes((p)  => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const toggleColor = (v: string) => setSelectedColors((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>

          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>‹</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{isEditing ? 'Edit Product' : 'Create Product'}</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={Schema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit: hs, setFieldValue, values, errors, touched }) => (
                <View style={styles.body}>

                  {/* Media */}
                  <View style={styles.section}>
                    <View style={styles.sectionRow}>
                      <Text style={styles.sectionTitle}>Media</Text>
                      <Pressable onPress={handleAddMedia}>
                        <Text style={styles.link}>⊕ Add Photo</Text>
                      </Pressable>
                    </View>
                    <View style={styles.mediaRow}>
                      {images.map((uri, i) => (
                        <View key={i} style={styles.mediaThumb}>
                          <Image source={{ uri }} style={styles.mediaImg} resizeMode="cover" />
                          <Pressable
                            style={styles.mediaRemove}
                            onPress={() => setImages((p) => p.filter((_, j) => j !== i))}
                          >
                            <Text style={styles.mediaRemoveText}>✕</Text>
                          </Pressable>
                        </View>
                      ))}
                      {images.length < 5 && (
                        <Pressable style={styles.mediaAdd} onPress={handleAddMedia}>
                          <Text style={styles.mediaAddIcon}>📷</Text>
                          <Text style={styles.mediaAddText}>Add</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>

                  {/* Product Name */}
                  <View style={styles.section}>
                    <Text style={styles.label}>Product Name <Text style={styles.req}>*</Text></Text>
                    <TextInput
                      style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                      placeholder="e.g. Floral Summer Dress"
                      placeholderTextColor="#9CA3AF"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                    />
                    {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                  </View>

                  {/* Status */}
                  <View style={styles.section}>
                    <Text style={styles.label}>Status</Text>
                    <View style={styles.radioRow}>
                      {[{ label: 'Active', val: true }, { label: 'Inactive', val: false }].map(({ label, val }) => (
                        <Pressable
                          key={label}
                          style={[styles.radioBtn, isActive === val && styles.radioBtnActive]}
                          onPress={() => setIsActive(val)}
                        >
                          <View style={[styles.radioOuter, isActive === val && styles.radioOuterActive]}>
                            {isActive === val && <View style={styles.radioInner} />}
                          </View>
                          <Text style={[styles.radioLabel, isActive === val && styles.radioLabelActive]}>{label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Description */}
                  <View style={styles.section}>
                    <Text style={styles.label}>Description <Text style={styles.req}>*</Text></Text>
                    <TextInput
                      style={[styles.input, styles.textArea, touched.description && errors.description ? styles.inputError : null]}
                      placeholder="Describe your product..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={4}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values.description}
                    />
                    {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                  </View>

                  {/* Sizes */}
                  <View style={styles.section}>
                    <Text style={styles.label}>Available Sizes</Text>
                    <View style={styles.chipRow}>
                      {SIZES.map((size) => (
                        <Pressable
                          key={size}
                          style={selectedSizes.includes(size) ? styles.chipActive : styles.chip}
                          onPress={() => toggleSize(size)}
                        >
                          <Text style={selectedSizes.includes(size) ? styles.chipTextActive : styles.chipText}>{size}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Colors */}
                  <View style={styles.section}>
                    <Text style={styles.label}>Available Colors</Text>
                    <View style={styles.colorGrid}>
                      {PRESET_COLORS.map((c) => (
                        <Pressable
                          key={c.value}
                          style={styles.colorItem}
                          onPress={() => toggleColor(c.value)}
                        >
                          <View style={[
                            styles.colorDot,
                            { backgroundColor: c.value },
                            c.value === '#FFFFFF' && styles.colorDotWhite,
                            selectedColors.includes(c.value) && styles.colorDotSel,
                          ]}>
                            {selectedColors.includes(c.value) && (
                              <Text style={{ fontSize: 11, fontWeight: '700', color: c.value === '#FFFFFF' ? '#000' : '#FFF' }}>
                                ✓
                              </Text>
                            )}
                          </View>
                          <Text style={styles.colorLabel}>{c.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Category */}
                  <View style={styles.section}>
                    <View style={styles.sectionRow}>
                      <Text style={styles.label}>Category <Text style={styles.req}>*</Text></Text>
                      <Pressable onPress={() => setShowCatModal(true)}>
                        <Text style={styles.link}>+ Add</Text>
                      </Pressable>
                    </View>
                    <View style={styles.chipRow}>
                      {categories.length === 0
                        ? <Text style={styles.placeholder}>Tap "+ Add" to select categories</Text>
                        : categories.map((cat) => (
                          <View key={cat} style={styles.chipActive}>
                            <Text style={styles.chipTextActive}>{cat}</Text>
                            <Pressable onPress={() => setCategories((p) => p.filter((c) => c !== cat))}>
                              <Text style={[styles.chipTextActive, { fontSize: 11, marginLeft: 4 }]}>✕</Text>
                            </Pressable>
                          </View>
                        ))
                      }
                    </View>
                  </View>

                  {/* Price */}
                  <View style={styles.section}>
                    <View style={styles.sectionRow}>
                      <Text style={styles.label}>Price <Text style={styles.req}>*</Text></Text>
                      <Pressable onPress={() => setShowPriceModal(true)}>
                        <Text style={styles.link}>+ Pricing Tool</Text>
                      </Pressable>
                    </View>
                    <TextInput
                      style={[styles.input, touched.price && errors.price ? styles.inputError : null]}
                      placeholder="₱ 0.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="decimal-pad"
                      onChangeText={handleChange('price')}
                      onBlur={handleBlur('price')}
                      value={values.price}
                    />
                    {touched.price && errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                  </View>

                  {/* Stock */}
                  <View style={styles.section}>
                    <View style={styles.sectionRow}>
                      <Text style={styles.label}>Stock Quantity <Text style={styles.req}>*</Text></Text>
                      <Pressable onPress={() => setShowStockModal(true)}>
                        <Text style={styles.link}>+ Add Stock</Text>
                      </Pressable>
                    </View>
                    <TextInput
                      style={[styles.input, touched.stock && errors.stock ? styles.inputError : null]}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="number-pad"
                      onChangeText={handleChange('stock')}
                      onBlur={handleBlur('stock')}
                      value={values.stock}
                    />
                    {touched.stock && errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
                  </View>

                  {/* Footer */}
                  <View style={styles.footer}>
                    <Pressable
                      style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
                      onPress={() => hs()}
                      disabled={loading}
                    >
                      {loading
                        ? <ActivityIndicator color="#FFF" />
                        : <Text style={styles.submitBtnText}>{isEditing ? '✓  Save Changes' : '＋  Add Product'}</Text>
                      }
                    </Pressable>
                  </View>

                  {/* Modals */}
                  <CategoryModal
                    visible={showCatModal}
                    selected={categories}
                    onSave={setCategories}
                    onClose={() => setShowCatModal(false)}
                  />
                  <StockModal
                    visible={showStockModal}
                    value={values.stock}
                    onSave={(v) => setFieldValue('stock', v)}
                    onClose={() => setShowStockModal(false)}
                  />
                  <PricingModal
                    visible={showPriceModal}
                    price={values.price}
                    onSave={(p, c) => { setFieldValue('price', p); setFieldValue('costPrice', c); }}
                    onClose={() => setShowPriceModal(false)}
                  />
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}