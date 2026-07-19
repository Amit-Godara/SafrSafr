/**
 * SafeSafr — Light theme (mockup palette).
 * Purple-primary light UI used by the AI Safety Score module,
 * matching the uploaded design reference.
 */
export const light = {
  background: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  border: '#E2E8F0',

  primary: '#7C3AED',     // violet
  primarySoft: '#EDE9FE', // violet-100 chip bg
  accent: '#8B5CF6',

  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',

  success: '#22C55E',
  successSoft: '#DCFCE7',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  info: '#3B82F6',
  infoSoft: '#DBEAFE',
} as const;

export const lightGradients = {
  purple: ['#7C3AED', '#8B5CF6'] as const,
  header: ['#6D28D9', '#8B5CF6'] as const,
} as const;
