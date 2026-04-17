// src/screens/seller/Products/SellerProductsScreen.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white, paddingTop: 52,
    paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.secondary, borderRadius: RADIUS.sm,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  addBtnPressed: { opacity: 0.85 },
  addBtnText: { color: COLORS.white, fontWeight: FONTS.bold, fontSize: 13 },
  list: { padding: 14 },
  // Product card — horizontal row
  productCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    marginBottom: 10, flexDirection: 'row',
    overflow: 'hidden', ...SHADOW.sm,
  },
  productCardPressed: { opacity: 0.9 },
  imageWrap: { width: 88, height: 88, backgroundColor: COLORS.background },
  imageActual: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
  },
  imagePlaceholderText: { fontSize: 28, color: COLORS.borderDark },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: FONTS.semiBold, color: COLORS.text, marginBottom: 3 },
  productPrice: { fontSize: 14, fontWeight: FONTS.extraBold, color: COLORS.primary, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  stockText: { fontSize: 12, color: COLORS.textSecondary },
  categoryBadge: {
    backgroundColor: COLORS.background, borderRadius: RADIUS.xs,
    paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: COLORS.border,
  },
  categoryText: { fontSize: 10, color: COLORS.textSecondary, fontWeight: FONTS.semiBold },
  archivedBadge: {
    backgroundColor: COLORS.background, borderRadius: RADIUS.xs,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  archivedText: { fontSize: 10, fontWeight: FONTS.bold, color: COLORS.textLight },
  // Color dots preview
  colorRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  colorPreview: { width: 12, height: 12, borderRadius: 6, borderWidth: 0.5, borderColor: COLORS.border },
  // Actions column
  actions: {
    flexDirection: 'column', justifyContent: 'center',
    gap: 6, paddingRight: 12,
  },
  actionBtn: {
    width: 34, height: 34, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.border,
  },
  actionBtnText: { fontSize: 13, color: COLORS.textSecondary },
  // Empty
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 40, color: COLORS.borderDark },
  emptyTitle: { fontSize: 15, fontWeight: FONTS.semiBold, color: COLORS.text, marginTop: 12 },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
});
