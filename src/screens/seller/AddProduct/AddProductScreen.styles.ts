// src/screens/seller/AddProduct/AddProductScreen.styles.ts
import { StyleSheet } from 'react-native';

// ─── Main Styles ──────────────────────────────────────────────
export const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingBottom: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#EFEFEF', backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  backText:        { fontSize: 22, color: '#1A1A2E' },
  headerTitle:     { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  body:            { padding: 16, paddingBottom: 40 },
  section:         { marginBottom: 20 },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  sectionTitle:    { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  link:            { fontSize: 13, color: '#E63946', fontWeight: '600' },

  // Media
  mediaRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mediaThumb: {
    width: 80, height: 80, borderRadius: 10,
    overflow: 'hidden', position: 'relative',
  },
  mediaImg:        { width: '100%', height: '100%' },
  mediaRemove: {
    position: 'absolute', top: 3, right: 3,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  mediaRemoveText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  mediaAdd: {
    width: 80, height: 80, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E0E0E0', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB',
  },
  mediaAddIcon:    { fontSize: 20 },
  mediaAddText:    { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  // Fields
  label:           { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  req:             { color: '#DC2626' },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#111827', backgroundColor: '#F9FAFB',
  },
  textArea:        { height: 90, textAlignVertical: 'top' },
  inputError:      { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText:       { fontSize: 12, color: '#EF4444', marginTop: 4 },
  placeholder:     { fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' },

  // Radio
  radioRow:        { flexDirection: 'row', gap: 12 },
  radioBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#F9FAFB',
  },
  radioBtnActive:  { borderColor: '#1D3557', backgroundColor: '#FFFFFF' },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive:{ borderColor: '#1D3557' },
  radioInner:      { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1D3557' },
  radioLabel:      { fontSize: 13, fontWeight: '500', color: '#6B7280' },
  radioLabelActive:{ color: '#1A1A2E', fontWeight: '600' },

  // Chips
  chipRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: '#E0E0E0',
    flexDirection: 'row', alignItems: 'center',
  },
  chipActive: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#E63946', flexDirection: 'row', alignItems: 'center',
  },
  chipText:        { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  chipTextActive:  { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },

  // Colors
  colorGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorItem:       { alignItems: 'center', width: 46 },
  colorDot: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
  },
  colorDotWhite:   { borderColor: '#D1D5DB' },
  colorDotSel:     { borderColor: '#E63946', borderWidth: 2.5 },
  colorLabel:      { fontSize: 9, color: '#6B7280', marginTop: 3, textAlign: 'center' },

  // Footer
  footer:          { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText:   { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  submitBtn: {
    flex: 2, height: 48, borderRadius: 12,
    backgroundColor: '#E63946', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#E63946', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  submitBtnText:   { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});

// ─── Modal Styles ─────────────────────────────────────────────
export const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '75%',
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, borderBottomWidth: 1, borderBottomColor: '#EFEFEF',
  },
  sheetTitle:  { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  closeBtn:    { fontSize: 18, color: '#6B7280', padding: 4 },
  chipGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999,
    backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: '#E0E0E0',
    flexDirection: 'row', alignItems: 'center',
  },
  chipActive: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999,
    backgroundColor: '#E63946', flexDirection: 'row', alignItems: 'center',
  },
  chipText:       { fontSize: 13, fontWeight: '500', color: '#6B7280' },
  chipTextActive: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  chipX:          { fontSize: 11, color: '#FFFFFF' },
  footer: {
    flexDirection: 'row', gap: 10, padding: 16,
    borderTopWidth: 1, borderTopColor: '#EFEFEF',
  },
  cancelBtn: {
    flex: 1, height: 46, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  saveBtn: {
    flex: 2, height: 46, borderRadius: 10,
    backgroundColor: '#E63946', alignItems: 'center', justifyContent: 'center',
  },
  saveText:    { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  // Stock
  stockBody:   { padding: 20 },
  stockLabel:  { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 2 },
  stockSub:    { fontSize: 12, color: '#6B7280', marginBottom: 14 },
  qtyRow:      { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 40, height: 40, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText:  { fontSize: 20, color: '#1A1A2E', fontWeight: '700' },
  qtyInput: {
    flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700',
    color: '#1A1A2E', borderWidth: 1.5, borderColor: '#E0E0E0',
    height: 40, marginHorizontal: 8, borderRadius: 8,
  },

  // Pricing
  priceInput: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E0E0E0',
    borderRadius: 10, paddingHorizontal: 14, height: 48,
    backgroundColor: '#F9FAFB',
  },
  priceCurrency:   { fontSize: 14, color: '#6B7280', marginRight: 8 },
  priceTextInput:  { flex: 1, fontSize: 16, color: '#1A1A2E' },
  calcRow:         { flexDirection: 'row', gap: 12, marginTop: 4 },
  calcBox: {
    flex: 1, padding: 12, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#F9FAFB',
  },
  calcLabel:  { fontSize: 11, color: '#6B7280', marginBottom: 4 },
  calcValue:  { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
});