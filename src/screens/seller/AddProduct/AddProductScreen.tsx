// src/screens/seller/AddProduct/AddProductScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { AddProductScreenProps } from '../../../props/props';
import {
  createProduct,
  getProductById,
  updateProduct,
} from '../../../services/productService';
import { useAuth } from '../../../context/AuthContext';
import { ProductCondition, ShippingMethod } from '../../../types';
import { styles, modalStyles as ms } from './AddProductScreen.styles';

// ─── Constants ───────────────────────────────────────────────
const FASHION_CATEGORIES = [
  'Dress', 'Tops', 'Bottoms', 'Footwear',
  'Outerwear', 'Accessories', 'Bags', 'Activewear',
];

const CAT_ICONS: Record<string, string> = {
  Dress: '👗', Tops: '👕', Bottoms: '👖', Footwear: '👟',
  Outerwear: '🧥', Accessories: '💍', Bags: '👜', Activewear: '🩱',
};

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
const SHOE_SIZES    = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const PRESET_COLORS = [
  { label: 'Black',  hex: '#1A1A1A' },
  { label: 'White',  hex: '#FFFFFF' },
  { label: 'Red',    hex: '#DC2626' },
  { label: 'Navy',   hex: '#1D3557' },
  { label: 'Pink',   hex: '#F472B6' },
  { label: 'Beige',  hex: '#D4B896' },
  { label: 'Brown',  hex: '#92400E' },
  { label: 'Gray',   hex: '#6B7280' },
  { label: 'Green',  hex: '#059669' },
  { label: 'Yellow', hex: '#F59E0B' },
  { label: 'Purple', hex: '#7C3AED' },
  { label: 'Blue',   hex: '#2563EB' },
];

// ─── Form type (matches Product fields only) ─────────────────
type FormValues = {
  name: string;
  price: string;
  description: string;
  stock: string;
};

const Schema = Yup.object().shape({
  name:        Yup.string().min(2, 'At least 2 characters').required('Required'),
  price:       Yup.number().typeError('Enter a valid number').positive('Must be > 0').required('Required'),
  description: Yup.string().min(10, 'At least 10 characters').required('Required'),
  stock:       Yup.number().typeError('Enter a valid number').integer('Must be a whole number').min(0, 'Cannot be negative').required('Required'),
});

