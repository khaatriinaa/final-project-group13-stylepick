// src/screens/seller/Dashboard/SellerDashboardScreen.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { useFocusEffect, useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SellerDashboardScreenProps, SellerStackParamList } from '../../../props/props';
import { Order, OrderStatus } from '../../../types';
import { getMyOrdersAsSeller, getSellerStats } from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';
import { COLORS, FONTS, STATUS_COLORS } from '../../../theme';
import { styles } from './SellerDashboardScreen.styles';

// ─── Constants ────────────────────────────────────────────────
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type SalesPeriod = 'Last Week' | 'Last Month' | 'Last 3 Months';
type OrderFilter = 'All' | 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

const SALES_PERIODS: SalesPeriod[] = ['Last Week', 'Last Month', 'Last 3 Months'];
const ORDER_FILTERS: OrderFilter[] = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

const STATUS_MAP: Record<OrderFilter, OrderStatus | null> = {
  All:        null,
  Pending:    'pending',
  Processing: 'preparing',
  Delivered:  'delivered',
  Cancelled:  'cancelled',
};

// ─── Helpers ──────────────────────────────────────────────────
const getPeriodRange = (period: SalesPeriod): Date => {
  const now = new Date();
  if (period === 'Last Week')     { const d = new Date(now); d.setDate(now.getDate() - 7);   return d; }
  if (period === 'Last Month')    { const d = new Date(now); d.setMonth(now.getMonth() - 1); return d; }
  /* Last 3 Months */               const d = new Date(now); d.setMonth(now.getMonth() - 3); return d;
};

const getChartConfig = (period: SalesPeriod, orders: Order[]) => {
  const now = new Date();

  if (period === 'Last Week') {
    const labels = WEEK_DAYS.map((d) => d.slice(0, 2));
    const counts = WEEK_DAYS.map((_, i) =>
      orders.filter((o) => {
        const d = new Date(o.createdAt);
        const daysAgo = (now.getTime() - d.getTime()) / 86400000;
        return daysAgo <= 7 && d.getDay() === (i + 1) % 7;
      }).length
    );
    const revenue = WEEK_DAYS.map((_, i) =>
      orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          const daysAgo = (now.getTime() - d.getTime()) / 86400000;
          return daysAgo <= 7 && d.getDay() === (i + 1) % 7 && o.status === 'delivered';
        })
        .reduce((s, o) => s + o.totalAmount, 0)
    );
    const todayIdx = (now.getDay() + 6) % 7;
    return { labels, counts, revenue, highlightIdx: todayIdx };
  }

  if (period === 'Last Month') {
    const labels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'];
    const counts = [0, 1, 2, 3].map((wk) =>
      orders.filter((o) => {
        const d = new Date(o.createdAt);
        const daysAgo = Math.floor((now.getTime() - d.getTime()) / 86400000);
        return daysAgo < 28 && Math.floor(daysAgo / 7) === (3 - wk);
      }).length
    );
    const revenue = [0, 1, 2, 3].map((wk) =>
      orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          const daysAgo = Math.floor((now.getTime() - d.getTime()) / 86400000);
          return daysAgo < 28 && Math.floor(daysAgo / 7) === (3 - wk) && o.status === 'delivered';
        })
        .reduce((s, o) => s + o.totalAmount, 0)
    );
    return { labels, counts, revenue, highlightIdx: 3 };
  }

  // Last 3 Months
  const months: string[] = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short' }));
  }
  const counts = [2, 1, 0].map((mOffset) =>
    orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === (now.getMonth() - mOffset + 12) % 12;
    }).length
  );
  const revenue = [2, 1, 0].map((mOffset) =>
    orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.getMonth() === (now.getMonth() - mOffset + 12) % 12 &&
          o.status === 'delivered'
        );
      })
      .reduce((s, o) => s + o.totalAmount, 0)
  );
  return { labels: months, counts, revenue, highlightIdx: 2 };
};

