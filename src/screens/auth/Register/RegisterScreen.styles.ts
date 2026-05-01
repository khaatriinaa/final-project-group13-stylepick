// src/screens/auth/Register/RegisterScreen.styles.ts
import { StyleSheet, Platform, StatusBar } from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;
const TOP_BAR_CONTENT_HEIGHT = 56;
const TOP_BAR_HEIGHT = STATUS_BAR_HEIGHT + TOP_BAR_CONTENT_HEIGHT;

const C = {
  ink: '#0F0E17',
  ivory: '#FAF9F6',
  white: '#FFFFFF',
  coral: '#E8614D',
  border: '#E8E4DC',
  borderFocus: '#E8614D',
  textPrimary: '#0F0E17',
  textSecond: '#5C5767',
  textMuted: '#9B95A5',
  placeholder: '#B8B4C0',
  error: '#C0392B',
  errorBg: '#FDECEA',
  errorBorder: '#F5A49A',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.ink,
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
    backgroundColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2A2840',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCirclePressed: { opacity: 0.45 },
  backArrow: { fontSize: 22, color: '#9B95A5', marginTop: -2 },
  topBarBrand: { flex: 1, alignItems: 'center' },
  topBarName: { fontSize: 20, fontWeight: '800', color: '#FAF9F6' },
  topBarSpacer: { width: 40 },

  // Updated Body for Scrolling
  body: {
    flex: 1,
    backgroundColor: C.ivory,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 10,
  },
  bodyContent: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    flexGrow: 1,
  },

  formHeader: { marginBottom: 24 },
  formEyebrow: { fontSize: 10, letterSpacing: 2.5, color: C.textPrimary, textTransform: 'uppercase', fontWeight: '600', marginBottom: 8 },
  formTitle: { fontSize: 28, fontWeight: '800', color: C.textPrimary, marginBottom: 6 },
  formSubtitle: { fontSize: 13, color: C.textMuted },

  fieldsWrapper: { flex: 1, marginBottom: 20 },
  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', color: C.textSecond, marginBottom: 7 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border, borderRadius: 14, paddingHorizontal: 16, height: 50 },
  inputWrapError: { borderColor: C.errorBorder, backgroundColor: C.errorBg },
  inputWrapFocus: { borderColor: C.borderFocus, backgroundColor: C.white },
  input: { flex: 1, fontSize: 15, color: C.textPrimary, height: '100%' },
  showHideText: { fontSize: 11, fontWeight: '600', color: C.textPrimary },
  errorText: { fontSize: 12, color: C.error, marginTop: 4 },
  hintText: { fontSize: 12, color: C.textMuted, marginTop: 4 },
  sectionRule: { height: 1, backgroundColor: C.border, marginVertical: 10, opacity: 0.7 },

  bottomSection: { marginTop: 'auto' },
  termsRow: { marginBottom: 15 },
  termsText: { fontSize: 11, color: C.textMuted, textAlign: 'center', lineHeight: 16 },
  termsLink: { color: C.textPrimary, fontWeight: '600' },
  submitBtn: { backgroundColor: C.textPrimary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  submitBtnPressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  submitBtnText: { fontSize: 13, fontWeight: '700', color: C.white, textTransform: 'uppercase' },
  dividerWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 11, color: C.placeholder },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },
  footerText: { fontSize: 14, color: C.textMuted },
  footerLink: { fontSize: 14, color: C.textPrimary, fontWeight: '700' },
});