// src/screens/seller/Profile/SellerChangePasswordScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert,
  StyleSheet, ScrollView, ActivityIndicator, SafeAreaView,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabaseClient';

type Field = 'current' | 'new' | 'confirm';

export default function SellerChangePasswordScreen() {
  const navigation = useNavigation();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState<Record<Field, boolean>>({
    current: false, new: false, confirm: false,
  });
  const [saving, setSaving] = useState(false);

  const toggle = (field: Field) =>
    setVisible((v) => ({ ...v, [field]: !v[field] }));

  const isDirty = current.trim() !== '' || next.trim() !== '' || confirm.trim() !== '';

  const handleSave = async () => {
    if (!current.trim()) {
      Alert.alert('Validation', 'Please enter your current password.'); return;
    }
    if (next.length < 8) {
      Alert.alert('Validation', 'New password must be at least 8 characters.'); return;
    }
    if (next !== confirm) {
      Alert.alert('Validation', 'New passwords do not match.'); return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("No active session found.");

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });
      if (authError) throw new Error("Current password is incorrect.");

      const { error: updateError } = await supabase.auth.updateUser({ password: next });
      if (updateError) throw updateError;

      Alert.alert('Success', 'Your password has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not update password.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert('Discard Changes', 'You have unsaved changes. Discard them?', [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const renderField = (
    label: string, value: string, onChange: (v: string) => void,
    field: Field, placeholder: string, isLast = false,
  ) => (
    <View key={field} style={[s.fieldWrap, !isLast && s.fieldBorder]}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!visible[field]}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType={isLast ? 'done' : 'next'}
          onSubmitEditing={isLast ? handleSave : undefined}
        />
        <Pressable onPress={() => toggle(field)} style={s.eyeBtn}>
          <Text style={s.eyeText}>{visible[field] ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={s.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ backgroundColor: '#FFFFFF' }} />
      <View style={s.topBar}>
        <Pressable onPress={handleCancel} style={s.topBtn}>
          <Text style={s.topBtnText}>Cancel</Text>
        </Pressable>
        <Text style={s.topTitle}>Change Password</Text>
        <Pressable onPress={handleSave} disabled={!isDirty || saving} style={s.topBtn}>
          {saving 
            ? <ActivityIndicator size="small" color="#111827" />
            : <Text style={[s.topBtnText, s.topBtnSave, !isDirty && s.topBtnDisabled]}>Save</Text>
          }
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.card}>
          {renderField('Current Password', current, setCurrent, 'current', 'Enter current password')}
          {renderField('New Password', next, setNext, 'new', 'At least 8 characters')}
          {renderField('Confirm Password', confirm, setConfirm, 'confirm', 'Re-enter new password', true)}
        </View>
        <Text style={s.hint}>Use a strong password with letters and numbers.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  topTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  topBtn: { minWidth: 60, alignItems: 'center' },
  topBtnText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  topBtnSave: { color: '#111827' },
  topBtnDisabled: { color: '#D1D5DB' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 16, marginTop: 24, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  fieldWrap: { paddingHorizontal: 16, paddingVertical: 14 },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontSize: 15, fontWeight: '500', color: '#111827' },
  eyeBtn: { paddingLeft: 8 },
  eyeText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  hint: { fontSize: 12, color: '#9CA3AF', marginHorizontal: 20, marginTop: 10 },
});