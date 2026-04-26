// src/screens/seller/AddProduct/AddProductScreen.styles.ts
import { StyleSheet, Platform } from 'react-native';

const RED   = '#E63946';
const NAVY  = '#1D3557';
const WHITE = '#FFFFFF';
const BG    = '#F8F7F5';
const BORDER = '#E5E7EB';
const TEXT   = '#111827';
const TEXT2  = '#6B7280';
const TEXT3  = '#9CA3AF';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backText: { fontSize: 16, color: RED, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: TEXT },
  headerSpacer: { width: 48 },

  // ── Body ────────────────────────────────────────────────────
  body: { padding: 16, paddingBottom: 60 },

  // ── Card ────────────────────────────────────────────────────
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  // ── Fields ──────────────────────────────────────────────────
  label: { fontSize: 13, fontWeight: '600', color: TEXT2, marginBottom: 6 },
  req: { color: RED },
  fieldGap: { height: 14 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: '#FAFAF8',
    paddingHorizontal: 13,
    height: 48,
    gap: 8,
  },
  inputWrapError: { borderColor: '#EF4444' },
  inputWrapMulti: {
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: '#FAFAF8',
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputIcon: { fontSize: 15 },
  input: { flex: 1, fontSize: 14, color: TEXT, fontWeight: '500' },
  inputMulti: { fontSize: 14, color: TEXT, fontWeight: '500', minHeight: 80, textAlignVertical: 'top' },
  errorText: { fontSize: 11, color: '#EF4444', marginTop: 4 },

  // ── Media ───────────────────────────────────────────────────
  mediaScroll: { marginHorizontal: -2 },
  mediaRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 2, paddingBottom: 4 },
  mediaThumbMain: { width: 110, height: 130, borderRadius: 14, overflow: 'hidden', position: 'relative' },
  mediaThumb: { width: 88, height: 104, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  mediaImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  coverBadge: {
    position: 'absolute', bottom: 6, left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
  },
  coverBadgeText: { fontSize: 9, color: WHITE, fontWeight: '700', letterSpacing: 0.4 },
  removeBtn: {
    position: 'absolute', top: 5, right: 5,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  removeBtnText: { color: WHITE, fontSize: 9, fontWeight: '800' },
  addPhotoBtn: {
    width: 88, height: 104, borderRadius: 12,
    borderWidth: 1.5, borderColor: BORDER, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FAFAF8', gap: 5,
  },
  addPhotoIcon: { fontSize: 22 },
  addPhotoText: { fontSize: 10, color: TEXT3, fontWeight: '500' },
  mediaHint: { fontSize: 11, color: TEXT3, textAlign: 'center', marginTop: 8 },

  // ── Chips ───────────────────────────────────────────────────
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 10, borderWidth: 1.5, borderColor: BORDER,
    backgroundColor: '#FAFAF8',
  },
  chipActive: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 10, borderWidth: 1.5, borderColor: NAVY,
    backgroundColor: NAVY,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: TEXT2 },
  chipTextActive: { fontSize: 12, fontWeight: '600', color: WHITE },

  // ── Sizes ───────────────────────────────────────────────────
  sizeGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 10,
  },
  sizeChip: {
    width: 52, height: 46, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: BORDER, backgroundColor: '#FAFAF8',
  },
  sizeChipActive: {
    width: 52, height: 46, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: RED, backgroundColor: RED,
  },
  sizeText: { fontSize: 12, fontWeight: '700', color: TEXT2 },
  sizeTextActive: { fontSize: 12, fontWeight: '700', color: WHITE },

  // ── Colors ──────────────────────────────────────────────────
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorItem: { alignItems: 'center', width: 46 },
  colorDot: {
    width: 38, height: 38, borderRadius: 19,
    borderWidth: 2, borderColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
  },
  colorDotWhite: { borderColor: BORDER },
  colorDotSel: { borderColor: RED, borderWidth: 3 },
  colorCheck: { fontSize: 13, fontWeight: '800' },
  colorLabel: { fontSize: 9, color: TEXT3, marginTop: 4, textAlign: 'center' },

  // ── Category ────────────────────────────────────────────────
  catSelectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1.5, borderColor: BORDER,
    borderStyle: 'dashed', backgroundColor: '#FAFAF8',
  },
  catSelectText: { fontSize: 13, color: TEXT3, fontWeight: '500' },
  catList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1.5, borderColor: NAVY,
    backgroundColor: NAVY,
  },
  catPillText: { fontSize: 12, fontWeight: '600', color: WHITE },
  catPillX: { fontSize: 12, color: '#FFFFFF99', fontWeight: '700' },

  // ── Status ──────────────────────────────────────────────────
  statusRow: { flexDirection: 'row', gap: 10 },
  statusBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 7, paddingVertical: 13,
    borderRadius: 12, borderWidth: 1.5, borderColor: BORDER,
    backgroundColor: '#FAFAF8',
  },
  statusBtnRed: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 7, paddingVertical: 13,
    borderRadius: 12, borderWidth: 1.5, borderColor: RED,
    backgroundColor: '#FFF0F0',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  statusTextRed: { fontSize: 13, fontWeight: '600', color: RED },

  // ── Price / Stock display ────────────────────────────────────
  priceDisplay: { flexDirection: 'row', alignItems: 'baseline', gap: 3, marginBottom: 10 },
  priceCurrency: { fontSize: 16, fontWeight: '700', color: RED },
  priceValue: { fontSize: 28, fontWeight: '800', color: TEXT, letterSpacing: -0.5 },
  priceEmpty: { fontSize: 24, fontWeight: '700', color: TEXT3 },
  stockDisplay: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  stockNum: { fontSize: 28, fontWeight: '800', color: TEXT },
  stockUnit: { fontSize: 13, color: TEXT2 },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#ECFDF5' },
  stockBadgeWarn: { backgroundColor: '#FEF3C7' },
  stockBadgeText: { fontSize: 11, fontWeight: '700', color: '#059669' },
  stockBadgeWarnText: { color: '#D97706' },

  // ── Footer ──────────────────────────────────────────────────
  footer: { flexDirection: 'row', gap: 10, marginTop: 4 },
  discardBtn: {
    flex: 1, height: 52, borderRadius: 14,
    borderWidth: 1.5, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center', backgroundColor: WHITE,
  },
  discardText: { fontSize: 14, fontWeight: '600', color: TEXT2 },
  submitBtn: {
    flex: 2.5, height: 52, borderRadius: 14,
    backgroundColor: RED, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
    shadowColor: RED, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: WHITE },
});