// ─── Category Modal ──────────────────────────────────────────
function CategoryModal({
  visible, selected, onSave, onClose,
}: {
  visible: boolean;
  selected: string[];
  onSave: (v: string[]) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<string[]>(selected);

  const toggle = (cat: string) =>
    setLocal((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
    );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ms.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={ms.sheet}>
          <View style={ms.handle} />
          <View style={ms.sheetHeader}>
            <Text style={ms.sheetTitle}>Select Category</Text>
            <Pressable style={ms.closeBtn} onPress={onClose}>
              <Text style={ms.closeBtnText}>✕</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={ms.chipGrid}>
            {FASHION_CATEGORIES.map((cat) => {
              const active = local.includes(cat);
              return (
                <Pressable
                  key={cat}
                  style={active ? ms.chipActive : ms.chip}
                  onPress={() => toggle(cat)}
                >
                  <Text>{CAT_ICONS[cat]}  </Text>
                  <Text style={active ? ms.chipTextActive : ms.chipText}>{cat}</Text>
                  {active && <Text style={ms.chipX}> ✓</Text>}
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={ms.footer}>
            <Pressable style={ms.cancelBtn} onPress={onClose}>
              <Text style={ms.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={ms.saveBtn}
              onPress={() => { onSave(local); onClose(); }}
            >
              <Text style={ms.saveText}>Apply ({local.length})</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Stock Modal ─────────────────────────────────────────────
function StockModal({
  visible, value, onSave, onClose,
}: {
  visible: boolean;
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(parseInt(value, 10) || 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ms.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={ms.sheet}>
          <View style={ms.handle} />
          <View style={ms.sheetHeader}>
            <Text style={ms.sheetTitle}>Set Stock Quantity</Text>
            <Pressable style={ms.closeBtn} onPress={onClose}>
              <Text style={ms.closeBtnText}>✕</Text>
            </Pressable>
          </View>
          <View style={ms.stockBody}>
            <Text style={ms.stockLabel}>Units available</Text>
            <Text style={ms.stockSub}>How many items do you have in stock right now?</Text>
            <View style={ms.qtyRow}>
              <Pressable style={ms.qtyBtn} onPress={() => setQty((q) => Math.max(0, q - 1))}>
                <Text style={ms.qtyBtnText}>−</Text>
              </Pressable>
              <TextInput
                style={ms.qtyInput}
                keyboardType="number-pad"
                value={String(qty)}
                onChangeText={(v) => setQty(parseInt(v, 10) || 0)}
              />
              <Pressable style={ms.qtyBtn} onPress={() => setQty((q) => q + 1)}>
                <Text style={ms.qtyBtnText}>+</Text>
              </Pressable>
            </View>
            <View style={ms.quickRow}>
              {[10, 25, 50, 100].map((q) => (
                <Pressable key={q} style={ms.quickBtn} onPress={() => setQty(q)}>
                  <Text style={ms.quickBtnText}>+{q}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={ms.footer}>
            <Pressable style={ms.cancelBtn} onPress={onClose}>
              <Text style={ms.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={ms.saveBtn} onPress={() => { onSave(String(qty)); onClose(); }}>
              <Text style={ms.saveText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Inner Form Component (real component → hooks allowed) ───
function ProductForm({
  formik,
  images,
  setImages,
  sizes,
  setSizes,
  colors,
  setColors,
  categories,
  setCategories,
  isActive,
  setIsActive,
  showCatModal,
  setShowCatModal,
  showStockModal,
  setShowStockModal,
  loading,
  navigation,
  isEditing,
  onAddPhoto,
}: {
  formik: FormikProps<FormValues>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  sizes: string[];
  setSizes: React.Dispatch<React.SetStateAction<string[]>>;
  colors: string[];
  setColors: React.Dispatch<React.SetStateAction<string[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  showCatModal: boolean;
  setShowCatModal: (v: boolean) => void;
  showStockModal: boolean;
  setShowStockModal: (v: boolean) => void;
  loading: boolean;
  navigation: any;
  isEditing: boolean;
  onAddPhoto: () => void;
}) {
  const { handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched } = formik;

  const toggleSize  = (v: string) => setSizes((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const toggleColor = (v: string) => setColors((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const stockNum = parseInt(values.stock || '0', 10);
  const stockOk  = stockNum > 10;

  return (
    <View style={styles.body}>

      {/* ── PHOTOS ──────────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📸  Product Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
          <View style={styles.mediaRow}>
            {images.map((uri, i) => (
              <View key={i} style={i === 0 ? styles.mediaThumbMain : styles.mediaThumb}>
                <Image source={{ uri }} style={styles.mediaImg} />
                {i === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>COVER</Text>
                  </View>
                )}
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </Pressable>
              </View>
            ))}
            {images.length < 5 && (
              <Pressable style={styles.addPhotoBtn} onPress={onAddPhoto}>
                <Text style={styles.addPhotoIcon}>📷</Text>
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
        <Text style={styles.mediaHint}>{images.length}/5 · First image becomes the cover</Text>
      </View>

      {/* ── BASIC INFO ──────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>✏️  Basic Info</Text>

        {/* Name */}
        <Text style={styles.label}>Product Name <Text style={styles.req}>*</Text></Text>
        <View style={[styles.inputWrap, touched.name && errors.name ? styles.inputWrapError : null]}>
          <Text style={styles.inputIcon}>🏷️</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Floral Wrap Midi Dress"
            placeholderTextColor="#9CA3AF"
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            returnKeyType="next"
          />
        </View>
        {touched.name && errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <View style={styles.fieldGap} />

        {/* Description */}
        <Text style={styles.label}>Description <Text style={styles.req}>*</Text></Text>
        <View style={[styles.inputWrapMulti, touched.description && errors.description ? styles.inputWrapError : null]}>
          <TextInput
            style={styles.inputMulti}
            placeholder="Material, fit, care instructions, occasion..."
            placeholderTextColor="#9CA3AF"
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            multiline
            numberOfLines={4}
          />
        </View>
        {touched.description && errors.description ? (
          <Text style={styles.errorText}>{errors.description}</Text>
        ) : null}

        <View style={styles.fieldGap} />

        {/* Status */}
        <Text style={styles.label}>Listing Status</Text>
        <View style={styles.statusRow}>
          <Pressable
            style={isActive ? styles.statusBtnRed : styles.statusBtn}
            onPress={() => setIsActive(true)}
          >
            <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
            <Text style={isActive ? styles.statusTextRed : styles.statusText}>Active</Text>
          </Pressable>
          <Pressable
            style={!isActive ? styles.statusBtnRed : styles.statusBtn}
            onPress={() => setIsActive(false)}
          >
            <View style={[styles.statusDot, { backgroundColor: '#9CA3AF' }]} />
            <Text style={!isActive ? styles.statusTextRed : styles.statusText}>Inactive</Text>
          </Pressable>
        </View>
      </View>

      {/* ── CATEGORY ────────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏷️  Category <Text style={styles.req}>*</Text></Text>
        {categories.length > 0 && (
          <View style={[styles.catList, { marginBottom: 10 }]}>
            {categories.map((cat) => (
              <View key={cat} style={styles.catPill}>
                <Text style={styles.catPillText}>{CAT_ICONS[cat]} {cat}</Text>
                <Pressable onPress={() => setCategories((p) => p.filter((c) => c !== cat))}>
                  <Text style={styles.catPillX}>  ✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
        <Pressable style={styles.catSelectBtn} onPress={() => setShowCatModal(true)}>
          <Text style={{ fontSize: 15 }}>＋</Text>
          <Text style={styles.catSelectText}>
            {categories.length === 0 ? 'Choose categories...' : 'Add more'}
          </Text>
        </Pressable>
      </View>

      {/* ── SIZES ───────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={[styles.cardTitle, { marginBottom: 0, flex: 1 }]}>📐  Available Sizes</Text>
          {sizes.length > 0 && (
            <Pressable onPress={() => setSizes([])}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>Clear all</Text>
            </Pressable>
          )}
        </View>
        {/* Clothing Sizes */}
        <Text style={styles.sizeGroupLabel}>Clothing</Text>
        <View style={[styles.chipRow, { gap: 8, marginBottom: 14 }]}>
          {CLOTHING_SIZES.map((size) => {
            const active = sizes.includes(size);
            return (
              <Pressable
                key={size}
                style={active ? styles.sizeChipActive : styles.sizeChip}
                onPress={() => toggleSize(size)}
              >
                <Text style={active ? styles.sizeTextActive : styles.sizeText}>{size}</Text>
              </Pressable>
            );
          })}
        </View>
        {/* Shoe Sizes */}
        <Text style={styles.sizeGroupLabel}>Footwear (EU)</Text>
        <View style={[styles.chipRow, { gap: 8 }]}>
          {SHOE_SIZES.map((size) => {
            const active = sizes.includes(size);
            return (
              <Pressable
                key={size}
                style={active ? styles.sizeChipActive : styles.sizeChip}
                onPress={() => toggleSize(size)}
              >
                <Text style={active ? styles.sizeTextActive : styles.sizeText}>{size}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── COLORS ──────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <Text style={[styles.cardTitle, { marginBottom: 0, flex: 1 }]}>🎨  Available Colors</Text>
          {colors.length > 0 && (
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>
              {colors.length} selected
            </Text>
          )}
        </View>
        <View style={styles.colorGrid}>
          {PRESET_COLORS.map(({ label, hex }) => {
            const sel = colors.includes(hex);
            const light = hex === '#FFFFFF' || hex === '#F59E0B';
            return (
              <Pressable key={hex} style={styles.colorItem} onPress={() => toggleColor(hex)}>
                <View style={[
                  styles.colorDot,
                  { backgroundColor: hex },
                  hex === '#FFFFFF' ? styles.colorDotWhite : null,
                  sel ? styles.colorDotSel : null,
                ]}>
                  {sel && <Text style={[styles.colorCheck, { color: light ? '#000' : '#FFF' }]}>✓</Text>}
                </View>
                <Text style={styles.colorLabel}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── PRICE ───────────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰  Selling Price</Text>
        {values.price ? (
          <View style={styles.priceDisplay}>
            <Text style={styles.priceCurrency}>₱</Text>
            <Text style={styles.priceValue}>
              {parseFloat(values.price).toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        ) : (
          <View style={styles.priceDisplay}>
            <Text style={styles.priceEmpty}>₱ —</Text>
          </View>
        )}
        <View style={[styles.inputWrap, touched.price && errors.price ? styles.inputWrapError : null]}>
          <Text style={styles.inputIcon}>₱</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            value={values.price}
            onChangeText={handleChange('price')}
            onBlur={handleBlur('price')}
          />
        </View>
        {touched.price && errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
      </View>

      {/* ── STOCK ───────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <Text style={[styles.cardTitle, { marginBottom: 0, flex: 1 }]}>📦  Stock</Text>
          <Pressable
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
              borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FAFAF8',
            }}
            onPress={() => setShowStockModal(true)}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280' }}>⊕ Quick Set</Text>
          </Pressable>
        </View>
        <View style={styles.stockDisplay}>
          <Text style={styles.stockNum}>{values.stock || '0'}</Text>
          <Text style={styles.stockUnit}>units</Text>
          <View style={stockOk ? styles.stockBadge : styles.stockBadgeWarn}>
            <Text style={stockOk ? styles.stockBadgeText : styles.stockBadgeWarnText}>
              {stockOk ? 'In Stock' : 'Low Stock'}
            </Text>
          </View>
        </View>
        <View style={[styles.inputWrap, touched.stock && errors.stock ? styles.inputWrapError : null]}>
          <Text style={styles.inputIcon}>📦</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={values.stock}
            onChangeText={handleChange('stock')}
            onBlur={handleBlur('stock')}
          />
        </View>
        {touched.stock && errors.stock ? <Text style={styles.errorText}>{errors.stock}</Text> : null}
      </View>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <View style={styles.footer}>
        <Pressable style={styles.discardBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.discardText}>Discard</Text>
        </Pressable>
        <Pressable
          style={styles.submitBtn}
          onPress={() => handleSubmit()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={{ fontSize: 16 }}>{isEditing ? '✓' : '🚀'}</Text>
              <Text style={styles.submitBtnText}>
                {isEditing ? 'Save Changes' : 'Publish Listing'}
              </Text>
            </>
          )}
        </Pressable>
      </View>

      {/* ── Modals ──────────────────────────────────────── */}
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
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────
export default function AddProductScreen({ navigation, route }: AddProductScreenProps) {
  const { user }  = useAuth();
  const productId = route.params?.productId;
  const isEditing = Boolean(productId);

  const [loading,       setLoading]       = useState(false);
  const [images,        setImages]        = useState<string[]>([]);
  const [sizes,         setSizes]         = useState<string[]>([]);
  const [colors,        setColors]        = useState<string[]>([]);
  const [categories,    setCategories]    = useState<string[]>([]);
  const [isActive,      setIsActive]      = useState(true);
  const [showCatModal,  setShowCatModal]  = useState(false);
  const [showStockModal,setShowStockModal]= useState(false);
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: '', price: '', description: '', stock: '0',
  });

  // Load product data when editing
  useFocusEffect(useCallback(() => {
    if (isEditing && productId) {
      getProductById(productId).then((p) => {
        if (!p) return;
        setInitialValues({
          name:        p.name,
          price:       String(p.price),
          description: p.description,
          stock:       String(p.stock),
        });
        setImages(p.images ?? []);
        setSizes(p.sizes ?? []);
        setColors(p.colors ?? []);
        setCategories(p.category ? [p.category] : []);
        setIsActive(!p.isArchived);
      });
    }
  }, [isEditing, productId]));

  // Photo picker
  const handleAddPhoto = () => {
    Alert.alert('Add Photo', 'Choose source', [
      {
        text: '📷  Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is required.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
          if (!result.canceled) {
            setImages((prev) => [...prev, result.assets[0].uri].slice(0, 5));
          }
        },
      },
      {
        text: '🖼️  Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Gallery access is required.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            quality: 0.8,
          });
          if (!result.canceled) {
            setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 5));
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Submit
  const handleSubmit = async (values: FormValues) => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }
    if (categories.length === 0) {
      Alert.alert('Missing Category', 'Please select at least one category.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name:            values.name.trim(),
        description:     values.description.trim(),
        price:           parseFloat(values.price),
        stock:           parseInt(values.stock, 10),
        category:        categories[0],
        images,
        colors,
        sizes,
        isArchived:      !isActive,
        isFeatured:      false,
        condition:       'new' as ProductCondition,
        shippingMethods: ['standard'] as ShippingMethod[],
      };

      if (isEditing && productId) {
        await updateProduct(productId, payload);
        Alert.alert('✓ Updated', 'Your product has been updated.');
      } else {
        await createProduct({ sellerId: user.id, ...payload });
        Alert.alert('✓ Published!', 'Your listing is now live.');
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Product' : 'Add Product'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={Schema}
          onSubmit={handleSubmit}
        >
          {/* Pass formik bag to a real component — no hook violations */}
          {(formik) => (
            <ProductForm
              formik={formik}
              images={images}
              setImages={setImages}
              sizes={sizes}
              setSizes={setSizes}
              colors={colors}
              setColors={setColors}
              categories={categories}
              setCategories={setCategories}
              isActive={isActive}
              setIsActive={setIsActive}
              showCatModal={showCatModal}
              setShowCatModal={setShowCatModal}
              showStockModal={showStockModal}
              setShowStockModal={setShowStockModal}
              loading={loading}
              navigation={navigation}
              isEditing={isEditing}
              onAddPhoto={handleAddPhoto}
            />
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}