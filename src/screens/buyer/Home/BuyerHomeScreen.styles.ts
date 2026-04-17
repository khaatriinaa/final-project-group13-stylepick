import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 52,
    paddingBottom: 14, paddingHorizontal: 16,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerLeft: { flex: 1 },
  hiText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  nameText: { fontSize: 17, fontWeight: FONTS.bold, color: COLORS.white },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeWrap: { position: 'relative' },
  cartBadge: {
    position: 'absolute', top: -5, right: -5,
    backgroundColor: COLORS.white, borderRadius: 9,
    minWidth: 17, height: 17, alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 3,
  },
  cartBadgeText: { fontSize: 9, fontWeight: FONTS.extraBold, color: COLORS.primary },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: RADIUS.md,
    paddingHorizontal: 12, height: 40, gap: 8,
  },
  searchIcon: { width: 16, height: 16, tintColor: '#9CA3AF' },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text, padding: 0 },
  // Categories
  catWrap: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  catContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.border,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipText: { fontSize: 12, fontWeight: FONTS.semiBold, color: COLORS.textSecondary },
  catChipTextActive: { color: COLORS.white },
  // Banner
  banner: {
    backgroundColor: COLORS.secondary, marginHorizontal: 14,
    marginTop: 14, borderRadius: RADIUS.lg, padding: 18,
    flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
  },
  bannerText: { flex: 1 },
  bannerTag: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: FONTS.semiBold, marginBottom: 4 },
  bannerTitle: { fontSize: 18, fontWeight: FONTS.extraBold, color: COLORS.white, lineHeight: 24 },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  // Section
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 14, paddingTop: 18, paddingBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: FONTS.bold, color: COLORS.text },
  sectionCount: { fontSize: 12, color: COLORS.textSecondary },
  // Product grid
  grid: { paddingHorizontal: 7, paddingBottom: 24 },
  productCard: {
    flex: 1, margin: 5, backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm,
  },
  productCardPressed: { opacity: 0.93, transform: [{ scale: 0.99 }] },
  productImageWrap: { width: '100%', aspectRatio: 0.85, backgroundColor: COLORS.background, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  productImagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  productImageIcon: { fontSize: 40, color: COLORS.borderDark },
  soldOutOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  soldOutText: { color: COLORS.white, fontWeight: FONTS.bold, fontSize: 13, letterSpacing: 1 },
  wishlistBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', ...SHADOW.sm,
  },
  productInfo: { padding: 10 },
  productName: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2, lineHeight: 16 },
  productPrice: { fontSize: 15, fontWeight: FONTS.extraBold, color: COLORS.primary },
  // Empty
  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 15, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: 6, marginTop: 14 },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' },
});
