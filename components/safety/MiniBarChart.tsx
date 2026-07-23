// import React, { useEffect, useRef } from 'react';
// import { View, Animated, Easing, StyleSheet } from 'react-native';
// import { light } from '@constants/lightTheme';
// import { ThemedText } from '@components/ui/Typography';

// export interface BarDatum {
//   label: string;
//   /** 0..100 */
//   value: number;
//   highlight?: boolean;
// }

// export interface MiniBarChartProps {
//   data: BarDatum[];
//   height?: number;
//   title?: string;
// }

// /**
//  * MiniBarChart — animated vertical bars (e.g. incidents by day).
//  * Bars grow on mount; highlighted bar uses the primary purple.
//  */
// export function MiniBarChart({ data, height = 110, title }: MiniBarChartProps) {
//   const anims = useRef(data.map(() => new Animated.Value(0))).current;

//   useEffect(() => {
//     Animated.stagger(
//       70,
//       anims.map((a, i) =>
//         Animated.timing(a, {
//           toValue: data[i].value,
//           duration: 700,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: false,
//         })
//       )
//     ).start();
//   }, [anims, data]);

//   return (
//     <View style={{ gap: 10 }}>
//       {title && (
//         <ThemedText variant="label" color={light.textPrimary}>
//           {title}
//         </ThemedText>
//       )}
//       <View style={[styles.chart, { height }]}>
//         {data.map((d, i) => {
//           const h = anims[i].interpolate({
//             inputRange: [0, 100],
//             outputRange: [4, height - 24],
//           });
//           return (
//             <View key={d.label} style={styles.col}>
//               <Animated.View
//                 style={[
//                   styles.bar,
//                   {
//                     height: h,
//                     backgroundColor: d.highlight ? light.primary : light.primarySoft,
//                   },
//                 ]}
//               />
//               <ThemedText variant="caption" color={light.textMuted}>
//                 {d.label}
//               </ThemedText>
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
//   col: { alignItems: 'center', gap: 6, flex: 1 },
//   bar: { width: 22, borderRadius: 8 },
// });

// export default MiniBarChart;



import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { light } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';

export interface MiniBarChartDatum {
  label: string;
  value: number; // 0-100
  highlight?: boolean;
}

export interface MiniBarChartProps {
  title: string;
  data: MiniBarChartDatum[];
}

const CHART_HEIGHT = 96;

function Bar({ datum, delay }: { datum: MiniBarChartDatum; delay: number }) {
  const height = useSharedValue(0);
  const clamped = Math.max(4, Math.min(100, datum.value));

  useEffect(() => {
    height.value = withDelay(
      delay,
      withTiming(clamped, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
  }, [clamped, delay]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${height.value}%`,
  }));

  return (
    <View style={styles.barCol}>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.bar,
            barStyle,
            { backgroundColor: datum.highlight ? light.primary : light.primarySoft },
          ]}
        />
      </View>
      <ThemedText variant="caption" color={light.textMuted}>
        {datum.label}
      </ThemedText>
    </View>
  );
}

/**
 * MiniBarChart — lightweight animated bar chart (no chart library
 * dependency), used for "Reported incidents this week" mock data.
 */
export function MiniBarChart({ title, data }: MiniBarChartProps) {
  return (
    <View style={{ gap: 14 }}>
      <ThemedText variant="title" color={light.textPrimary}>
        {title}
      </ThemedText>
      <View style={styles.row}>
        {data.map((datum, i) => (
          <Bar key={datum.label} datum={datum} delay={i * 70} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: CHART_HEIGHT + 24,
  },
  barCol: { alignItems: 'center', gap: 8, flex: 1 },
  barTrack: {
    width: 18,
    height: CHART_HEIGHT,
    borderRadius: 9,
    backgroundColor: 'rgba(124,58,237,0.08)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: { width: '100%', borderRadius: 9 },
});

export default MiniBarChart;