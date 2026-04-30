// src/screens/buyer/Favorites/FavoritesScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F8' },

  // ── Header ──────────────────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 52, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#EBEBEB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  backIcon: { fontSize: 24, color: '#374151', fontWeight: '300', lineHeight: 28 },
  title: { fontSize: 20, fontWeight: '800', color: '#111827', flex: 1, letterSpacing: -0.3 },
  clearBtn: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 6, backgroundColor: '#FEF2F2',
  },
  clearBtnText: { fontSize: 12, color: '#EF4444', fontWeight: '700' },

  // ── Grid ────────────────────────────────────────────────
  list: { padding: 12, flexGrow: 1 },
  row: { justifyContent: 'space-between', marginBottom: 12 },

  // ── Card ────────────────────────────────────────────────
  //
  // FIX: overflow is intentionally NOT set to 'hidden' here.
  // overflow:hidden on a card clips absolutely-positioned children (like the
  // heart button) on Android — both visually and for touch hit-testing.
  // Each child section handles its own clipping/radius instead.
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    // overflow:hidden removed — see note above
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },

  // Image wrapper clips the image to the card's top rounded corners.
  // overflow:hidden lives here, scoped only to the image area.
  imageWrapper: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#F3F4F6',
    position: 'relative',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
  },
  imagePlaceholderIcon: { fontSize: 36, color: '#D1D5DB' },

  // Heart remove button — must have elevation > card elevation so Android
  // places it on top for both rendering and touch hit-testing.
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    // FIX: zIndex + elevation both set and higher than card (elevation:2)
    zIndex: 20,
    elevation: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12, shadowRadius: 3,
  },
  heartIcon: { fontSize: 16 },

  // Info
  info: { padding: 10, paddingBottom: 6 },
  name: { fontSize: 13, fontWeight: '700', color: '#111827', lineHeight: 18, marginBottom: 4 },
  price: { fontSize: 15, fontWeight: '800', color: '#E63946', marginBottom: 2 },
  stock: { fontSize: 11, color: '#9CA3AF' },

  // Add to cart button
  addBtn: {
    margin: 10, marginTop: 6,
    backgroundColor: '#E63946', borderRadius: 8,
    paddingVertical: 10, alignItems: 'center',
  },
  addBtnPressed: { opacity: 0.85 },
  addBtnDisabled: { backgroundColor: '#E5E7EB' },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  // ── Empty ────────────────────────────────────────────────
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100,
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 18, marginBottom: 24 },
  browseBtn: {
    backgroundColor: '#E63946', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 28,
  },
  browseBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});