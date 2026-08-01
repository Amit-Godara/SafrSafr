import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';
import { useNotifications } from '../contexts/NotificationsContext';

/**
 * Local "Guardian" palette for this screen only. Deliberately not pulled
 * from constants/lightTheme.ts (the purple palette used by the Safety
 * Score / AI Assistant screens) — this Home redesign uses its own blue +
 * red brand direction per the latest mockup.
 */
const C = {
  // Background
  page: '#F7F8FC',

  // Cards
  card: '#FFFFFF',

  // Primary Blue
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',

  // Text
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',

  // Grey Card
  reportBg: '#F4F6FB',

  // SOS
  emergency: '#ff0008',
  emergencyDark: '#ff000d',

  // Border
  border: '#E7ECF4',

  // Bottom Navigation
  navInactive: '#8D96B5',
  navActive: '#3A63F3',
};

/* ======================================================================= */
/* Reusable animation primitives — every card/button/entrance in this file */
/* is built from these few hooks/components so animation logic isn't      */
/* duplicated per section.                                                */
/* ======================================================================= */

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * useOscillate — a value that continuously ping-pongs between min and max
 * forever. Powers breathing, floating, pulsing, and glow effects; each
 * call site just decides how to apply the value (scale, translateY,
 * opacity, translateX...).
 */
