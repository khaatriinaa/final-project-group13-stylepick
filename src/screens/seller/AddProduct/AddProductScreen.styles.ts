import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 60, borderBottomWidth: 1, borderColor: '#EEE',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backText:    { fontSize: 18, color: '#E63946' },
  body:        { padding: 20, paddingBottom: 60 },
  label:       { fontSize: 14, fontWeight: '600', marginTop: 15, marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: '#DDD', padding: 12,
    borderRadius: 8, backgroundColor: '#FAFAFA',
  },
  errorText: { color: '#E63946', fontSize: 12, marginTop: 3 },

  // Media
  mediaRow:   { flexDirection: 'row', marginBottom: 10 },
  mediaThumb: {
    width: 80, height: 80, marginRight: 10,
    borderRadius: 8, overflow: 'hidden', position: 'relative',
  },
  mediaImg:    { width: '100%', height: '100%' },
  mediaRemove: {
    position: 'absolute', top: 5, right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 2,
  },
  mediaAdd: {
    width: 80, height: 80, borderStyle: 'dashed',
    borderWidth: 1, borderColor: '#CCC',
    justifyContent: 'center', alignItems: 'center', borderRadius: 8,
  },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 5 },

  // Colors
  colorGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorItem:  { alignItems: 'center', marginBottom: 10 },
  colorLabel: { fontSize: 10, color: '#666', marginTop: 3 },
  colorDot: {
    width: 35, height: 35, borderRadius: 18,
    borderWidth: 1, borderColor: '#EEE',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  colorDotSel: { borderColor: '#E63946', borderWidth: 2 },
  colorFill:   { ...StyleSheet.absoluteFillObject },

  // Toggle
  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 15,
  },
  toggle: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#EEE',
  },
  toggleActive: { backgroundColor: '#E63946' },

  // Submit
  submitBtn: {
    backgroundColor: '#E63946', padding: 15,
    borderRadius: 10, marginTop: 30, alignItems: 'center',
  },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', padding: 20,
  },
  sheet:      { backgroundColor: '#FFF', borderRadius: 15, padding: 20 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  chipGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:       { padding: 10, backgroundColor: '#F0F0F0', borderRadius: 20 },
  chipActive: { padding: 10, backgroundColor: '#E63946', borderRadius: 20 },
  chipText:       { color: '#666' },
  chipTextActive: { color: '#FFF' },
  footer:  { marginTop: 20, alignItems: 'flex-end' },
  saveBtn: {
    backgroundColor: '#E63946', padding: 12,
    borderRadius: 8, width: 100, alignItems: 'center',
  },
  saveText: { color: '#FFF', fontWeight: 'bold' },
});