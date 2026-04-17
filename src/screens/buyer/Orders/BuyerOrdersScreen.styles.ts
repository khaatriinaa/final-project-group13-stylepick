// src/screens/buyer/Orders/BuyerOrdersScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 52,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18, fontWeight: '700', color: '#111827',
    paddingHorizontal: 16, paddingBottom: 12,
  },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 0, gap: 0 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  filterTabActive: { borderBottomColor: '#E63946' },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  filterTabTextActive: { color: '#E63946' },
  list: { padding: 10 },

  // Order card
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  orderCardPressed: {
    opacity: 0.85,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  orderSeller: { fontSize: 13, fontWeight: '700', color: '#374151' },
  statusBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },

  // Summary row (replaces full item list on the list screen)
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  orderSummaryText: { fontSize: 13, color: '#374151', flex: 1, marginRight: 8 },
  orderSummaryQty: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },

  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  orderTotal: { fontSize: 14, fontWeight: '800', color: '#E63946' },
  orderDate: { fontSize: 11, color: '#9CA3AF' },

  // Tap hint
  tapHint: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  tapHintText: { fontSize: 11, color: '#9CA3AF' },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#374151' },
  emptyText: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
});