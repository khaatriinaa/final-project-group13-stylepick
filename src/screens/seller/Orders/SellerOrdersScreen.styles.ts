// src/screens/seller/Orders/SellerOrdersScreen.styles.ts
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 56 : 20,
    paddingBottom: 0,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.8,
  },
  orderCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#F97316',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // ── Filter pill tabs ──────────────────────────────────────────────────────
  filterWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 22,
    backgroundColor: '#F2F2F2',
  },
  filterTabActive: {
    backgroundColor: '#FFF5EE',
    borderWidth: 1.5,
    borderColor: '#F97316',
  },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#666666' },
  filterTabTextActive: { color: '#F97316' },

  // ── List ──────────────────────────────────────────────────────────────────
  flatList: { flex: 1 },
  list: { padding: 14, paddingBottom: 30 },

  // ── Order card ────────────────────────────────────────────────────────────
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // Card header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  orderId: { fontSize: 13, fontWeight: '800', color: '#111111', letterSpacing: 0.3 },
  orderDate: { fontSize: 11, color: '#AAAAAA', marginTop: 1 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },

  // Item preview strip
  itemsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  itemThumbImage: { width: 48, height: 48 },
  itemThumbPlaceholder: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  itemThumbPlaceholderText: { fontSize: 20 },
  itemsInfo: { flex: 1 },
  itemsNames: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 18,
  },
  itemsSubtext: { fontSize: 11, color: '#AAAAAA', marginTop: 2 },
  moreItemsBadge: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  moreItemsText: { fontSize: 11, fontWeight: '700', color: '#888888' },

  // Card footer / amount + actions
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
  },
  amountWrap: { flex: 1 },
  amount: { fontSize: 18, fontWeight: '800', color: '#111111' },
  codLabel: { fontSize: 11, color: '#AAAAAA', marginTop: 1 },

  actionBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  actionBtnPrimary: { backgroundColor: '#F97316', borderColor: '#F97316' },
  actionBtnDanger: { backgroundColor: '#FFE5E5', borderColor: 'rgba(220,38,38,0.2)' },
  actionBtnPressed: { opacity: 0.82 },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#555555' },
  actionBtnTextPrimary: { color: '#FFFFFF' },
  actionBtnTextDanger: { color: '#CC0000' },

  viewBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtnText: { fontSize: 12, fontWeight: '700', color: '#555555' },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#222222', marginTop: 14 },
  emptyText: { fontSize: 13, color: '#888888', marginTop: 5, textAlign: 'center', paddingHorizontal: 40 },
});