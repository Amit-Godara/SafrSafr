import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { GlassCard } from '@components/ui/GlassCard';
import { ThemedText } from '@components/ui/Typography';
import { Icon, IconName } from '@components/ui/Icon';
import { colors, spacing, radius } from '@constants/index';

export interface SafePlace {
  key: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  icon: IconName;
}

const DEFAULT_PLACES: SafePlace[] = [
  { key: '1', name: 'City Police Station', type: 'Police', distance: '350 m', rating: 4.8, icon: 'shield' },
  { key: '2', name: 'Apollo Hospital', type: 'Hospital', distance: '1.2 km', rating: 4.6, icon: 'heart' },
  { key: '3', name: 'Cafe Aroma', type: 'Verified Cafe', distance: '600 m', rating: 4.5, icon: 'coffee' },
];

export interface NearbySafePlacesProps {
  places?: SafePlace[];
  onPress?: (key: string) => void;
}

/** NearbySafePlaces — horizontal carousel of verified safe spots. */
export function NearbySafePlaces({ places = DEFAULT_PLACES, onPress }: NearbySafePlacesProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.xl }}
    >
      {places.map((p) => (
        <Pressable key={p.key} onPress={() => onPress?.(p.key)}>
          <GlassCard padding="lg" radiusToken="lg" style={{ width: 190 }}>
            <View style={{ gap: spacing.md }}>
              <View style={styles.top}>
                <View style={styles.iconWrap}>
                  <Icon name={p.icon} size={22} color={colors.primary} />
                </View>
                <View style={styles.rating}>
                  <Icon name="star" size={12} color={colors.warning} />
                  <ThemedText variant="caption" color={colors.textSecondary}>
                    {p.rating.toFixed(1)}
                  </ThemedText>
                </View>
              </View>
              <View style={{ gap: 2 }}>
                <ThemedText variant="label" color={colors.textPrimary} numberOfLines={1}>
                  {p.name}
                </ThemedText>
                <ThemedText variant="caption" color={colors.textMuted}>
                  {p.type}
                </ThemedText>
              </View>
              <View style={styles.dist}>
                <Icon name="navigation" size={13} color={colors.accent} />
                <ThemedText variant="caption" color={colors.accent}>
                  {p.distance} away
                </ThemedText>
              </View>
            </View>
          </GlassCard>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(20,184,166,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dist: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});

export default NearbySafePlaces;
