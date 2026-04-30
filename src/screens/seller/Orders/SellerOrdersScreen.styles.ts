// src/screens/seller/Orders/SellerOrdersScreen.styles.ts
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 52 : 20,
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

  // ── Pill tabs ─────────────────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeActive: {
    backgroundColor: '#FFFFFF',
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  tabBadgeTextActive: {
    color: '#111827',
  },

  // ── List ──────────────────────────────────────────────────────────────────
  list: { padding: 12, gap: 10 },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  cardPressed: { opacity: 0.8 },
  cardCancelled: {
    opacity: 0.82,
    borderColor: '#FECACA',
    borderWidth: 1,
  },

  // Card header
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
  productImgImage: { width: 52, height: 52 },
  productImgPlaceholder: { fontSize: 22 },
  productInfo: { flex: 1, minWidth: 0 },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 3,
  },
  productMeta: { fontSize: 12, color: '#9CA3AF' },

  // Variant chip
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
  orderDate: { fontSize: 12, color: '#9CA3AF' },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 0,
  },

  // Primary action button (Confirm / Preparing / Shipped / Delivered)
  actionBtnPrimary: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#374151',
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  // Danger action button (Cancel)
  actionBtnDanger: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionBtnDangerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#991B1B',
  },

  // Details button
  detailsBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#111827',
  },
  detailsBtnPressed: { opacity: 0.75 },
  detailsBtnCancelled: { backgroundColor: '#9CA3AF' },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
  },
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
  emptyTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 20,
    textAlign: 'center',
  },
});