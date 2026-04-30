// src/screens/seller/Profile/SellerEditProfileScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert,
  StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

export default function SellerEditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);

  const isDirty = name.trim() !== (user?.name ?? '').trim();

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: trimmed });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save changes. Please try again.');
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

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Header row ── */}
      <View style={s.topBar}>
        <Pressable onPress={handleCancel} style={({ pressed }) => [s.topBtn, pressed && s.topBtnPressed]}>
          <Text style={s.topBtnText}>Cancel</Text>
        </Pressable>
        <Text style={s.topTitle}>Edit Profile</Text>
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
        <View style={s.fieldWrap}>
          <Text style={s.fieldLabel}>Full Name</Text>
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </View>
      </View>

      <Text style={s.hint}>
        Your name is shown to buyers across the platform.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 40,
  },

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
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  topBtn: {
    minWidth: 60,
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  topBtnPressed: {
    backgroundColor: '#F3F4F6',
  },
  topBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  topBtnSave: {
    color: '#111827',
  },
  topBtnDisabled: {
    color: '#D1D5DB',
  },

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
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 0,
  },

  /* ── Hint ── */
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 20,
    marginTop: 10,
    lineHeight: 18,
  },
});