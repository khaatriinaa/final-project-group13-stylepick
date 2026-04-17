// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

import {
  RootStackParamList,
  AuthStackParamList,
  BuyerStackParamList,
  BuyerTabParamList,
  SellerStackParamList,
  SellerTabParamList,
} from '../props/props';

// Auth
import LoginScreen    from '../screens/auth/Login/LoginScreen';
import RegisterScreen from '../screens/auth/Register/RegisterScreen';

// Buyer
import BuyerHomeScreen            from '../screens/buyer/Home/BuyerHomeScreen';
import ProductDetailScreen        from '../screens/buyer/ProductDetail/ProductDetailScreen';
import CartScreen                 from '../screens/buyer/Cart/CartScreen';
import BuyerOrdersScreen          from '../screens/buyer/Orders/BuyerOrdersScreen';
import BuyerOrderDetailScreen     from '../screens/buyer/Orders/BuyerOrderDetailScreen';
import BuyerProfileScreen         from '../screens/buyer/Profile/BuyerProfileScreen';
import CheckoutScreen             from '../screens/buyer/Checkout/CheckoutScreen';
import BuyerNotificationsScreen   from '../screens/buyer/Notifications/BuyerNotificationsScreen';
import EditProfileScreen          from '../screens/buyer/EditProfile/EditProfileScreen';

// Seller
import SellerDashboardScreen      from '../screens/seller/Dashboard/SellerDashboardScreen';
import SellerProductsScreen       from '../screens/seller/Products/SellerProductsScreen';
import AddProductScreen           from '../screens/seller/AddProduct/AddProductScreen';
import SellerOrdersScreen         from '../screens/seller/Orders/SellerOrdersScreen';
import SellerProfileScreen        from '../screens/seller/Profile/SellerProfileScreen';
import SellerNotificationsScreen  from '../screens/seller/Notifications/SellerNotificationsScreen';

const RootStack  = createNativeStackNavigator<RootStackParamList>();
const AuthStack  = createNativeStackNavigator<AuthStackParamList>();
const BuyerStack = createNativeStackNavigator<BuyerStackParamList>();
const BuyerTab   = createBottomTabNavigator<BuyerTabParamList>();
const SellerStack = createNativeStackNavigator<SellerStackParamList>();
const SellerTab  = createBottomTabNavigator<SellerTabParamList>();

// ─── Auth ─────────────────────────────────────────────────────
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login"    component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// ─── Buyer Tabs ───────────────────────────────────────────────
function BuyerTabNavigator() {
  return (
    <BuyerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          const icons: Record<string, string> = {
            Home: '⌂', Cart: '⊕', Orders: '◫', Profile: '◎',
          };
          return (
            <Text style={{ fontSize: 18, color: focused ? '#E63946' : '#9CA3AF' }}>
              {icons[route.name]}
            </Text>
          );
        },
        tabBarActiveTintColor:   '#E63946',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 84,
          paddingBottom: 24,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <BuyerTab.Screen name="Home"    component={BuyerHomeScreen} />
      <BuyerTab.Screen name="Cart"    component={CartScreen} />
      <BuyerTab.Screen name="Orders"  component={BuyerOrdersScreen} />
      <BuyerTab.Screen name="Profile" component={BuyerProfileScreen} />
    </BuyerTab.Navigator>
  );
}

function BuyerNavigator() {
  return (
    <BuyerStack.Navigator screenOptions={{ headerShown: false }}>
      <BuyerStack.Screen name="BuyerTabs"          component={BuyerTabNavigator} />
      <BuyerStack.Screen name="ProductDetail"      component={ProductDetailScreen} />
      <BuyerStack.Screen name="BuyerOrderDetail"   component={BuyerOrderDetailScreen} />
      <BuyerStack.Screen name="Checkout"           component={CheckoutScreen} />
      <BuyerStack.Screen name="BuyerNotifications" component={BuyerNotificationsScreen} />
      <BuyerStack.Screen name="EditProfile"        component={EditProfileScreen} />
    </BuyerStack.Navigator>
  );
}

// ─── Seller Tabs ──────────────────────────────────────────────
function SellerTabNavigator() {
  return (
    <SellerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          const icons: Record<string, string> = {
            Dashboard: '◈', Products: '◉', SellerOrders: '◧', SellerProfile: '◎',
          };
          return (
            <Text style={{ fontSize: 18, color: focused ? '#1D3557' : '#9CA3AF' }}>
              {icons[route.name]}
            </Text>
          );
        },
        tabBarActiveTintColor:   '#1D3557',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 84,
          paddingBottom: 24,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <SellerTab.Screen name="Dashboard"    component={SellerDashboardScreen} />
      <SellerTab.Screen name="Products"     component={SellerProductsScreen} />
      <SellerTab.Screen name="SellerOrders" component={SellerOrdersScreen}    options={{ tabBarLabel: 'Orders' }} />
      <SellerTab.Screen name="SellerProfile" component={SellerProfileScreen}  options={{ tabBarLabel: 'Profile' }} />
    </SellerTab.Navigator>
  );
}

function SellerNavigator() {
  return (
    <SellerStack.Navigator screenOptions={{ headerShown: false }}>
      <SellerStack.Screen name="SellerTabs"          component={SellerTabNavigator} />
      <SellerStack.Screen name="AddProduct"          component={AddProductScreen} />
      <SellerStack.Screen name="SellerNotifications" component={SellerNotificationsScreen} />
    </SellerStack.Navigator>
  );
}

// ─── Root — driven by AuthContext ────────────────────────────
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
        <>
          {!user ? (
            <RootStack.Screen name="Auth"   component={AuthNavigator} />
          ) : user.role === 'buyer' ? (
            <RootStack.Screen name="Buyer"  component={BuyerNavigator} />
          ) : (
            <RootStack.Screen name="Seller" component={SellerNavigator} />
          )}
        </>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}