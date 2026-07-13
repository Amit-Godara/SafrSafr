/**
 * SafeSafr — Typography scale
 * White-first premium typography.
 */

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 38,
  '4xl': 44,
  '5xl': 56,
} as const;

/** Ready-to-spread text style presets. */
export const textVariants = {
  display: { fontSize: fontSize['5xl'], lineHeight: lineHeight['5xl'], fontWeight: fontWeight.extrabold },
  h1: { fontSize: fontSize['4xl'], lineHeight: lineHeight['4xl'], fontWeight: fontWeight.bold },
  h2: { fontSize: fontSize['3xl'], lineHeight: lineHeight['3xl'], fontWeight: fontWeight.bold },
  h3: { fontSize: fontSize['2xl'], lineHeight: lineHeight['2xl'], fontWeight: fontWeight.semibold },
  title: { fontSize: fontSize.xl, lineHeight: lineHeight.xl, fontWeight: fontWeight.semibold },
  bodyLg: { fontSize: fontSize.lg, lineHeight: lineHeight.lg, fontWeight: fontWeight.regular },
  body: { fontSize: fontSize.base, lineHeight: lineHeight.base, fontWeight: fontWeight.regular },
  bodySm: { fontSize: fontSize.sm, lineHeight: lineHeight.sm, fontWeight: fontWeight.regular },
  label: { fontSize: fontSize.sm, lineHeight: lineHeight.sm, fontWeight: fontWeight.semibold },
  caption: { fontSize: fontSize.xs, lineHeight: lineHeight.xs, fontWeight: fontWeight.medium },
} as const;

export type TextVariant = keyof typeof textVariants;
