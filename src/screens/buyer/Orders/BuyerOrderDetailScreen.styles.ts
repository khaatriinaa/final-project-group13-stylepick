// src/screens/buyer/Orders/BuyerOrderDetailScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { width: 60 },
  backBtnText: { fontSize: 14, color: '#E63946', fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  scrollContent: { padding: 12 },

  // Section card
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Order ID + status
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: { fontSize: 17, fontWeight: '800', color: '#111827' },
  statusBadge: { borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  orderDate: { fontSize: 12, color: '#9CA3AF' },

  // Progress tracker
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStepWrap: { alignItems: 'center', flex: 0 },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressDotCompleted: { backgroundColor: '#059669' },
  progressDotActive: {
    backgroundColor: '#E63946',
    transform: [{ scale: 1.15 }],
  },
  progressCheck: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  progressLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginBottom: 18, marginHorizontal: 2 },
  progressLineCompleted: { backgroundColor: '#059669' },
  progressLabel: { fontSize: 9, color: '#9CA3AF', textAlign: 'center', maxWidth: 52 },
  progressLabelCompleted: { color: '#059669' },
  progressLabelActive: { color: '#E63946', fontWeight: '700' },

  // Items
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemImageWrap: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  itemImage: { width: '100%', height: '100%' },
  itemImagePlaceholder: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
  },
  itemImageIcon: { fontSize: 26, color: '#D1D5DB' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  itemUnit: { fontSize: 12, color: '#9CA3AF' },
  itemSubtotal: { fontSize: 14, fontWeight: '700', color: '#374151' },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 13, color: '#6B7280' },
  summaryValue: { fontSize: 13, color: '#374151', fontWeight: '600' },
  summaryTotalRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryTotalLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  summaryTotalValue: { fontSize: 16, fontWeight: '800', color: '#E63946' },

  // Address
  addressText: { fontSize: 13, color: '#374151', lineHeight: 20 },

  // Cancel
  cancelBtn: {
    marginTop: 4,
    marginBottom: 4,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  cancelBtnDisabled: { opacity: 0.6 },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
});