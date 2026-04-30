// src/screens/seller/Dashboard/SellerDashboardScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerDashboardScreenProps, SellerStackParamList } from '../../../props/props';
import { Order, OrderStatus } from '../../../types';
import { getMyOrdersAsSeller, getSellerStats } from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';
import { STATUS_COLORS } from '../../../theme';
import { styles, C } from './SellerDashboardScreen.styles';

// ─── Constants ────────────────────────────────────────────────
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type SalesPeriod = 'This Week' | 'This Month' | 'Last 3 Months';
type OrderFilter = 'All' | 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

const SALES_PERIODS: SalesPeriod[] = ['This Week', 'This Month', 'Last 3 Months'];
const ORDER_FILTERS: OrderFilter[] = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

const STATUS_MAP: Record<OrderFilter, OrderStatus | null> = {
  All:        null,
  Pending:    'pending',
  Processing: 'preparing',
  Delivered:  'delivered',
  Cancelled:  'cancelled',
};

// ─── SVG Icons ────────────────────────────────────────────────
function BellIcon({ size = 15, color = 'rgba(255,255,255,0.75)' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
const getPeriodRange = (period: SalesPeriod): Date => {
  const now = new Date();
  if (period === 'This Week')  { const d = new Date(now); d.setDate(now.getDate() - 7);   return d; }
  if (period === 'This Month') { const d = new Date(now); d.setMonth(now.getMonth() - 1); return d; }
  /* Last 3 Months */            const d = new Date(now); d.setMonth(now.getMonth() - 3); return d;
};

const getChartConfig = (period: SalesPeriod, orders: Order[]) => {
  const now = new Date();

  if (period === 'This Week') {
    const labels  = WEEK_DAYS.map((d) => d.slice(0, 2));
    const counts  = WEEK_DAYS.map((_, i) =>
      orders.filter((o) => {
        const d = new Date(o.createdAt);
        return (now.getTime() - d.getTime()) / 86400000 <= 7 && d.getDay() === (i + 1) % 7;
      }).length
    );
    const revenue = WEEK_DAYS.map((_, i) =>
      orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return (now.getTime() - d.getTime()) / 86400000 <= 7
            && d.getDay() === (i + 1) % 7
            && o.status === 'delivered';
        })
        .reduce((s, o) => s + o.totalAmount, 0)
    );
    return { labels, counts, revenue, highlightIdx: (now.getDay() + 6) % 7 };
  }

  if (period === 'This Month') {
    const labels  = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'];
    const counts  = [0, 1, 2, 3].map((wk) =>
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
  const counts  = [2, 1, 0].map((mo) =>
    orders.filter((o) => new Date(o.createdAt).getMonth() === (now.getMonth() - mo + 12) % 12).length
  );
  const revenue = [2, 1, 0].map((mo) =>
    orders
      .filter((o) => new Date(o.createdAt).getMonth() === (now.getMonth() - mo + 12) % 12 && o.status === 'delivered')
      .reduce((s, o) => s + o.totalAmount, 0)
  );
  return { labels: months, counts, revenue, highlightIdx: 2 };
};

// ─── Lightweight line chart ────────────────────────────────────
const LineChart = ({ data, color, height = 90 }: { data: number[]; color: string; height?: number }) => {
  const CHART_WIDTH = 260;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => ({
    x: data.length === 1 ? 0 : (i / (data.length - 1)) * CHART_WIDTH,
    y: height - (v / max) * (height * 0.85),
  }));

  return (
    <View style={{ height, width: CHART_WIDTH, position: 'relative' }}>
      {pts.slice(0, -1).map((pt, i) => {
        const next  = pts[i + 1];
        const dx    = next.x - pt.x;
        const dy    = next.y - pt.y;
        const len   = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <View
            key={i}
            style={{
              position:        'absolute',
              left:            pt.x,
              top:             pt.y - 1.5,
              width:           len + 1,
              height:          3,
              backgroundColor: color,
              borderRadius:    2,
              transform:       [{ rotate: `${angle}deg` }],
              // @ts-ignore
              transformOrigin: '0 50%',
            }}
          />
        );
      })}
      {pts.map((pt, i) => (
        <View
          key={`d${i}`}
          style={{
            position:        'absolute',
            left:            pt.x - 4,
            top:             pt.y - 4,
            width:           8,
            height:          8,
            borderRadius:    4,
            backgroundColor: color,
            borderWidth:     2,
            borderColor:     C.white,
          }}
        />
      ))}
    </View>
  );
};

