// import React, { useEffect, useRef, useState } from 'react';
// import { View, Animated, Easing, StyleSheet } from 'react-native';
// import Svg, { Circle } from 'react-native-svg';
// import { light } from '@constants/lightTheme';
// import { ThemedText } from '@components/ui/Typography';

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// export interface ScoreRingProps {
//   /** 0..5 like the mockup's "4.2 / 5". */
//   score: number;
//   outOf?: number;
//   size?: number;
//   label?: string;
// }

// /**
//  * ScoreRing — large animated circular safety score (mockup style:
//  * green arc, big number, "/5" underneath, label below).
//  */
// export function ScoreRing({ score, outOf = 5, size = 168, label }: ScoreRingProps) {
//   const stroke = 14;
//   const r = (size - stroke) / 2;
//   const circ = 2 * Math.PI * r;
//   const pct = Math.max(0, Math.min(1, score / outOf));
//   const progress = useRef(new Animated.Value(0)).current;
//   const [display, setDisplay] = useState(0);

//   useEffect(() => {
//     progress.setValue(0);
//     const anim = Animated.timing(progress, {
//       toValue: pct,
//       duration: 1300,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: false,
//     });
//     anim.start();
//     const id = progress.addListener(({ value }) => setDisplay(value * outOf));
//     return () => {
//       progress.removeListener(id);
//       anim.stop();
//     };
//   }, [pct, outOf, progress]);

//   const dashoffset = progress.interpolate({ inputRange: [0, 1], outputRange: [circ, 0] });
//   const tint = pct >= 0.7 ? light.success : pct >= 0.45 ? light.warning : light.danger;

//   return (
//     <View style={{ alignItems: 'center', gap: 6 }}>
//       <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
//         <Svg width={size} height={size}>
//           <Circle cx={size / 2} cy={size / 2} r={r} stroke={light.border} strokeWidth={stroke} fill="none" />
//           <AnimatedCircle
//             cx={size / 2}
//             cy={size / 2}
//             r={r}
//             stroke={tint}
//             strokeWidth={stroke}
//             strokeLinecap="round"
//             fill="none"
//             strokeDasharray={circ}
//             strokeDashoffset={dashoffset}
//             transform={`rotate(-90 ${size / 2} ${size / 2})`}
//           />
//         </Svg>
//         <View style={styles.center}>
//           <ThemedText variant="display" color={light.textPrimary} style={{ fontSize: 44, lineHeight: 50 }}>
//             {display.toFixed(1)}
//           </ThemedText>
//           <ThemedText variant="bodySm" color={light.textMuted}>
//             /{outOf}
//           </ThemedText>
//         </View>
//       </View>
//       {label && (
//         <ThemedText variant="title" color={tint}>
//           {label}
//         </ThemedText>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: { position: 'absolute', alignItems: 'center' },
// });

// export default ScoreRing;


import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';
import type { RiskLevel } from '@services/safetyScore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 176;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RISK_COLOR: Record<RiskLevel, { ring: string; badgeBg: string; badgeText: string }> = {
  Low: { ring: '#22C55E', badgeBg: '#DCFCE7', badgeText: '#15803D' },
  Medium: { ring: '#F59E0B', badgeBg: '#FEF3C7', badgeText: '#B45309' },
  High: { ring: '#EF4444', badgeBg: '#FEE2E2', badgeText: '#B91C1C' },
};

export interface ScoreRingProps {
  score: number; // 0-100
  riskLevel: RiskLevel;
}

/**
 * ScoreRing — large animated circular progress ring showing the safety
 * score (0-100) with a color-coded risk-level badge underneath.
 */
export function ScoreRing({ score, riskLevel }: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const progress = useSharedValue(0);
  const [displayScore, setDisplayScore] = React.useState(0);
  const colors = RISK_COLOR[riskLevel];

  useEffect(() => {
    progress.value = withTiming(clamped, {
      duration: 1100,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped]);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      runOnJS(setDisplayScore)(Math.round(value));
    },
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - (CIRCUMFERENCE * progress.value) / 100,
  }));

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#EDE9FE"
          strokeWidth={STROKE}
          fill="none"
        />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.ring}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>

      <View style={styles.center} pointerEvents="none">
        <ThemedText variant="title" color="#1E1B3A" style={styles.scoreNum}>
          {displayScore}
        </ThemedText>
        <ThemedText variant="caption" color="#6B6485">
          / 100
        </ThemedText>
      </View>

      <View style={[styles.badge, { backgroundColor: colors.badgeBg }]}>
        <View style={[styles.badgeDot, { backgroundColor: colors.ring }]} />
        <ThemedText variant="caption" color={colors.badgeText} style={styles.badgeText}>
          {riskLevel} Risk
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },

  ringContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  center: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -35,
  },

  scoreNum: {
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 48,
    marginBottom: -4,
  },

  badge: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 10,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  badgeText: {
    fontWeight: '700',
  },
});

export default ScoreRing;