// src/screens/seller/Profile/SellerProfileScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Alert,
  Image, ActivityIndicator, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { SellerProfileScreenProps } from '../../../props/props';
import { useAuth } from '../../../context/AuthContext';

const ACCOUNT_MENU = [
  { id: 'edit',     label: 'Edit Profile'    },
  { id: 'location', label: 'Store Location'  },
  { id: 'notifs',   label: 'Notifications'   },
  { id: 'password', label: 'Change Password' },
];

const PREF_MENU = [
  { id: 'reports', label: 'Sales Reports'  },
  { id: 'help',    label: 'Help & Support' },
];

export default function SellerProfileScreen({ navigation }: SellerProfileScreenProps) {
  const { user, logout, updateProfile } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(user?.profilePicture ?? null);
  const [locLoading, setLocLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    setImageUri(user?.profilePicture ?? null);
  }, [user?.profilePicture]));

  const handlePicture = () => {
    Alert.alert('Store Photo', 'Choose an option', [
      {
        text: 'Take Photo', onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission Denied', 'Camera permission is required.'); return; }
          const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
          if (!r.canceled) {
            const uri = r.assets[0].uri;
            setImageUri(uri);
            await updateProfile({ profilePicture: uri });
          }
        },
      },
      {
        text: 'Choose from Gallery', onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission Denied', 'Gallery permission is required.'); return; }
          const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
          if (!r.canceled) {
            const uri = r.assets[0].uri;
            setImageUri(uri);
            await updateProfile({ profilePicture: uri });
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const getLocation = async () => {
    setLocLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission Denied', 'Location permission is required.'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
      const [place] = await Location.reverseGeocodeAsync(loc.coords);
      const address = [place.street, place.city ?? place.subregion, place.region].filter(Boolean).join(', ');
      await updateProfile({ address });
      Alert.alert('Location Set', address);
    } catch {
      Alert.alert('Error', 'Could not get location.');
    } finally {
      setLocLoading(false);
    }
  };

  const handleMenuItem = (id: string) => {
    // ✅ FIX: use navigation.navigate directly — no more (navigation as any)
    if (id === 'edit')     navigation.navigate('SellerEditProfile');
    if (id === 'location') getLocation();
    if (id === 'notifs')   navigation.navigate('SellerNotifications');
    if (id === 'password') Alert.alert('Coming Soon', 'Change password feature coming soon.');
    if (id === 'reports')  Alert.alert('Coming Soon', 'Sales reports coming soon.');
    if (id === 'help')     Alert.alert('Help & Support', 'Contact us at support@shopgo.ph');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const renderMenu = (
    items: { id: string; label: string }[],
    sectionTitle: string,
  ) => (
    <View style={s.sectionWrap}>
      <Text style={s.sectionLabel}>{sectionTitle}</Text>
      <View style={s.card}>
        {items.map((item, i) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              s.menuItem,
              i < items.length - 1 && s.menuItemBorder,
              pressed && s.menuItemPressed,
            ]}
            onPress={() => handleMenuItem(item.id)}
            disabled={item.id === 'location' && locLoading}
          >
            <Text style={s.menuLabel}>{item.label}</Text>
            {item.id === 'location' && locLoading
              ? <ActivityIndicator size="small" color="#111827" />
              : <Text style={s.menuArrow}>›</Text>
            }
          </Pressable>
        ))}
      </View>
    </View>
  );

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'S';

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable style={s.avatarWrap} onPress={handlePicture}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={s.avatarImg} />
          ) : (
            <View style={s.avatarFallback}>
              <Text style={s.avatarInitial}>{initial}</Text>
            </View>
          )}
          <View style={s.editBadge}>
            <Text style={s.editBadgeText}>Edit</Text>
          </View>
        </Pressable>

        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.email}>{user?.email}</Text>

        <View style={s.roleBadge}>
          <Text style={s.roleText}>SELLER</Text>
        </View>

        {user?.address ? (
          <Text style={s.address} numberOfLines={2}>{user.address}</Text>
        ) : null}
      </View>

      {renderMenu(ACCOUNT_MENU, 'Account')}
      {renderMenu(PREF_MENU, 'Preferences')}

      {/* ── Sign Out ── */}
      <View style={s.sectionWrap}>
        <View style={s.card}>
          <Pressable
            style={({ pressed }) => [s.menuItem, pressed && s.menuItemPressed]}
            onPress={handleLogout}
          >
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
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#374151',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: '#111827',
  },
  editBadgeText: {
    fontSize: 10,
    fontWeight: '700',
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
  roleBadge: {
    marginTop: 6,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  address: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
    paddingHorizontal: 30,
  },
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
  logoutLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#E63946',
  },
});