// ─── Component ────────────────────────────────────────────────
export default function SellerDashboardScreen({ navigation }: SellerDashboardScreenProps) {
  const { user } = useAuth();
  const stackNav = useNavigation<NativeStackNavigationProp<SellerStackParamList>>();

  const [orders, setOrders]         = useState<Order[]>([]);
  const [stats, setStats]           = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [refreshing, setRefreshing] = useState(false);

  // Dropdown states
  const [salesPeriod, setSalesPeriod]             = useState<SalesPeriod>('Last Week');
  const [orderFilter, setOrderFilter]             = useState<OrderFilter>('All');
  const [salesDropdownOpen, setSalesDropdownOpen] = useState(false);
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);

  // ── Open drawer — walk up the navigator tree to find the drawer ──
  const openDrawer = () => {
    // navigation.getParent() walks up one level; keep going until we
    // find a navigator that knows how to open a drawer.
    let nav: any = navigation;
    while (nav) {
      try {
        nav.dispatch(DrawerActions.openDrawer());
        return; // success — stop walking
      } catch {
        nav = nav.getParent?.();
      }
    }
  };

  // ── Fetch ──────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    const [allOrders, s] = await Promise.all([
      getMyOrdersAsSeller(user.id),
      getSellerStats(user.id),
    ]);
    setOrders(allOrders);
    setStats(s);
  }, [user?.id]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  // ── Derived data ───────────────────────────────────────────
  const periodFrom      = getPeriodRange(salesPeriod);
  const periodOrders    = orders.filter((o) => new Date(o.createdAt) >= periodFrom);
  const chartConfig     = getChartConfig(salesPeriod, orders);
  const maxCount        = Math.max(...chartConfig.counts, 1);
  const barHeights      = chartConfig.counts.map((c) => Math.max(c / maxCount, 0.08));

  const periodIncome    = chartConfig.revenue.reduce((s, v) => s + v, 0);
  const periodDelivered = periodOrders.filter((o) => o.status === 'delivered').length;
  const todayOrders     = orders.filter((o) => {
    const today = new Date();
    return new Date(o.createdAt).toDateString() === today.toDateString();
  }).length;

  // Filtered orders list
  const filteredOrders = (() => {
    const status = STATUS_MAP[orderFilter];
    const base   = status ? orders.filter((o) => o.status === status) : orders;
    return base.slice(0, 6);
  })();

  // ── Close both dropdowns when tapping outside ──────────────
  const closeDropdowns = () => {
    setSalesDropdownOpen(false);
    setOrderDropdownOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* ─── Header ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {/* Burger → opens drawer */}
            <Pressable
              style={({ pressed }) => [styles.menuIcon, pressed && { opacity: 0.7 }]}
              onPress={openDrawer}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={[styles.menuLine, { width: 14 }]} />
            </Pressable>

            <Text style={styles.headerTitle}>Dashboard</Text>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.headerIconBtn}
                onPress={() => stackNav.navigate('SellerNotifications' as any)}
              >
                <Text style={styles.headerIconText}>⚑</Text>
                {stats.pendingOrders > 0 && <View style={styles.notifDot} />}
              </Pressable>
              <Pressable style={styles.headerIconBtn} onPress={handleRefresh}>
                <Text style={styles.headerIconText}>↻</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ─── Stats card ─────────────────────────────────────── */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalOrders.toLocaleString()}</Text>
            <Text style={styles.statLabel}>orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ₱{stats.totalRevenue >= 1000
                ? `${(stats.totalRevenue / 1000).toFixed(1)}k`
                : stats.totalRevenue.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>gross</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>pending</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* ─── Sales Statistics chart ──────────────────────── */}
          <View style={[styles.chartCard, { zIndex: salesDropdownOpen ? 20 : 1 }]}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Sales Statistics</Text>

              {/* Sales period dropdown */}
              <View style={{ position: 'relative' }}>
                <Pressable
                  style={styles.chartPeriod}
                  onPress={() => {
                    setOrderDropdownOpen(false);
                    setSalesDropdownOpen((v) => !v);
                  }}
                >
                  <Text style={styles.chartPeriodText}>{salesPeriod}</Text>
                  <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>
                    {salesDropdownOpen ? '  ▴' : '  ▾'}
                  </Text>
                </Pressable>

                {salesDropdownOpen && (
                  <View style={styles.dropdown}>
                    {SALES_PERIODS.map((p) => (
                      <Pressable
                        key={p}
                        style={[
                          styles.dropdownItem,
                          salesPeriod === p && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setSalesPeriod(p);
                          setSalesDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            salesPeriod === p && styles.dropdownItemTextActive,
                          ]}
                        >
                          {p}
                        </Text>
                        {salesPeriod === p && (
                          <Text style={{ fontSize: 12, color: COLORS.primary }}>✓</Text>
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Bar chart */}
            <View style={styles.barChart}>
              {barHeights.map((h, i) => {
                const isHighlight = i === chartConfig.highlightIdx;
                return (
                  <View key={i} style={styles.barWrap}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(Math.round(h * 68), 4),
                          backgroundColor: isHighlight ? COLORS.secondary : COLORS.background,
                          borderWidth: isHighlight ? 0 : 1,
                          borderColor: COLORS.border,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.barLabel,
                        isHighlight && { color: COLORS.secondary, fontWeight: FONTS.bold },
                      ]}
                    >
                      {chartConfig.labels[i]}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.legendValue}>
                  ₱{periodIncome >= 1000 ? `${(periodIncome / 1000).toFixed(1)}k` : periodIncome}
                </Text>
                <Text style={styles.legendLabel}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.legendValue}>{periodDelivered}</Text>
                <Text style={styles.legendLabel}>Delivered</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
                <Text style={styles.legendValue}>{todayOrders}</Text>
                <Text style={styles.legendLabel}>Today</Text>
              </View>
            </View>
          </View>

          {/* ─── Quick actions ───────────────────────────────── */}
          <View style={styles.quickRow}>
            {[
              { label: 'Add Product', icon: '+', onPress: () => stackNav.navigate('AddProduct', {}) },
              { label: 'Orders',      icon: '≡', onPress: () => (navigation as any).navigate('SellerOrders') },
              { label: 'Products',    icon: '◉', onPress: () => (navigation as any).navigate('Products') },
            ].map((a) => (
              <Pressable
                key={a.label}
                style={({ pressed }) => [styles.quickBtn, pressed && styles.quickBtnPressed]}
                onPress={a.onPress}
              >
                <Text style={styles.quickBtnIcon}>{a.icon}</Text>
                <Text style={styles.quickBtnLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* ─── Orders section header ───────────────────────── */}
          <View style={[styles.sectionRow, { zIndex: orderDropdownOpen ? 20 : 1 }]}>
            <Text style={styles.sectionTitle}>All Orders</Text>

            {/* Order filter dropdown */}
            <View style={{ position: 'relative' }}>
              <Pressable
                style={styles.sortWrap}
                onPress={() => {
                  setSalesDropdownOpen(false);
                  setOrderDropdownOpen((v) => !v);
                }}
              >
                <Text style={styles.sortText}>{orderFilter === 'All' ? 'Newest Orders' : orderFilter}</Text>
                <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>
                  {orderDropdownOpen ? '  ▴' : '  ▾'}
                </Text>
              </Pressable>

              {orderDropdownOpen && (
                <View style={[styles.dropdown, styles.dropdownRight]}>
                  {ORDER_FILTERS.map((f) => (
                    <Pressable
                      key={f}
                      style={[
                        styles.dropdownItem,
                        orderFilter === f && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setOrderFilter(f);
                        setOrderDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          orderFilter === f && styles.dropdownItemTextActive,
                        ]}
                      >
                        {f}
                      </Text>
                      {orderFilter === f && (
                        <Text style={{ fontSize: 12, color: COLORS.primary }}>✓</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* ─── Orders list ─────────────────────────────────── */}
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={{ fontSize: 32, color: COLORS.borderDark }}>◻</Text>
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.emptyText}>
                {orderFilter === 'All'
                  ? 'Your orders will appear here once buyers start purchasing'
                  : `No ${orderFilter.toLowerCase()} orders at the moment`}
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items?.[0];
              const color = STATUS_COLORS[order.status] ?? { bg: '#F3F4F6', text: '#6B7280' };
              return (
                <Pressable
                  key={order.id}
                  style={({ pressed }) => [styles.orderRow, pressed && styles.orderRowPressed]}
                >
                  {/* Thumbnail */}
                  <View style={styles.orderImageWrap}>
                    {firstItem?.product?.images?.[0] ? (
                      <Image
                        source={{ uri: firstItem.product.images[0] }}
                        style={styles.orderImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.orderImagePlaceholder}>◻</Text>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderItemName} numberOfLines={1}>
                      {firstItem?.product?.name ?? `Order #${order.id.slice(0, 6).toUpperCase()}`}
                    </Text>
                    <Text style={styles.orderMeta}>
                      {order.shippingAddress?.split(',')[0]} · #{order.id.slice(0, 6).toUpperCase()}
                    </Text>
                    {/* Status badge */}
                    <View style={[styles.statusBadge, { backgroundColor: color.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: color.text }]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {/* Amount */}
                  <Text style={styles.orderAmount}>
                    ₱{order.totalAmount.toLocaleString()}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}