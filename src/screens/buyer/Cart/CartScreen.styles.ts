// src/screens/buyer/Cart/CartScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F8' },

  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 52, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: '#EBEBEB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#111827', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartCount: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  clearBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#FEF2F2' },
  clearBtnText: { fontSize: 12, color: '#EF4444', fontWeight: '700' },

  selectAllBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 10,
  },
  selectAllText: { fontSize: 13, fontWeight: '600', color: '#374151', flex: 1 },
  selectedCount: { fontSize: 12, color: '#9CA3AF' },

  checkbox: {
    width: 20, height: 20, borderRadius: 5,
    borderWidth: 2, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
  },
  checkboxChecked: { backgroundColor: '#E63946', borderColor: '#E63946' },
  checkmark: { fontSize: 11, color: '#FFFFFF', fontWeight: '800' },

  list: { padding: 12, gap: 8, flexGrow: 1 },

  // ── Swipe ──────────────────────────────────────────────
  swipeWrapper: {
    position: 'relative',
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0, top: 0, bottom: 0,
    width: 80,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  deleteAction: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  deleteIcon: { fontSize: 20 },
  deleteLabel: { fontSize: 11, color: '#FFFFFF', fontWeight: '700' },

  // ── Cart Item ──────────────────────────────────────────
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  cartItemSelected: { borderColor: '#E63946', backgroundColor: '#FFFAFA' },
  itemImage: {
    width: 68, height: 68, borderRadius: 8,
    backgroundColor: '#F5F5F5', overflow: 'hidden',
  },
  itemImageActual: { width: '100%', height: '100%' },
  itemImagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  itemImageIcon: { fontSize: 28, color: '#D1D5DB' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 3, lineHeight: 18 },
  itemUnitPrice: { fontSize: 11, color: '#9CA3AF', marginBottom: 5 },
  itemSubtotal: { fontSize: 15, fontWeight: '800', color: '#E63946' },
  stockWarning: { fontSize: 10, color: '#F59E0B', fontWeight: '600', marginTop: 3 },

  // ── Qty Controls (horizontal) ──────────────────────────
  qtyControls: {
    flexDirection: 'row',   // ← horizontal row
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 30, height: 30, borderRadius: 8,
    borderWidth: 1, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  qtyBtnPressed: { backgroundColor: '#F3F4F6' },
  qtyBtnDisabled: { opacity: 0.35 },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#374151', lineHeight: 22 },
  qtyValue: { fontSize: 14, fontWeight: '700', color: '#111827', minWidth: 22, textAlign: 'center' },

  // ── Empty ──────────────────────────────────────────────
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 18 },

  // ── Footer ─────────────────────────────────────────────
  footer: {
    backgroundColor: '#FFFFFF', padding: 16, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: '#EBEBEB',
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  summaryLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  summaryValue: { fontSize: 20, fontWeight: '800', color: '#111827' },
  checkoutBtn: {
    backgroundColor: '#E63946', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center',
  },
  checkoutBtnPressed: { opacity: 0.85 },
  checkoutBtnDisabled: { backgroundColor: '#F3A1A7', opacity: 0.7 },
  checkoutText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },

  // ── Modal ──────────────────────────────────────────────
  modalContainer: { flex: 1, backgroundColor: '#F4F4F8' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EBEBEB',
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  modalCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  modalCloseBtnText: { fontSize: 13, color: '#6B7280', fontWeight: '700' },
  modalContent: { padding: 16, gap: 12, paddingBottom: 40 },
  modalImageWrapper: {
    width: '100%', height: 240, borderRadius: 14,
    overflow: 'hidden', backgroundColor: '#E5E7EB',
  },
  modalImage: { width: '100%', height: '100%' },
  modalImagePlaceholder: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6',
  },
  modalSection: { paddingVertical: 4 },
  modalProductName: {
    fontSize: 19, fontWeight: '800', color: '#111827',
    marginBottom: 6, letterSpacing: -0.2, lineHeight: 26,
  },
  modalPriceRow: { flexDirection: 'row', alignItems: 'baseline' },
  modalPrice: { fontSize: 22, fontWeight: '800', color: '#E63946' },
  modalPriceUnit: { fontSize: 13, color: '#9CA3AF' },
  modalCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  modalCardTitle: {
    fontSize: 12, fontWeight: '700', color: '#9CA3AF',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: 10, marginBottom: 10,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  modalDetailRowLast: { paddingBottom: 0, marginBottom: 0, borderBottomWidth: 0 },
  modalDetailLabel: { fontSize: 13, color: '#6B7280' },
  modalDetailValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  modalDetailTotal: { fontSize: 16, fontWeight: '800', color: '#E63946' },
  inStock: { color: '#10B981' },
  outOfStock: { color: '#EF4444' },
  modalDescription: { fontSize: 13, color: '#4B5563', lineHeight: 20 },
  modalSelectBtn: {
    backgroundColor: '#E63946', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  modalDeselectBtn: { backgroundColor: '#10B981' },
  modalSelectBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // ── Header icon buttons ────────────────────────────────
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  headerIconBtnPressed: { backgroundColor: '#E5E7EB' },
  headerIconEmoji: { fontSize: 16 },
  notifBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#E63946',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  notifBadgeText: { fontSize: 6, color: '#FFFFFF', fontWeight: '800' },
});