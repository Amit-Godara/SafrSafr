import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@components/ui/GlassCard';
import { ThemedText } from '@components/ui/Typography';
import { Icon, IconName } from '@components/ui/Icon';
import { colors, spacing, radius, gradients, shadow } from '@constants/index';

export interface QuickAction {
  key: string;
  label: string;
  icon: IconName;
  /** Highlighted (gradient) tile — used for SOS. */
  highlight?: boolean;
  tint?: string;
}

export const DEFAULT_ACTIONS: QuickAction[] = [
  { key: 'route', label: 'Safe Route', icon: 'route', tint: colors.primary },
  { key: 'sos', label: 'SOS', icon: 'alert', highlight: true },
  { key: 'nearby', label: 'Nearby Travelers', icon: 'community', tint: colors.accent },
  { key: 'map', label: 'Live Map', icon: 'map-pin', tint: colors.primary },
  { key: 'reports', label: 'Safety Reports', icon: 'file-text', tint: colors.accent },
  { key: 'score', label: 'AI Safety Score', icon: 'sparkles', tint: colors.primary },
];

export interface QuickActionsGridProps {
  actions?: QuickAction[];
  onPress?: (key: string) => void;
}

/** QuickActionsGrid — 3-column grid of glass action tiles; SOS stands out. */
export function QuickActionsGrid({ actions = DEFAULT_ACTIONS, onPress }: QuickActionsGridProps) {
  return (
    <View style={styles.grid}>
      {actions.map((a) => (
        <Pressable key={a.key} style={styles.cell} onPress={() => onPress?.(a.key)}>
          {({ pressed }) => {
            const scale = { transform: [{ scale: pressed ? 0.95 : 1 }] };
            if (a.highlight) {
              return (
                <LinearGradient
                  colors={gradients.danger}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.tile, shadow.glowDanger, scale]}
                >
                  <Icon name={a.icon} size={26} color={colors.textPrimary} />
                  <ThemedText variant="caption" color={colors.textPrimary} style={styles.tileLabel}>
                    {a.label}
                  </ThemedText>
                </LinearGradient>
              );
            }
            return (
              <GlassCard padding="none" radiusToken="lg" style={scale}>
                <View style={styles.tile}>
                  <View style={[styles.iconWrap, { backgroundColor: (a.tint ?? colors.primary) + '22' }]}>
                    <Icon name={a.icon} size={24} color={a.tint ?? colors.primary} />
                  </View>
                  <ThemedText variant="caption" color={colors.textSecondary} style={styles.tileLabel}>
                    {a.label}
                  </ThemedText>
                </View>
              </GlassCard>
            );
          }}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  cell: { width: '31%', flexGrow: 1 },
  tile: {
    height: 96,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { textAlign: 'center' },
});

export default QuickActionsGrid;
