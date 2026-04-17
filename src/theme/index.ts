// src/theme/index.ts — ShopGo design tokens

export const COLORS = {
  primary:       '#E63946',
  primaryDark:   '#C1121F',
  primaryLight:  '#FFF1F2',
  secondary:     '#1D3557',
  white:         '#FFFFFF',
  background:    '#F7F8FA',
  card:          '#FFFFFF',
  border:        '#EFEFEF',
  borderDark:    '#E0E0E0',
  text:          '#1A1A2E',
  textSecondary: '#6B7280',
  textLight:     '#9CA3AF',
  success:       '#059669',
  successLight:  '#ECFDF5',
  warning:       '#D97706',
  warningLight:  '#FEF3C7',
  error:         '#DC2626',
  errorLight:    '#FEF2F2',
  info:          '#2563EB',
  infoLight:     '#EFF6FF',
};

export const FONTS = {
  regular:     '400' as const,
  medium:      '500' as const,
  semiBold:    '600' as const,
  bold:        '700' as const,
  extraBold:   '800' as const,
};

export const RADIUS = {
  xs:  4,
  sm:  6,
  md:  10,
  lg:  14,
  xl:  20,
  full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: '#FEF3C7', text: '#D97706' },
  confirmed: { bg: '#DBEAFE', text: '#2563EB' },
  preparing: { bg: '#EDE9FE', text: '#7C3AED' },
  shipped:   { bg: '#D1FAE5', text: '#059669' },
  delivered: { bg: '#DCFCE7', text: '#047857' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  refunded:  { bg: '#F3F4F6', text: '#6B7280' },
};

export const FASHION_CATEGORIES = [
  'All', 'Dress', 'Tops', 'Bottoms', 'Footwear',
  'Outerwear', 'Accessories', 'Bags', 'Activewear',
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

export const PRESET_COLORS = [
  { label: 'Black',  value: '#1A1A1A' },
  { label: 'White',  value: '#FFFFFF' },
  { label: 'Red',    value: '#DC2626' },
  { label: 'Navy',   value: '#1D3557' },
  { label: 'Pink',   value: '#F472B6' },
  { label: 'Beige',  value: '#D4B896' },
  { label: 'Brown',  value: '#92400E' },
  { label: 'Gray',   value: '#6B7280' },
  { label: 'Green',  value: '#059669' },
  { label: 'Yellow', value: '#F59E0B' },
  { label: 'Purple', value: '#7C3AED' },
  { label: 'Blue',   value: '#2563EB' },
];
