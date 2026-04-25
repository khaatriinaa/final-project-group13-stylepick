import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView,
  Platform, Pressable, Alert, ActivityIndicator, Image, Modal, StyleSheet,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { AddProductScreenProps } from '../../../props/props';
import { createProduct, getProductById, updateProduct } from '../../../services/productService';
import { useAuth } from '../../../context/AuthContext';
import { ProductCondition, ShippingMethod } from '../../../types';
import { styles, modalStyles as ms } from './AddProductScreen.styles';

const FASHION_CATEGORIES = ['Dress', 'Tops', 'Bottoms', 'Footwear', 'Outerwear', 'Accessories', 'Bags', 'Activewear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
const CONDITIONS: { label: string; value: ProductCondition }[] = [
  { label: 'New',       value: 'new' },
  { label: 'Like New',  value: 'like_new' },
  { label: 'Good',      value: 'good' },
  { label: 'Fair',      value: 'fair' },
];
const SHIPPING_METHODS: { label: string; value: ShippingMethod }[] = [
  { label: 'Standard', value: 'standard' },
  { label: 'Express',  value: 'express' },
  { label: 'Same Day', value: 'same_day' },
  { label: 'Pickup',   value: 'pickup' },
];
const PRESET_COLORS = [
  { label: 'Black',  value: '#1A1A1A' }, { label: 'White',  value: '#FFFFFF' },
  { label: 'Red',    value: '#DC2626' }, { label: 'Navy',   value: '#1D3557' },
  { label: 'Pink',   value: '#F472B6' }, { label: 'Beige',  value: '#D4B896' },
  { label: 'Brown',  value: '#92400E' }, { label: 'Gray',   value: '#6B7280' },
  { label: 'Green',  value: '#059669' }, { label: 'Yellow', value: '#F59E0B' },
  { label: 'Purple', value: '#7C3AED' }, { label: 'Blue',   value: '#2563EB' },
];

type FormValues = {
  name: string;
  price: string;
  costPrice: string;
  description: string;
  stock: string;
};

const Schema = Yup.object().shape({
  name:        Yup.string().min(2, 'Too short').required('Required'),
  price:       Yup.number().typeError('Must be a number').positive().required('Required'),
  costPrice:   Yup.number().typeError('Must be a number').positive().nullable().optional(),
  description: Yup.string().min(10, 'Too short').required('Required'),
  stock:       Yup.number().typeError('Must be a number').integer().min(0).required('Required'),
});

// ─── Category Modal ───────────────────────────────────────────────────────────
const CategoryModal = ({ visible, selected, onSave, onClose }: any) => {
  const [local, setLocal] = useState<string[]>(selected);
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={ms.backdrop}>
        <View style={ms.sheet}>
          <Text style={ms.sheetTitle}>Select Category</Text>
          <View style={ms.chipGrid}>
            {FASHION_CATEGORIES.map(cat => (
              <Pressable
                key={cat}
                style={local.includes(cat) ? ms.chipActive : ms.chip}
                onPress={() =>
                  setLocal(prev =>
                    prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat]
                  )
                }
              >
                <Text style={local.includes(cat) ? ms.chipTextActive : ms.chipText}>{cat}</Text>
              </Pressable>
            ))}
          </View>
          <View style={ms.footer}>
            <Pressable style={ms.saveBtn} onPress={() => { onSave(local); onClose(); }}>
              <Text style={ms.saveText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AddProductScreen({ navigation, route }: AddProductScreenProps) {
  const { user } = useAuth();
  const productId = route.params?.productId;
  const isEditing = Boolean(productId);

  const [loading,        setLoading]        = useState(false);
  const [images,         setImages]         = useState<string[]>([]);
  const [selectedSizes,  setSelectedSizes]  = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [categories,     setCategories]     = useState<string[]>([]);
  const [condition,      setCondition]      = useState<ProductCondition>('new');
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(['standard']);
  const [isActive,       setIsActive]       = useState(true);
  const [showCatModal,   setShowCatModal]   = useState(false);

  const [initialValues, setInitialValues] = useState<FormValues>({
    name: '', price: '', costPrice: '', description: '', stock: '0',
  });

  useFocusEffect(useCallback(() => {
    if (isEditing && productId) {
      getProductById(productId).then((p) => {
        if (p) {
          setInitialValues({
            name:        p.name,
            price:       String(p.price),
            costPrice:   p.costPrice != null ? String(p.costPrice) : '',
            description: p.description,
            stock:       String(p.stock),
          });
          setImages(p.images ?? []);
          setSelectedSizes(p.sizes ?? []);
          setSelectedColors(p.colors ?? []);
          setCategories(p.category ? [p.category] : []);
          setCondition(p.condition ?? 'new');
          setShippingMethods(p.shippingMethods ?? ['standard']);
          setIsActive(!p.isArchived);
        }
      });
    }
  }, [isEditing, productId]));

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 5));
    }
  };

  const handleSubmit = async (values: FormValues) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const payload = {
        name:            values.name,
        description:     values.description,
        price:           parseFloat(values.price),
        costPrice:       values.costPrice ? parseFloat(values.costPrice) : null,
        stock:           parseInt(values.stock, 10),
        category:        categories[0] || 'Other',
        condition,
        shippingMethods,
        images,
        colors:          selectedColors,
        sizes:           selectedSizes,
        isArchived:      !isActive,
        isFeatured:      false,
        comparePrice:    null,
        weight:          null,
        sku:             null,
        shippingNotes:   null,
        returnPolicy:    null,
      };

      if (isEditing) {
        await updateProduct(productId!, payload);
      } else {
        await createProduct({ sellerId: user.id, ...payload });
      }

      Alert.alert('Success', 'Product saved!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit' : 'Add'} Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={Schema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, touched }) => (
            <View>

              {/* ── Media ── */}
              <Text style={styles.label}>Media (Max 5)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
                {images.map((uri, i) => (
                  <View key={i} style={styles.mediaThumb}>
                    <Image source={{ uri }} style={styles.mediaImg} />
                    <Pressable
                      style={styles.mediaRemove}
                      onPress={() => setImages(images.filter((_, j) => j !== i))}
                    >
                      <Text style={{ color: 'white', fontSize: 10 }}>✕</Text>
                    </Pressable>
                  </View>
                ))}
                {images.length < 5 && (
                  <Pressable style={styles.mediaAdd} onPress={handleImagePick}>
                    <Text style={{ color: '#999' }}>+ Add</Text>
                  </Pressable>
                )}
              </ScrollView>

              {/* ── Product Name ── */}
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Name"
              />
              {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {/* ── Description ── */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="Describe your product..."
                multiline
              />
              {touched.description && errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

              {/* ── Price ── */}
              <Text style={styles.label}>Price (₱)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                value={values.price}
                placeholder="0.00"
              />
              {touched.price && errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

              {/* ── Cost Price ── */}
              <Text style={styles.label}>Cost Price (₱) — private</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={handleChange('costPrice')}
                onBlur={handleBlur('costPrice')}
                value={values.costPrice}
                placeholder="0.00"
              />
              {touched.costPrice && errors.costPrice && (
                <Text style={styles.errorText}>{errors.costPrice}</Text>
              )}

              {/* ── Stock ── */}
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={handleChange('stock')}
                onBlur={handleBlur('stock')}
                value={values.stock}
                placeholder="0"
              />
              {touched.stock && errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}

              {/* ── Category ── */}
              <Text style={styles.label}>Category</Text>
              <Pressable style={styles.input} onPress={() => setShowCatModal(true)}>
                <Text style={{ color: categories.length ? '#000' : '#AAA' }}>
                  {categories.length ? categories.join(', ') : 'Select category...'}
                </Text>
              </Pressable>

              {/* ── Condition ── */}
              <Text style={styles.label}>Condition</Text>
              <View style={styles.chipRow}>
                {CONDITIONS.map(c => (
                  <Pressable
                    key={c.value}
                    style={condition === c.value ? ms.chipActive : ms.chip}
                    onPress={() => setCondition(c.value)}
                  >
                    <Text style={condition === c.value ? ms.chipTextActive : ms.chipText}>
                      {c.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* ── Shipping Methods ── */}
              <Text style={styles.label}>Shipping Methods</Text>
              <View style={styles.chipRow}>
                {SHIPPING_METHODS.map(m => {
                  const active = shippingMethods.includes(m.value);
                  return (
                    <Pressable
                      key={m.value}
                      style={active ? ms.chipActive : ms.chip}
                      onPress={() =>
                        setShippingMethods(prev =>
                          prev.includes(m.value)
                            ? prev.filter(x => x !== m.value)
                            : [...prev, m.value]
                        )
                      }
                    >
                      <Text style={active ? ms.chipTextActive : ms.chipText}>{m.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* ── Sizes ── */}
              <Text style={styles.label}>Sizes</Text>
              <View style={styles.chipRow}>
                {SIZES.map(size => {
                  const active = selectedSizes.includes(size);
                  return (
                    <Pressable
                      key={size}
                      style={active ? ms.chipActive : ms.chip}
                      onPress={() =>
                        setSelectedSizes(prev =>
                          prev.includes(size) ? prev.filter(x => x !== size) : [...prev, size]
                        )
                      }
                    >
                      <Text style={active ? ms.chipTextActive : ms.chipText}>{size}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* ── Colors ── */}
              <Text style={styles.label}>Colors</Text>
              <View style={styles.colorGrid}>
                {PRESET_COLORS.map(c => {
                  const isSelected = selectedColors.includes(c.value);
                  return (
                    <Pressable
                      key={c.value}
                      style={styles.colorItem}
                      onPress={() =>
                        setSelectedColors(prev =>
                          prev.includes(c.value)
                            ? prev.filter(x => x !== c.value)
                            : [...prev, c.value]
                        )
                      }
                    >
                      <View style={[styles.colorDot, isSelected && styles.colorDotSel]}>
                        <View style={StyleSheet.flatten([styles.colorFill, { backgroundColor: c.value }])} />
                        {isSelected && (
                          <Text style={{ color: c.value === '#FFFFFF' ? '#000' : '#FFF' }}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.colorLabel}>{c.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* ── Active Toggle ── */}
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Active Listing</Text>
                <Pressable
                  style={[styles.toggle, isActive && styles.toggleActive]}
                  onPress={() => setIsActive(prev => !prev)}
                >
                  <Text style={{ color: isActive ? '#FFF' : '#666' }}>
                    {isActive ? 'Active' : 'Archived'}
                  </Text>
                </Pressable>
              </View>

              {/* ── Submit ── */}
              <Pressable
                style={styles.submitBtn}
                onPress={() => formikSubmit()}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#FFF" />
                  : <Text style={styles.submitBtnText}>
                      {isEditing ? 'Update' : 'Submit'} Product
                    </Text>
                }
              </Pressable>

            </View>
          )}
        </Formik>
      </ScrollView>

      <CategoryModal
        visible={showCatModal}
        selected={categories}
        onSave={setCategories}
        onClose={() => setShowCatModal(false)}
      />
    </KeyboardAvoidingView>
  );
}