// src/screens/buyer/Orders/BuyerOrdersScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 52,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBtnText: {
    fontSize: 16,
  },
  iconBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  iconBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formalBell: {
    fontSize: 18,
    color: '#374151',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },

  // ── Tabs ─────────────────────────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#111827',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },

  // ── List ─────────────────────────────────────────────────────────────────────
  list: { padding: 12, gap: 10 },

  // ── Card ─────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  cardPressed: { opacity: 0.8 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  orderId: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    letterSpacing: 0.3,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Card body
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  productImg: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  productImgImage: {
    width: 52,
    height: 52,
  },
  productImgPlaceholder: {
    fontSize: 22,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 3,
  },
  productMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Card footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#F3F4F6',
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  detailsBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#111827',
  },
  detailsBtnPressed: {
    opacity: 0.75,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  // ── Variant ───────────────────────────────────────────────────────────────
  variantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 3,
    marginBottom: 3,
  },
  variantDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
  },
  variantText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  }, 
  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyWrap: { alignItems: 'center', paddingTop: 48 },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: { fontSize: 24 },
  emptyTitle: { fontSize: 15, fontWeight: '500', color: '#111827', marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#9CA3AF', lineHeight: 20, textAlign: 'center' },
});