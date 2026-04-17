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
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

const MENU = [
  { id: 'edit',     label: 'Edit Profile' },
  { id: 'location', label: 'Get Current Location' },
  { id: 'notifs',   label: 'Notifications' },
  { id: 'password', label: 'Change Password' },
  { id: 'help',     label: 'Help & Support' },
];

export default function BuyerProfileScreen({ navigation }: BuyerProfileScreenProps) {
  const { user, logout, updateProfile } = useAuth();
  const [imageUri, setImageUri] = useState<string | null>(user?.profilePicture ?? null);
  const [locationLoading, setLocationLoading] = useState(false);

  useFocusEffect(useCallback(() => { setImageUri(user?.profilePicture ?? null); }, [user?.profilePicture]));

  const handleChangePicture = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
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
    } catch { Alert.alert('Error', 'Could not get location.'); }
    finally { setLocationLoading(false); }
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
    if (id === 'password') Alert.alert('Coming Soon', 'Change password feature coming soon.');
    if (id === 'help')     Alert.alert('Help & Support', 'Contact us at support@shopgo.ph');
  };

  return (
    <ScrollView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.avatarWrap} onPress={handleChangePicture}>
          {imageUri
            ? <Image source={{ uri: imageUri }} style={s.avatarImg} />
            : <View style={s.avatarFallback}>
                <Text style={s.avatarInitial}>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</Text>
              </View>
          }
          <View style={s.cameraTag}><Text style={s.cameraTagText}>Edit</Text></View>
        </Pressable>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.email}>{user?.email}</Text>
        {user?.address && <Text style={s.address} numberOfLines={1}>{user.address}</Text>}
      </View>

      {/* General section */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>GENERAL</Text>
        <View style={s.card}>
          {MENU.slice(0, 3).map((item, i, arr) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [s.menuItem, i < arr.length - 1 && s.menuItemBorder, pressed && s.menuItemPressed]}
              onPress={() => handleMenuItem(item.id)}
              disabled={item.id === 'location' && locationLoading}
            >
              <Text style={s.menuLabel}>{item.label}</Text>
              {item.id === 'location' && locationLoading
                ? <ActivityIndicator size="small" color={COLORS.primary} />
                : <Text style={s.menuArrow}>›</Text>
              }
            </Pressable>
          ))}
        </View>
      </View>

      {/* Preferences section */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>PREFERENCES</Text>
        <View style={s.card}>
          {MENU.slice(3).map((item, i, arr) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [s.menuItem, i < arr.length - 1 && s.menuItemBorder, pressed && s.menuItemPressed]}
              onPress={() => handleMenuItem(item.id)}
            >
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Logout */}
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
    backgroundColor: COLORS.white, paddingTop: 56,
    paddingBottom: 24, alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  avatarWrap: { marginBottom: 12, position: 'relative' },
  avatarImg: { width: 80, height: 80, borderRadius: 40 },
  avatarFallback: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 32, fontWeight: FONTS.bold, color: COLORS.primary },
  cameraTag: {
    position: 'absolute', bottom: -4, right: -4,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  cameraTagText: { fontSize: 10, color: COLORS.white, fontWeight: FONTS.bold },
  name: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: 2 },
  email: { fontSize: 13, color: COLORS.textSecondary },
  address: { fontSize: 12, color: COLORS.textLight, marginTop: 4, maxWidth: 260, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionLabel: { fontSize: 11, fontWeight: FONTS.bold, color: COLORS.textLight, letterSpacing: 0.8, marginBottom: 8 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuItemPressed: { backgroundColor: COLORS.background },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: FONTS.medium, color: COLORS.text },
  menuArrow: { fontSize: 18, color: COLORS.textLight },
});
