// src/screens/buyer/Notifications/BuyerNotificationsScreen.styles.ts
import { StyleSheet, Platform } from 'react-native';

const PRIMARY_RED = '#C8102E';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 56 : 20,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 22,
    color: '#111111',
    fontWeight: '600',
    lineHeight: 26,
    marginTop: -1,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.3,
  },
  unreadCountBadge: {
    backgroundColor: PRIMARY_RED,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  markAllBtn: {
    width: 80,
    alignItems: 'flex-end',
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 12,
    color: PRIMARY_RED,
    fontWeight: '700',
  },

  // ── Summary bar ───────────────────────────────────────────────────────────
  summaryBar: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  summaryText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  summaryHint: {
    fontSize: 11,
    color: '#BBBBBB',
  },

  // ── List ─────────────────────────────────────────────────────────────────
  list: {
    padding: 14,
    paddingBottom: 40,
  },

  // ── Notification item ─────────────────────────────────────────────────────
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemUnread: {
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY_RED, // overridden inline per type accent
    borderRadius: 16,
  },
  itemPressed: {
    opacity: 0.85,
  },

  // Icon pill
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  iconText: {
    fontSize: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Body
  itemBody: {
    flex: 1,
    gap: 6,
  },
  itemMessage: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 19,
  },
  itemMessageRead: {
    fontWeight: '400',
    color: '#666666',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTime: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  newBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Delete button
  deleteBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  deleteBtnText: {
    fontSize: 13,
    color: '#CCCCCC',
    fontWeight: '600',
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 100,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF0F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },
  emptyText: {
    fontSize: 13,
    color: '#AAAAAA',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});