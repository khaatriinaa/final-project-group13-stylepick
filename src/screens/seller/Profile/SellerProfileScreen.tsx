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
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

const ACCOUNT_MENU = [
  { id: 'location', label: 'Store Location' },
  { id: 'notifs',   label: 'Notifications' },
  { id: 'password', label: 'Change Password' },
];
const PREF_MENU = [
  { id: 'reports', label: 'Sales Reports' },
  { id: 'help',    label: 'Help & Support' },
];

export default function SellerProfileScreen({ navigation }: SellerProfileScreenProps) {
  const { user, logout, updateProfile } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(user?.profilePicture ?? null);
  const [locLoading, setLocLoading] = useState(false);

  useFocusEffect(useCallback(() => { setImageUri(user?.profilePicture ?? null); }, [user?.profilePicture]));

  const handlePicture = () => {
    Alert.alert('Store Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission Denied', 'Camera permission is required.'); return; }
        const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
        if (!r.canceled) { const uri = r.assets[0].uri; setImageUri(uri); await updateProfile({ profilePicture: uri }); }
      }},
      { text: 'Choose from Gallery', onPress: async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission Denied', 'Gallery permission is required.'); return; }
        const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
        if (!r.canceled) { const uri = r.assets[0].uri; setImageUri(uri); await updateProfile({ profilePicture: uri }); }
      }},
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
    } catch { Alert.alert('Error', 'Could not get location.'); }
    finally { setLocLoading(false); }
  };

  const handleMenuItem = (id: string) => {
    if (id === 'location') getLocation();
    if (id === 'notifs')   (navigation as any).navigate('SellerNotifications');
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

  const renderMenu = (items: { id: string; label: string }[]) => (
    <View style={s.card}>
      {items.map((item, i) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [s.menuItem, i < items.length - 1 && s.menuItemBorder, pressed && s.menuItemPressed]}
          onPress={() => handleMenuItem(item.id)}
          disabled={item.id === 'location' && locLoading}
        >
          <Text style={s.menuLabel}>{item.label}</Text>
          {item.id === 'location' && locLoading
            ? <ActivityIndicator size="small" color={COLORS.info} />
            : <Text style={s.menuArrow}>›</Text>
          }
        </Pressable>
      ))}
    </View>
  );

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Pressable style={s.avatarWrap} onPress={handlePicture}>
          {imageUri
            ? <Image source={{ uri: imageUri }} style={s.avatarImg} />
            : <View style={s.avatarFallback}>
                <Text style={s.avatarInitial}>{user?.name?.charAt(0).toUpperCase() ?? 'S'}</Text>
              </View>
          }
          <View style={[s.cameraTag, { backgroundColor: COLORS.info }]}><Text style={s.cameraTagText}>Edit</Text></View>
        </Pressable>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.roleBadge}><Text style={s.roleText}>SELLER</Text></View>
        {user?.address && <Text style={s.address} numberOfLines={1}>{user.address}</Text>}
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>ACCOUNT</Text>
        {renderMenu(ACCOUNT_MENU)}
      </View>
      <View style={s.section}>
        <Text style={s.sectionLabel}>PREFERENCES</Text>
        {renderMenu(PREF_MENU)}
      </View>
      <View style={s.section}>
        <View style={s.card}>
          <Pressable style={({ pressed }) => [s.menuItem, pressed && s.menuItemPressed]} onPress={handleLogout}>
            <Text style={[s.menuLabel, { color: COLORS.error }]}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.info, paddingTop: 56, paddingBottom: 24,
    alignItems: 'center',
  },
  avatarWrap: { marginBottom: 12, position: 'relative' },
  avatarImg: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  avatarFallback: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 32, fontWeight: FONTS.bold, color: COLORS.white },
  cameraTag: {
    position: 'absolute', bottom: -4, right: -4,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  cameraTagText: { fontSize: 10, color: COLORS.white, fontWeight: FONTS.bold },
  name: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.white },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  roleBadge: {
    marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 4,
  },
  roleText: { fontSize: 11, fontWeight: FONTS.bold, color: COLORS.white, letterSpacing: 1 },
  address: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, maxWidth: 260, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionLabel: { fontSize: 11, fontWeight: FONTS.bold, color: COLORS.textLight, letterSpacing: 0.8, marginBottom: 8 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuItemPressed: { backgroundColor: COLORS.background },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: FONTS.medium, color: COLORS.text },
  menuArrow: { fontSize: 18, color: COLORS.textLight },
});
