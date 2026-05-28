export const colors = {
  background: '#111625',
  surface: '#0E89FF',
  surfaceDim: '#0E89FF22',
  accent: '#FF007F',
  text: '#F8F9FA',
  textMuted: '#F8F9FA99',
  textDim: '#F8F9FA66',
  border: '#F8F9FA1A',
  success: '#22C55E',
  danger: '#EF4444',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.text },
  bodyMuted: { fontSize: 16, fontWeight: '400' as const, color: colors.textMuted },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
  number: { fontSize: 32, fontWeight: '700' as const, color: colors.text },
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;
