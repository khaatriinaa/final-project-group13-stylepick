// src/screens/seller/Orders/SellerOrdersScreen.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 52, paddingBottom: 0,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 14,
  },
  title: { flex: 1, fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text },
  orderCount: { fontSize: 13, color: COLORS.textSecondary },

  // Filter tabs (like buyer orders)
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 0 },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  filterTabActive: { borderBottomColor: COLORS.secondary },
  filterTabText: { fontSize: 13, fontWeight: FONTS.semiBold, color: COLORS.textSecondary },
  filterTabTextActive: { color: COLORS.secondary },

  // List
  list: { padding: 14 },
  flatList: { flex: 1 },

  // Order card
  orderCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    marginBottom: 10, overflow: 'hidden', ...SHADOW.sm,
  },

  // Card header
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  orderId: { fontSize: 13, fontWeight: FONTS.bold, color: COLORS.text },
  statusBadge: { borderRadius: RADIUS.xs, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: FONTS.bold },

  // Card body
  cardBody: { paddingHorizontal: 14, paddingVertical: 12 },
  amount: { fontSize: 18, fontWeight: FONTS.extraBold, color: COLORS.text, marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  infoLabel: { fontSize: 11, fontWeight: FONTS.semiBold, color: COLORS.textLight, width: 60 },
  infoValue: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
  divider: { height: 1, backgroundColor: COLORS.border },

  // Card footer / actions
  cardFooter: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  actionBtn: {
    flex: 1, paddingVertical: 10, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.infoLight,
    borderWidth: 1, borderColor: 'rgba(37,99,235,0.15)',
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  actionBtnDanger: {
    backgroundColor: COLORS.errorLight,
    borderColor: 'rgba(220,38,38,0.15)',
  },
  actionBtnPressed: { opacity: 0.8 },
  actionBtnText: { fontSize: 12, fontWeight: FONTS.bold, color: COLORS.info },
  actionBtnTextPrimary: { color: COLORS.white },
  actionBtnTextDanger: { color: COLORS.error },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, color: COLORS.borderDark, marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: FONTS.semiBold, color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },

  // Filter wrapper
  filterWrapper: {
    height: 44, backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
});
