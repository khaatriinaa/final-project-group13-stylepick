// src/screens/buyer/ProductDetail/ProductDetailScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFEFEF' },

  // ── Image area ────────────────────────────────────────────────────────────────
  imageArea: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E8E8E8',
    position: 'relative',
  },
  productImage: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
  },
  imagePlaceholderIcon: { fontSize: 72, color: '#C4C4C4' },

  // ── Back button ───────────────────────────────────────────────────────────────
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  backBtnPressed: { opacity: 0.65 },

  // ── Body scroll container ─────────────────────────────────────────────────────
  body: { padding: 10, gap: 6 },

  // ── Section card ─────────────────────────────────────────────────────────────
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#DCDCDC',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EBEBEB',
    backgroundColor: '#FAFAFA',
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  sectionBody: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  // ── Price row ─────────────────────────────────────────────────────────────────
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A0A0A',
    letterSpacing: -0.5,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // ── Product name ──────────────────────────────────────────────────────────────
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0A0A0A',
    lineHeight: 24,
    letterSpacing: -0.1,
  },

  // ── Inline divider (inside a card body) ──────────────────────────────────────
  divider: {
    height: 0.5,
    backgroundColor: '#EBEBEB',
    marginVertical: 10,
  },

  // ── Small label (inside card body) ───────────────────────────────────────────
  sectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 7,
  },

  // ── Category ──────────────────────────────────────────────────────────────────
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catBadge: {
    backgroundColor: '#F2F2F2',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  catText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // ── Description ───────────────────────────────────────────────────────────────
  desc: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 21,
    letterSpacing: 0.1,
  },

  // ── Footer ────────────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#DCDCDC',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 6,
  },
  footerPriceLabel: {
    fontSize: 10,
    color: '#AAAAAA',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A0A0A',
    letterSpacing: -0.3,
  },

  // ── Add to Cart (outline) ─────────────────────────────────────────────────────
  cartBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtnDisabled: { borderColor: '#CCCCCC' },
  cartBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: 0.3,
  },
  cartBtnTextDisabled: { color: '#BBBBBB' },

  // ── Buy Now (filled) ──────────────────────────────────────────────────────────
  buyBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnDisabled: { backgroundColor: '#CCCCCC' },
  buyBtnPressed: { opacity: 0.80 },
  buyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  addedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});