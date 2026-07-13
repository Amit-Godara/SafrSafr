/**
 * SafeSafr — Unified theme object.
 * Single import surface for the design system.
 */
import { colors, palette, gradients } from './colors';
import { textVariants, fontSize, fontWeight, lineHeight, fontFamily } from './typography';
import { spacing, radius, shadow } from './spacing';

export const theme = {
  colors,
  palette,
  gradients,
  typography: { textVariants, fontSize, fontWeight, lineHeight, fontFamily },
  spacing,
  radius,
  shadow,
} as const;

export type Theme = typeof theme;
export default theme;
