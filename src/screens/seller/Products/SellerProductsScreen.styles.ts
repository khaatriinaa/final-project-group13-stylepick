// src/screens/seller/Products/SellerProductsScreen.styles.ts
import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 56 : 20,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: { fontSize: 18 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Search row ────────────────────────────────────────────────────────────
  searchRow: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchIcon: { fontSize: 15 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
    paddingVertical: 0,
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSquareText: { fontSize: 20, color: '#555555' },

  // ── Filter chips ──────────────────────────────────────────────────────────
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: '#FFF5EE',
  },
  filterChipText: {
    fontSize: 13,
    color: '#222222',
    fontWeight: '600',
  },
  filterChipCaret: {
    fontSize: 20,
    color: '#222222',
    fontWeight: '900',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F4F4F4',
  },
  // ── Dropdown ──────────────────────────────────────────────────────────────
  dropdown: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 192 : 160,
    left: 16,
    zIndex: 999,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    minWidth: 140,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemActive: { backgroundColor: '#FFF5EE' },
  dropdownItemText: { fontSize: 14, color: '#222222' },
  dropdownItemTextActive: { color: '#F97316', fontWeight: '700' },

  // ── Product list ──────────────────────────────────────────────────────────
  list: { padding: 14, paddingBottom: 30 },

  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productCardPressed: { opacity: 0.92 },

  // Image — fixed 90×90 square on the LEFT
  imageWrap: {
    width: 90,
    height: 90,
    backgroundColor: '#F8F8F8',
    flexShrink: 0,
  },
  imageActual: {
    width: 90,
    height: 90,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  imagePlaceholderText: { fontSize: 28 },

  // Info section
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },

  // Status pill
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
    gap: 5,
    marginBottom: 3,
  },
  statusBadgeActive:   { backgroundColor: '#E8F9EE' },
  statusBadgeArchived: { backgroundColor: '#F2F2F2' },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusDotActive:   { backgroundColor: '#22C55E' },
  statusDotArchived: { backgroundColor: '#9CA3AF' },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
  statusBadgeTextActive:   { color: '#15803D' },
  statusBadgeTextArchived: { color: '#6B7280' },

  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 19,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  dotSeparator: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '600',
  },
  colorDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  colorLabel: {
    fontSize: 12,
    color: '#666666',
  },
  stockText: {
    fontSize: 12,
    color: '#666666',
  },

  // Action buttons column
  actions: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
    paddingRight: 12,
    paddingLeft: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  actionBtnText: { fontSize: 15, color: '#666666' },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  toastCheckWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastCheck: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  toastText: { flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  toastClose: { color: '#888888', fontSize: 15 },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    marginTop: 14,
  },
  emptyText: {
    fontSize: 13,
    color: '#888888',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});