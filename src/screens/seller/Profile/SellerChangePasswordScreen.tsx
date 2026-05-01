// src/screens/seller/Profile/SellerChangePasswordScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert,
  StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

type Field = 'current' | 'new' | 'confirm';

export default function SellerChangePasswordScreen() {
  const navigation = useNavigation();
  const { updateProfile } = useAuth();

  const [current, setCurrent]   = useState('');
  const [next, setNext]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [visible, setVisible]   = useState<Record<Field, boolean>>({
    current: false, new: false, confirm: false,
  });
  const [saving, setSaving]     = useState(false);

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
      // TODO: wire to your real password-change API
      await new Promise((r) => setTimeout(r, 800)); // mock delay
      Alert.alert('Success', 'Your password has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not update password. Please try again.');
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
    label: string,
    value: string,
    onChange: (v: string) => void,
    field: Field,
    placeholder: string,
    isLast = false,
  ) => (
    <View style={[s.fieldWrap, !isLast && s.fieldBorder]}>
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
        <Pressable
          onPress={() => toggle(field)}
          style={({ pressed }) => [s.eyeBtn, pressed && { opacity: 0.5 }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {/* ← replaced emoji with formal "Show" / "Hide" labels */}
          <Text style={s.eyeText}>{visible[field] ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Top bar ── */}
      <View style={s.topBar}>
        <Pressable
          onPress={handleCancel}
          style={({ pressed }) => [s.topBtn, pressed && s.topBtnPressed]}
        >
          <Text style={s.topBtnText}>Cancel</Text>
        </Pressable>
        <Text style={s.topTitle}>Change Password</Text>
        <Pressable
          onPress={handleSave}
          disabled={!isDirty || saving}
          style={({ pressed }) => [s.topBtn, pressed && s.topBtnPressed]}
        >
          {saving
            ? <ActivityIndicator size="small" color="#111827" />
            : <Text style={[s.topBtnText, s.topBtnSave, !isDirty && s.topBtnDisabled]}>Save</Text>
          }
        </Pressable>
      </View>

      {/* ── Form ── */}
      <View style={s.card}>
        {renderField('Current Password', current, setCurrent, 'current', 'Enter current password')}
        {renderField('New Password',     next,    setNext,    'new',     'At least 8 characters')}
        {renderField('Confirm Password', confirm, setConfirm, 'confirm', 'Re-enter new password', true)}
      </View>

      <Text style={s.hint}>
        Use a strong password with a mix of letters, numbers, and symbols.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content:   { paddingBottom: 40 },

  /* ── Top bar ── */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  topBtn: {
    minWidth: 60,
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  topBtnPressed:  { backgroundColor: '#F3F4F6' },
  topBtnText:     { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  topBtnSave:     { color: '#111827' },
  topBtnDisabled: { color: '#D1D5DB' },

  /* ── Form card ── */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  fieldWrap: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 0,
  },
  eyeBtn:  { paddingLeft: 8 },
  eyeText: { fontSize: 13, fontWeight: '600', color: '#6B7280' }, // ← styled to match form tone
  
  /* ── Hint ── */
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 20,
    marginTop: 10,
    lineHeight: 18,
  },
});