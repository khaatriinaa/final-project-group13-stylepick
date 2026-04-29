// src/screens/buyer/Orders/BuyerOrderDetailScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // ── Header (mirrors BuyerOrdersScreen header) ────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 60 },
  backBtnText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },

  scrollContent: { padding: 12, gap: 10 },

  // ── Section card (mirrors .card) ─────────────────────────────────────────────
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 0,
  },
  sectionHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  // ── Order ID + status (mirrors .cardHeader) ──────────────────────────────────
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
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
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // ── Progress tracker ──────────────────────────────────────────────────────────
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStepWrap: { alignItems: 'center', flex: 0 },
  progressDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  progressDotCompleted: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  progressDotActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
    transform: [{ scale: 1.1 }],
  },
  progressCheck: { fontSize: 11, color: '#FFFFFF', fontWeight: '700' },
  progressActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#E5E7EB',
    marginBottom: 22,
    marginHorizontal: 2,
  },
  progressLineCompleted: { backgroundColor: '#111827' },
  progressLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: 52,
    fontWeight: '500',
  },
  progressLabelCompleted: { color: '#374151', fontWeight: '600' },
  progressLabelActive: { color: '#111827', fontWeight: '700' },

  // ── Items ─────────────────────────────────────────────────────────────────────
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  itemRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  itemImageWrap: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemImage: { width: 52, height: 52 },
  itemImagePlaceholder: { fontSize: 22 },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 3,
  },
  itemUnit: { fontSize: 12, color: '#9CA3AF' },
  itemSubtotal: { fontSize: 13, fontWeight: '600', color: '#111827' },

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
  // ── Summary ───────────────────────────────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 13, color: '#6B7280' },
  summaryValue: { fontSize: 13, color: '#374151', fontWeight: '500' },
  summaryFreeText: { fontSize: 13, color: '#059669', fontWeight: '500' },
  summaryDivider: {
    height: 0.5,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  summaryTotalValue: { fontSize: 15, fontWeight: '700', color: '#111827' },

  // ── Address ───────────────────────────────────────────────────────────────────
  addressText: { fontSize: 13, color: '#374151', lineHeight: 20 },

  // ── Cancel button ─────────────────────────────────────────────────────────────
  cancelBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnDisabled: { opacity: 0.5 },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
});