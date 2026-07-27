import React, { useState, useCallback } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useAnimatedReaction,
  withTiming,
  withRepeat,
  withDelay,
  withSpring,
  cancelAnimation,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';

/** Modern emergency palette — dark red/black backdrop pre-activation, */
/** light cards for information once activated.                       */
const C = {
  emergencyDark: '#1A0505',
  emergency: '#E53935',
  emergencyBright: '#FF5252',
  card: '#FFFFFF',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  success: '#22C55E',
  successSoft: '#DCFCE7',
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',
  border: '#F1E4E4',
};

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);
const HOLD_MS = 3000;
const RING_SIZE = 236;
const STROKE = 10;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* ---------------------------------------------------------------------- */
/* Inline icons — self-contained, no dependency on the shared Icon set.   */
/* ---------------------------------------------------------------------- */

function AlertIcon({ size = 64, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.5l9.5 16.5H2.5L12 3.5z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" fill="none" />
      <Path d="M12 9.5v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function CloseIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 22, color = C.success }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={10} fill={color} opacity={0.15} />
      <Path d="M7.5 12.5l3 3 6-6.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MessageIcon({ size = 20, color = C.success }: { size?: number; color?: string }) {
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

function PinIcon({ size = 20, color = C.success }: { size?: number; color?: string }) {
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

function PhoneIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2z"
        fill={color}
      />
    </Svg>
  );
}

function ShieldIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z" fill={color} opacity={0.95} />
    </Svg>
  );
}

function HospitalCrossIcon({ size = 18, color = C.emergency }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

function UserIcon({ size = 18, color = C.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={8} r={3.4} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" stroke={color} strokeWidth={1.7} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Mock data — no backend                                                */
/* ---------------------------------------------------------------------- */

const EMERGENCY_CONTACTS = [
  { id: 'c1', name: 'Mom', relation: 'Mother' },
  { id: 'c2', name: 'Rahul Sharma', relation: 'Brother' },
  { id: 'c3', name: 'Priya Verma', relation: 'Friend' },
];

const NEAREST_POLICE = { name: 'Vidhayak Nagar Police Station', distance: '1.2 km away' };
const NEAREST_HOSPITAL = { name: 'City Care Hospital', distance: '1.8 km away' };

/* ---------------------------------------------------------------------- */

function StatusRow({ icon, title, subtitle, delay }: { icon: React.ReactNode; title: string; subtitle: string; delay: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-12);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.statusRow, style]}>
      {icon}
      <View style={{ flex: 1 }}>
        <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
          {title}
        </ThemedText>
        <ThemedText variant="caption" color={C.textSecondary}>
          {subtitle}
        </ThemedText>
      </View>
    </Animated.View>
  );
}

export interface SOSScreenProps {
  onClose?: () => void;
}

/**
 * SOSScreen — hold-to-activate emergency flow.
 * Idle: large circular button, hold 3s (animated progress ring) to trigger.
 * Activated: SMS/location status, emergency contacts, nearest police &
 * hospital with call actions. No backend — everything is dummy/UI only.
 */
