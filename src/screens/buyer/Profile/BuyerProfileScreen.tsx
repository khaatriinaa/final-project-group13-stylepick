// src/screens/buyer/Profile/BuyerProfileScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Alert,
  Image, ActivityIndicator, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { BuyerProfileScreenProps } from '../../../props/props';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../services/supabaseClient';

const MENU_GENERAL = [
  { id: 'edit',     label: 'Edit Profile',         symbol: '›', icon: '✎' },
  { id: 'location', label: 'Get Current Location', symbol: '›', icon: '⚲' },
  { id: 'notifs',   label: 'Notifications',        symbol: '›', icon: '▤' },
];

const MENU_PREFERENCES = [
  { id: 'password', label: 'Change Password',      symbol: '›', icon: '🗝' },
  { id: 'help',     label: 'Help & Support',       symbol: '›', icon: 'ⓘ' },
];

// ─── Upload avatar to Supabase Storage ───────────────────────────────────────
const uploadAvatar = async (localUri: string, userId: string): Promise<string> => {
  if (localUri.startsWith('http://') || localUri.startsWith('https://')) {
    return localUri;
  }
  try {
    const fileName    = `${userId}_${Date.now()}.jpg`;
    const filePath    = `avatars/${fileName}`;
    const response    = await fetch(localUri);
    if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert:      true,
      });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    console.log('Buyer avatar uploaded:', data.publicUrl); // ✅ DEBUG
    return data.publicUrl;
  } catch (err) {
    console.warn('Buyer avatar upload failed:', err); // ✅ DEBUG
    return localUri;
  }
};
// ─────────────────────────────────────────────────────────────────────────────

export default function BuyerProfileScreen({ navigation }: BuyerProfileScreenProps) {
  const { user, logout, updateProfile } = useAuth();
  const [imageUri, setImageUri]         = useState<string | null>(user?.profilePicture ?? null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [avatarLoading, setAvatarLoading]     = useState(false);

  // ─── Fetch latest avatar from Supabase on focus ───────────────────────────
  useFocusEffect(useCallback(() => {
    const fetchAvatar = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', authUser.id)
        .single();
      if (data?.avatar_url) {
        setImageUri(data.avatar_url);
        await updateProfile({ profilePicture: data.avatar_url });
      } else {
        setImageUri(user?.profilePicture ?? null);
      }
    };
    fetchAvatar();
  }, [user?.profilePicture]));
  // ─────────────────────────────────────────────────────────────────────────

  const handleChangePicture = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
      {
        text: 'Take Photo', onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission Denied', 'Camera permission is required.'); return; }
          const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
          if (!r.canceled) await processAvatar(r.assets[0].uri);
        },
      },
      {
        text: 'Choose from Gallery', onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission Denied', 'Gallery permission is required.'); return; }
          const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
          if (!r.canceled) await processAvatar(r.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const processAvatar = async (localUri: string) => {
    setAvatarLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not logged in');

      // ─── Upload to Supabase Storage ───────────────────────────────
      const publicUrl = await uploadAvatar(localUri, authUser.id);
      setImageUri(publicUrl);

      // ─── Save public URL to profiles table ───────────────────────
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', authUser.id);

      // ─── Save to buyer_profiles table ────────────────────────────
      await supabase
        .from('buyer_profiles')
        .upsert({ id: authUser.id, avatar_url: publicUrl });

      // ─── Save to local auth context ───────────────────────────────
      await updateProfile({ profilePicture: publicUrl });

      Alert.alert('Success', 'Profile photo updated!');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to upload photo.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission Denied', 'Location permission is required.'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
      const [place] = await Location.reverseGeocodeAsync(loc.coords);
      const address = [place.street, place.city ?? place.subregion, place.region].filter(Boolean).join(', ');
      await updateProfile({ address });
      Alert.alert('Location Updated', address);
    } catch {
      Alert.alert('Error', 'Could not get location.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleMenuItem = (id: string) => {
    if (id === 'edit')     navigation.navigate('EditProfile' as any);
    if (id === 'location') getCurrentLocation();
    if (id === 'notifs')   navigation.navigate('BuyerNotifications' as any);
    if (id === 'password') navigation.navigate('BuyerChangePassword' as any);
    if (id === 'help')     navigation.navigate('BuyerHelpSupport' as any);
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable style={s.avatarWrap} onPress={handleChangePicture} disabled={avatarLoading}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={s.avatarImg} />
          ) : (
            <View style={s.avatarFallback}>
              <Text style={s.avatarInitial}>{initial}</Text>
            </View>
          )}
          {avatarLoading ? (
            <View style={s.avatarOverlay}>
              <ActivityIndicator color="#FFFFFF" />
            </View>
          ) : (
            <View style={s.editBadge}>
              <Text style={s.editBadgeText}>✎</Text>
            </View>
          )}
        </Pressable>

        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.email}>{user?.email}</Text>

        {user?.address ? (
          <View style={s.addressRow}>
            <Text style={s.addressPin}>⚲</Text>
            <Text style={s.address} numberOfLines={2}>{user.address}</Text>
          </View>
        ) : null}
      </View>

      {/* ── General ── */}
      <View style={s.sectionWrap}>
        <Text style={s.sectionLabel}>General</Text>
        <View style={s.card}>
          {MENU_GENERAL.map((item, i) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                s.menuItem,
                i < MENU_GENERAL.length - 1 && s.menuItemBorder,
                pressed && s.menuItemPressed,
              ]}
              onPress={() => handleMenuItem(item.id)}
              disabled={item.id === 'location' && locationLoading}
            >
              <View>
                <Text style={s.menuIconText}></Text>
              </View>
              <Text style={s.menuLabel}>{item.label}</Text>
              {item.id === 'location' && locationLoading ? (
                <ActivityIndicator size="small" color="#111827" />
              ) : (
                <Text style={s.menuArrow}>{item.symbol}</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Preferences ── */}
      <View style={s.sectionWrap}>
        <Text style={s.sectionLabel}>Preferences</Text>
        <View style={s.card}>
          {MENU_PREFERENCES.map((item, i) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                s.menuItem,
                i < MENU_PREFERENCES.length - 1 && s.menuItemBorder,
                pressed && s.menuItemPressed,
              ]}
              onPress={() => handleMenuItem(item.id)}
            >
              <View>
                <Text style={s.menuIconText}></Text>
              </View>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuArrow}>{item.symbol}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Sign Out ── */}
      <View style={s.sectionWrap}>
        <View style={s.card}>
          <Pressable
            style={({ pressed }) => [s.menuItem, pressed && s.menuItemPressed]}
            onPress={handleLogout}
          >
            <View>
              <Text style={[s.menuIconText, s.logoutIconText]}></Text>
            </View>
            <Text style={s.logoutLabel}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  /* ── Header ── */
  header: {
    backgroundColor: '#111827',
    paddingTop: 56,
    paddingBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarWrap: {
    marginBottom: 16,
    position: 'relative',
  },
  avatarImg: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarFallback: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 42,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    backgroundColor: '#374151',
    borderRadius: 13,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#111827',
  },
  editBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 4,
  },
  addressPin: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  address: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },

  /* ── Sections ── */
  sectionWrap: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  /* ── Menu items ── */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },

  /* ── Logout ── */
  logoutIconWrap: {
    backgroundColor: '#1F2937',
  },
  logoutIconText: {
    color: '#F87171',
    fontSize: 16,
  },
  logoutLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#E63946',
  },
});