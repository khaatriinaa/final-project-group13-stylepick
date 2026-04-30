// src/screens/auth/Register/RegisterScreen.styles.ts
import { StyleSheet, Platform, StatusBar } from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;
const TOP_BAR_CONTENT_HEIGHT = 56;
const TOP_BAR_HEIGHT = STATUS_BAR_HEIGHT + TOP_BAR_CONTENT_HEIGHT;

const C = {
  ink:          '#0F0E17',
  inkSoft:      '#1A1927',
  ivory:        '#FAF9F6',
  white:        '#FFFFFF',
  coral:        '#E8614D',
  border:       '#E8E4DC',
  borderFocus:  '#E8614D',
  textPrimary:  '#0F0E17',
  textSecond:   '#5C5767',
  textMuted:    '#9B95A5',
  placeholder:  '#B8B4C0',
  error:        '#C0392B',
  errorBg:      '#FDECEA',
  errorBorder:  '#F5A49A',
  borderDark:   '#252438',
};

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: C.ink,
  },

  // ← flat wrapper replacing the triple-nested containers
  inner: {
    flex: 1,
    backgroundColor: C.ink,
  },

  // ─── Top Bar ────────────────────────────────────────────────────────────────
  topBar: {
    height: TOP_BAR_HEIGHT,
    backgroundColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: STATUS_BAR_HEIGHT + 8,
    paddingBottom: 8,
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
  backCirclePressed: {
    opacity: 0.45,
  },
  backArrow: {
    fontSize: 22,
    color: '#9B95A5',
    lineHeight: 24,
    marginTop: -2,
  },

  topBarBrand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#FAF9F6',
  },
  topBarSpacer: {
    width: 40,
    height: 40,
  },

  // ─── Cream Body ─────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: C.ivory,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },

  // ─── Form Header ────────────────────────────────────────────────────────────
  formHeader: {},
  formEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: C.textPrimary,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 13,
    color: C.textMuted,
    letterSpacing: 0.1,
    lineHeight: 18,
    marginBottom: 4,
  },

  // ─── Fields ─────────────────────────────────────────────────────────────────
  fieldsWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 6,
  },

  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: C.textSecond,
    marginBottom: 7,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    gap: 10,
  },
  inputWrapError: {
    borderColor: C.errorBorder,
    backgroundColor: C.errorBg,
  },
  inputWrapFocus: {
    borderColor: C.borderFocus,
    backgroundColor: C.white,
    shadowColor: C.coral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.textPrimary,
    height: '100%',
    letterSpacing: 0.1,
  },
  showHideText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textPrimary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingVertical: 4,
    paddingLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: C.error,
    marginTop: 4,
    letterSpacing: 0.1,
  },
  hintText: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 4,
    letterSpacing: 0.1,
  },

  sectionRule: {
    height: 1,
    backgroundColor: C.border,
    marginTop: 2,
    marginBottom: 16,
    opacity: 0.7,
  },

  // ─── Bottom Section ──────────────────────────────────────────────────────────
  bottomSection: {
    paddingTop: 4,
    paddingBottom: 36,
  },

  termsRow: {
    marginBottom: 10,
  },
  termsText: {
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.1,
    lineHeight: 16,
    textAlign: 'center',
  },
  termsLink: {
    fontSize: 11,
    color: C.textPrimary,
    fontWeight: '600',
  },

  submitBtn: {
    backgroundColor: C.textPrimary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: C.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
  },
  submitBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.white,
  },

  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    fontSize: 11,
    color: C.placeholder,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: 14,
    color: C.textMuted,
  },
  footerLink: {
    fontSize: 14,
    color: C.textPrimary,
    fontWeight: '700',
  },
});