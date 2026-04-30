// src/screens/seller/Orders/SellerOrderDetailScreen.styles.ts
import { StyleSheet, Platform } from 'react-native';

export const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // ── Hero header ───────────────────────────────────────────────────────────
  hero: {
    backgroundColor: '#111827',
    paddingTop: Platform.OS === 'ios' ? 56 : 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  heroBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },
  heroBackText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroOrderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  heroDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  heroAmountWrap: {
    alignItems: 'flex-end',
  },
  heroAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroAmountLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },

  // ── Status badge (in hero) ────────────────────────────────────────────────
  heroBadgeWrap: { marginTop: 16 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Timeline ──────────────────────────────────────────────────────────────
  timelineCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  timelineTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 28,
  },
  timelineNodeDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNodeActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNodePending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  timelineNodeCancelled: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNodeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  timelineNodeActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
    alignSelf: 'center',
  },
  timelineConnectorDone: {
    backgroundColor: '#111827',
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  timelineLabelDone: {
    color: '#111827',
  },
  timelineLabelActive: {
    color: '#111827',
    fontWeight: '700',
  },
  timelineSub: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 2,
  },
  timelineSubDone: {
    color: '#6B7280',
  },

  // ── Section card (shared) ─────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },

  // ── Order item row ────────────────────────────────────────────────────────
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    flexShrink: 0,
  },
  itemImageActual: { width: 56, height: 56 },
  itemImagePlaceholder: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImagePlaceholderText: { fontSize: 22 },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 18,
  },
  itemMeta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 3,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 0,
  },

  // ── Info rows ─────────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  infoIcon: {
    fontSize: 15,
    width: 22,
    textAlign: 'center',
    marginTop: 1,
  },
  infoBlock: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    lineHeight: 18,
  },

  // ── Summary / totals ──────────────────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  // ── Action footer ─────────────────────────────────────────────────────────
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    gap: 10,
  },
  footerBtnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  footerBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },
  footerBtnPrimary: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  footerBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footerBtnPressed: { opacity: 0.75 },

  bottomSpacer: { height: 20 },
});