export function SOSScreen({ onClose }: SOSScreenProps) {
  const insets = useSafeAreaInsets();
  const [activated, setActivated] = useState(false);

  const progress = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const ambientPulse = useSharedValue(1);

  React.useEffect(() => {
    ambientPulse.value = withRepeat(withTiming(1.12, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const activate = useCallback(() => setActivated(true), []);

  const onPressIn = () => {
    buttonScale.value = withTiming(1.05, { duration: 150 });
    progress.value = withTiming(100, { duration: HOLD_MS, easing: Easing.linear });
  };

  const onPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 150 });
    if (progress.value < 100) {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 250 });
    }
  };

  useAnimatedReaction(
    () => progress.value,
    (value, prev) => {
      if (value >= 100 && (prev ?? 0) < 100) {
        runOnJS(activate)();
      }
    },
  );

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - (CIRCUMFERENCE * progress.value) / 100,
  }));
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value * (progress.value === 0 ? ambientPulse.value : 1) }],
  }));

  const reset = () => {
    setActivated(false);
    progress.value = 0;
  };

  if (activated) {
    return (
      <View style={styles.activatedRoot}>
        <LinearGradient colors={[C.emergency, '#B71C1C']} style={{ paddingTop: insets.top }}>
          <View style={styles.activatedHeader}>
            <View>
              <ThemedText variant="title" color="#FFFFFF" style={{ fontSize: 22, fontWeight: '800' }}>
                SOS Activated
              </ThemedText>
              <ThemedText variant="caption" color="rgba(255,255,255,0.85)">
                Alert sent just now
              </ThemedText>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <CloseIcon />
            </Pressable>
          </View>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: insets.bottom + 24 }}
        >
          <View style={styles.card}>
            <StatusRow icon={<CheckCircleIcon />} title="Emergency SMS Sent" subtitle="Delivered to 3 emergency contacts" delay={80} />
            <StatusRow icon={<CheckCircleIcon />} title="Live Location Shared" subtitle="Updating every 30 seconds" delay={180} />
          </View>

          <View style={styles.card}>
            <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700', marginBottom: 10 }}>
              Emergency Contacts
            </ThemedText>
            {EMERGENCY_CONTACTS.map((c) => (
              <View key={c.id} style={styles.contactRow}>
                <View style={styles.contactAvatar}>
                  <UserIcon />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '600' }}>
                    {c.name}
                  </ThemedText>
                  <ThemedText variant="caption" color={C.textMuted}>
                    {c.relation}
                  </ThemedText>
                </View>
                <Pressable style={styles.smallCallBtn}>
                  <PhoneIcon color={C.success} size={15} />
                </Pressable>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.serviceRow}>
              <View style={[styles.serviceIconWrap, { backgroundColor: C.primarySoft }]}>
                <ShieldIcon />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '700' }}>
                  {NEAREST_POLICE.name}
                </ThemedText>
                <ThemedText variant="caption" color={C.textMuted}>
                  Nearest Police Station • {NEAREST_POLICE.distance}
                </ThemedText>
              </View>
            </View>
            <Pressable style={[styles.callBtn, { backgroundColor: C.primary }]}>
              <PhoneIcon />
              <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
                Call Police
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.serviceRow}>
              <View style={[styles.serviceIconWrap, { backgroundColor: '#FDEDED' }]}>
                <HospitalCrossIcon />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '700' }}>
                  {NEAREST_HOSPITAL.name}
                </ThemedText>
                <ThemedText variant="caption" color={C.textMuted}>
                  Nearest Hospital • {NEAREST_HOSPITAL.distance}
                </ThemedText>
              </View>
            </View>
            <Pressable style={[styles.callBtn, { backgroundColor: C.emergency }]}>
              <PhoneIcon />
              <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
                Call Hospital
              </ThemedText>
            </Pressable>
          </View>

          <Pressable onPress={reset} style={styles.safeBtn}>
            <ThemedText variant="label" color={C.emergency} style={{ fontWeight: '700' }}>
              I'm Safe — Cancel SOS
            </ThemedText>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <LinearGradient colors={[C.emergencyDark, '#3B0A0A']} style={styles.idleRoot}>
      <View style={{ paddingTop: insets.top }}>
        <Pressable onPress={onClose} hitSlop={10} style={styles.idleCloseBtn}>
          <CloseIcon />
        </Pressable>
      </View>

      <View style={styles.idleCenter}>
        <ThemedText variant="title" color="#FFFFFF" style={{ fontSize: 22, fontWeight: '800', marginBottom: 8 }}>
          Emergency SOS
        </ThemedText>
        <ThemedText variant="bodySm" color="rgba(255,255,255,0.65)" style={{ textAlign: 'center', marginBottom: 36, maxWidth: 260 }}>
          Press and hold the button for 3 seconds to alert your emergency contacts and nearby services.
        </ThemedText>

        <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
            <SvgCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={C.emergencyBright}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={ringProps}
            />
          </Svg>

          <Animated.View style={buttonStyle}>
            <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={styles.sosButton}>
              <AlertIcon />
              <ThemedText variant="title" color="#FFFFFF" style={{ fontSize: 26, fontWeight: '800', marginTop: 6 }}>
                SOS
              </ThemedText>
            </Pressable>
          </Animated.View>
        </View>

        <ThemedText variant="caption" color="rgba(255,255,255,0.5)" style={{ marginTop: 32 }}>
          Hold for 3 seconds
        </ThemedText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  idleRoot: { flex: 1 },
  idleCloseBtn: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  sosButton: {
    width: RING_SIZE - STROKE * 3,
    height: RING_SIZE - STROKE * 3,
    borderRadius: (RING_SIZE - STROKE * 3) / 2,
    backgroundColor: C.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.emergencyBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  },
  activatedRoot: { flex: 1, backgroundColor: '#F7F8FC' },
  activatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  contactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallCallBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 12,
  },
  safeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.emergency,
    marginTop: 4,
  },
});

export default SOSScreen;