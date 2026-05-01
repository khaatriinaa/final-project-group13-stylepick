import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { Order, CartItem } from '../types';

// ─── Stack Param Lists ────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type BuyerTabParamList = {
  Home: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type BuyerStackParamList = {
  BuyerTabs: undefined;
  ProductDetail: { productId: string };
  BuyerOrderDetail: { order: Order };
  Checkout: { selectedItems: CartItem[] } | undefined;
  BuyerNotifications: undefined;
  EditProfile: undefined;
  Favorites: undefined;
  BuyerChangePassword: undefined;
  BuyerHelpSupport: undefined;
};

export type SellerTabParamList = {
  Dashboard: undefined;
  SellerOrders: undefined;
  AddProductTab: undefined;
  Products: undefined;
  SellerProfile: undefined;
};

export type SellerStackParamList = {
  SellerTabs: undefined;
  AddProduct: { productId?: string };
  SellerNotifications: undefined;
  SellerOrderDetail: { orderId: string };
  SellerEditProfile: undefined;
  SellerChangePassword: undefined;
  SellerHelpSupport: undefined;  
};

export type RootStackParamList = {
  Auth: undefined;
  Buyer: undefined;
  Seller: undefined;
};

// ─── Auth Props ───────────────────────────────────────────────────────────────

export interface LoginScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  route: RouteProp<AuthStackParamList, 'Login'>;
}

export interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
  route: RouteProp<AuthStackParamList, 'Register'>;
}

// ─── Buyer Props ──────────────────────────────────────────────────────────────

export interface BuyerHomeScreenProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BuyerTabParamList, 'Home'>,
    NativeStackNavigationProp<BuyerStackParamList>
  >;
  route: RouteProp<BuyerTabParamList, 'Home'>;
}

export interface ProductDetailScreenProps {
  navigation: NativeStackNavigationProp<BuyerStackParamList, 'ProductDetail'>;
  route: RouteProp<BuyerStackParamList, 'ProductDetail'>;
}

export interface CartScreenProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BuyerTabParamList, 'Cart'>,
    NativeStackNavigationProp<BuyerStackParamList>
  >;
  route: RouteProp<BuyerTabParamList, 'Cart'>;
}

export interface BuyerOrdersScreenProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BuyerTabParamList, 'Orders'>,
    NativeStackNavigationProp<BuyerStackParamList>
  >;
  route: RouteProp<BuyerTabParamList, 'Orders'>;
}

export interface BuyerOrderDetailScreenProps {
  navigation: NativeStackNavigationProp<BuyerStackParamList, 'BuyerOrderDetail'>;
  route: RouteProp<BuyerStackParamList, 'BuyerOrderDetail'>;
}

export interface CheckoutScreenProps {
  navigation: NativeStackNavigationProp<BuyerStackParamList, 'Checkout'>;
  route: RouteProp<BuyerStackParamList, 'Checkout'>;
}

export interface BuyerNotificationsScreenProps {
  navigation: NativeStackNavigationProp<BuyerStackParamList, 'BuyerNotifications'>;
  route: RouteProp<BuyerStackParamList, 'BuyerNotifications'>;
}

export interface EditProfileScreenProps {
  navigation: NativeStackNavigationProp<BuyerStackParamList, 'EditProfile'>;
  route: RouteProp<BuyerStackParamList, 'EditProfile'>;
}

export interface BuyerProfileScreenProps {
  navigation: BottomTabNavigationProp<BuyerTabParamList, 'Profile'>;
  route: RouteProp<BuyerTabParamList, 'Profile'>;
}

export interface BuyerChangePasswordScreenProps {
  navigation: NativeStackNavigationProp<BuyerStackParamList, 'BuyerChangePassword'>;
  route: RouteProp<BuyerStackParamList, 'BuyerChangePassword'>;
}

export interface BuyerHelpSupportScreenProps {
  navigation: NativeStackNavigationProp<BuyerStackParamList, 'BuyerHelpSupport'>;
  route: RouteProp<BuyerStackParamList, 'BuyerHelpSupport'>;
}
// ─── Seller Props ─────────────────────────────────────────────────────────────

export interface SellerDashboardScreenProps {
  navigation: BottomTabNavigationProp<SellerTabParamList, 'Dashboard'>;
  route: RouteProp<SellerTabParamList, 'Dashboard'>;
}

export interface SellerProductsScreenProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<SellerTabParamList, 'Products'>,
    NativeStackNavigationProp<SellerStackParamList>
  >;
  route: RouteProp<SellerTabParamList, 'Products'>;
}

export interface AddProductScreenProps {
  navigation: NativeStackNavigationProp<SellerStackParamList, 'AddProduct'>;
  route: RouteProp<SellerStackParamList, 'AddProduct'>;
}

export interface SellerOrdersScreenProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<SellerTabParamList, 'SellerOrders'>,
    NativeStackNavigationProp<SellerStackParamList>
  >;
  route: RouteProp<SellerTabParamList, 'SellerOrders'>;
}

export interface SellerOrderDetailScreenProps {
  navigation: NativeStackNavigationProp<SellerStackParamList, 'SellerOrderDetail'>;
  route: RouteProp<SellerStackParamList, 'SellerOrderDetail'>;
}

export interface SellerProfileScreenProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<SellerTabParamList, 'SellerProfile'>,
    NativeStackNavigationProp<SellerStackParamList>
  >;
  route: RouteProp<SellerTabParamList, 'SellerProfile'>;
}

export interface SellerNotificationsScreenProps {
  navigation: NativeStackNavigationProp<SellerStackParamList, 'SellerNotifications'>;
  route: RouteProp<SellerStackParamList, 'SellerNotifications'>;
}

export interface SellerEditProfileScreenProps {
  navigation: NativeStackNavigationProp<SellerStackParamList, 'SellerEditProfile'>;
  route: RouteProp<SellerStackParamList, 'SellerEditProfile'>;
}

export interface SellerChangePasswordScreenProps {
  navigation: NativeStackNavigationProp<SellerStackParamList, 'SellerChangePassword'>;
  route: RouteProp<SellerStackParamList, 'SellerChangePassword'>;
}

export interface SellerHelpSupportScreenProps {
  navigation: NativeStackNavigationProp<SellerStackParamList, 'SellerHelpSupport'>;
  route: RouteProp<SellerStackParamList, 'SellerHelpSupport'>;
}