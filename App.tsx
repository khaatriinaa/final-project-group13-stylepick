// App.tsx

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './src/services/pushNotificationService';

export default function App() {
  useEffect(() => {
    // Register device for push notifications on app launch
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
