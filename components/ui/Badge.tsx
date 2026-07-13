import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@constants/index';
import { ThemedText } from './Typography';

export type BadgeTone = 'primary' | 'accent' | 'success' | 'danger' | 'neutral';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  dot?: boolean;
}

const toneMap: Record<BadgeTone, { bg: string; fg: string }> = {
  primary: { bg: 'rgba(20,184,166,0.15)', fg: colors.primary },
  accent: { bg: 'rgba(34,211,238,0.15)', fg: colors.accent },
  success: { bg: 'rgba(34,197,94,0.15)', fg: colors.success },
  danger: { bg: 'rgba(239,68,68,0.15)', fg: colors.danger },
  neutral: { bg: colors.surfaceAlt, fg: colors.textSecondary },
};

/**
 * Badge — compact status pill, e.g. "Your location is live".
 */
export function Badge({ label, tone = 'primary', dot = false }: BadgeProps) {
  const { bg, fg } = toneMap[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: fg }]} />}
      <ThemedText variant="caption" color={fg}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export default Badge;
