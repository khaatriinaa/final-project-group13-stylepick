// src/screens/buyer/Home/BuyerHomeScreen.styles.ts
import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

const C = {
  ink:          '#0F0E17',
  inkSoft:      '#1A1927',
  inkMid:       '#252438',
  ivory:        '#FAF9F6',
  ivoryDark:    '#F2F0EB',
  white:        '#FFFFFF',
  amber:        '#FFFFFF',
  amberDark:    '#111111',
  amberLight:   '#F5F5F5',
  violet:       '#2D2B55',
  violetLight:  '#EEEDF7',
  border:       '#E8E4DC',
  borderFocus:  '#FFFFFF',
  textPrimary:  '#0F0E17',
  textSecond:   '#5C5767',
  textMuted:    '#9B95A5',
  placeholder:  '#B8B4C0',
};

export { C };

export const styles = StyleSheet.create({

  // ─── Root ─────────────────────────────────────────────────────────────────
  container: { flex: 1, backgroundColor: C.ink },

  // ─── Header ───────────────────────────────────────────────────────────────
  header: { backgroundColor: C.ink, paddingTop: STATUS_BAR_HEIGHT },

  // ─── Top bar ──────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },

  // Avatar
  avatarBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.inkMid,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden', flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarFallbackText: {
    fontSize: 15, color: C.white, fontWeight: '700', letterSpacing: -0.3,
  },

  // Search
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.inkSoft, borderRadius: 10,
    paddingHorizontal: 11, height: 40, gap: 7,
    borderWidth: 1.5, borderColor: C.inkMid,
  },
  searchWrapFocused: {
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: C.white, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18, shadowRadius: 5, elevation: 2,
  },
  searchIcon: { fontSize: 13, color: C.placeholder },
  searchInput: { flex: 1, fontSize: 13, color: C.white, padding: 0, letterSpacing: 0.1 },
  searchBtn: {
    backgroundColor: C.white, borderRadius: 7,
    paddingHorizontal: 11, paddingVertical: 5, marginRight: -2,
  },
  searchBtnText: { color: C.ink, fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },

  // Right icons — pill buttons
  topBarRightIcons: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  iconPill: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.inkSoft,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  // kept for compatibility
  topBarIcon: {
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  topBarIconText: { fontSize: 19 },
  notifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: 99,
    backgroundColor: '#EF4444',
    borderWidth: 1.2, borderColor: C.inkSoft,
  },
  cartCount: {
    position: 'absolute', top: 5, right: 5,
    minWidth: 15, height: 15, borderRadius: 99,
    backgroundColor: '#EF4444',
    borderWidth: 1.2, borderColor: C.inkSoft,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2,
  },
  cartCountText: { fontSize: 8, fontWeight: '800', color: C.white, lineHeight: 10 },

  // ─── Primary nav tabs ─────────────────────────────────────────────────────
  navTabRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingBottom: 2,
  },
  navTab: { paddingHorizontal: 10, paddingVertical: 8 },
  navTabText: {
    fontSize: 13, color: 'rgba(255,255,255,0.35)',
    fontWeight: '500', letterSpacing: 0.1,
  },
  navTabActive: {},
  navTabTextActive: {
    color: C.white, fontWeight: '800',
    textDecorationLine: 'underline', textDecorationColor: C.white,
  },
  navTabMore: { marginLeft: 'auto' as any, paddingHorizontal: 8, paddingVertical: 6 },
  navTabMoreText: { fontSize: 18, color: 'rgba(255,255,255,0.5)' },

  // ─── Sub tabs — text only, no icons ──────────────────────────────────────
  subTabsWrap: {
    backgroundColor: C.inkSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.inkMid,
  },
  subTabsRow: { flexDirection: 'row', paddingHorizontal: 4 },
  subTab: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  subTabActive: { borderBottomColor: C.white },
  subTabIcon: { fontSize: 13 },
  subTabText: {
    fontSize: 13, color: 'rgba(255,255,255,0.38)',
    fontWeight: '500', letterSpacing: 0.2,
  },
  subTabTextActive: { color: C.white, fontWeight: '700' },

  // ─── Body ─────────────────────────────────────────────────────────────────
  body: {
    flex: 1, backgroundColor: C.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden',
  },

  // ─── Promo bar ────────────────────────────────────────────────────────────
  promoBar: {
    flexDirection: 'row', gap: 8, backgroundColor: C.ivoryDark,
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  promoBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  promoBadgeIcon: { fontSize: 15 },
  promoBadgeMain: { fontSize: 12, fontWeight: '700', color: C.textPrimary, letterSpacing: 0.1 },
  promoBadgeSub: { fontSize: 11, color: C.textMuted },
  promoDivider: { width: 1, backgroundColor: C.border, marginVertical: 2 },

  // ─── Banner ───────────────────────────────────────────────────────────────
  bannerWrap: {
    backgroundColor: C.ink, marginHorizontal: 14,
    marginTop: 16, marginBottom: 4,
    borderRadius: 16, overflow: 'hidden',
    shadowColor: C.ink, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 5,
  },
  bannerInner: {
    flexDirection: 'row', alignItems: 'stretch',
    padding: 16, paddingRight: 0, minHeight: 150,
  },
  bannerLeft: { flex: 1, justifyContent: 'center' },
  bannerStars: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  bannerStarText: { fontSize: 11, color: C.white },
  bannerStarLabel: { fontSize: 11, fontWeight: '600', color: C.white, marginLeft: 4 },
  bannerTitle: {
    fontSize: 21, fontWeight: '900', color: C.white,
    lineHeight: 26, marginBottom: 10, letterSpacing: -0.5,
  },
  bannerSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 12 },
  bannerCta: {
    alignSelf: 'flex-start', backgroundColor: C.white,
    borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7,
  },
  bannerCtaText: { color: C.ink, fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  bannerRight: { width: SCREEN_W * 0.42, flexDirection: 'row', gap: 6, paddingRight: 10 },
  bannerThumbWrap: { flex: 1, gap: 6 },
  bannerThumb: {
    flex: 1, borderRadius: 10, backgroundColor: C.inkMid,
    overflow: 'hidden', position: 'relative',
  },
  bannerThumbImg: { width: '100%', height: '100%' },
  bannerThumbImgPlaceholder: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center', backgroundColor: C.inkMid,
  },
  bannerThumbPlaceholderText: { fontSize: 22 },
  bannerThumbPrice: {
    position: 'absolute', bottom: 5, left: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  bannerThumbPriceText: { color: C.white, fontSize: 10, fontWeight: '700' },
  bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, paddingBottom: 12 },
  bannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  bannerDotActive: { backgroundColor: C.white, width: 18 },

  // ─── Category circles ─────────────────────────────────────────────────────
  catCirclesWrap: {
    backgroundColor: C.white, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  catCirclesContent: { paddingHorizontal: 14, gap: 6 },
  catCircleItem: { alignItems: 'center', width: 64 },
  catCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: C.ivoryDark,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 5, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  catCircleActive: { borderColor: C.ink, backgroundColor: C.amberLight },
  catCircleImg: { width: '100%', height: '100%' },
  catCircleEmoji: { fontSize: 22 },
  catCircleLabel: {
    fontSize: 10, color: C.textSecond,
    textAlign: 'center', lineHeight: 13, letterSpacing: 0.1,
  },
  catCircleLabelActive: { color: C.ink, fontWeight: '700' },

  // ─── Discount banner ──────────────────────────────────────────────────────
  discountBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.ink, marginHorizontal: 14, marginVertical: 14,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    gap: 12, elevation: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  discountBadge: {
    backgroundColor: C.white, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, alignItems: 'center',
  },
  discountBadgePercent: { fontSize: 18, fontWeight: '900', color: C.ink, lineHeight: 20 },
  discountBadgeOff: {
    fontSize: 9, fontWeight: '800', color: C.ink,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  discountText: {
    flex: 1, fontSize: 13, fontWeight: '800',
    color: C.white, letterSpacing: -0.1, lineHeight: 18,
  },
  discountClaimBtn: {
    backgroundColor: C.white, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
  },
  discountClaimText: {
    color: C.ink, fontSize: 11, fontWeight: '800',
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  discountPromoLabel: {
    fontSize: 9, color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 2,
  },

  // ─── Section header ───────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10, backgroundColor: C.white,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.4 },
  sectionTitleAccent: { color: C.violet },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAll: { fontSize: 12, color: C.violet, fontWeight: '600', letterSpacing: 0.2 },
  seeAllArrow: { fontSize: 13, color: C.violet },

  // ─── Grid ─────────────────────────────────────────────────────────────────
  grid: { paddingHorizontal: 8, paddingBottom: 40, backgroundColor: C.white },

  // ─── Product card ─────────────────────────────────────────────────────────
  productCard: {
    flex: 1, margin: 4, backgroundColor: C.white,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.border,
    overflow: 'hidden',
    shadowColor: C.ink, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  productImageWrap: {
    width: '100%', aspectRatio: 0.8,
    backgroundColor: C.ivoryDark, position: 'relative', overflow: 'hidden',
  },
  productImage: { width: '100%', height: '100%' },
  productImagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  productImageIcon: { fontSize: 36 },
  soldOutOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15,14,23,0.52)',
    alignItems: 'center', justifyContent: 'center',
  },
  soldOutText: {
    color: C.white, fontWeight: '700', fontSize: 10,
    letterSpacing: 2, textTransform: 'uppercase',
  },
  cardWishlistBtn: {
    position: 'absolute', top: 8, right: 8, zIndex: 20,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.ink, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  cardWishlistIcon: { fontSize: 13, color: C.textMuted, lineHeight: 15 },
  cardWishlistIconActive: { color: C.ink },
  tagBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: C.ink, borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  tagBadgeSale: { backgroundColor: C.violet },
  tagBadgeText: {
    fontSize: 9, fontWeight: '700', color: C.white, letterSpacing: 0.8, textTransform: 'uppercase',
  },
  discountTagBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: C.violet, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3,
  },
  discountTagText: { fontSize: 9, fontWeight: '700', color: C.white, letterSpacing: 0.8 },
  productInfo: { padding: 10, paddingBottom: 10 },
  productBrand: {
    fontSize: 10, color: C.textMuted, marginBottom: 2,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  productName: { fontSize: 12, color: C.textSecond, marginBottom: 5, lineHeight: 16, letterSpacing: 0.1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  productPrice: { fontSize: 15, fontWeight: '900', color: C.textPrimary, letterSpacing: -0.3 },
  comparePrice: { fontSize: 11, color: C.placeholder, textDecorationLine: 'line-through' },
  discountPercent: { fontSize: 10, fontWeight: '700', color: C.textSecond },
  productFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 2,
  },
  soldLabel: { fontSize: 10, color: C.textMuted, letterSpacing: 0.1 },
  addBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.ink, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28, shadowRadius: 5, elevation: 3,
  },
  addBtnPressed: { backgroundColor: C.inkMid, opacity: 0.88 },
  addBtnText: { fontSize: 18, fontWeight: '400', color: C.white, lineHeight: 22, marginTop: -1 },

  // ─── Empty ────────────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center', paddingTop: 60, paddingHorizontal: 30, backgroundColor: C.white,
  },
  emptyTitle: {
    fontSize: 16, fontWeight: '800', color: C.textPrimary,
    marginBottom: 6, marginTop: 14, letterSpacing: -0.3,
  },
  emptyText: { fontSize: 13, color: C.textMuted, textAlign: 'center', lineHeight: 20 },

  // ─── Sort modal ───────────────────────────────────────────────────────────
  sortOverlay: {
    flex: 1, backgroundColor: 'rgba(15,14,23,0.65)', justifyContent: 'flex-end',
  },
  sortSheet: {
    backgroundColor: C.white, borderTopLeftRadius: 26, borderTopRightRadius: 26,
    paddingTop: 12, paddingBottom: 40, paddingHorizontal: 26,
  },
  sortHandle: {
    alignSelf: 'center', width: 34, height: 4,
    borderRadius: 99, backgroundColor: C.border, marginBottom: 22,
  },
  sortTitle: {
    fontSize: 10, fontWeight: '700', color: C.textMuted,
    letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8,
  },
  sortRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border,
  },
  sortRowActive: {},
  sortRowLabel: { fontSize: 15, color: C.textSecond, letterSpacing: 0.1 },
  sortRowLabelActive: { color: C.textPrimary, fontWeight: '700' },
  sortCheck: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center',
  },

  // ─── Status / sort row ────────────────────────────────────────────────────
  statusRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: C.ivory,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  statusCount: { fontSize: 11, color: C.textMuted, letterSpacing: 0.2 },
  statusCountBold: { color: C.textPrimary, fontWeight: '700' },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  sortBtnIcon: { fontSize: 12, color: C.textMuted },
  sortBtnText: { fontSize: 11, color: C.textSecond, fontWeight: '600', letterSpacing: 0.2 },
  sortBtnChevron: { fontSize: 11, color: C.textMuted },
});