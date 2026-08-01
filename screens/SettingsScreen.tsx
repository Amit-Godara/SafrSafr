import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
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
  safe: '#22C55E',
  fast: '#F59E0B',
  short: '#8B5CF6',
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

function LogoutIcon({ size = 18, color = C.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l5 4-5 4M21 12H9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function AlertTriangleIcon({ size = 26, color = C.danger }: { size?: number; color?: string }) {
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

function ShieldIcon({ size = 16, color = C.safe }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z" fill={color} opacity={0.95} />
    </Svg>
  );
}

function BoltIcon({ size = 16, color = C.fast }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={color} />
    </Svg>
  );
}

function CompassIcon({ size = 16, color = C.short }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M15 9l-2 6-4-2 2-6 4 2z" fill={color} />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Reusable animation primitives                                         */
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

/** Custom toggle switch — small sliding pill, matches the app's style. */
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

function ExpandableRow({ label, isLast, children }: { label: string; isLast?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={!isLast ? styles.rowBorder : undefined}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.row}>
        <ThemedText variant="bodySm" color={C.textPrimary} style={{ flex: 1, fontWeight: '600' }}>
          {label}
        </ThemedText>
        <ChevronDownIcon rotated={open} />
      </Pressable>
      {open && <View style={styles.expandBody}>{children}</View>}
    </View>
  );
}

function RouteOptionRow({ icon, label, selected, accent, onSelect }: { icon: React.ReactNode; label: string; selected: boolean; accent: string; onSelect: () => void }) {
  return (
    <Pressable onPress={onSelect} style={styles.routeOptionRow}>
      <View style={[styles.routeIconWrap, { backgroundColor: `${accent}1A` }]}>{icon}</View>
      <ThemedText variant="bodySm" color={C.textPrimary} style={{ flex: 1, fontWeight: '600' }}>
        {label}
      </ThemedText>
      <View style={[styles.radioOuter, selected && { borderColor: accent }]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: accent }]} />}
      </View>
    </Pressable>
  );
}

/* ---------------------------------------------------------------------- */

export interface SettingsScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

/**
 * SettingsScreen — Account, App Preferences, AI Preferences, Route
 * Preferences, Location. Light theme matching Home. Dummy/local state
 * only, no backend.
 *
 * Note: "Dark Mode" is included as a UI toggle per spec, but the app's
 * theme is intentionally locked to light throughout — the toggle updates
 * local state only and doesn't switch the app's actual theme.
 */
