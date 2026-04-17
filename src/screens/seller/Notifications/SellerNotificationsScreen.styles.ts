// src/screens/seller/Notifications/SellerNotificationsScreen.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white, paddingTop: 52,
    paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text },
  markAllBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  markAllText: { fontSize: 13, color: COLORS.info, fontWeight: FONTS.semiBold },
  list: { padding: 14 },
  item: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 14, marginBottom: 8,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    ...SHADOW.sm,
  },
  itemUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.secondary },
  itemPressed: { opacity: 0.85 },
  indicator: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.secondary, marginTop: 5, flexShrink: 0,
  },
  indicatorRead: { backgroundColor: 'transparent' },
  itemBody: { flex: 1 },
  itemMessage: { fontSize: 13, color: COLORS.text, fontWeight: FONTS.semiBold, lineHeight: 20 },
  itemMessageRead: { fontWeight: FONTS.regular, color: COLORS.textSecondary },
  itemTime: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 36, color: COLORS.borderDark, marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontWeight: FONTS.semiBold, color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
});
