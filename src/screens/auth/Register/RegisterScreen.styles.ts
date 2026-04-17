import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  inner: { paddingHorizontal: 28, paddingTop: 56, paddingBottom: 40 },
  backBtn: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: COLORS.background, alignItems: 'center',
    justifyContent: 'center', marginBottom: 24,
  },
  backBtnPressed: { opacity: 0.6 },
  logoText: { fontSize: 28, fontWeight: FONTS.extraBold, color: COLORS.primary, marginBottom: 4, letterSpacing: -0.5 },
  title: { fontSize: 18, fontWeight: FONTS.bold, color: COLORS.text, marginBottom: 2 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 28 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: FONTS.semiBold, color: COLORS.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.borderDark,
    borderRadius: RADIUS.md, backgroundColor: COLORS.background,
    paddingHorizontal: 14, height: 48,
  },
  inputWrapError: { borderColor: COLORS.error, backgroundColor: COLORS.errorLight },
  input: { flex: 1, fontSize: 14, color: COLORS.text },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },
  roleRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  roleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.borderDark,
    alignItems: 'center', backgroundColor: COLORS.background,
  },
  roleBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  roleBtnLabel: { fontSize: 14, fontWeight: FONTS.semiBold, color: COLORS.textSecondary },
  roleBtnLabelActive: { color: COLORS.primary },
  roleBtnSub: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 24,
  },
  submitBtnPressed: { opacity: 0.88 },
  submitBtnText: { color: COLORS.white, fontSize: 15, fontWeight: FONTS.bold },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 13, color: COLORS.textSecondary },
  footerLink: { fontSize: 13, color: COLORS.primary, fontWeight: FONTS.bold },
});
