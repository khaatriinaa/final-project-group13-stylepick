import { StyleSheet, Dimensions, Platform } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TOP_BAR_HEIGHT = 72;

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  ink:          '#08070a',
  inkSoft:      '#141118',
  inkMid:       '#1e1b24',
  cream:        '#faf8f4',
  creamWhite:   '#ffffff',
  parchment:    '#ede5d4',
  gold:         '#c9a96e',
  goldLight:    '#dfc08e',
  goldMuted:    '#a08550',
  border:       '#e4ddd2',
  borderDark:   '#2a2420',
  borderFocus:  '#c9a96e',
  textPrimary:  '#18140f',
  textSecondary:'#6b6157',
  textMuted:    '#9e9589',
  placeholder:  '#c4bbb0',
  error:        '#b83232',
  errorBg:      '#fff7f7',
  errorBorder:  '#e8a0a0',
};

const R = { sm: 4, md: 10, lg: 22 };

// ─── Styles ───────────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({

  // ── Root Layout ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.ink,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },

  // ── Updated Top Bar ───────────────────────────────────────────────────────
    topBar: {
      height: TOP_BAR_HEIGHT,
      backgroundColor: C.ink,
      flexDirection: 'row',
      alignItems: 'center', 
      paddingHorizontal: 20,
      // Adds extra space at the top so the logo isn't touching the status bar
      paddingTop: Platform.OS === 'ios' ? 20 : 10, 
      gap: 14,
    },
    backCircle: {
      width: 40, // Slightly larger for better tap target
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: C.borderDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backCirclePressed: {
      opacity: 0.45,
    },
    backArrow: {
      fontSize: 24,
      color: '#8a7d6a',
      lineHeight: 26,
      marginTop: -2,
    },
    topBarBrand: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topBarName: {
      fontFamily: 'CormorantGaramond-Light',
      fontSize: 22, // Slightly larger font
      letterSpacing: 6, // Increased letter spacing for luxury feel
      color: C.parchment,
      textTransform: 'uppercase',
    },
    topBarSpacer: {
      width: 40, // Match the new backCircle width to keep brand centered
    },

  // ── Cream Body ────────────────────────────────────────────────────────────
  body: {
      // This ensures the cream body starts exactly where the top bar ends
      minHeight: SCREEN_HEIGHT - TOP_BAR_HEIGHT,
      backgroundColor: C.cream,
      borderTopLeftRadius: R.lg,
      borderTopRightRadius: R.lg,
      paddingHorizontal: 28,
      paddingTop: 40, // Increased top padding for better flow
      paddingBottom: 48,
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
    shadowColor: '#c9a96e',
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

  // ── Password Hint ─────────────────────────────────────────────────────────
  hintText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: C.textMuted,
    marginTop: 5,
    letterSpacing: 0.2,
  },

  // ── Section Divider ───────────────────────────────────────────────────────
  sectionRule: {
    height: 1,
    backgroundColor: C.border,
    marginTop: 4,
    marginBottom: 20,
    opacity: 0.7,
  },

  // ── Terms ─────────────────────────────────────────────────────────────────
  termsRow: {
    marginBottom: 24,
  },
  termsText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.2,
    lineHeight: 17,
    textAlign: 'center',
  },
  termsLink: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    color: C.goldMuted,
    fontWeight: '500',
  },

  // ── Submit Button ─────────────────────────────────────────────────────────
  submitBtn: {
    backgroundColor: C.inkSoft,
    borderRadius: R.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
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

  // ── Footer ────────────────────────────────────────────────────────────────
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