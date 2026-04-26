// src/screens/buyer/Home/BuyerHomeScreen.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../../theme';

const PRIMARY_RED = '#C8102E';
const HEADER_BG   = PRIMARY_RED;
const BANNER_BG   = '#1D3557';

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: HEADER_BG,
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  avatarRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerLeft: {
    flexShrink: 1,
  },
  greetingText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },

  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnEmoji: {
    fontSize: 15,
  },
  cartBadgeWrap: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.white,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: PRIMARY_RED,
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: FONTS.bold,
    color: PRIMARY_RED,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    height: 42,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.45)',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.white,
    padding: 0,
  },
  searchClear: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
  },

  catStrip: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    maxHeight: 52,
  },
  catContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  catChipActive: {
    backgroundColor: PRIMARY_RED,
    borderColor: PRIMARY_RED,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  catChipTextActive: {
    color: COLORS.white,
  },

  banner: {
    backgroundColor: BANNER_BG,
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: RADIUS.xl,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerDeco: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  bannerDeco2: {
    position: 'absolute',
    right: 36,
    bottom: -36,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  bannerTextWrap: {
    flex: 1,
    zIndex: 1,
  },
  bannerTag: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: FONTS.semiBold,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    lineHeight: 26,
  },
  bannerTitleAccent: {
    color: '#FAC775',
  },
  bannerCta: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerCtaText: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
  },
  bannerEmoji: {
    fontSize: 50,
    zIndex: 1,
    marginLeft: 10,
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: PRIMARY_RED,
  },

  grid: {
    paddingHorizontal: 9,
    paddingBottom: 32,
  },

  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  productCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },

  productImageWrap: {
    width: '100%',
    aspectRatio: 0.85,
    backgroundColor: COLORS.background,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
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
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    color: COLORS.white,
    fontWeight: FONTS.semiBold,
    fontSize: 11,
    letterSpacing: 1,
  },

  // ✅ Rendered first in JSX + elevated so it always receives touches on both iOS and Android
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 20,
    elevation: 5,          // ✅ Android requires elevation for zIndex to take effect
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 0.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistIcon: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  wishlistIconActive: {
    color: PRIMARY_RED,
  },

  tagBadge: {
    position: 'absolute',
    top: 8, left: 8,
    backgroundColor: PRIMARY_RED,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagBadgeSale: {
    backgroundColor: COLORS.secondary,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  productInfo: {
    padding: 10,
    paddingBottom: 12,
  },
  productName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 3,
    lineHeight: 16,
  },
  comparePrice: {
    fontSize: 11,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.text,
  },
  productPriceSale: {
    color: PRIMARY_RED,
  },

  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: PRIMARY_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnPressed: {
    backgroundColor: '#A00C24',
  },
  addBtnText: {
    fontSize: 18,
    fontWeight: FONTS.regular,
    color: COLORS.white,
    lineHeight: 22,
    marginTop: -1,
  },

  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 14,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});