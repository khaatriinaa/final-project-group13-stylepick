// src/screens/buyer/Checkout/CheckoutScreen.styles.ts

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  /* ── Header ── */
  header: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#FFFFFF',
    lineHeight: 30,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ── Warning Box ── */
  warningBox: {
    backgroundColor: '#FFF7ED',
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
    margin: 12,
    borderRadius: 10,
    padding: 14,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C2410C',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#7C2D12',
    lineHeight: 19,
  },
  warningBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  warningBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  /* ── Section Cards ── */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,           // ← was 14
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pinIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  /* ── Address Rows ── */
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  addressLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    width: 80,
  },
  addressValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  missingValue: {
    color: '#EF4444',
    fontStyle: 'italic',
  },

  /* ── Product Row ── */
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: '#6B7280',
  },
  productQty: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  productSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },

  /* ── Payment Method ── */
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#111827',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#111827',
  },
  paymentText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },

  /* ── Order Summary ── */
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  freeText: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  /* ── Bottom Bar ── */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,        // ← was 30, more room on Android
    minHeight: 90,            // ← added so it never collapses
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomPriceInfo: {
    flex: 1,
  },
  bottomLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  placeOrderBtn: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  placeOrderBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});