// src/screens/buyer/ProductDetail/ProductDetailScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  imageArea: {
    width: '100%', aspectRatio: 1,
    backgroundColor: '#F5F5F5', position: 'relative',
  },
  productImage: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
  },
  imagePlaceholderIcon: { fontSize: 72, color: '#D1D5DB' },
  backBtn: {
    position: 'absolute', top: 52, left: 14,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12, shadowRadius: 4, elevation: 3,
  },
  backBtnPressed: { opacity: 0.7 },
  body: { flex: 1, padding: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 8 },
  price: { fontSize: 26, fontWeight: '800', color: '#E63946' },
  stockBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 4, alignSelf: 'flex-start', marginBottom: 10,
  },
  stockText: { fontSize: 11, fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '700', color: '#111827', lineHeight: 22, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  desc: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catBadge: {
    backgroundColor: '#F5F5F5', borderRadius: 4,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  catText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  footer: {
    padding: 16, paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    flexDirection: 'row', gap: 10,
  },
  cartBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#E63946',
    alignItems: 'center',
  },
  cartBtnText: { fontSize: 14, fontWeight: '700', color: '#E63946' },
  buyBtn: {
    flex: 2, paddingVertical: 14, borderRadius: 8,
    backgroundColor: '#E63946', alignItems: 'center',
  },
  buyBtnDisabled: { backgroundColor: '#D1D5DB' },
  buyBtnPressed: { opacity: 0.85 },
  buyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  addedText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
