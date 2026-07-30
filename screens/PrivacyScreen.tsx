import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle, Rect } from 'react-native-svg';
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
  danger: '#E53935',
  dangerSoft: '#FDECEC',
  inputBg: '#F3F4F8',
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

function ChevronDownIcon({ size = 16, color = C.textMuted, rotated }: { size?: number; color?: string; rotated?: boolean }) {
  return (
    <View style={{ transform: [{ rotate: rotated ? '180deg' : '0deg' }] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

function LockIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={10} width={14} height={10} rx={2} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.7} fill="none" />
    </Svg>
  );
}

function FingerprintIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4a8 8 0 0 1 8 8v2M4 12a8 8 0 0 1 4-6.9M8 20.5A8 8 0 0 1 4 14v-2M12 8a4 4 0 0 1 4 4v3.5M12 8a4 4 0 0 0-4 4v1M12 12v5.5M15 19a10 10 0 0 0 1-4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function PinIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
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

function ShareIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={6} cy={12} r={2.4} stroke={color} strokeWidth={1.7} fill="none" />
      <SvgCircle cx={18} cy={6} r={2.4} stroke={color} strokeWidth={1.7} fill="none" />
      <SvgCircle cx={18} cy={18} r={2.4} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M8.2 10.8L15.8 7.2M8.2 13.2l7.6 3.6" stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}

function UserIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={8} r={3.4} stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function AlertTriangleIcon({ size = 22, color = C.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.5l9.5 16.5H2.5L12 3.5z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" fill="none" />
      <Path d="M12 9.5v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function CheckIcon({ size = 15, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Reusable animation primitives — same pattern used elsewhere.          */
/* ---------------------------------------------------------------------- */

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useEffect(() => {
    const cfg = { duration: 380, easing: Easing.out(Easing.cubic) };
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

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const x = useSharedValue(value ? 18 : 2);
  useEffect(() => {
    x.value = withTiming(value ? 18 : 2, { duration: 180 });
  }, [value]);
  const dotStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <Pressable onPress={() => onChange(!value)} style={[styles.toggleTrack, value && styles.toggleTrackActive]}>
      <Animated.View style={[styles.toggleDot, dotStyle]} />
    </Pressable>
  );
}

/* ---------------------------------------------------------------------- */
/* Reusable section pieces                                               */
/* ---------------------------------------------------------------------- */

function SectionTitle({ children }: { children: string }) {
  return (
    <ThemedText variant="caption" color={C.textMuted} style={styles.sectionTitle}>
      {children.toUpperCase()}
    </ThemedText>
  );
}

function ToggleRow({ label, subtitle, value, onChange, isLast }: { label: string; subtitle?: string; value: boolean; onChange: (v: boolean) => void; isLast?: boolean }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '600' }}>
          {label}
        </ThemedText>
        {subtitle && (
          <ThemedText variant="caption" color={C.textMuted}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  );
}

function SelectorRow({ label, options, value, onChange, isLast }: { label: string; options: string[]; value: string; onChange: (v: string) => void; isLast?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={!isLast ? styles.rowBorder : undefined}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.row}>
        <ThemedText variant="bodySm" color={C.textPrimary} style={{ flex: 1, fontWeight: '600' }}>
          {label}
        </ThemedText>
        <ThemedText variant="caption" color={C.primary} style={{ fontWeight: '700', marginRight: 4 }}>
          {value}
        </ThemedText>
        <ChevronDownIcon rotated={open} />
      </Pressable>
      {open && (
        <View style={styles.chipsWrap}>
          {options.map((opt) => {
            const active = opt === value;
            return (
              <Pressable key={opt} onPress={() => { onChange(opt); setOpen(false); }} style={[styles.chip, active && styles.chipActive]}>
                <ThemedText variant="caption" color={active ? '#FFFFFF' : C.textSecondary} style={{ fontWeight: '700' }}>
                  {opt}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

/* ---------------------------------------------------------------------- */
/* Mock data                                                             */
/* ---------------------------------------------------------------------- */

interface BlockedUser {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

const INITIAL_BLOCKED: BlockedUser[] = [
  { id: 'b1', name: 'Rohit Kumar', initials: 'RK', avatarColor: '#94A3B8' },
  { id: 'b2', name: 'Unknown User', initials: '?', avatarColor: '#94A3B8' },
];

export interface PrivacyScreenProps {
  onBack?: () => void;
  onAccountDeleted?: () => void;
}

/**
 * PrivacyScreen — App Lock, Biometric Login, Location Privacy, Data
 * Sharing, Blocked Users, Delete Account. Light theme matching Home.
 * Dummy/local state only, no backend.
 */
export function PrivacyScreen({ onBack, onAccountDeleted }: PrivacyScreenProps) {
  const insets = useSafeAreaInsets();

  const [appLock, setAppLock] = useState(false);
  const [pin, setPin] = useState('');
  const [biometric, setBiometric] = useState(true);
  const [locationPrivacy, setLocationPrivacy] = useState('While Using App');
  const [dataSharing, setDataSharing] = useState(true);
  const [blocked, setBlocked] = useState<BlockedUser[]>(INITIAL_BLOCKED);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const unblock = (id: string) => setBlocked((prev) => prev.filter((u) => u.id !== id));

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            Privacy
          </ThemedText>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 4 }}>
        {/* Security */}
        <Reveal delay={0}>
          <SectionTitle>Security</SectionTitle>
          <View style={styles.card}>
            <View style={styles.rowBorder}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <LockIcon />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '600' }}>
                    App Lock
                  </ThemedText>
                  <ThemedText variant="caption" color={C.textMuted}>
                    Require a PIN to open the app
                  </ThemedText>
                </View>
                <Toggle value={appLock} onChange={setAppLock} />
              </View>
              {appLock && (
                <View style={styles.expandBody}>
                  <View style={{ gap: 6 }}>
                    <ThemedText variant="caption" color={C.textSecondary} style={{ fontWeight: '700' }}>
                      Set a 4-digit PIN
                    </ThemedText>
                    <TextInput
                      value={pin}
                      onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 4))}
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={4}
                      placeholder="••••"
                      placeholderTextColor={C.textMuted}
                      style={styles.input}
                    />
                    <PressFeedback style={[styles.saveBtn, { marginTop: 8 }]}>
                      <CheckIcon />
                      <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
                        Save PIN
                      </ThemedText>
                    </PressFeedback>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <FingerprintIcon />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '600' }}>
                  Biometric Login
                </ThemedText>
                <ThemedText variant="caption" color={C.textMuted}>
                  Use Face ID / Fingerprint to unlock
                </ThemedText>
              </View>
              <Toggle value={biometric} onChange={setBiometric} />
            </View>
          </View>
        </Reveal>

        {/* Location Privacy */}
        <Reveal delay={60}>
          <SectionTitle>Location Privacy</SectionTitle>
          <View style={styles.card}>
            <SelectorRow
              label="Share My Location"
              options={['Always', 'While Using App', 'Never']}
              value={locationPrivacy}
              onChange={setLocationPrivacy}
              isLast
            />
          </View>
        </Reveal>

        {/* Data Sharing */}
        <Reveal delay={120}>
          <SectionTitle>Data Sharing</SectionTitle>
          <View style={styles.card}>
            <ToggleRow
              label="Share Anonymized Data"
              subtitle="Helps improve safety predictions for everyone"
              value={dataSharing}
              onChange={setDataSharing}
              isLast
            />
          </View>
        </Reveal>

        {/* Blocked Users */}
        <Reveal delay={180}>
          <SectionTitle>Blocked Users</SectionTitle>
          <View style={styles.card}>
            {blocked.length === 0 ? (
              <View style={styles.emptyState}>
                <ThemedText variant="caption" color={C.textMuted}>
                  You haven't blocked anyone.
                </ThemedText>
              </View>
            ) : (
              blocked.map((u, i) => (
                <View key={u.id} style={[styles.row, i < blocked.length - 1 && styles.rowBorder]}>
                  <View style={[styles.avatar, { backgroundColor: u.avatarColor }]}>
                    <UserIcon />
                  </View>
                  <ThemedText variant="bodySm" color={C.textPrimary} style={{ flex: 1, fontWeight: '600' }}>
                    {u.name}
                  </ThemedText>
                  <PressFeedback onPress={() => unblock(u.id)} style={styles.unblockBtn}>
                    <ThemedText variant="caption" color={C.primary} style={{ fontWeight: '700' }}>
                      Unblock
                    </ThemedText>
                  </PressFeedback>
                </View>
              ))
            )}
          </View>
        </Reveal>

        {/* Danger zone */}
        <Reveal delay={240}>
          <SectionTitle>Danger Zone</SectionTitle>
          <View style={[styles.card, styles.dangerCard]}>
            <View style={styles.dangerHeader}>
              <AlertTriangleIcon />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                  Delete Account
                </ThemedText>
                <ThemedText variant="caption" color={C.textMuted}>
                  Permanently deletes your profile, trips, and saved data. This can't be undone.
                </ThemedText>
              </View>
            </View>

            {confirmingDelete ? (
              <View style={{ gap: 10, marginTop: 14 }}>
                <ThemedText variant="caption" color={C.danger} style={{ fontWeight: '700' }}>
                  Are you absolutely sure? This action is permanent.
                </ThemedText>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <PressFeedback onPress={onAccountDeleted} style={[styles.deleteBtn, { flex: 1 }]}>
                    <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
                      Yes, Delete My Account
                    </ThemedText>
                  </PressFeedback>
                  <PressFeedback onPress={() => setConfirmingDelete(false)} style={styles.cancelBtn}>
                    <ThemedText variant="caption" color={C.textSecondary} style={{ fontWeight: '700' }}>
                      Cancel
                    </ThemedText>
                  </PressFeedback>
                </View>
              </View>
            ) : (
              <PressFeedback onPress={() => setConfirmingDelete(true)} style={[styles.deleteBtn, { marginTop: 14 }]}>
                <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
                  Delete Account
                </ThemedText>
              </PressFeedback>
            )}
          </View>
        </Reveal>
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
  sectionTitle: { fontWeight: '700', letterSpacing: 0.5, marginTop: 18, marginBottom: 8, marginLeft: 4 },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  expandBody: { paddingBottom: 16 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E7ECF4',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: { backgroundColor: C.primary },
  toggleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 16 },
  chip: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F3F4F8' },
  chipActive: { backgroundColor: C.primary },
  input: {
    backgroundColor: C.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: C.textPrimary,
    letterSpacing: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.primary,
  },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  unblockBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: C.primarySoft },
  emptyState: { paddingVertical: 20, alignItems: 'center' },
  dangerCard: { borderWidth: 1, borderColor: '#F6D9D9', paddingVertical: 16 },
  dangerHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  deleteBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: C.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F8',
  },
});

export default PrivacyScreen;