// src/screens/buyer/EditProfile/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable,
  Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../context/AuthContext';
import { COLORS, FONTS, RADIUS } from '../../../theme';

const Schema = Yup.object().shape({
  name:    Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  phone:   Yup.string().matches(/^[0-9+\-\s]{7,15}$/, 'Please enter a valid phone number').nullable(),
  address: Yup.string().min(5, 'Please enter a complete address').nullable(),
});

export default function EditProfileScreen({ navigation }: any) {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: { name: string; phone: string; address: string }) => {
    setLoading(true);
    try {
      await updateProfile({ name: values.name, phone: values.phone || undefined, address: values.address || undefined });
      Alert.alert('Success', 'Profile updated successfully.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to update profile.');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <Pressable style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]} onPress={() => navigation.goBack()}>
              <Text style={s.backBtnText}>‹</Text>
            </Pressable>
            <Text style={s.headerTitle}>Edit Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={s.body}>
            <View style={s.avatarWrap}>
              <View style={s.avatar}>
                <Text style={{ fontSize: 36, color: COLORS.textSecondary }}>
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </Text>
              </View>
              <Text style={s.avatarName}>{user?.name}</Text>
              <Text style={s.avatarEmail}>{user?.email}</Text>
            </View>

            <Formik
              initialValues={{ name: user?.name ?? '', phone: user?.phone ?? '', address: user?.address ?? '' }}
              validationSchema={Schema} onSubmit={handleSave}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={s.form}>
                  {[
                    { field: 'name',    label: 'Full Name',    placeholder: 'Enter your full name',      keyboard: 'default' as const, required: true },
                    { field: 'phone',   label: 'Phone Number', placeholder: 'e.g. 09171234567',          keyboard: 'phone-pad' as const, required: false },
                    { field: 'address', label: 'Delivery Address', placeholder: 'Enter your full address', keyboard: 'default' as const, required: false },
                  ].map(({ field, label, placeholder, keyboard, required }) => (
                    <View key={field} style={s.field}>
                      <Text style={s.label}>{label} {required && <Text style={s.req}>*</Text>}</Text>
                      <View style={[s.inputWrap, touched[field as keyof typeof values] && errors[field as keyof typeof values] ? s.inputWrapError : null]}>
                        <TextInput
                          style={s.input} placeholder={placeholder} placeholderTextColor={COLORS.textLight}
                          keyboardType={keyboard}
                          autoCapitalize={field === 'phone' ? 'none' : 'sentences'}
                          onChangeText={handleChange(field)} onBlur={handleBlur(field)}
                          value={values[field as keyof typeof values]}
                          multiline={field === 'address'} numberOfLines={field === 'address' ? 3 : 1}
                        />
                      </View>
                      {touched[field as keyof typeof values] && errors[field as keyof typeof values] && (
                        <Text style={s.errorText}>{errors[field as keyof typeof values] as string}</Text>
                      )}
                    </View>
                  ))}

                  <Pressable
                    style={({ pressed }) => [s.saveBtn, pressed && { opacity: 0.88 }]}
                    onPress={() => handleSubmit()} disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={s.saveBtnText}>Save Changes</Text>}
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingBottom: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 22, color: COLORS.text },
  headerTitle: { fontSize: 16, fontWeight: FONTS.bold, color: COLORS.text },
  body: { padding: 20 },
  avatarWrap: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  avatarName: { fontSize: 16, fontWeight: FONTS.bold, color: COLORS.text },
  avatarEmail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  form: {},
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: FONTS.semiBold, color: COLORS.text, marginBottom: 8 },
  req: { color: COLORS.error },
  inputWrap: {
    borderWidth: 1.5, borderColor: COLORS.borderDark, borderRadius: RADIUS.md,
    backgroundColor: COLORS.background, paddingHorizontal: 14, justifyContent: 'center',
    minHeight: 48,
  },
  inputWrapError: { borderColor: COLORS.error, backgroundColor: COLORS.errorLight },
  input: { fontSize: 14, color: COLORS.text, paddingVertical: 10 },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: FONTS.bold },
});
