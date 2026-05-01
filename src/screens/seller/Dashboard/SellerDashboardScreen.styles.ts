// src/screens/seller/Dashboard/SellerDashboardScreen.styles.ts
import { StyleSheet, Platform, StatusBar } from 'react-native';

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

// ─── Design tokens ────────────────────────────────────────────
export const C = {
  ink:         '#0F0E17',
  inkSoft:     '#1A1927',
  inkMid:      '#252438',
  ivory:       '#FAF9F6',
  ivoryDark:   '#F2F0EB',
  white:       '#FFFFFF',
  violet:      '#2D2B55',
  border:      '#E8E4DC',
  textPrimary: '#0F0E17',
  textSecond:  '#5C5767',
  textMuted:   '#9B95A5',
  placeholder: '#B8B4C0',
  amber:       '#FF8C00',
  blue:        '#5B8DEF',
  green:       '#28C76F',
  red:         '#F0506E',
};

const RADIUS = {
  sm: 8,
  md: 10,
  lg: 14,
};

const SHADOW = {
  sm: {
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const styles = StyleSheet.create({

  // ─── Root ─────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.ink,
  },

  // ─── Top Bar ──────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: C.ink,
    gap: 10,
  },

  // ─── Avatar ───────────────────────────────────────────────────────────────
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: C.inkMid,
    flexShrink: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: C.inkMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.2,
  },

  // ─── Store identity ───────────────────────────────────────────────────────
  storeIdentity: {
    flex: 1,
  },
  storeDashboardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.40)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.3,
  },

  // ─── Notification button ──────────────────────────────────────────────────
  notifBtn: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // removed flexDirection/gap — no longer needed
  },
  notifBtnText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  notifCountBadge: {
    position:        'absolute',
    top:             -6,
    right:           -6,
    minWidth:        16,
    height:          16,
    borderRadius:    8,
    backgroundColor: C.red,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 3,
    borderWidth:     1.5,
    borderColor:     C.ink,   // punches out against the dark topbar
  },
  notifCountBadgeText: {
    color:      C.white,
    fontSize:   9,
    fontWeight: '700',
    lineHeight: 11,
  },

  // ─── KPI Strip ────────────────────────────────────────────────────────────
  kpiStrip: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  kpiItem: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  kpiItemLast: {
    borderRightWidth: 0,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.40)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
    color: C.white,
    letterSpacing: -0.5,
  },

  // ─── Body ─────────────────────────────────────────────────────────────────
  bodyShell: {
    flex: 1,
    backgroundColor: C.white,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 18,
  },

  // ─── Generic card ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: C.border,
    ...SHADOW.sm,
  },

  // ─── Card header ──────────────────────────────────────────────────────────
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },

  // Period button
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.ink,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 6,
    gap: 4,
  },
  periodBtnText: {
    fontSize: 12,
    color: C.white,
    fontWeight: '600',
  },
  periodBtnArrow: {
    fontSize: 20,
    color: C.white,
  },

  // Filter button (orders)
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.ivory,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1.5,
    borderColor: C.border,
    minWidth: 110,
  },
  filterBtnText: {
    fontSize: 12,
    color: C.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  filterBtnArrow: {
    fontSize: 20,
    color: C.textPrimary,
  },

  // ─── Legend ───────────────────────────────────────────────────────────────
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '500',
  },

  // ─── Chart area ───────────────────────────────────────────────────────────
  chartArea: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingBottom: 20,
    width: 28,
  },
  yLabel: {
    fontSize: 9,
    color: C.placeholder,
    textAlign: 'right',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  xLabel: {
    fontSize: 10,
    color: C.textMuted,
    textAlign: 'center',
    flex: 1,
  },
  xLabelActive: {
    color: C.violet,
    fontWeight: '800',
  },

  // Chart summary row
  chartSummary: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    paddingTop: 14,
    marginTop: 4,
  },
  chartSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  chartSummaryBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  chartSummaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  chartSummaryLabel: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },

  // ─── Dropdown ─────────────────────────────────────────────────────────────
  dropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    backgroundColor: C.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: C.border,
    minWidth: 160,
    zIndex: 999,
    ...SHADOW.md,
  },
  dropdownRight: {
    left: undefined,
    right: 0,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  dropdownItemActive: {
    backgroundColor: C.ivory,
  },
  dropdownItemText: {
    fontSize: 13,
    color: C.textPrimary,
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: C.violet,
    fontWeight: '700',
  },

  // ─── Section header ───────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
    overflow: 'visible',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 13,
    color: C.violet,
    fontWeight: '600',
  },

  // ─── Product cards ────────────────────────────────────────────────────────
  productScroll: {
    gap: 10,
    paddingRight: 4,
    paddingBottom: 4,
  },
  productCard: {
    width: 118,
    backgroundColor: C.white,
    borderRadius: RADIUS.lg,
    padding: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    ...SHADOW.sm,
  },
  productImageWrap: {
    width: '100%',
    height: 98,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: C.ivoryDark,
    marginBottom: 8,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productRankBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15,14,23,0.65)',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  productRankText: {
    fontSize: 9,
    color: C.white,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textSecond,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  productSold: {
    fontSize: 10,
    color: C.textMuted,
    marginTop: 1,
  },

  // ─── Buyer rows ───────────────────────────────────────────────────────────
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
  },
  buyerRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  buyerRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.ivoryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerRankGold: {
    backgroundColor: '#FFF3E8',
  },
  buyerRankText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textMuted,
  },
  buyerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.ivoryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
  },
  buyerAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.violet,
  },
  buyerInfo: {
    flex: 1,
  },
  buyerName: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
  },
  buyerOrders: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 1,
  },
  buyerSpend: {
    fontSize: 14,
    fontWeight: '900',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },

  // ─── Order rows ───────────────────────────────────────────────────────────
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  orderRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  orderThumb: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: C.ivoryDark,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  orderThumbImage: {
    width: '100%',
    height: '100%',
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
    marginBottom: 2,
  },
  orderMeta: {
    fontSize: 11,
    color: C.textMuted,
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },

  // ─── Status badge ─────────────────────────────────────────────────────────
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ─── Empty states ─────────────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: C.ivory,
    borderRadius: RADIUS.lg,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
    ...SHADOW.sm,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
    marginTop: 10,
    letterSpacing: -0.2,
  },
  emptyText: {
    fontSize: 13,
    color: C.textMuted,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyInline: {
    backgroundColor: C.ivory,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
    ...SHADOW.sm,
  },
  emptyInlineText: {
    fontSize: 13,
    color: C.textMuted,
  },
});