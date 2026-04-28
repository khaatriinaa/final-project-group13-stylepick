// src/screens/buyer/Home/BuyerHomeScreen.styles.ts
import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

const C = {
  pink:         '#FF5C8D',
  pinkDark:     '#E04070',
  pinkLight:    '#FF8FB3',
  pinkPale:     '#FFF0F5',
  pinkBg:       '#FFC0D8',
  white:        '#FFFFFF',
  offWhite:     '#FAF8F9',
  textPrimary:  '#1A1A2E',
  textSecond:   '#555577',
  textMuted:    '#9999BB',
  border:       '#F0E0EA',
  cream:        '#FFF8FB',
  red:          '#FF3B3B',
  orange:       '#FF7A00',
  black:        '#1A1A2E',
  goldStar:     '#FFC107',
};

export const styles = StyleSheet.create({

  // ─── Root ─────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.offWhite,
  },

  // ─── Header ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: C.pink,
    paddingTop: STATUS_BAR_HEIGHT,
  },

  // ─── Row 1: Top bar ───────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  topBarIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  topBarIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarIconText: {
    fontSize: 19,
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: C.pink,
  },

  // Search bar
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 36,
    gap: 6,
  },
  searchIcon: {
    fontSize: 14,
    color: C.textMuted,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.textPrimary,
    padding: 0,
  },
  searchCamera: {
    fontSize: 16,
    color: C.textMuted,
    paddingHorizontal: 4,
  },
  searchBtn: {
    backgroundColor: C.black,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: -8,
  },
  searchBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
  },
  wishlistBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistBtnText: {
    fontSize: 20,
    color: C.white,
  },

  // ─── Row 2: Nav tabs ──────────────────────────────────────────────────────
  navTabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  navTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  navTabText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  navTabActive: {},
  navTabTextActive: {
    color: C.white,
    fontWeight: '800',
    textDecorationLine: 'underline',
    textDecorationColor: C.white,
  },
  navTabMore: {
    marginLeft: 'auto' as any,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navTabMoreText: {
    fontSize: 18,
    color: C.white,
  },

  // ─── Promo bar ────────────────────────────────────────────────────────────
  promoBar: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFF8EE',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  promoBadgeIcon: {
    fontSize: 14,
  },
  promoBadgeMain: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textPrimary,
  },
  promoBadgeSub: {
    fontSize: 11,
    color: C.textMuted,
  },
  promoDivider: {
    width: 1,
    backgroundColor: C.border,
    marginVertical: 2,
  },

  // ─── Body scroll ─────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: C.offWhite,
  },

  // ─── Banner ───────────────────────────────────────────────────────────────
  bannerWrap: {
    backgroundColor: '#FFD6E8',
    marginBottom: 0,
    overflow: 'hidden',
  },
  bannerInner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 16,
    paddingRight: 0,
    minHeight: 160,
  },
  bannerLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  bannerStarText: {
    fontSize: 12,
    color: C.goldStar,
  },
  bannerStarLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.pinkDark,
    marginLeft: 2,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: C.pinkDark,
    lineHeight: 30,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: 'rgba(224,64,112,0.7)',
    marginBottom: 12,
  },
  bannerCta: {
    alignSelf: 'flex-start',
    backgroundColor: C.pinkDark,
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerCtaText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '700',
  },
  bannerRight: {
    width: SCREEN_W * 0.48,
    flexDirection: 'row',
    gap: 6,
    paddingRight: 10,
  },
  bannerThumbWrap: {
    flex: 1,
    gap: 6,
  },
  bannerThumb: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: C.white,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerThumbImg: {
    width: '100%',
    height: '100%',
  },
  bannerThumbImgPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB0CC',
  },
  bannerThumbPlaceholderText: {
    fontSize: 24,
  },
  bannerThumbPrice: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  bannerThumbPriceText: {
    color: C.white,
    fontSize: 11,
    fontWeight: '700',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingBottom: 12,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(224,64,112,0.25)',
  },
  bannerDotActive: {
    backgroundColor: C.pinkDark,
    width: 18,
  },

  // ─── Sub tabs (For You / New In / Deals / Bestsellers) ───────────────────
  subTabsWrap: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  subTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 2,
  },
  subTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subTabActive: {
    borderBottomColor: C.pink,
  },
  subTabIcon: {
    fontSize: 14,
  },
  subTabText: {
    fontSize: 13,
    color: C.textMuted,
    fontWeight: '500',
  },
  subTabTextActive: {
    color: C.pink,
    fontWeight: '700',
  },

  // ─── Category circles ─────────────────────────────────────────────────────
  catCirclesWrap: {
    backgroundColor: C.white,
    paddingTop: 14,
    paddingBottom: 10,
  },
  catCirclesContent: {
    paddingHorizontal: 12,
    gap: 6,
  },
  catCircleItem: {
    alignItems: 'center',
    width: 68,
  },
  catCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5EFF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  catCircleActive: {
    borderWidth: 2,
    borderColor: C.pink,
  },
  catCircleImg: {
    width: '100%',
    height: '100%',
  },
  catCircleEmoji: {
    fontSize: 26,
  },
  catCircleLabel: {
    fontSize: 11,
    color: C.textSecond,
    textAlign: 'center',
    lineHeight: 14,
  },
  catCircleLabelActive: {
    color: C.pink,
    fontWeight: '600',
  },

  // ─── Discount draw banner ────────────────────────────────────────────────
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  discountBadge: {
    backgroundColor: C.red,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  discountBadgePercent: {
    fontSize: 18,
    fontWeight: '900',
    color: C.white,
    lineHeight: 20,
  },
  discountBadgeOff: {
    fontSize: 10,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 0.5,
  },
  discountText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.2,
  },
  discountClaimBtn: {
    backgroundColor: C.black,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  discountClaimText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  discountPromoLabel: {
    fontSize: 9,
    color: C.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ─── Section header ───────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: C.white,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  sectionTitleAccent: {
    color: C.pink,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAll: {
    fontSize: 13,
    color: C.pink,
    fontWeight: '600',
  },
  seeAllArrow: {
    fontSize: 13,
    color: C.pink,
  },

  // ─── Product grid ─────────────────────────────────────────────────────────
  grid: {
    paddingHorizontal: 6,
    paddingBottom: 40,
    backgroundColor: C.white,
  },

  // ─── Product card ─────────────────────────────────────────────────────────
  productCard: {
    flex: 1,
    margin: 4,
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  productImageWrap: {
    width: '100%',
    aspectRatio: 0.8,
    backgroundColor: '#F9F0F5',
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImageIcon: {
    fontSize: 38,
  },
  soldOutOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(26,26,46,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    color: C.white,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  cardWishlistBtn: {
    position: 'absolute',
    top: 7,
    right: 7,
    zIndex: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWishlistIcon: {
    fontSize: 14,
    color: C.textMuted,
    lineHeight: 16,
  },
  cardWishlistIconActive: {
    color: C.pink,
  },
  tagBadge: {
    position: 'absolute',
    top: 7,
    left: 7,
    backgroundColor: C.black,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tagBadgeSale: {
    backgroundColor: C.red,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 0.5,
  },
  discountTagBadge: {
    position: 'absolute',
    top: 7,
    left: 7,
    backgroundColor: C.pink,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 0.5,
  },
  productInfo: {
    padding: 8,
    paddingBottom: 10,
  },
  productBrand: {
    fontSize: 10,
    color: C.textMuted,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  productName: {
    fontSize: 12,
    color: C.textSecond,
    marginBottom: 4,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: C.red,
    letterSpacing: -0.2,
  },
  comparePrice: {
    fontSize: 11,
    color: C.textMuted,
    textDecorationLine: 'line-through',
  },
  discountPercent: {
    fontSize: 10,
    fontWeight: '700',
    color: C.orange,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  soldLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  addBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnPressed: {
    backgroundColor: C.pinkDark,
  },
  addBtnText: {
    fontSize: 18,
    fontWeight: '400',
    color: C.white,
    lineHeight: 22,
    marginTop: -1,
  },

  // ─── Empty state ──────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
    backgroundColor: C.white,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.textPrimary,
    marginBottom: 6,
    marginTop: 14,
  },
  emptyText: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ─── Sort modal ───────────────────────────────────────────────────────────
  sortOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.55)',
    justifyContent: 'flex-end',
  },
  sortSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  sortHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 99,
    backgroundColor: C.border,
    marginBottom: 20,
  },
  sortTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  sortRowActive: {},
  sortRowLabel: {
    fontSize: 15,
    color: C.textSecond,
  },
  sortRowLabelActive: {
    color: C.pink,
    fontWeight: '700',
  },
  sortCheck: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: C.pink,
  },

  // ─── Status / sort row ────────────────────────────────────────────────────
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: C.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  statusCount: {
    fontSize: 11,
    color: C.textMuted,
  },
  statusCountBold: {
    color: C.textPrimary,
    fontWeight: '600',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortBtnIcon: {
    fontSize: 12,
    color: C.textMuted,
  },
  sortBtnText: {
    fontSize: 11,
    color: C.textSecond,
  },
  sortBtnChevron: {
    fontSize: 11,
    color: C.textMuted,
  },

  // ─── Cart count ───────────────────────────────────────────────────────────
  cartCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 15,
    height: 15,
    borderRadius: 99,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: C.pink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  cartCountText: {
    fontSize: 8,
    fontWeight: '700',
    color: C.white,
    lineHeight: 10,
  },
});