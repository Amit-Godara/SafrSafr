import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { GlassCard } from '@components/ui/GlassCard';
import { ThemedText } from '@components/ui/Typography';
import { Icon } from '@components/ui/Icon';
import { Badge } from '@components/ui/Badge';
import { colors, spacing } from '@constants/index';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface SafetyScoreCardProps {
  /** 0..100 */
  score?: number;
  area?: string;
}

/**
 * SafetyScoreCard — hero "AI Safety Score" card.
 * Animated ring counts up on mount. Liquid-glass surface + teal glow.
 */
export function SafetyScoreCard({ score = 82, area = 'this area' }: SafetyScoreCardProps) {
  const size = 92;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: score / 100,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, score]);

  const dashoffset = progress.interpolate({ inputRange: [0, 1], outputRange: [circ, 0] });
  const tint = score >= 75 ? colors.success : score >= 50 ? colors.warning : colors.danger;
  const label = score >= 75 ? 'Very Safe' : score >= 50 ? 'Moderate' : 'Caution';

  return (
    <GlassCard glow="teal" radiusToken="xl">
      <View style={styles.row}>
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={size} height={size}>
            <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surfaceAlt} strokeWidth={stroke} fill="none" />
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={tint}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={dashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={{ position: 'absolute', alignItems: 'center' }}>
            <ThemedText variant="h2" color={colors.textPrimary}>
              {score}
            </ThemedText>
            <ThemedText variant="caption" color={colors.textMuted} style={{ marginTop: -2 }}>
              / 100
            </ThemedText>
          </View>
        </View>

        <View style={{ flex: 1, gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="sparkles" size={18} color={colors.accent} />
            <ThemedText variant="label" color={colors.accent}>
              AI Safety Score
            </ThemedText>
          </View>
          <ThemedText variant="bodySm" color={colors.textSecondary}>
            {area} is rated safe based on live data, reports & time of day.
          </ThemedText>
          <Badge label={label} tone={score >= 75 ? 'success' : 'primary'} dot />
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
});

export default SafetyScoreCard;
