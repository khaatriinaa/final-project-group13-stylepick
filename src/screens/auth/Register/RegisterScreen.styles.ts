import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

const TOP_BAR_CONTENT_HEIGHT = 56;
const TOP_BAR_HEIGHT = STATUS_BAR_HEIGHT + TOP_BAR_CONTENT_HEIGHT;

const C = {
  ink:           '#08070a',
  inkSoft:       '#141118',
  cream:         '#faf8f4',
  creamWhite:    '#ffffff',
  parchment:     '#ede5d4',
  gold:          '#c9a96e',
  goldMuted:     '#a08550',
  border:        '#e4ddd2',
  borderDark:    '#2a2420',
  borderFocus:   '#c9a96e',
  textPrimary:   '#18140f',
  textSecondary: '#6b6157',
  textMuted:     '#9e9589',
  placeholder:   '#c4bbb0',
  error:         '#b83232',
  errorBg:       '#fff7f7',
  errorBorder:   '#e8a0a0',
};

const R = { sm: 4, md: 10, lg: 22 };

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: C.ink,
  },

  topBar: {
    height: TOP_BAR_HEIGHT,
    backgroundColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',               // ← changed from 'flex-end' to 'center'
    paddingHorizontal: 20,
    paddingTop: STATUS_BAR_HEIGHT,      // ← pushes content below status bar
    // paddingBottom removed — centering handles vertical alignment
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontSize: 22,
    letterSpacing: 10,
    color: C.parchment,
    textTransform: 'uppercase',
  },
  topBarSpacer: {
    width: 38,
    height: 38,
  },

  body: {
    flex: 1,
    backgroundColor: C.cream,
    borderTopLeftRadius: R.lg,
    borderTopRightRadius: R.lg,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },

  formHeader: {},
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
    fontSize: 28,
    fontWeight: '400',
    color: C.textPrimary,
    letterSpacing: 0.3,
    lineHeight: 34,
    marginBottom: 6,
  },
  formSubtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: C.textMuted,
    letterSpacing: 0.2,
    lineHeight: 18,
  },

  fieldsWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },

  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontFamily: 'DMSans-Medium',
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: C.textSecondary,
    marginBottom: 7,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.creamWhite,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingHorizontal: 14,
    height: 48,
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
    marginTop: 4,
    letterSpacing: 0.2,
  },
  hintText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: C.textMuted,
    marginTop: 4,
    letterSpacing: 0.2,
  },

  sectionRule: {
    height: 1,
    backgroundColor: C.border,
    marginTop: 2,
    marginBottom: 16,
    opacity: 0.7,
  },

  bottomSection: {
    paddingTop: 4,
    paddingBottom: 36,
  },

  termsRow: {
    marginBottom: 14,
  },
  termsText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    color: C.textMuted,
    letterSpacing: 0.2,
    lineHeight: 16,
    textAlign: 'center',
  },
  termsLink: {
    fontFamily: 'DMSans-Medium',
    fontSize: 10,
    color: C.goldMuted,
    fontWeight: '500',
  },

  submitBtn: {
    backgroundColor: C.inkSoft,
    borderRadius: R.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
});