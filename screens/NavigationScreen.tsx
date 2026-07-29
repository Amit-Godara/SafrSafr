import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';
import type { RouteType } from '@screens/RoutePlannerScreen';

const C = {
  mapBg: '#0E1526',
  mapGrid: 'rgba(255,255,255,0.06)',
  card: '#FFFFFF',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  safe: '#22C55E',
  fast: '#F59E0B',
  short: '#8B5CF6',
  danger: '#E53935',
};

const ROUTE_META: Record<RouteType, { label: string; distance: string; duration: string; safetyScore: number; accent: string }> = {
  safest: { label: 'Safest Route', distance: '5.2 km', duration: '18 min', safetyScore: 92, accent: C.safe },
  fastest: { label: 'Fastest Route', distance: '4.6 km', duration: '13 min', safetyScore: 68, accent: C.fast },
  shortest: { label: 'Shortest Route', distance: '4.1 km', duration: '15 min', safetyScore: 74, accent: C.short },
};

/* ---------------------------------------------------------------------- */

function CloseIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function TurnArrowIcon({ size = 26, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 18V10a6 6 0 0 1 6-6h4M12 8l4-4 4 4"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function ShieldIcon({ size = 14, color = C.safe }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z" fill={color} opacity={0.95} />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */

function PulsingDot({ color }: { color: string }) {
  const pulse = useSharedValue(0.6);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.8, { duration: 1500, easing: Easing.out(Easing.ease) }), -1, false);
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1 - (pulse.value - 0.6) / 1.2,
  }));
  return (
    <View style={styles.dotWrap}>
      <Animated.View style={[styles.dotPulse, style, { backgroundColor: `${color}66` }]} />
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  );
}

export interface NavigationScreenProps {
  type: RouteType;
  source?: string;
  destination?: string;
  onEnd?: () => void;
}

/**
 * NavigationScreen — dummy turn-by-turn view for a chosen route. Dark
 * illustrated map canvas (same visual language as MapScreen), highlighted
 * route path, a live "current step" card, and a route summary with an
 * End Navigation button. No backend, no real routing.
 */
export function NavigationScreen({ type, source, destination, onEnd }: NavigationScreenProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const meta = ROUTE_META[type];

  const px = (pct: number) => (pct / 100) * width;
  const py = (pct: number) => (pct / 100) * height;

  return (
    <View style={styles.root}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        {Array.from({ length: Math.ceil(width / 40) }).map((_, i) => (
          <Line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={height} stroke={C.mapGrid} strokeWidth={1} />
        ))}
        {Array.from({ length: Math.ceil(height / 40) }).map((_, i) => (
          <Line key={`h${i}`} x1={0} y1={i * 40} x2={width} y2={i * 40} stroke={C.mapGrid} strokeWidth={1} />
        ))}

        <Path
          d={`M${px(20)},${py(78)} C ${px(30)},${py(50)} ${px(45)},${py(60)} ${px(55)},${py(40)} S ${px(75)},${py(25)} ${px(82)},${py(20)}`}
          stroke={meta.accent}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
        <SvgCircle cx={px(82)} cy={py(20)} r={7} fill={C.danger} stroke="#FFFFFF" strokeWidth={2} />
      </Svg>

      <View pointerEvents="none" style={{ position: 'absolute', left: px(20) - 20, top: py(78) - 20 }}>
        <PulsingDot color={meta.accent} />
      </View>

      <Pressable onPress={onEnd} hitSlop={10} style={[styles.closeBtn, { top: insets.top + 12 }]}>
        <CloseIcon />
      </Pressable>

      <View style={[styles.instructionCard, { top: insets.top + 12 }]}>
        <View style={[styles.turnIconWrap, { backgroundColor: meta.accent }]}>
          <TurnArrowIcon />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
            Head north on MG Road
          </ThemedText>
          <ThemedText variant="caption" color="rgba(255,255,255,0.7)">
            Then continue straight for 800 m
          </ThemedText>
        </View>
      </View>

      <View style={[styles.summaryCard, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.summaryTop}>
          <View style={[styles.typeBadge, { backgroundColor: meta.accent }]}>
            <ShieldIcon color="#FFFFFF" />
            <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
              {meta.label}
            </ThemedText>
          </View>
          <ThemedText variant="caption" color={C.textMuted} numberOfLines={1} style={{ flex: 1, textAlign: 'right' }}>
            {source || 'Current location'} → {destination || 'Destination'}
          </ThemedText>
        </View>

        <View style={styles.summaryStatsRow}>
          <View style={styles.summaryStat}>
            <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
              {meta.duration}
            </ThemedText>
            <ThemedText variant="caption" color={C.textMuted}>
              ETA
            </ThemedText>
          </View>
          <View style={styles.summaryStat}>
            <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
              {meta.distance}
            </ThemedText>
            <ThemedText variant="caption" color={C.textMuted}>
              Distance
            </ThemedText>
          </View>
          <View style={styles.summaryStat}>
            <ThemedText variant="title" color={meta.accent} style={{ fontWeight: '800' }}>
              {meta.safetyScore}
            </ThemedText>
            <ThemedText variant="caption" color={C.textMuted}>
              Safety Score
            </ThemedText>
          </View>
        </View>

        <Pressable onPress={onEnd} style={styles.endBtn}>
          <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
            End Navigation
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.mapBg },
  closeBtn: {
    position: 'absolute',
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionCard: {
    position: 'absolute',
    left: 16,
    right: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(14,21,38,0.9)',
    borderRadius: 18,
    padding: 12,
  },
  turnIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dotWrap: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  dotPulse: { position: 'absolute', width: 40, height: 40, borderRadius: 20 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: '#FFFFFF' },
  summaryCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  summaryStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryStat: { alignItems: 'center', gap: 2 },
  endBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: C.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NavigationScreen;