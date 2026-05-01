// App.tsx

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-url-polyfill/auto';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { FavoritesProvider } from './src/context/FavoritesContext'; // ← ADD THIS
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './src/services/pushNotificationService';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>          {/* ← ADD THIS */}
          <StatusBar style="light" />
          <AppNavigator />
        </FavoritesProvider>          {/* ← ADD THIS */}
      </CartProvider>
    </AuthProvider>
  );
}