function useOscillate(min: number, max: number, duration: number, delay = 0) {
  const value = useSharedValue(min);
  useEffect(() => {
    value.value = withDelay(
      delay,
      withRepeat(withTiming(max, { duration, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
  }, []);
  return value;
}

/**
 * Reveal — staggered entrance animation (fade + translateY + optional
 * scale). Used for every section's "appear" animation with an 80ms
 * stagger between sections, per the screen-opening spec.
 */
function Reveal({
  children,
  delay = 0,
  from = 20,
  withScale = false,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: number;
  withScale?: boolean;
  style?: any;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(from);
  const scale = useSharedValue(withScale ? 0.95 : 1);

  useEffect(() => {
    const cfg = { duration: 500, easing: Easing.out(Easing.cubic) };
    opacity.value = withDelay(delay, withTiming(1, cfg));
    translateY.value = withDelay(delay, withTiming(0, cfg));
    if (withScale) scale.value = withDelay(delay, withTiming(1, cfg));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/**
 * PressFeedback — wraps any pressable card/button with a scale-down (and
 * optional shadow-lift) response on press, plus native ripple on Android.
 * This single component covers "every white card" / "every button" press
 * behavior (spec items #12 and #20).
 */
function PressFeedback({
  children,
  onPress,
  style,
  pressScale = 0.97,
  liftShadow = false,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  pressScale?: number;
  liftShadow?: boolean;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const shadow = useSharedValue(0.06);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    ...(liftShadow
      ? { shadowOpacity: shadow.value, elevation: 2 + shadow.value * 55 }
      : null),
  }));

  const onPressIn = () => {
    scale.value = withSpring(pressScale, { damping: 16, stiffness: 320 });
    if (liftShadow) shadow.value = withTiming(0.18, { duration: 150 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 260 });
    if (liftShadow) shadow.value = withTiming(0.06, { duration: 220 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      android_ripple={{ color: 'rgba(16,24,40,0.06)' }}
      style={[style, animStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

/** CountUp — animates a number from 0 to `target` once, on mount. */
function useCountUp(target: number, duration = 900, delay = 0) {
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(target, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [target]);

  useAnimatedReaction(
    () => progress.value,
    (value) => runOnJS(setDisplay)(Math.round(value)),
  );

  return display;
}

/* ---------------------------------------------------------------------- */
/* Inline icons — self-contained SVGs so this file has zero dependency on */
/* the shared Icon component's registered name set.                      */
/* ---------------------------------------------------------------------- */

function ShieldCheckIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z"
        fill={color}
        opacity={0.95}
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke="#2F6FED"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BellIcon({ size = 20, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a5 5 0 0 0-5 5v3.2c0 .6-.2 1.2-.6 1.7L5 15.5h14l-1.4-2.6a2.8 2.8 0 0 1-.6-1.7V8a5 5 0 0 0-5-5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function SettingsIcon({ size = 20, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} fill="none" />
      <Path
        d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4.5a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10.7A1.7 1.7 0 0 0 11.7 4.5V4.5a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10.7c.2.6.7 1 1.3 1.1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function PinIcon({ size = 14, color = C.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11z"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
      />
      <SvgCircle cx={12} cy={10} r={2.2} stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

function AlertTriangleIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5l9.5 16.5H2.5L12 3.5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M12 9.5v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function MapIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4.5L4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M9 4.5v13M15 6.5v13" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function ChatIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5.5h16v10H9l-4 3.5v-3.5H4v-10z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function LightbulbIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18h6M10 21h4M8 10a4 4 0 1 1 8 0c0 1.8-1 2.7-1.7 3.6-.5.6-.8 1-.8 1.9H10.5c0-.9-.3-1.3-.8-1.9C9 12.7 8 11.8 8 10z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Section-specific animated widgets                                     */
/* ---------------------------------------------------------------------- */

/** Bell icon: idle shake every 12s + bounce on press. */
function AnimatedBell({ onPress }: { onPress?: () => void }) {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const shake = () => {
      rotate.value = withSequence(
        withTiming(-10, { duration: 90 }),
        withTiming(10, { duration: 140 }),
        withTiming(-6, { duration: 110 }),
        withTiming(6, { duration: 100 }),
        withTiming(0, { duration: 110 }),
      );
    };
    const interval = setInterval(shake, 12000);
    return () => clearInterval(interval);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 90 }),
      withTiming(1.05, { duration: 110 }),
      withTiming(1, { duration: 100 }),
    );
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} hitSlop={10} style={styles.iconBtn}>
      <Animated.View style={style}>
        <BellIcon />
      </Animated.View>
    </Pressable>
  );
}

/** Settings icon: press scale + slight rotation. */
function AnimatedSettings({ onPress }: { onPress?: () => void }) {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
  }));

  const onPressIn = () => {
    rotate.value = withTiming(15, { duration: 125 });
    scale.value = withTiming(0.9, { duration: 125 });
  };
  const onPressOut = () => {
    rotate.value = withTiming(0, { duration: 125 });
    scale.value = withTiming(1, { duration: 125 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={10}
      style={styles.iconBtn}
    >
      <Animated.View style={style}>
        <SettingsIcon />
      </Animated.View>
    </Pressable>
  );
}

/** The "Good" safety status word: fade + scale + color settle on mount. */
function SafetyStatusWord({ text, delay }: { text: string; delay: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));
    scale.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.4)) }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <ThemedText variant="bodySm" color={C.primary} style={{ fontWeight: '700' }}>
        {text}
      </ThemedText>
    </Animated.View>
  );
}

/** Continuous "breathing" wrapper for the SOS card. */
function Breathing({ children, style }: { children: React.ReactNode; style?: any }) {
  const scale = useOscillate(1, 1.015, 1250);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/** Continuous pulse for the SOS alert icon. */
function PulseIcon({ children, style }: { children: React.ReactNode; style?: any }) {
  const scale = useOscillate(1, 1.15, 1000);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/** Continuous gentle float for the AI Agent card. */
function Floating({ children, style }: { children: React.ReactNode; style?: any }) {
  const translateY = useOscillate(0, -4, 1400);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/** Continuous glow for the lightbulb icon. */
function Glow({ children, style }: { children: React.ReactNode; style?: any }) {
  const opacity = useOscillate(0.8, 1, 1500);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

/** Looping horizontal nudge for the "Plan a route" arrow. */
function ArrowLoop() {
  const translateX = useOscillate(0, 5, 750);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  return (
    <Animated.View style={style}>
      <ChevronRightIcon size={13} />
    </Animated.View>
  );
}

/* ======================================================================= */

/** Dummy status data (no backend). */
const LOCATION = 'Delhi';
const SAFETY_STATUS = 'Good';
const NEARBY_TRAVELERS_COUNT = 24;
const LATEST_REPORT = 'Reports of heavy crowd at Market St';

export interface HomeScreenProps {
  onActivateSOS?: () => void;
  onAIAgentPress?: () => void;
  onPlanRoute?: () => void;
  onNearbyTravelersPress?: () => void;
  onNotificationsPress?: () => void;
  onSettingsPress?: () => void;
}

/**
 * HomeScreen — "Guardian" dashboard redesign with a full micro-interaction
 * pass: staggered entrance, breathing/floating/pulsing idle animations,
 * and press-scale + shadow-lift feedback on every card and button.
 * Dummy data only, no backend.
 */
export function HomeScreen({
  onActivateSOS,
  onAIAgentPress,
  onPlanRoute,
  onNearbyTravelersPress,
  onNotificationsPress,
  onSettingsPress,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { hasUnread } = useNotifications();
  const travelersCount = useCountUp(NEARBY_TRAVELERS_COUNT, 900, 400);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          gap: 16,
        }}
      >
        {/* Header — fade in + slide down + slight scale */}
        <Reveal delay={0} from={-12} withScale>
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <ShieldCheckIcon size={20} />
              </View>
              <ThemedText variant="title" color={C.textPrimary} style={styles.brandText}>
                Amit
              </ThemedText>
            </View>

            <View style={styles.headerActions}>
              <View>
                <AnimatedBell onPress={onNotificationsPress} />
                {hasUnread && <View style={styles.notifDot} />}
              </View>
              <AnimatedSettings onPress={onSettingsPress} />
            </View>
          </View>
        </Reveal>

        {/* Location + status */}
        <Reveal delay={80}>
          <View style={{ gap: 4 }}>
            <View style={styles.locRow}>
              <PinIcon />
              <ThemedText variant="caption" color={C.textSecondary}>
                Current location
              </ThemedText>
            </View>
            <ThemedText variant="title" color={C.textPrimary} style={styles.locationText}>
              {LOCATION}
            </ThemedText>
            <View style={styles.statusRow}>
              <ThemedText variant="bodySm" color={C.textSecondary}>
                Safety around you is{' '}
              </ThemedText>
              <SafetyStatusWord text={SAFETY_STATUS} delay={260} />
            </View>
          </View>
        </Reveal>

        {/* Smart SOS banner — continuous breathing + icon pulse + press scale */}
        <Reveal delay={160}>
          <Breathing>
            <LinearGradient
              colors={['#ff0000', '#fd0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sosCard}
            >
              <View style={styles.sosTopRow}>
                <PulseIcon style={styles.sosIconWrap}>
                  <AlertTriangleIcon size={18} />
                </PulseIcon>
                <ThemedText variant="caption" color="#FFFFFF" style={styles.sosLabel}>
                  EMERGENCY
                </ThemedText>
              </View>

              <ThemedText variant="title" color="#FFFFFF" style={styles.sosTitle}>
                Smart SOS
              </ThemedText>
              <ThemedText variant="bodySm" color="rgba(255,255,255,0.9)" style={{ marginBottom: 16 }}>
                One tap to alert emergency contacts and services.
              </ThemedText>

              <PressFeedback onPress={onActivateSOS} pressScale={0.94} liftShadow style={styles.sosBtnWrap}>
                <ThemedText
                  variant="label"
                  color="rgb(255, 0, 0)"
                  style={{
                    fontWeight: '700',
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  Activate SOS
                </ThemedText>
              </PressFeedback>
            </LinearGradient>
          </Breathing>
        </Reveal>

        {/* AI Agent / Smart Route */}
        <View style={styles.grid}>
          <Reveal delay={240} style={styles.gridItem}>
            <Floating>
              <PressFeedback onPress={onAIAgentPress} liftShadow style={styles.card}>
                <View style={styles.cardIconWrap}>
                  <ShieldCheckIcon size={18} color={C.primary} />
                </View>
                <ThemedText variant="label" color={C.textPrimary} style={styles.cardTitle}>
                  AI Agent
                </ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>
                  Predicts safety score for any location
                </ThemedText>
              </PressFeedback>
            </Floating>
          </Reveal>

          <Reveal delay={320} style={styles.gridItem}>
            <PressFeedback liftShadow style={styles.card}>
              <View style={styles.cardIconWrap}>
                <MapIcon size={18} />
              </View>
              <ThemedText variant="label" color={C.textPrimary} style={styles.cardTitle}>
                Smart Route
              </ThemedText>
              <ThemedText variant="caption" color={C.textSecondary}>
                Safest path, not just shortest
              </ThemedText>
              <Pressable onPress={onPlanRoute} style={styles.planRouteRow}>
                <ThemedText variant="caption" color={C.primary} style={{ fontWeight: '700' }}>
                  Plan a route
                </ThemedText>
                <ArrowLoop />
              </Pressable>
            </PressFeedback>
          </Reveal>
        </View>

        {/* Nearby Travelers */}
        <Reveal delay={400}>
          <PressFeedback onPress={onNearbyTravelersPress} liftShadow style={styles.card}>
            <View style={styles.travelersRow}>
              <View style={styles.cardIconWrap}>
                <ChatIcon size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" color={C.textPrimary} style={styles.cardTitle}>
                  Nearby Travelers
                </ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>
                  {travelersCount} travelers nearby
                </ThemedText>
              </View>
              <View style={styles.chevronBtn}>
                <ChevronRightIcon size={16} />
              </View>
            </View>

            <Reveal delay={480} from={10}>
              <View style={styles.reportBox}>
                <ThemedText variant="caption" color={C.textSecondary}>
                  "{LATEST_REPORT}"
                </ThemedText>
              </View>
            </Reveal>
          </PressFeedback>
        </Reveal>

        {/* Precautions */}
        <Reveal delay={480}>
          <PressFeedback style={[styles.card, styles.precautionsRow]}>
            <Glow style={styles.cardIconWrap}>
              <LightbulbIcon size={18} />
            </Glow>
            <View style={{ flex: 1 }}>
              <ThemedText variant="label" color={C.textPrimary} style={styles.cardTitle}>
                Precautions for tonight
              </ThemedText>
              <ThemedText variant="caption" color={C.textSecondary}>
                Stay alert and keep your phone charged.
              </ThemedText>
            </View>
          </PressFeedback>
        </Reveal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontSize: 25, fontWeight: '800' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  notifDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.primary,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 26, fontWeight: '800' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  sosCard: { borderRadius: 24, padding: 22 },
  sosTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sosIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosLabel: { fontWeight: '700', letterSpacing: 1 },
  sosTitle: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  sosBtnWrap: { alignSelf: 'stretch', borderRadius: 12 },
  grid: { flexDirection: 'row', gap: 12 },
  gridItem: { flex: 1 },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    gap: 6,
    shadowColor: '#27338e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 14,
    elevation: 2,
  },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: '700' },
  planRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  travelersRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportBox: {
    marginTop: 14,
    backgroundColor: C.reportBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  precautionsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});

export default HomeScreen;