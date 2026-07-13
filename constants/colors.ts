/**
 * SafeSafr — Color palette
 * Premium travel-inspired dark theme.
 */

export const palette = {
  // Core brand
  navy: '#0F172A', // primary background
  navy800: '#1E293B', // raised surfaces / cards
  navy700: '#334155', // borders / dividers
  navy600: '#475569',

  teal: '#14B8A6', // primary
  tealDark: '#0D9488',
  tealLight: '#2DD4BF',

  cyan: '#22D3EE', // accent
  cyanDark: '#06B6D4',
  cyanLight: '#67E8F9',

  white: '#FFFFFF',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8', // muted text
  slate500: '#64748B',

  // Semantic
  danger: '#EF4444', // SOS
  dangerDark: '#DC2626',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#3B82F6',

  transparent: 'transparent',
  black: '#000000',
} as const;

/** Semantic aliases used across the design system. */
export const colors = {
  background: palette.navy,
  surface: palette.navy800,
  surfaceAlt: palette.navy700,
  border: palette.navy700,

  primary: palette.teal,
  primaryDark: palette.tealDark,
  primaryLight: palette.tealLight,

  accent: palette.cyan,
  accentDark: palette.cyanDark,
  accentLight: palette.cyanLight,

  textPrimary: palette.white,
  textSecondary: palette.slate300,
  textMuted: palette.slate400,

  danger: palette.danger,
  success: palette.success,
  warning: palette.warning,
  info: palette.info,

  // Glassmorphism overlays
  glass: 'rgba(30, 41, 59, 0.55)',
  glassBorder: 'rgba(148, 163, 184, 0.18)',
  glassHighlight: 'rgba(255, 255, 255, 0.06)',
} as const;

/** Gradient presets (use with expo-linear-gradient). */
export const gradients = {
  brand: ['#14B8A6', '#22D3EE'] as const,
  brandDeep: ['#0D9488', '#06B6D4'] as const,
  danger: ['#EF4444', '#DC2626'] as const,
  navy: ['#0F172A', '#1E293B'] as const,
  glow: ['rgba(34,211,238,0.25)', 'rgba(20,184,166,0.05)'] as const,
} as const;

export type ColorToken = keyof typeof colors;
