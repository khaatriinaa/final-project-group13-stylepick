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

const FASHION_CATEGORIES = ['Dress', 'Tops', 'Bottoms', 'Footwear', 'Outerwear', 'Accessories', 'Bags', 'Activewear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
const PRESET_COLORS = [
  { label: 'Black',  value: '#1A1A1A' }, { label: 'White',  value: '#FFFFFF' },
  { label: 'Red',    value: '#DC2626' }, { label: 'Navy',   value: '#1D3557' },
  { label: 'Pink',   value: '#F472B6' }, { label: 'Beige',  value: '#D4B896' },
  { label: 'Brown',  value: '#92400E' }, { label: 'Gray',   value: '#6B7280' },
  { label: 'Green',  value: '#059669' }, { label: 'Yellow', value: '#F59E0B' },
  { label: 'Purple', value: '#7C3AED' }, { label: 'Blue',   value: '#2563EB' },
];

type FormValues = {
  name: string; price: string; costPrice: string; description: string; stock: string;
};

const Schema = Yup.object().shape({
  name: Yup.string().min(2, 'Too short').required('Required'),
  price: Yup.number().typeError('Must be a number').positive().required('Required'),
  description: Yup.string().min(10, 'Too short').required('Required'),
  stock: Yup.number().typeError('Must be a number').integer().min(0).required('Required'),
});

// --- Sub-components for Modals ---
const CategoryModal = ({ visible, selected, onSave, onClose }: any) => {
  const [local, setLocal] = useState<string[]>(selected);
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={ms.backdrop}>
        <View style={ms.sheet}>
          <Text style={ms.sheetTitle}>Select Category</Text>
          <View style={ms.chipGrid}>
            {FASHION_CATEGORIES.map(cat => (
              <Pressable key={cat} style={local.includes(cat) ? ms.chipActive : ms.chip} 
                onPress={() => setLocal(prev => prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat])}>
                <Text style={local.includes(cat) ? ms.chipTextActive : ms.chipText}>{cat}</Text>
              </Pressable>
            ))}
          </View>
          <View style={ms.footer}>
            <Pressable style={ms.saveBtn} onPress={() => { onSave(local); onClose(); }}><Text style={ms.saveText}>Apply</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function AddProductScreen({ navigation, route }: AddProductScreenProps) {
  const { user } = useAuth();
  const productId = route.params?.productId;
  const isEditing = Boolean(productId);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: '', price: '', costPrice: '', description: '', stock: '0',
  });

  useFocusEffect(useCallback(() => {
    if (isEditing && productId) {
      getProductById(productId).then((p) => {
        if (p) {
          setInitialValues({ name: p.name, price: String(p.price), costPrice: '', description: p.description, stock: String(p.stock) });
          setImages(p.images ?? []);
          setSelectedSizes(p.sizes ?? []);
          setSelectedColors(p.colors ?? []);
          setCategories(p.category ? [p.category] : []);
          setIsActive(!p.isArchived);
        }
      });
    }
  }, [isEditing, productId]));

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 0.7 });
    if (!result.canceled) setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 5));
  };

  const handleSubmit = async (values: FormValues) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const payload = {
        ...values,
        price: parseFloat(values.price),
        stock: parseInt(values.stock),
        category: categories[0] || 'Other',
        images, colors: selectedColors, sizes: selectedSizes, isArchived: !isActive,
      };
      isEditing ? await updateProduct(productId!, payload) : await createProduct({ sellerId: user.id, ...payload });
      Alert.alert('Success', 'Product saved!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.backText}>‹ Back</Text></Pressable>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit' : 'Add'} Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Formik initialValues={initialValues} enableReinitialize validationSchema={Schema} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, touched }) => (
            <View>
              <Text style={styles.label}>Media (Max 5)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
                {images.map((uri, i) => (
                  <View key={i} style={styles.mediaThumb}>
                    <Image source={{ uri }} style={styles.mediaImg} />
                    <Pressable style={styles.mediaRemove} onPress={() => setImages(images.filter((_, j) => j !== i))}>
                      <Text style={{ color: 'white', fontSize: 10 }}>✕</Text>
                    </Pressable>
                  </View>
                ))}
                {images.length < 5 && <Pressable style={styles.mediaAdd} onPress={handleImagePick}><Text>Add</Text></Pressable>}
              </ScrollView>

              <Text style={styles.label}>Product Name</Text>
              <TextInput style={styles.input} onChangeText={handleChange('name')} value={values.name} placeholder="Name" />
              
              <Text style={styles.label}>Price (₱)</Text>
              <TextInput style={styles.input} keyboardType="numeric" onChangeText={handleChange('price')} value={values.price} placeholder="0.00" />

              <Text style={styles.label}>Colors</Text>
              <View style={styles.colorGrid}>
                {PRESET_COLORS.map(c => {
                  const isSelected = selectedColors.includes(c.value);
                  return (
                    <Pressable key={c.value} style={styles.colorItem} onPress={() => 
                      setSelectedColors(prev => prev.includes(c.value) ? prev.filter(x => x !== c.value) : [...prev, c.value])
                    }>
                      <View style={[styles.colorDot, isSelected && styles.colorDotSel]}>
                        {/* FIX: Use style flattening to prevent Reanimated crash */}
                        <View style={StyleSheet.flatten([styles.colorFill, { backgroundColor: c.value }])} />
                        {isSelected && <Text style={{ color: c.value === '#FFFFFF' ? '#000' : '#FFF' }}>✓</Text>}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable style={styles.submitBtn} onPress={() => formikSubmit()} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Product</Text>}
              </Pressable>
            </View>
          )}
        </Formik>
      </ScrollView>

      <CategoryModal visible={showCatModal} selected={categories} onSave={setCategories} onClose={() => setShowCatModal(false)} />
    </KeyboardAvoidingView>
  );
}