// ─── Component ────────────────────────────────────────────────
export default function SellerDashboardScreen({ navigation }: SellerDashboardScreenProps) {
  const { user } = useAuth();
  const stackNav = useNavigation<NativeStackNavigationProp<SellerStackParamList>>();

  const [orders, setOrders]         = useState<Order[]>([]);
  const [stats, setStats]           = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const [salesPeriod, setSalesPeriod]             = useState<SalesPeriod>('This Week');
  const [orderFilter, setOrderFilter]             = useState<OrderFilter>('All');
  const [salesDropdownOpen, setSalesDropdownOpen] = useState(false);
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);

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

  const periodFrom      = getPeriodRange(salesPeriod);
  const periodOrders    = orders.filter((o) => new Date(o.createdAt) >= periodFrom);
  const chartConfig     = getChartConfig(salesPeriod, orders);
  const periodIncome    = chartConfig.revenue.reduce((s, v) => s + v, 0);
  const periodDelivered = periodOrders.filter((o) => o.status === 'delivered').length;
  const processingCount = orders.filter((o) => o.status === 'preparing').length;

  const filteredOrders = (() => {
    const status = STATUS_MAP[orderFilter];
    return (status ? orders.filter((o) => o.status === status) : orders).slice(0, 5);
  })();

  const productFreq: Record<string, { name: string; image?: string; count: number; price: number }> = {};
  orders.forEach((o) =>
    o.items?.forEach((item) => {
      const id = item.product?.id;
      if (!id) return;
      if (!productFreq[id])
        productFreq[id] = { name: item.product.name, image: item.product.images?.[0], count: 0, price: item.product.price };
      productFreq[id].count += item.quantity;
    })
  );
  const topProducts = Object.values(productFreq).sort((a, b) => b.count - a.count).slice(0, 10);

  const buyerSpend: Record<string, { id: string; spend: number; orderCount: number }> = {};
  orders.forEach((o) => {
    if (!buyerSpend[o.buyerId]) buyerSpend[o.buyerId] = { id: o.buyerId, spend: 0, orderCount: 0 };
    buyerSpend[o.buyerId].spend      += o.totalAmount;
    buyerSpend[o.buyerId].orderCount += 1;
  });
  const topBuyers = Object.values(buyerSpend).sort((a, b) => b.spend - a.spend).slice(0, 5);

  const closeDropdowns = () => { setSalesDropdownOpen(false); setOrderDropdownOpen(false); };

  const avatarUri      = user?.profilePicture;
  const avatarInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <View style={styles.container}>

        {/* ─── Top Bar ─────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [styles.avatarBtn, pressed && { opacity: 0.75 }]}
            onPress={() => stackNav.navigate('SellerProfile' as any)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{avatarInitials}</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.storeIdentity}>
            <Text style={styles.storeDashboardLabel}>Seller Dashboard</Text>
            <Text style={styles.storeName} numberOfLines={1}>{user?.name ?? 'My Store'}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.notifBtn, pressed && { opacity: 0.75 }]}
            onPress={() => stackNav.navigate('SellerNotifications' as any)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <BellIcon size={15} color="rgba(255,255,255,0.75)" />
            <Text style={styles.notifBtnText}>Notifications</Text>
            {stats.pendingOrders > 0 && (
              <View style={styles.notifCountBadge}>
                <Text style={styles.notifCountBadgeText}>
                  {stats.pendingOrders > 99 ? '99+' : stats.pendingOrders}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ─── KPI Strip ───────────────────────────────────────── */}
        <View style={styles.kpiStrip}>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>Total Orders</Text>
            <Text style={styles.kpiValue}>{stats.totalOrders}</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>Pending</Text>
            <Text style={[styles.kpiValue, { color: C.amber }]}>{stats.pendingOrders}</Text>
          </View>
          <View style={[styles.kpiItem, styles.kpiItemLast]}>
            <Text style={styles.kpiLabel}>Revenue</Text>
            <Text style={[styles.kpiValue, { color: C.green }]}>
              {stats.totalRevenue >= 1000
                ? `₱${(stats.totalRevenue / 1000).toFixed(1)}k`
                : `₱${stats.totalRevenue}`}
            </Text>
          </View>
        </View>

        {/* ─── White Body Shell ─────────────────────────────────── */}
        <View style={styles.bodyShell}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[C.ink]}
                tintColor={C.ink}
              />
            }
          >
            <View style={styles.body}>

              {/* ─── Sales Statistics ─────────────────────────────────── */}
              <View style={[styles.card, { zIndex: salesDropdownOpen ? 20 : 1, marginTop: 18 }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Sales Statistics</Text>
                  <View style={{ position: 'relative' }}>
                    <Pressable
                      style={styles.periodBtn}
                      onPress={() => { setOrderDropdownOpen(false); setSalesDropdownOpen((v) => !v); }}
                    >
                      <Text style={styles.periodBtnText}>{salesPeriod}</Text>
                      <Text style={styles.periodBtnArrow}>{salesDropdownOpen ? '▴' : '▾'}</Text>
                    </Pressable>
                    {salesDropdownOpen && (
                      <View style={styles.dropdown}>
                        {SALES_PERIODS.map((p) => (
                          <Pressable
                            key={p}
                            style={[styles.dropdownItem, salesPeriod === p && styles.dropdownItemActive]}
                            onPress={() => { setSalesPeriod(p); setSalesDropdownOpen(false); }}
                          >
                            <Text style={[styles.dropdownItemText, salesPeriod === p && styles.dropdownItemTextActive]}>{p}</Text>
                            {salesPeriod === p && <Text style={{ fontSize: 12, color: C.violet }}>✓</Text>}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* Legend */}
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: C.amber }]} />
                    <Text style={styles.legendText}>Amount</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: C.blue }]} />
                    <Text style={styles.legendText}>Orders</Text>
                  </View>
                </View>

                {/* Chart */}
                <View style={styles.chartArea}>
                  <View style={styles.yAxis}>
                    {['10k', '5k', '3k', '1k', '0'].map((l) => (
                      <Text key={l} style={styles.yLabel}>{l}</Text>
                    ))}
                  </View>
                  <View style={{ flex: 1, overflow: 'hidden' }}>
                    <LineChart data={chartConfig.revenue} color={C.amber} height={100} />
                    <View style={{ marginTop: -100 }}>
                      <LineChart data={chartConfig.counts} color={C.blue} height={100} />
                    </View>
                    <View style={styles.xAxis}>
                      {chartConfig.labels.map((l, i) => (
                        <Text
                          key={i}
                          style={[styles.xLabel, i === chartConfig.highlightIdx && styles.xLabelActive]}
                        >
                          {l}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Summary */}
                <View style={styles.chartSummary}>
                  <View style={styles.chartSummaryItem}>
                    <Text style={styles.chartSummaryValue}>
                      ₱{periodIncome >= 1000 ? `${(periodIncome / 1000).toFixed(1)}k` : periodIncome}
                    </Text>
                    <Text style={styles.chartSummaryLabel}>Income</Text>
                  </View>
                  <View style={[styles.chartSummaryItem, styles.chartSummaryBorder]}>
                    <Text style={styles.chartSummaryValue}>{periodDelivered}</Text>
                    <Text style={styles.chartSummaryLabel}>Delivered</Text>
                  </View>
                  <View style={styles.chartSummaryItem}>
                    <Text style={styles.chartSummaryValue}>{periodOrders.length}</Text>
                    <Text style={styles.chartSummaryLabel}>Total Orders</Text>
                  </View>
                </View>
              </View>

              {/* ─── Top 10 Trending Products ─────────────────────────── */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top 10 Trending Products</Text>
                <Pressable onPress={() => (navigation as any).navigate('Products')}>
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              </View>

              {topProducts.length === 0 ? (
                <View style={styles.emptyInline}>
                  <Text style={styles.emptyInlineText}>No product data yet</Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
                  {topProducts.map((p, i) => (
                    <View key={i} style={styles.productCard}>
                      <View style={styles.productImageWrap}>
                        {p.image ? (
                          <Image source={{ uri: p.image }} style={styles.productImage} resizeMode="cover" />
                        ) : (
                          <View style={styles.productImagePlaceholder}>
                            <Text style={{ fontSize: 28 }}>📦</Text>
                          </View>
                        )}
                        <View style={styles.productRankBadge}>
                          <Text style={styles.productRankText}>#{i + 1}</Text>
                        </View>
                      </View>
                      <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                      <Text style={styles.productPrice}>₱{p.price.toLocaleString()}</Text>
                      <Text style={styles.productSold}>{p.count} sold</Text>
                    </View>
                  ))}
                </ScrollView>
              )}

              {/* ─── Top 5 Spending Customers ─────────────────────────── */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top 5 Spending Customers</Text>
              </View>

              {topBuyers.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={{ fontSize: 32 }}>👥</Text>
                  <Text style={styles.emptyTitle}>No customer data yet</Text>
                  <Text style={styles.emptyText}>Customer spend will appear here</Text>
                </View>
              ) : (
                <View style={styles.card}>
                  {topBuyers.map((b, i) => (
                    <View key={b.id} style={[styles.buyerRow, i < topBuyers.length - 1 && styles.buyerRowBorder]}>
                      <View style={[styles.buyerRank, i === 0 && styles.buyerRankGold]}>
                        <Text style={[styles.buyerRankText, i === 0 && { color: C.amber }]}>{i + 1}</Text>
                      </View>
                      <View style={styles.buyerAvatar}>
                        <Text style={styles.buyerAvatarText}>{b.id.slice(0, 2).toUpperCase()}</Text>
                      </View>
                      <View style={styles.buyerInfo}>
                        <Text style={styles.buyerName}>Customer #{b.id.slice(0, 6).toUpperCase()}</Text>
                        <Text style={styles.buyerOrders}>{b.orderCount} order{b.orderCount !== 1 ? 's' : ''}</Text>
                      </View>
                      <Text style={styles.buyerSpend}>
                        ₱{b.spend >= 1000 ? `${(b.spend / 1000).toFixed(1)}k` : b.spend}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* ─── Recent Orders ────────────────────────────────────── */}
              <View style={[styles.sectionHeader, { zIndex: orderDropdownOpen ? 20 : 1 }]}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <View style={{ position: 'relative' }}>
                  <Pressable
                    style={styles.filterBtn}
                    onPress={() => { setSalesDropdownOpen(false); setOrderDropdownOpen((v) => !v); }}
                  >
                    <Text style={styles.filterBtnText}>{orderFilter === 'All' ? 'All Status' : orderFilter}</Text>
                    <Text style={styles.filterBtnArrow}>{orderDropdownOpen ? '▴' : '▾'}</Text>
                  </Pressable>
                  {orderDropdownOpen && (
                    <View style={[styles.dropdown, styles.dropdownRight]}>
                      {ORDER_FILTERS.map((f) => (
                        <Pressable
                          key={f}
                          style={[styles.dropdownItem, orderFilter === f && styles.dropdownItemActive]}
                          onPress={() => { setOrderFilter(f); setOrderDropdownOpen(false); }}
                        >
                          <Text style={[styles.dropdownItemText, orderFilter === f && styles.dropdownItemTextActive]}>{f}</Text>
                          {orderFilter === f && <Text style={{ fontSize: 12, color: C.violet }}>✓</Text>}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {filteredOrders.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={{ fontSize: 32 }}>📋</Text>
                  <Text style={styles.emptyTitle}>No orders found</Text>
                  <Text style={styles.emptyText}>
                    {orderFilter === 'All'
                      ? 'Orders will appear once buyers start purchasing'
                      : `No ${orderFilter.toLowerCase()} orders at the moment`}
                  </Text>
                </View>
              ) : (
                <View style={styles.card}>
                  {filteredOrders.map((order, i) => {
                    const firstItem = order.items?.[0];
                    const color = STATUS_COLORS[order.status] ?? { bg: '#F3F4F6', text: '#6B7280' };
                    return (
                      <Pressable
                        key={order.id}
                        style={({ pressed }) => [
                          styles.orderRow,
                          i < filteredOrders.length - 1 && styles.orderRowBorder,
                          pressed && { opacity: 0.82 },
                        ]}
                      >
                        <View style={styles.orderThumb}>
                          {firstItem?.product?.images?.[0] ? (
                            <Image source={{ uri: firstItem.product.images[0] }} style={styles.orderThumbImage} resizeMode="cover" />
                          ) : (
                            <Text style={{ fontSize: 20 }}>📦</Text>
                          )}
                        </View>
                        <View style={styles.orderInfo}>
                          <Text style={styles.orderName} numberOfLines={1}>
                            {firstItem?.product?.name ?? `Order #${order.id.slice(0, 6).toUpperCase()}`}
                          </Text>
                          <Text style={styles.orderMeta}>
                            #{order.id.slice(0, 6).toUpperCase()} · {order.shippingAddress?.split(',')[0]}
                          </Text>
                          <View style={[styles.statusBadge, { backgroundColor: color.bg }]}>
                            <Text style={[styles.statusBadgeText, { color: color.text }]}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.orderAmount}>₱{order.totalAmount.toLocaleString()}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <View style={{ height: 40 }} />
            </View>
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}