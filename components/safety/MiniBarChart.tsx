import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { light } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';

export interface BarDatum {
  label: string;
  /** 0..100 */
  value: number;
  highlight?: boolean;
}

export interface MiniBarChartProps {
  data: BarDatum[];
  height?: number;
  title?: string;
}

/**
 * MiniBarChart — animated vertical bars (e.g. incidents by day).
 * Bars grow on mount; highlighted bar uses the primary purple.
 */
export function MiniBarChart({ data, height = 110, title }: MiniBarChartProps) {
  const anims = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      70,
      anims.map((a, i) =>
        Animated.timing(a, {
          toValue: data[i].value,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      )
    ).start();
  }, [anims, data]);

  return (
    <View style={{ gap: 10 }}>
      {title && (
        <ThemedText variant="label" color={light.textPrimary}>
          {title}
        </ThemedText>
      )}
      <View style={[styles.chart, { height }]}>
        {data.map((d, i) => {
          const h = anims[i].interpolate({
            inputRange: [0, 100],
            outputRange: [4, height - 24],
          });
          return (
            <View key={d.label} style={styles.col}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height: h,
                    backgroundColor: d.highlight ? light.primary : light.primarySoft,
                  },
                ]}
              />
              <ThemedText variant="caption" color={light.textMuted}>
                {d.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  col: { alignItems: 'center', gap: 6, flex: 1 },
  bar: { width: 22, borderRadius: 8 },
});

export default MiniBarChart;
