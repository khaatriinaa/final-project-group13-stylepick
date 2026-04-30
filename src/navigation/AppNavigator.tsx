// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, View, Pressable, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import SellerEditProfileScreen from '../screens/seller/Profile/SellerEditProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import {
  RootStackParamList,
  AuthStackParamList,
  BuyerStackParamList,
  BuyerTabParamList,
  SellerStackParamList,
  SellerTabParamList,
} from '../props/props';

// Auth
import LoginScreen from '../screens/auth/Login/LoginScreen';
import RegisterScreen from '../screens/auth/Register/RegisterScreen';

// Buyer
import BuyerHomeScreen from '../screens/buyer/Home/BuyerHomeScreen';
import ProductDetailScreen from '../screens/buyer/ProductDetail/ProductDetailScreen';
import CartScreen from '../screens/buyer/Cart/CartScreen';
import BuyerOrdersScreen from '../screens/buyer/Orders/BuyerOrdersScreen';
import BuyerOrderDetailScreen from '../screens/buyer/Orders/BuyerOrderDetailScreen';
import BuyerProfileScreen from '../screens/buyer/Profile/BuyerProfileScreen';
import CheckoutScreen from '../screens/buyer/Checkout/CheckoutScreen';
import BuyerNotificationsScreen from '../screens/buyer/Notifications/BuyerNotificationsScreen';
import EditProfileScreen from '../screens/buyer/EditProfile/EditProfileScreen';
import FavoritesScreen from '../screens/buyer/Favorites/FavoritesScreen'; // 👈 added

// Seller
import SellerDashboardScreen from '../screens/seller/Dashboard/SellerDashboardScreen';
import SellerProductsScreen from '../screens/seller/Products/SellerProductsScreen';
import AddProductScreen from '../screens/seller/AddProduct/AddProductScreen';
import SellerOrdersScreen from '../screens/seller/Orders/SellerOrdersScreen';
import SellerOrderDetailScreen from '../screens/seller/Orders/SellerOrderDetailScreen';
import SellerProfileScreen from '../screens/seller/Profile/SellerProfileScreen';
import SellerNotificationsScreen from '../screens/seller/Notifications/SellerNotificationsScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const BuyerStack = createNativeStackNavigator<BuyerStackParamList>();
const BuyerTab = createBottomTabNavigator<BuyerTabParamList>();
const SellerStack = createNativeStackNavigator<SellerStackParamList>();
const SellerTab = createBottomTabNavigator<SellerTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function BuyerTabNavigator() {
  return (
    <BuyerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, { focused: string; outline: string }> = {
            Home:    { focused: 'home',            outline: 'home-outline' },
            Cart:    { focused: 'bag',             outline: 'bag-outline' },
            Orders:  { focused: 'receipt',         outline: 'receipt-outline' },
            Profile: { focused: 'person',          outline: 'person-outline' },
          };
          const icon = icons[route.name];
          return (
            <Ionicons
              name={(focused ? icon.focused : icon.outline) as any}
              size={22}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#E63946',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <BuyerTab.Screen name="Home" component={BuyerHomeScreen} />
      <BuyerTab.Screen name="Cart" component={CartScreen} />
      <BuyerTab.Screen name="Orders" component={BuyerOrdersScreen} />
      <BuyerTab.Screen name="Profile" component={BuyerProfileScreen} />
    </BuyerTab.Navigator>
  );
}

function BuyerNavigator() {
  return (
    <BuyerStack.Navigator screenOptions={{ headerShown: false }}>
      <BuyerStack.Screen name="BuyerTabs" component={BuyerTabNavigator} />
      <BuyerStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <BuyerStack.Screen name="BuyerOrderDetail" component={BuyerOrderDetailScreen} />
      <BuyerStack.Screen name="Checkout" component={CheckoutScreen} />
      <BuyerStack.Screen name="BuyerNotifications" component={BuyerNotificationsScreen} />
      <BuyerStack.Screen name="EditProfile" component={EditProfileScreen} />
      <BuyerStack.Screen name="Favorites" component={FavoritesScreen} /> 
    </BuyerStack.Navigator>
  );
}

function AddProductTabButton() {
  const nav = useNavigation<NativeStackNavigationProp<SellerStackParamList>>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable
        style={({ pressed }) => [navStyles.fab, pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] }]}
        onPress={() => nav.navigate('AddProduct', { productId: undefined })}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function SellerTabNavigator() {
  return (
    <SellerTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: navStyles.tabBar,
        tabBarLabelStyle: navStyles.tabLabel,
      }}
    >
      <SellerTab.Screen
        name="Dashboard"
        component={SellerDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} />
          ),
        }}
      />
      <SellerTab.Screen
        name="SellerOrders"
        component={SellerOrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'cube' : 'cube-outline'} size={22} color={color} />
          ),
        }}
      />
      <SellerTab.Screen
        name={"AddProductTab" as any}
        component={SellerProductsScreen}
        options={{ tabBarLabel: '', tabBarButton: () => <AddProductTabButton /> }}
      />
      <SellerTab.Screen
        name="Products"
        component={SellerProductsScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'pricetag' : 'pricetag-outline'} size={22} color={color} />
          ),
        }}
      />
      <SellerTab.Screen
        name="SellerProfile"
        component={SellerProfileScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={22} color={color} />
          ),
        }}
      />
    </SellerTab.Navigator>
  );
}

function SellerNavigator() {
  return (
    <SellerStack.Navigator screenOptions={{ headerShown: false }}>
      <SellerStack.Screen name="SellerTabs" component={SellerTabNavigator} />
      <SellerStack.Screen name="AddProduct" component={AddProductScreen} />
      <SellerStack.Screen name="SellerNotifications" component={SellerNotificationsScreen} />
      <SellerStack.Screen name="SellerOrderDetail" component={SellerOrderDetailScreen} />
      <SellerStack.Screen name="SellerEditProfile" component={SellerEditProfileScreen} />
    </SellerStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : user.role === 'buyer' ? (
          <RootStack.Screen name="Buyer" component={BuyerNavigator} />
        ) : (
          <RootStack.Screen name="Seller" component={SellerNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const navStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
  },
  tabLabel: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
  },
});