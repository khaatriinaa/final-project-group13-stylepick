// src/storage/keys.ts
// All AsyncStorage keys in one place — prevents typo bugs

export const KEYS = {
  USERS:         'eshop:users',         // User[]
  CURRENT_USER:  'eshop:current_user',  // User (logged-in)
  PRODUCTS:      'eshop:products',      // Product[]
  ORDERS:        'eshop:orders',        // Order[]
  NOTIFICATIONS: 'eshop:notifications', // Notification[]
} as const;
