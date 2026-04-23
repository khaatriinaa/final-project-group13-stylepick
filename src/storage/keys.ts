// src/storage/keys.ts
// All AsyncStorage keys in one place — prevents typo bugs

export const KEYS = {
  USERS:         'eshop:users',         // User[]
  CURRENT_USER:  'eshop:current_user',  // User (logged-in)
  PRODUCTS:      'eshop:products',      // Product[]
  ORDERS:        'eshop:orders',        // Order[]
  NOTIFICATIONS: 'eshop:notifications', // Notification[]
} as const;

// Use environment variables — never hardcode secrets!
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;