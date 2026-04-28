// src/screens/auth/Login/LoginScreen.styles.ts — Redesigned
import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = 230;

const C = {
  ink:          '#0F0E17',
  inkSoft:      '#1A1927',
  inkMid:       '#252438',
  ivory:        '#FAF9F6',
  ivoryDark:    '#F2F0EB',
  white:        '#FFFFFF',
  coral:        '#E8614D',
  coralDark:    '#C44A38',
  coralLight:   '#FFF0EE',
  violet:       '#2D2B55',
  amber:        '#F0B429',
  border:       '#E8E4DC',
  borderFocus:  '#E8614D',
  textPrimary:  '#0F0E17',
  textSecond:   '#5C5767',
  textMuted:    '#9B95A5',
  placeholder:  '#B8B4C0',
  error:        '#C0392B',
  errorBg:      '#FDECEA',
  errorBorder:  '#F5A49A',
};

export const styles = StyleSheet.create({

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

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: C.textMuted,
    opacity: 0.07,
    top: -40,
    alignSelf: 'center',
  },
  heroAccentDot: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.amber,
    opacity: 0.06,
    bottom: 20,
    right: 40,
  },
  heroDiamond: {
    marginBottom: 20,
  },
  brand: {
    alignItems: 'center',
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  brandMarkText: {
    fontSize: 16,
    fontWeight: '800',
    color: C.white,
    letterSpacing: -0.5,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: C.ivory,
  },
  brandRule: {
    width: 24,
    height: 2,
    backgroundColor: C.border,
    marginVertical: 10,
    borderRadius: 2,
  },
  brandSub: {
    fontSize: 10,
    letterSpacing: 3,
    color: C.textMuted,
    textTransform: 'uppercase',
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    minHeight: SCREEN_HEIGHT - HERO_HEIGHT,
    backgroundColor: C.ivory,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
  },

  // ── Form Header ───────────────────────────────────────────────────────────
  formHeader: {
    marginBottom: 32,
  },
  formEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: C.textPrimary,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: C.textMuted,
    letterSpacing: 0.1,
    lineHeight: 20,
  },

  // ── Fields ────────────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: C.textSecond,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
  },
  inputWrapError: {
    borderColor: C.errorBorder,
    backgroundColor: C.errorBg,
  },
  inputWrapFocus: {
    borderColor: C.borderFocus,
    backgroundColor: C.white,
    shadowColor: C.textPrimary,
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
    fontWeight: '400',
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
    marginTop: 5,
    letterSpacing: 0.1,
  },

  // ── Submit Button ─────────────────────────────────────────────────────────
  submitBtn: {
    backgroundColor: C.textPrimary,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: C.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
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
    fontSize: 11,
    color: C.placeholder,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
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

  // ── Trust ─────────────────────────────────────────────────────────────────
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
    fontSize: 10,
    color: C.placeholder,
    letterSpacing: 0.5,
  },

  // Legacy (unused but kept for compat)
  forgotRow: { alignItems: 'flex-end', marginTop: -8, marginBottom: 24 },
  forgotText: { fontSize: 12, color: C.textMuted },
});
