import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@components/ui/Typography';
import { Icon, IconName } from '@components/ui/Icon';
import { colors, spacing, radius, shadow } from '@constants/index';

export interface RecommendationCardProps {
  title?: string;
  body?: string;
  icon?: IconName;
  tag?: string;
}

/**
 * RecommendationCard — "Latest Safety Recommendation" gradient hero.
 * Premium brand gradient with a glass icon chip.
 */
export function RecommendationCard({
  title = 'Avoid the underpass after dark',
  body = 'Recent reports suggest poor lighting near MG Road underpass tonight. Prefer the main road route.',
  icon = 'sparkles',
  tag = 'AI Recommendation',
}: RecommendationCardProps) {
  return (
    <LinearGradient
      colors={['#0D9488', '#0891B2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, shadow.glowTeal]}
    >
      <View style={styles.iconChip}>
        <Icon name={icon} size={24} color={colors.textPrimary} />
      </View>
      <View style={{ flex: 1, gap: spacing.sm }}>
        <View style={styles.tag}>
          <Icon name="star" size={12} color={colors.background} />
          <ThemedText variant="caption" color={colors.background} style={{ fontWeight: '700' }}>
            {tag}
          </ThemedText>
        </View>
        <ThemedText variant="title" color={colors.textPrimary}>
          {title}
        </ThemedText>
        <ThemedText variant="bodySm" color="rgba(255,255,255,0.85)">
          {body}
        </ThemedText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.xl,
  },
  iconChip: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});

export default RecommendationCard;
