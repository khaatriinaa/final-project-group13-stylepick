import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HERO_HEIGHT = 220;

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  ink:         '#08070a',
  inkSoft:     '#141118',
  inkMid:      '#1e1b24',
  cream:       '#faf8f4',
  creamWhite:  '#ffffff',
  parchment:   '#ede5d4',
  gold:        '#c9a96e',
  goldLight:   '#dfc08e',
  goldMuted:   '#a08550',
  border:      '#e4ddd2',
  borderFocus: '#c9a96e',
  textPrimary: '#18140f',
  textSecondary:'#6b6157',
  textMuted:   '#9e9589',
  placeholder: '#c4bbb0',
  error:       '#b83232',
  errorBg:     '#fff7f7',
  errorBorder: '#e8a0a0',
};

const R = { sm: 4, md: 10, lg: 22 };

// ─── Styles ───────────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({

  // ── Root Layout ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.ink,
  },
  scroll: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },
  inner: {
    flex: 1,
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingTop: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#c9a96e',
    opacity: 0.04,
    top: '10%',
    alignSelf: 'center',
  },
  heroDiamond: {
    marginBottom: 18,
  },
  brand: {
    alignItems: 'center',
  },
  brandName: {
    fontFamily: 'CormorantGaramond-Light',
    fontSize: 30,
    letterSpacing: 6,
    color: C.parchment,
    textTransform: 'uppercase',
  },
  brandRule: {
    width: 32,
    height: 0.5,
    backgroundColor: C.goldMuted,
    marginVertical: 8,
    opacity: 0.6,
  },
  brandSub: {
    fontFamily: 'DMSans-Regular',
    fontSize: 9,
    letterSpacing: 3.5,
    color: '#5c5248',
    textTransform: 'uppercase',
  },

  // ── Body (cream panel) ────────────────────────────────────────────────────
  body: {
    flex: 1,
    minHeight: SCREEN_HEIGHT - HERO_HEIGHT,
    backgroundColor: C.cream,
    borderTopLeftRadius: R.lg,
    borderTopRightRadius: R.lg,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
  },

  // ── Form Header ───────────────────────────────────────────────────────────
  formHeader: {
    marginBottom: 32,
  },
  formEyebrow: {
    fontFamily: 'DMSans-Regular',
    fontSize: 9,
    letterSpacing: 3,
    color: C.goldMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  formTitle: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 30,
    fontWeight: '400',
    color: C.textPrimary,
    letterSpacing: 0.3,
    lineHeight: 36,
    marginBottom: 6,
  },
  formSubtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: C.textMuted,
    letterSpacing: 0.2,
    lineHeight: 18,
  },

  // ── Fields ────────────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'DMSans-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: C.textSecondary,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.creamWhite,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  inputWrapError: {
    borderColor: C.errorBorder,
    backgroundColor: C.errorBg,
  },
  inputWrapFocus: {
    borderColor: C.borderFocus,
    backgroundColor: C.creamWhite,
    // Shadow for focused state
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: C.textPrimary,
    height: '100%',
    letterSpacing: 0.2,
  },
  showHideText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 10,
    color: C.goldMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingVertical: 4,
    paddingLeft: 4,
  },
  errorText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: C.error,
    marginTop: 5,
    letterSpacing: 0.2,
  },

  // ── Forgot Password ───────────────────────────────────────────────────────
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -10,
    marginBottom: 28,
  },
  forgotText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.3,
  },

  // ── Submit Button ─────────────────────────────────────────────────────────
  submitBtn: {
    backgroundColor: C.inkSoft,
    borderRadius: R.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  submitBtnText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: C.parchment,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    color: C.placeholder,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: C.textMuted,
  },
  footerLink: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    color: C.gold,
    fontWeight: '500',
  },

  // ── Trust Badge ───────────────────────────────────────────────────────────
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 6,
  },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.placeholder,
  },
  trustText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    color: C.placeholder,
    letterSpacing: 0.5,
  },
});