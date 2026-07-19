import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { light } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ScoreRingProps {
  /** 0..5 like the mockup's "4.2 / 5". */
  score: number;
  outOf?: number;
  size?: number;
  label?: string;
}

/**
 * ScoreRing — large animated circular safety score (mockup style:
 * green arc, big number, "/5" underneath, label below).
 */
export function ScoreRing({ score, outOf = 5, size = 168, label }: ScoreRingProps) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / outOf));
  const progress = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    progress.setValue(0);
    const anim = Animated.timing(progress, {
      toValue: pct,
      duration: 1300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    anim.start();
    const id = progress.addListener(({ value }) => setDisplay(value * outOf));
    return () => {
      progress.removeListener(id);
      anim.stop();
    };
  }, [pct, outOf, progress]);

  const dashoffset = progress.interpolate({ inputRange: [0, 1], outputRange: [circ, 0] });
  const tint = pct >= 0.7 ? light.success : pct >= 0.45 ? light.warning : light.danger;

  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={light.border} strokeWidth={stroke} fill="none" />
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
        <View style={styles.center}>
          <ThemedText variant="display" color={light.textPrimary} style={{ fontSize: 44, lineHeight: 50 }}>
            {display.toFixed(1)}
          </ThemedText>
          <ThemedText variant="bodySm" color={light.textMuted}>
            /{outOf}
          </ThemedText>
        </View>
      </View>
      {label && (
        <ThemedText variant="title" color={tint}>
          {label}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', alignItems: 'center' },
});

export default ScoreRing;