export function SettingsScreen({ onBack, onLogout }: SettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout?.();
  };

  // Account
  const [name, setName] = useState('Amit Sharma');
  const [email, setEmail] = useState('amit.sharma@email.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // App preferences
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);

  // AI preferences
  const [saveChatHistory, setSaveChatHistory] = useState(true);
  const [responseStyle, setResponseStyle] = useState('Concise');

  // Route preference
  const [defaultRoute, setDefaultRoute] = useState<'safest' | 'fastest' | 'shortest'>('safest');

  // Location
  const [backgroundLocation, setBackgroundLocation] = useState(true);
  const [locationAccuracy, setLocationAccuracy] = useState('High');

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            Settings
          </ThemedText>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 4 }}>
        {/* Account */}
        <Reveal delay={0}>
          <SectionTitle>Account</SectionTitle>
          <View style={styles.card}>
            <ExpandableRow label="Edit Profile">
              <View style={{ gap: 10 }}>
                <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={C.textMuted} style={styles.input} />
                <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={C.textMuted} style={styles.input} />
                <PressFeedback style={styles.saveBtn}>
                  <CheckIcon />
                  <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>Save Changes</ThemedText>
                </PressFeedback>
              </View>
            </ExpandableRow>

            <ExpandableRow label="Change Password">
              <View style={{ gap: 10 }}>
                <TextInput value={currentPassword} onChangeText={setCurrentPassword} placeholder="Current password" placeholderTextColor={C.textMuted} secureTextEntry style={styles.input} />
                <TextInput value={newPassword} onChangeText={setNewPassword} placeholder="New password" placeholderTextColor={C.textMuted} secureTextEntry style={styles.input} />
                <PressFeedback style={styles.saveBtn}>
                  <CheckIcon />
                  <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>Update Password</ThemedText>
                </PressFeedback>
              </View>
            </ExpandableRow>

            <ExpandableRow label="Change Email">
              <View style={{ gap: 10 }}>
                <TextInput value={newEmail} onChangeText={setNewEmail} placeholder="New email address" placeholderTextColor={C.textMuted} style={styles.input} />
                <PressFeedback style={styles.saveBtn}>
                  <CheckIcon />
                  <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>Update Email</ThemedText>
                </PressFeedback>
              </View>
            </ExpandableRow>

            <Pressable onPress={() => setShowLogoutConfirm(true)} style={styles.row}>
              <View style={styles.logoutIconWrap}>
                <LogoutIcon />
              </View>
              <ThemedText variant="bodySm" color={C.danger} style={{ fontWeight: '700' }}>
                Logout
              </ThemedText>
            </Pressable>
          </View>
        </Reveal>

        {/* App Preferences */}
        <Reveal delay={60}>
          <SectionTitle>App Preferences</SectionTitle>
          <View style={styles.card}>
            <ToggleRow label="Dark Mode" subtitle="App theme is currently light" value={darkMode} onChange={setDarkMode} />
            <SelectorRow label="Language" options={['English', 'Hindi', 'Spanish', 'French']} value={language} onChange={setLanguage} />
            <ToggleRow label="Notifications" subtitle="Alerts, updates & reminders" value={notifications} onChange={setNotifications} isLast />
          </View>
        </Reveal>

        {/* AI Preferences */}
        <Reveal delay={120}>
          <SectionTitle>AI Preferences</SectionTitle>
          <View style={styles.card}>
            <ToggleRow label="Save AI Chat History" subtitle="Keep past conversations with the AI Agent" value={saveChatHistory} onChange={setSaveChatHistory} />
            <SelectorRow label="AI Response Style" options={['Concise', 'Detailed', 'Friendly']} value={responseStyle} onChange={setResponseStyle} isLast />
          </View>
        </Reveal>

        {/* Route Preferences */}
        <Reveal delay={180}>
          <SectionTitle>Route Preferences</SectionTitle>
          <View style={styles.card}>
            <RouteOptionRow icon={<ShieldIcon />} label="Safest Route (Default)" accent={C.safe} selected={defaultRoute === 'safest'} onSelect={() => setDefaultRoute('safest')} />
            <RouteOptionRow icon={<BoltIcon />} label="Fastest Route" accent={C.fast} selected={defaultRoute === 'fastest'} onSelect={() => setDefaultRoute('fastest')} />
            <RouteOptionRow icon={<CompassIcon />} label="Shortest Route" accent={C.short} selected={defaultRoute === 'shortest'} onSelect={() => setDefaultRoute('shortest')} />
          </View>
        </Reveal>

        {/* Location */}
        <Reveal delay={240}>
          <SectionTitle>Location</SectionTitle>
          <View style={styles.card}>
            <ToggleRow label="Background Location" subtitle="Share location even when app is closed" value={backgroundLocation} onChange={setBackgroundLocation} />
            <SelectorRow label="Location Accuracy" options={['High', 'Balanced', 'Battery Saving']} value={locationAccuracy} onChange={setLocationAccuracy} isLast />
          </View>
        </Reveal>
      </ScrollView>

      {/* Logout confirmation dialog */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade" onRequestClose={() => setShowLogoutConfirm(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowLogoutConfirm(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalIconWrap}>
              <AlertTriangleIcon />
            </View>
            <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 12 }}>
              Log Out?
            </ThemedText>
            <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center', marginTop: 6 }}>
              Are you sure you want to log out of your account?
            </ThemedText>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowLogoutConfirm(false)} style={styles.modalCancelBtn}>
                <ThemedText variant="label" color={C.textSecondary} style={{ fontWeight: '700' }}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable onPress={confirmLogout} style={styles.modalLogoutBtn}>
                <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
                  Log Out
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  logoutIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.dangerSoft,
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
  routeOptionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  routeIconWrap: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 11, height: 11, borderRadius: 5.5 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: C.card,
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 22, width: '100%' },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLogoutBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingsScreen;