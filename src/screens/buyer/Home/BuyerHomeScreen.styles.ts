// src/screens/buyer/Home/BuyerHomeScreen.styles.ts
import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

const C = {
  ink:         '#0F0E17',
  inkSoft:     '#1A1927',
  inkMid:      '#252438',
  ivory:       '#FAF9F6',
  ivoryDark:   '#F2F0EB',
  white:       '#FFFFFF',
  amberLight:  '#F5F5F5',
  violet:      '#2D2B55',
  border:      '#E8E4DC',
  textPrimary: '#0F0E17',
  textSecond:  '#5C5767',
  textMuted:   '#9B95A5',
  placeholder: '#B8B4C0',
};

export { C };

// Banner dimensions
const BANNER_W        = SCREEN_W - 28;       // 14px margin each side
const BANNER_HEIGHT   = 220;                 // fixed banner height
const BANNER_HALF     = BANNER_W / 2;        // each side is exactly half

export const styles = StyleSheet.create({

  // ─── Root ─────────────────────────────────────────────────────────────────
  container: { flex: 1, backgroundColor: C.ink },

  // ─── Header ───────────────────────────────────────────────────────────────
  header: { backgroundColor: C.ink, paddingTop: STATUS_BAR_HEIGHT },

  // ─── Top bar ──────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },

  // Avatar
  avatarBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.inkMid,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden', flexShrink: 0,
  },
  avatarBtnImg: {
    width: 36, height: 36, borderRadius: 18,
  },
  avatarFallbackText: { fontSize: 15, color: C.white, fontWeight: '700', letterSpacing: -0.3 },

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
  searchInput: { flex: 1, fontSize: 13, color: C.white, padding: 0, letterSpacing: 0.1 },
  searchBtn: {
    backgroundColor: C.white, borderRadius: 7,
    paddingHorizontal: 11, paddingVertical: 5, marginRight: -2,
  },
  searchBtnText: { color: C.ink, fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },

  // Right icon pills
  topBarRightIcons: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  iconPill: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.inkSoft,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
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

  // ─── Sub tabs — equal width ────────────────────────────────────────────────
  subTabsWrap: {
    backgroundColor: C.inkSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.inkMid,
  },
  subTabsRow: { flexDirection: 'row' },
  subTab: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 13,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  subTabActive: { borderBottomColor: C.white },
  subTabText: { fontSize: 13, color: 'rgba(255,255,255,0.38)', fontWeight: '500', letterSpacing: 0.2 },
  subTabTextActive: { color: C.white, fontWeight: '700' },

  // ─── Body ─────────────────────────────────────────────────────────────────
  body: {
    flex: 1, backgroundColor: C.white,
    borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden',
  },

  // ─── Swipeable Banner ─────────────────────────────────────────────────────
  bannerContainer: {
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 2,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: C.ink,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
  bannerSlide: {
    flexDirection: 'row',
    height: BANNER_HEIGHT,
    // no extra padding — children handle their own
  },

  // Left half — text content
  bannerLeft: {
    width: BANNER_HALF,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  bannerTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  bannerTagText: {
    fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.2,
  },
  bannerHeadline: {
    fontSize: 26, fontWeight: '900', lineHeight: 30,
    marginBottom: 14, letterSpacing: -1, textAlign: 'center',
  },
  bannerCta: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bannerCtaText: {
    color: C.ink, fontSize: 12, fontWeight: '800', letterSpacing: 0.2,
  },

  // Right half — single large product image, same width as left
  bannerRight: {
    width: BANNER_HALF,
    height: BANNER_HEIGHT,
    overflow: 'hidden',
  },
  bannerThumb: {
    width: BANNER_HALF,
    height: BANNER_HEIGHT,
    backgroundColor: C.inkMid,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerThumbImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BANNER_HALF,
    height: BANNER_HEIGHT,
  },
  bannerThumbEmpty: {
    width: BANNER_HALF,
    height: BANNER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.inkMid,
  },

  // Overlays on the product image
  bannerPriceTag: {
    position: 'absolute', bottom: 28, left: 8,
    backgroundColor: 'rgba(0,0,0,0.60)',
    borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3,
  },
  bannerPriceTagText: { color: C.white, fontSize: 11, fontWeight: '800' },

  bannerNameTag: {
    position: 'absolute', bottom: 8, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.50)',
    paddingHorizontal: 8, paddingVertical: 4,
  },
  bannerNameTagText: {
    color: C.white, fontSize: 10, fontWeight: '600', letterSpacing: 0.1,
  },

  // Dots
  bannerDots: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 5,
    paddingVertical: 10,
    backgroundColor: C.ink,
  },
  bannerDot: {
    width: 5, height: 5, borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bannerDotActive: {
    backgroundColor: C.white,
    width: 16, height: 5,
  },

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
  catCircleEmoji: { fontSize: 22 },
  catCircleLabel: {
    fontSize: 10, color: C.textSecond,
    textAlign: 'center', lineHeight: 13, letterSpacing: 0.1,
  },
  catCircleLabelActive: { color: C.ink, fontWeight: '700' },

  // ─── Section header ───────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, backgroundColor: C.white,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.4 },
  sectionTitleAccent: { color: C.violet },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAll: { fontSize: 12, color: C.violet, fontWeight: '600', letterSpacing: 0.2 },

  // ─── Grid ─────────────────────────────────────────────────────────────────
  grid: { paddingHorizontal: 8, paddingBottom: 40, backgroundColor: C.white },

  // ─── Product card ─────────────────────────────────────────────────────────
  productCard: {
    flex: 1, margin: 4, backgroundColor: C.white,
    borderRadius: 10, borderWidth: 1.5, borderColor: C.border,
    overflow: 'visible',
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
  tagBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: C.ink, borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  tagBadgeText: {
    fontSize: 9, fontWeight: '700', color: C.white, letterSpacing: 0.8, textTransform: 'uppercase',
  },
  discountTagBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: C.violet, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3,
  },
  discountTagText: { fontSize: 9, fontWeight: '700', color: C.white, letterSpacing: 0.8 },
  productInfo: { padding: 10, paddingBottom: 10 },
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

  // ─── Empty state ──────────────────────────────────────────────────────────
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
    backgroundColor: C.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
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
  sortBtnText: { fontSize: 11, color: C.textSecond, fontWeight: '600', letterSpacing: 0.2 },
});