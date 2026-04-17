import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flexGrow: 1 },
  inner: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', paddingTop: 80, paddingBottom: 40 },
  logoRow: { alignItems: 'center', marginBottom: 36 },
  logoText: { fontSize: 34, fontWeight: FONTS.extraBold, color: COLORS.primary, letterSpacing: -1 },
  logoSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  formCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 24, ...SHADOW.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  formTitle: { fontSize: 20, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: 4 },
  formSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 24 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: FONTS.semiBold, color: COLORS.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.borderDark,
    borderRadius: RADIUS.md, backgroundColor: COLORS.background,
    paddingHorizontal: 14, height: 48,
  },
  inputWrapError: { borderColor: COLORS.error, backgroundColor: COLORS.errorLight },
  inputWrapFocus: { borderColor: COLORS.primary },
  input: { flex: 1, fontSize: 14, color: COLORS.text, height: '100%' },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    height: 50, alignItems: 'center', justifyContent: 'center',
    marginTop: 8, ...SHADOW.sm,
  },
  submitBtnPressed: { opacity: 0.88 },
  submitBtnText: { color: COLORS.white, fontSize: 15, fontWeight: FONTS.bold, letterSpacing: 0.3 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 4 },
  footerText: { fontSize: 13, color: COLORS.textSecondary },
  footerLink: { fontSize: 13, color: COLORS.primary, fontWeight: FONTS.bold },
});