// ── Modal Styles ─────────────────────────────────────────────
export const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '75%',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#E5E7EB', alignSelf: 'center',
    marginTop: 10, marginBottom: 2,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: TEXT },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 12, color: TEXT2, fontWeight: '700' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 20 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FAFAF8',
  },
  chipActive: {
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12,
    borderWidth: 1.5, borderColor: NAVY, backgroundColor: NAVY,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: TEXT2 },
  chipTextActive: { fontSize: 13, fontWeight: '600', color: WHITE },
  chipX: { fontSize: 10, color: WHITE, marginLeft: 4 },
  footer: {
    flexDirection: 'row', gap: 10, padding: 20,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF8',
  },
  cancelText: { fontSize: 14, fontWeight: '600', color: TEXT2 },
  saveBtn: {
    flex: 2, height: 48, borderRadius: 12, backgroundColor: RED,
    alignItems: 'center', justifyContent: 'center',
  },
  saveText: { fontSize: 14, fontWeight: '700', color: WHITE },
  stockBody: { padding: 20 },
  stockLabel: { fontSize: 15, fontWeight: '700', color: TEXT, marginBottom: 4 },
  stockSub: { fontSize: 12, color: TEXT2, marginBottom: 20 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    width: 52, height: 52, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF8',
  },
  qtyBtnText: { fontSize: 24, color: TEXT, fontWeight: '600' },
  qtyInput: {
    flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '800', color: TEXT,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    height: 52, borderRadius: 14, backgroundColor: '#FAFAF8',
  },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  quickBtn: {
    flex: 1, height: 38, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF8',
  },
  quickBtnText: { fontSize: 12, fontWeight: '600', color: TEXT2 },
});