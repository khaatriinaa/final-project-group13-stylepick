// src/screens/buyer/Profile/BuyerChangePasswordScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert,
  StyleSheet, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, Platform, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabaseClient';

type Field = 'current' | 'new' | 'confirm';

export default function BuyerChangePasswordScreen() {
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

      // Re-authenticate for security
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });
      if (authError) throw new Error("Current password is incorrect.");

      // Perform update
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
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ backgroundColor: '#111827' }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <Pressable style={s.backBtn} onPress={handleCancel}>
              <Text style={s.backBtnText}>‹</Text>
            </Pressable>
            <Text style={s.headerTitle}>Change Password</Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={s.sectionLabel}>Security</Text>
          <View style={s.card}>
            {renderField('Current Password', current, setCurrent, 'current', 'Enter current password')}
            {renderField('New Password', next, setNext, 'new', 'At least 8 characters')}
            {renderField('Confirm Password', confirm, setConfirm, 'confirm', 'Re-enter new password', true)}
          </View>
          <Text style={s.hint}>Use a strong password with letters and numbers.</Text>

          <View style={s.buttonWrap}>
            <Pressable
              style={[s.saveBtn, (!isDirty || saving) && s.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!isDirty || saving}
            >
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={s.saveBtnText}>Save Changes</Text>}
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111827', paddingBottom: 16, paddingHorizontal: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 24, color: '#FFFFFF', lineHeight: 28 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginTop: 24, marginBottom: 8, marginHorizontal: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  fieldWrap: { paddingHorizontal: 16, paddingVertical: 14 },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, fontWeight: '500', color: '#111827', minHeight: 36 },
  eyeBtn: { paddingLeft: 8 },
  eyeText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  hint: { fontSize: 12, color: '#9CA3AF', marginHorizontal: 20, marginTop: 10 },
  buttonWrap: { paddingHorizontal: 16, marginTop: 20 },
  saveBtn: { backgroundColor: '#111827', borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center' },
  saveBtnDisabled: { backgroundColor: '#D1D5DB' },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});