// src/screens/buyer/EditProfile/EditProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable,
  Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../services/supabaseClient';

const Schema = Yup.object().shape({
  name:    Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  phone:   Yup.string().matches(/^[0-9+\-\s]{7,15}$/, 'Please enter a valid phone number').nullable(),
  address: Yup.string().min(5, 'Please enter a complete address').nullable(),
});

const FIELDS = [
  {
    field: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    keyboard: 'default' as const,
    required: true,
    multiline: false,
  },
  {
    field: 'phone',
    label: 'Phone Number',
    placeholder: 'e.g. 09171234567',
    keyboard: 'phone-pad' as const,
    required: false,
    multiline: false,
  },
  {
    field: 'address',
    label: 'Delivery Address',
    placeholder: 'Enter your full address',
    keyboard: 'default' as const,
    required: false,
    multiline: true,
  },
];

export default function EditProfileScreen({ navigation }: any) {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name:    user?.name    ?? '',
    phone:   user?.phone   ?? '',
    address: user?.address ?? '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data } = await supabase
        .from('buyer_profiles')
        .select('full_name, phone_number, delivery_address')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setInitialValues({
          name:    data.full_name        ?? user?.name    ?? '',
          phone:   data.phone_number     ?? user?.phone   ?? '',
          address: data.delivery_address ?? user?.address ?? '',
        });
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (values: { name: string; phone: string; address: string }) => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { error: upsertError } = await supabase
          .from('buyer_profiles')
          .upsert({
            id:               authUser.id,
            full_name:        values.name,
            email:            authUser.email,
            phone_number:     values.phone   || null,
            delivery_address: values.address || null,
          });
        if (upsertError) throw new Error(upsertError.message);
      }

      await updateProfile({
        name:    values.name,
        phone:   values.phone   || undefined,
        address: values.address || undefined,
      });

      Alert.alert('Success', 'Profile updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <View style={s.header}>
            <Pressable
              style={({ pressed }) => [s.backBtn, pressed && s.backBtnPressed]}
              onPress={() => navigation.goBack()}
            >
              <Text style={s.backBtnText}>‹</Text>
            </Pressable>
            <Text style={s.headerTitle}>Edit Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* ── Avatar row ── */}
          <View style={s.avatarSection}>
            <View style={s.avatarCircle}>
              <Text style={s.avatarInitial}>{initial}</Text>
            </View>
            <View style={s.avatarMeta}>
              <Text style={s.avatarName}>{user?.name}</Text>
              <Text style={s.avatarEmail}>{user?.email}</Text>
            </View>
          </View>

          {/* ── Section Label ── */}
          <Text style={s.sectionLabel}>Account Information</Text>

          {/* ── Form ── */}
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={Schema}
            onSubmit={handleSave}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={s.form}>
                {FIELDS.map(({ field, label, placeholder, keyboard, required, multiline }) => {
                  const hasError =
                    touched[field as keyof typeof values] &&
                    !!errors[field as keyof typeof values];

                  return (
                    <View key={field} style={s.fieldWrap}>
                      <Text style={s.label}>
                        {label}
                        {required && <Text style={s.req}> *</Text>}
                      </Text>
                      <View style={[s.inputBox, hasError && s.inputBoxError]}>
                        <TextInput
                          style={[s.input, multiline && s.inputMultiline]}
                          placeholder={placeholder}
                          placeholderTextColor="#9CA3AF"
                          keyboardType={keyboard}
                          autoCapitalize={field === 'phone' ? 'none' : 'sentences'}
                          onChangeText={handleChange(field)}
                          onBlur={handleBlur(field)}
                          value={values[field as keyof typeof values]}
                          multiline={multiline}
                          numberOfLines={multiline ? 3 : 1}
                          textAlignVertical={multiline ? 'top' : 'center'}
                        />
                      </View>
                      {hasError && (
                        <Text style={s.errorText}>
                          {errors[field as keyof typeof values] as string}
                        </Text>
                      )}
                    </View>
                  );
                })}

                <Pressable
                  style={({ pressed }) => [s.saveBtn, pressed && s.saveBtnPressed]}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={s.saveBtnText}>Save Changes</Text>
                  }
                </Pressable>
              </View>
            )}
          </Formik>

          <View style={{ height: 40 }} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: {
    opacity: 0.6,
  },
  backBtnText: {
    fontSize: 24,
    color: '#FFFFFF',
    lineHeight: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  /* ── Avatar section ── */
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  avatarMeta: {
    flex: 1,
    minWidth: 0,
  },
  avatarName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  avatarEmail: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  /* ── Section label above form ── */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },

  /* ── Form ── */
  form: {
    paddingHorizontal: 16,
    gap: 12,
  },
  fieldWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  req: {
    color: '#E63946',
  },
  inputBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  inputBoxError: {
    borderBottomColor: '#E63946',
  },
  input: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 6,
    minHeight: 36,
  },
  inputMultiline: {
    minHeight: 72,
    paddingTop: 6,
  },
  errorText: {
    fontSize: 11,
    color: '#E63946',
    marginTop: 6,
    fontWeight: '500',
  },

  /* ── Save button ── */
  saveBtn: {
    backgroundColor: '#111827',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnPressed: {
    opacity: 0.85,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});