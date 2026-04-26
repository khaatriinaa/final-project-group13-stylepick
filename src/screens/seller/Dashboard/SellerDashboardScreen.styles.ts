// src/screens/seller/Dashboard/SellerDashboardScreen.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },

  // ─── Top Bar ─────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  // Avatar
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight ?? '#FFE5CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },

  // Store name
  storeName: {
    fontSize: 17,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    letterSpacing: 0.2,
  },

  // Bell
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F6F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  bellIcon: {
    fontSize: 18,
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#F0506E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: FONTS.bold,
    lineHeight: 13,
  },

  // ─── Body ─────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // ─── Stats Row ────────────────────────────────────────────────
  statsRow: {
    gap: 12,
    paddingRight: 4,
    paddingBottom: 4,
  },
  statCard: {
    width: 110,
    borderRadius: RADIUS.lg,
    padding: 14,
    ...SHADOW.sm,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 16,
  },
  statCardLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
    marginBottom: 3,
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: FONTS.extraBold,
    color: COLORS.text,
  },

  // ─── Generic card ─────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: 16,
    marginTop: 4,
    ...SHADOW.sm,
  },

  // ─── Card header ──────────────────────────────────────────────
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },

  // Period button
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 4,
  },
  periodBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: FONTS.semiBold,
  },
  periodBtnArrow: {
    fontSize: 20,
    color: '#fff',
  },

  // Filter button (orders)
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 110,
  },
  filterBtnText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: FONTS.medium,
    flex: 1,
  },

  filterBtnArrow: {
  fontSize: 20,
  color:'#000000',
},

  // ─── Legend ───────────────────────────────────────────────────
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
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
  },

  // ─── Chart area ───────────────────────────────────────────────
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
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  xLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    flex: 1,
  },
  xLabelActive: {
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },

  // Chart summary row
  chartSummary: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 14,
    marginTop: 4,
  },
  chartSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  chartSummaryBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F0F0F0',
  },
  chartSummaryValue: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  chartSummaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ─── Dropdown ─────────────────────────────────────────────────
  dropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 160,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
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
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemActive: {
    backgroundColor: COLORS.primaryLight ?? '#FFF3E8',
  },
  dropdownItemText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: FONTS.medium,
  },
  dropdownItemTextActive: {
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
  },

  // ─── Section header ───────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    overflow: 'visible',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
  },

  // ─── Product cards ────────────────────────────────────────────
  productScroll: {
    gap: 12,
    paddingRight: 4,
    paddingBottom: 4,
  },
  productCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: 10,
    ...SHADOW.sm,
  },
  productImageWrap: {
    width: '100%',
    height: 100,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: '#F6F7FB',
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
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  productRankText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: FONTS.bold,
  },
  productName: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  productSold: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  // ─── Buyer rows ───────────────────────────────────────────────
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
  },
  buyerRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  buyerRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F6F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerRankGold: {
    backgroundColor: '#FFF3E8',
  },
  buyerRankText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.textSecondary,
  },
  buyerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight ?? '#FFE5CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerAvatarText: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  buyerInfo: {
    flex: 1,
  },
  buyerName: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
  },
  buyerOrders: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  buyerSpend: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },

  // ─── Order rows ───────────────────────────────────────────────
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  orderRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  orderThumb: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: '#F6F7FB',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 2,
  },
  orderMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },

  // ─── Status badge ─────────────────────────────────────────────
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.semiBold,
  },

  // ─── Empty states ─────────────────────────────────────────────
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: 32,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyInline: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  emptyInlineText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});