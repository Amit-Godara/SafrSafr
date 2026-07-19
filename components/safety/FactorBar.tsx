import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { light } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';
import { Icon, IconName } from '@components/ui/Icon';

export interface FactorBarProps {
  label: string;
  icon: IconName;
  /** 0..100 */
  value: number;
  /** What a HIGH value means for safety: 'good' | 'bad'. Drives bar colour. */
  highIs?: 'good' | 'bad';
  caption?: string;
  delay?: number;
}

/**
 * FactorBar — one safety factor row (Crime Rate, Lighting, …) with an
 * icon chip, label, animated horizontal bar and a level caption.
 */
export function FactorBar({
  label,
  icon,
  value,
  highIs = 'good',
  caption,
  delay = 0,
}: FactorBarProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const pct = Math.max(0, Math.min(100, value));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 900,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [anim, pct, delay]);

  const goodness = highIs === 'good' ? pct : 100 - pct;
  const tint = goodness >= 66 ? light.success : goodness >= 40 ? light.warning : light.danger;
  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.row}>
      <View style={styles.iconChip}>
        <Icon name={icon} size={18} color={light.primary} />
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <View style={styles.labels}>
          <ThemedText variant="label" color={light.textPrimary}>
            {label}
          </ThemedText>
          <ThemedText variant="caption" color={tint}>
            {caption ?? `${pct}%`}
          </ThemedText>
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width, backgroundColor: tint }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconChip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 8, borderRadius: 99, backgroundColor: light.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
});

export default FactorBar;
