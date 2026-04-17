// src/screens/seller/Dashboard/SellerDashboardScreen.styles.ts
import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // ─── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuIcon: { padding: 4 },
  menuLine: {
    width: 22,
    height: 2,
    backgroundColor: COLORS.white,
    marginBottom: 4,
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: { color: COLORS.white, fontSize: 14 },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // ─── Stats card ───────────────────────────────────────────────
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 18,
    flexDirection: 'row',
    ...SHADOW.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: FONTS.extraBold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: FONTS.medium,
  },

  // ─── Body ─────────────────────────────────────────────────────
  body: { paddingHorizontal: 16, paddingBottom: 30 },

  // ─── Sales chart ──────────────────────────────────────────────
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginTop: 16,
    ...SHADOW.sm,
    overflow: 'visible',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  chartPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 110,
  },
  chartPeriodText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
    flex: 1,
  },

  // ─── Bar chart ────────────────────────────────────────────────
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 80,
    marginBottom: 8,
  },
  barWrap: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '100%', borderRadius: RADIUS.sm, minHeight: 4 },
  barLabel: { fontSize: 9, color: COLORS.textLight },

  // ─── Legend ───────────────────────────────────────────────────
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: { flex: 1, alignItems: 'center' },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  legendValue: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  legendLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  // ─── Quick actions ────────────────────────────────────────────
  quickRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  quickBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickBtnPressed: { backgroundColor: COLORS.background },
  quickBtnIcon: {
    fontSize: 18,
    marginBottom: 6,
    color: COLORS.secondary,
  },
  quickBtnLabel: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
  },

  // ─── Section header ───────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
    overflow: 'visible',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  sortWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 120,
  },
  sortText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },

  // ─── Shared dropdown styles ───────────────────────────────────
  dropdown: {
    position: 'absolute',
    top: 36,
    left: 0,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 150,
    ...SHADOW.md,
    zIndex: 999,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // Android
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemActive: {
    backgroundColor: COLORS.primaryLight,
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

  // ─── Order rows ───────────────────────────────────────────────
  orderRow: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOW.sm,
  },
  orderRowPressed: { opacity: 0.9 },
  orderImageWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderImage: { width: '100%', height: '100%' },
  orderImagePlaceholder: { fontSize: 20, color: COLORS.borderDark },
  orderInfo: { flex: 1 },
  orderItemName: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 2,
  },
  orderMeta: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 },
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
    borderRadius: RADIUS.full,
    marginTop: 2,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.semiBold,
  },

  // ─── Empty state ──────────────────────────────────────────────
  emptyCard: {
    backgroundColor: COLORS.white,
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
});