// src/screens/buyer/Cart/CartScreen.styles.ts
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerCount: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtnPressed: { backgroundColor: '#F9FAFB' },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  clearBtnText: { fontSize: 12, fontWeight: '500', color: '#6B7280' },

  // ── Radio ────────────────────────────────────────────────────────────────────
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },

  // ── Shop Group Header ────────────────────────────────────────────────────────
  shopHeader: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  shopIcon: { fontSize: 13 },
  shopName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111827' },

  // ── Swipe ────────────────────────────────────────────────────────────────────
  swipeWrapper: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAction: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  deleteLabel: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },

  // ── Cart Item — compact ──────────────────────────────────────────────────────
  cartItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,           // reduced from 14
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },

  // Image — slightly shorter for compact feel
  itemImage: {
    width: 80,                     // reduced from 90
    height: 90,                    // reduced from 110
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
  },
  itemImageActual: { width: '100%', height: '100%' },
  itemImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImageIcon: { fontSize: 22, color: '#D1D5DB' },

  dealBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17,24,39,0.85)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  dealBadgeText: { fontSize: 8, color: '#FFFFFF', fontWeight: '600' },

  itemInfo: {
    flex: 1,
    minHeight: 90,                 // matches image height
    justifyContent: 'space-between',
  },

  // Top row: name + trash
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemNameWrapper: { flex: 1, paddingRight: 6 },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 17,
  },
  trashBtn: {
    width: 26,
    height: 26,
    borderRadius: 5,
    backgroundColor: '#F9FAFB',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Variant chip — above price, matching reference screenshot
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
    gap: 4,
    marginBottom: 4,
  },
  variantDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
  },
  variantText: { fontSize: 11, color: '#374151', fontWeight: '500' },

  stockWarning: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 2,
  },

  // Price + qty on same bottom row
  priceQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#111827' },

  // Qty stepper — compact
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtyBtnPressed: { backgroundColor: '#F3F4F6' },
  qtyBtnDisabled: { opacity: 0.35 },
  qtyBtnText: { fontSize: 15, fontWeight: '400', color: '#374151', lineHeight: 19 },
  qtyValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    minWidth: 28,
    textAlign: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E5E7EB',
    height: 26,
    lineHeight: 24,
  },

  // Removed: separate priceRow (now inside priceQtyRow)
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },

  // ── List ─────────────────────────────────────────────────────────────────────
  list: { padding: 0, gap: 0 },

  // ── Empty ────────────────────────────────────────────────────────────────────
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
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
  emptySubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerAllLabel: { fontSize: 13, fontWeight: '500', color: '#374151' },
  footerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  footerTotal: { fontSize: 17, fontWeight: '700', color: '#111827' },
  checkoutBtn: {
    backgroundColor: '#111827',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  checkoutBtnPressed: { opacity: 0.85 },
  checkoutBtnDisabled: { backgroundColor: '#9CA3AF' },
  checkoutText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  // ── Modal ────────────────────────────────────────────────────────────────────
  modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: { fontSize: 13, color: '#6B7280', fontWeight: '700' },
  modalContent: { padding: 16, gap: 12, paddingBottom: 40 },
  modalImageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  modalImage: { width: '100%', height: '100%' },
  modalImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  modalSection: { paddingVertical: 4, gap: 6 },
  modalProductName: { fontSize: 17, fontWeight: '700', color: '#111827', lineHeight: 23 },
  modalPriceRow: { flexDirection: 'row', alignItems: 'baseline' },
  modalPrice: { fontSize: 19, fontWeight: '700', color: '#111827' },
  modalPriceUnit: { fontSize: 13, color: '#9CA3AF' },
  modalVariantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    gap: 5,
  },
  modalVariantText: { fontSize: 12, color: '#374151', fontWeight: '500' },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  modalCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  modalDetailRowLast: { paddingBottom: 0, marginBottom: 0, borderBottomWidth: 0 },
  modalDetailLabel: { fontSize: 13, color: '#6B7280' },
  modalDetailValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  modalDetailTotal: { fontSize: 15, fontWeight: '700', color: '#111827' },
  inStock: { color: '#10B981' },
  outOfStock: { color: '#EF4444' },
  modalDescription: { fontSize: 13, color: '#4B5563', lineHeight: 20 },
  modalSelectBtn: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  modalDeselectBtn: { backgroundColor: '#6B7280' },
  modalSelectBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});