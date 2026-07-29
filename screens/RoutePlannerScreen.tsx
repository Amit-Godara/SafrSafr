import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';

const C = {
  page: '#F7F8FC',
  card: '#FFFFFF',
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  border: '#E7ECF4',
  safe: '#22C55E',
  safeSoft: '#DCFCE7',
  fast: '#F59E0B',
  fastSoft: '#FEF3C7',
  short: '#8B5CF6',
  shortSoft: '#F3E8FF',
};

/* ---------------------------------------------------------------------- */
/* Inline icons                                                          */
/* ---------------------------------------------------------------------- */

function ChevronLeftIcon({ size = 22, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CrosshairIcon({ size = 15, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={5} stroke={color} strokeWidth={1.9} fill="none" />
      <Line x1={12} y1={2} x2={12} y2={6} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Line x1={12} y1={18} x2={12} y2={22} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Line x1={2} y1={12} x2={6} y2={12} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Line x1={18} y1={12} x2={22} y2={12} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function PinIcon({ size = 15, color = '#E53935' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11z"
        stroke={color}
        strokeWidth={1.9}
        fill="none"
      />
      <SvgCircle cx={12} cy={10} r={2.2} stroke={color} strokeWidth={1.9} fill="none" />
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

function BoltIcon({ size = 14, color = C.fast }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={color} />
    </Svg>
  );
}

function CompassIcon({ size = 14, color = C.short }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M15 9l-2 6-4-2 2-6 4 2z" fill={color} />
    </Svg>
  );
}

function ClockIcon({ size = 13, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M12 7v5l3.5 2" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function RulerIcon({ size = 13, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 15l5-5 3 3 8-8M13 3l3 0 0 3M15 12l0 3-3 0"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function StarIcon({ size = 12, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.6 6.8L12 17l-6.2 3.5 1.6-6.8-5.2-4.7 6.9-.7L12 2z" fill={color} />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Reusable local animation primitives                                   */
/* ---------------------------------------------------------------------- */

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    const cfg = { duration: 420, easing: Easing.out(Easing.cubic) };
    opacity.value = withDelay(delay, withTiming(1, cfg));
    translateY.value = withDelay(delay, withTiming(0, cfg));
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

function PressFeedback({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: any }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 16, stiffness: 320 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 14, stiffness: 260 }))}
      android_ripple={{ color: 'rgba(16,24,40,0.06)' }}
      style={[style, animStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

/* ---------------------------------------------------------------------- */
/* Mock route data — no backend                                          */
/* ---------------------------------------------------------------------- */

export type RouteType = 'safest' | 'fastest' | 'shortest';

interface RouteOption {
  type: RouteType;
  label: string;
  distance: string;
  duration: string;
  safetyScore: number;
  recommended: boolean;
  accent: string;
  accentSoft: string;
  icon: (props: { size?: number; color?: string }) => React.ReactElement;
}

const ROUTE_OPTIONS: RouteOption[] = [
  {
    type: 'safest',
    label: 'Safest Route',
    distance: '5.2 km',
    duration: '18 min',
    safetyScore: 92,
    recommended: true,
    accent: C.safe,
    accentSoft: C.safeSoft,
    icon: ShieldIcon,
  },
  {
    type: 'fastest',
    label: 'Fastest Route',
    distance: '4.6 km',
    duration: '13 min',
    safetyScore: 68,
    recommended: false,
    accent: C.fast,
    accentSoft: C.fastSoft,
    icon: BoltIcon,
  },
  {
    type: 'shortest',
    label: 'Shortest Route',
    distance: '4.1 km',
    duration: '15 min',
    safetyScore: 74,
    recommended: false,
    accent: C.short,
    accentSoft: C.shortSoft,
    icon: CompassIcon,
  },
];

function MapPreview({ accent }: { accent: string }) {
  return (
    <Svg width="100%" height={72} viewBox="0 0 300 72">
      <Line x1={0} y1={12} x2={300} y2={12} stroke="#EEF0F5" strokeWidth={1} />
      <Line x1={0} y1={36} x2={300} y2={36} stroke="#EEF0F5" strokeWidth={1} />
      <Line x1={0} y1={60} x2={300} y2={60} stroke="#EEF0F5" strokeWidth={1} />
      <Path
        d="M20,58 C 80,58 70,14 140,20 S 240,50 280,14"
        stroke={accent}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
        strokeDasharray="1 9"
      />
      <SvgCircle cx={20} cy={58} r={5} fill={accent} />
      <SvgCircle cx={280} cy={14} r={5} fill="#E53935" />
    </Svg>
  );
}

function RouteCard({ option, delay, onViewRoute }: { option: RouteOption; delay: number; onViewRoute: () => void }) {
  const Icon = option.icon;
  const scoreColor = option.safetyScore >= 80 ? C.safe : option.safetyScore >= 60 ? C.fast : '#E53935';

  return (
    <Reveal delay={delay}>
      <View style={styles.routeCard}>
        {option.recommended && (
          <View style={styles.recommendedBadge}>
            <StarIcon />
            <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
              Recommended
            </ThemedText>
          </View>
        )}

        <View style={styles.routeHeaderRow}>
          <View style={[styles.routeIconWrap, { backgroundColor: option.accentSoft }]}>
            <Icon color={option.accent} />
          </View>
          <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
            {option.label}
          </ThemedText>
        </View>

        <View style={styles.mapPreviewWrap}>
          <MapPreview accent={option.accent} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <RulerIcon />
            <ThemedText variant="caption" color={C.textSecondary} style={{ fontWeight: '600' }}>
              {option.distance}
            </ThemedText>
          </View>
          <View style={styles.statChip}>
            <ClockIcon />
            <ThemedText variant="caption" color={C.textSecondary} style={{ fontWeight: '600' }}>
              {option.duration}
            </ThemedText>
          </View>
          <View style={[styles.statChip, { backgroundColor: `${scoreColor}1A` }]}>
            <ShieldIcon color={scoreColor} />
            <ThemedText variant="caption" color={scoreColor} style={{ fontWeight: '700' }}>
              {option.safetyScore}/100
            </ThemedText>
          </View>
        </View>

        <PressFeedback onPress={onViewRoute} style={[styles.viewRouteBtn, { backgroundColor: option.accent }]}>
          <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
            View Route
          </ThemedText>
        </PressFeedback>
      </View>
    </Reveal>
  );
}

export interface RoutePlannerScreenProps {
  onBack?: () => void;
  onViewRoute?: (type: RouteType, source: string, destination: string) => void;
}

/**
 * RoutePlannerScreen — enter source/destination, see three dummy route
 * options (Safest/Fastest/Shortest) with mock stats and map previews.
 * Same light theme + animation language as Home. No backend.
 */
export function RoutePlannerScreen({ onBack, onViewRoute }: RoutePlannerScreenProps) {
  const insets = useSafeAreaInsets();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [searched, setSearched] = useState(false);

  const canSearch = source.trim().length > 0 && destination.trim().length > 0;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            Plan a Route
          </ThemedText>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: insets.bottom + 24 }}>
        <View style={styles.inputsCard}>
          <View style={styles.inputRow}>
            <View style={styles.dotSource} />
            <TextInput
              value={source}
              onChangeText={setSource}
              placeholder="Source"
              placeholderTextColor={C.textMuted}
              style={styles.input}
            />
          </View>
          <View style={styles.connectorLine} />
          <View style={styles.inputRow}>
            <PinIcon />
            <TextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="Destination"
              placeholderTextColor={C.textMuted}
              style={styles.input}
            />
          </View>

          <Pressable onPress={() => setSource('Your Current Location')} style={styles.currentLocChip}>
            <CrosshairIcon />
            <ThemedText variant="caption" color={C.primary} style={{ fontWeight: '700' }}>
              Use current location
            </ThemedText>
          </Pressable>

          <PressFeedback
            onPress={() => canSearch && setSearched(true)}
            style={[styles.findBtn, !canSearch && styles.findBtnDisabled]}
          >
            <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
              Find Routes
            </ThemedText>
          </PressFeedback>
        </View>

        {searched &&
          ROUTE_OPTIONS.map((opt, i) => (
            <RouteCard
              key={opt.type}
              option={opt}
              delay={i * 100}
              onViewRoute={() => onViewRoute?.(opt.type, source, destination)}
            />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  header: {
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputsCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dotSource: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.primary, marginHorizontal: 2.5 },
  connectorLine: { width: 1.5, height: 14, backgroundColor: C.border, marginLeft: 6.5 },
  input: { flex: 1, fontSize: 15, color: C.textPrimary, paddingVertical: 6 },
  currentLocChip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  findBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  findBtnDisabled: { backgroundColor: '#B7C3EF' },
  routeCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: C.safe,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: -2,
  },
  routeHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  mapPreviewWrap: { borderRadius: 14, overflow: 'hidden', backgroundColor: '#FAFBFC' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F3F4F8',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewRouteBtn: { height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

export default RoutePlannerScreen;