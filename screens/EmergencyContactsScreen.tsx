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
  success: '#22C55E',
  successSoft: '#DCFCE7',
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

function UserIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={8} r={3.4} stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function PhoneIcon({ size = 15, color = C.success }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2z"
        fill={color}
      />
    </Svg>
  );
}

function TrashIcon({ size = 15, color = C.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function PlusIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
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

function MessageIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
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

function MedicalIcon({ size = 16, color = C.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={4} width={16} height={16} rx={3} stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function AlertIcon({ size = 16, color = C.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.5l9.5 16.5H2.5L12 3.5z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" fill="none" />
      <Path d="M12 9.5v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function ShieldIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z" fill={color} opacity={0.95} />
    </Svg>
  );
}

function HeartIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20s-7.5-4.6-9.7-9.1C.8 7.6 2.4 4.5 5.6 4c2-.3 3.7.7 4.9 2.3l1.5 2 1.5-2C14.7 4.7 16.4 3.7 18.4 4c3.2.5 4.8 3.6 3.3 6.9C19.5 15.4 12 20 12 20z"
        fill={color}
      />
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

/* ---------------------------------------------------------------------- */
/* Mock data — no backend                                                */
/* ---------------------------------------------------------------------- */

type TabKey = 'contacts' | 'message' | 'medical' | 'history';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'contacts', label: 'Contacts' },
  { key: 'message', label: 'SOS Message' },
  { key: 'medical', label: 'Medical Info' },
  { key: 'history', label: 'SOS History' },
];

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Mom', relation: 'Mother', phone: '+91 98765 43210' },
  { id: 'c2', name: 'Rahul Sharma', relation: 'Brother', phone: '+91 91234 56789' },
  { id: 'c3', name: 'Priya Verma', relation: 'Friend', phone: '+91 99887 66554' },
];

interface Helpline {
  id: string;
  name: string;
  phone: string;
  color: string;
  icon: (props: { size?: number; color?: string }) => React.ReactElement;
}

const HELPLINES: Helpline[] = [
  { id: 'h1', name: 'Police', phone: '100', color: C.primary, icon: ShieldIcon },
  { id: 'h2', name: 'Ambulance', phone: '108', color: '#E53935', icon: MedicalIcon },
  { id: 'h3', name: 'Women Helpline', phone: '1091', color: '#D6336C', icon: HeartIcon },
];

const DEFAULT_SOS_MESSAGE =
  "I need help. This is an emergency alert from SafeSafar. My live location is being shared with you. Please contact me or call emergency services if you can't reach me.";

const SOS_HISTORY = [
  { id: 's1', date: 'Jul 18, 2026 • 11:42 PM', location: 'Old Market, Delhi', status: 'Resolved' },
  { id: 's2', date: 'Jun 30, 2026 • 9:05 PM', location: 'Ring Road, Delhi', status: 'Resolved' },
];

/* ---------------------------------------------------------------------- */

function FormField({ label, value, onChangeText, placeholder, multiline }: { label: string; value: string; onChangeText: (t: string) => void; placeholder: string; multiline?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <ThemedText variant="caption" color={C.textSecondary} style={{ fontWeight: '700' }}>
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

export interface EmergencyContactsScreenProps {
  onBack?: () => void;
}

/**
 * EmergencyContactsScreen — Manage Emergency Contacts, Default SOS
 * Message, Medical Information, SOS History, switchable via tabs.
 * Light theme matching Home. Dummy data only, no backend.
 */
export function EmergencyContactsScreen({ onBack }: EmergencyContactsScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('contacts');

  // --- Contacts ---
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addContact = () => {
    const id = `c_${Date.now()}`;
    setContacts((prev) => [...prev, { id, name: '', relation: '', phone: '' }]);
    setEditingId(id);
  };
  const updateContact = (id: string, patch: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };
  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // --- SOS Message ---
  const [message, setMessage] = useState(DEFAULT_SOS_MESSAGE);
  const [savedFlash, setSavedFlash] = useState(false);
  const saveMessage = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  // --- Medical Info ---
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('Peanuts, Penicillin');
  const [conditions, setConditions] = useState('Asthma');
  const [medications, setMedications] = useState('Inhaler (as needed)');
  const [medicalNotes, setMedicalNotes] = useState('');

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            Emergency Contacts
          </ThemedText>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tabChip, active && styles.tabChipActive]}>
                <ThemedText variant="caption" color={active ? '#FFFFFF' : C.textSecondary} style={{ fontWeight: '700' }}>
                  {t.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 24 }}>
        {/* Manage Emergency Contacts */}
        {tab === 'contacts' && (
          <>
            <Reveal delay={0}>
              <View style={{ gap: 8 }}>
                <ThemedText variant="caption" color={C.textMuted} style={{ fontWeight: '700', marginLeft: 4 }}>
                  EMERGENCY HELPLINES
                </ThemedText>
                <View style={styles.card}>
                  {HELPLINES.map((h, i) => {
                    const Icon = h.icon;
                    return (
                      <View key={h.id} style={[styles.contactRow, i < HELPLINES.length - 1 && styles.helplineRowBorder]}>
                        <View style={[styles.avatar, { backgroundColor: h.color }]}>
                          <Icon />
                        </View>
                        <View style={{ flex: 1 }}>
                          <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                            {h.name}
                          </ThemedText>
                          <ThemedText variant="caption" color={C.textMuted}>
                            {h.phone}
                          </ThemedText>
                        </View>
                        <PressFeedback style={[styles.iconBtn, { backgroundColor: C.successSoft }]}>
                          <PhoneIcon />
                        </PressFeedback>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Reveal>

            <ThemedText variant="caption" color={C.textMuted} style={{ fontWeight: '700', marginLeft: 4, marginTop: 4 }}>
              MY CONTACTS
            </ThemedText>

            {contacts.map((c, i) => (
              <Reveal key={c.id} delay={i * 70}>
                <View style={styles.card}>
                  {editingId === c.id ? (
                    <View style={{ gap: 10 }}>
                      <FormField label="Name" value={c.name} onChangeText={(v) => updateContact(c.id, { name: v })} placeholder="Contact name" />
                      <FormField label="Relation" value={c.relation} onChangeText={(v) => updateContact(c.id, { relation: v })} placeholder="e.g. Mother, Friend" />
                      <FormField label="Phone" value={c.phone} onChangeText={(v) => updateContact(c.id, { phone: v })} placeholder="+91 00000 00000" />
                      <PressFeedback onPress={() => setEditingId(null)} style={styles.saveBtn}>
                        <CheckIcon />
                        <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
                          Done
                        </ThemedText>
                      </PressFeedback>
                    </View>
                  ) : (
                    <View style={styles.contactRow}>
                      <View style={styles.avatar}>
                        <UserIcon />
                      </View>
                      <Pressable style={{ flex: 1 }} onPress={() => setEditingId(c.id)}>
                        <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                          {c.name || 'Unnamed contact'}
                        </ThemedText>
                        <ThemedText variant="caption" color={C.textMuted}>
                          {c.relation || 'Relation'} • {c.phone || 'No phone number'}
                        </ThemedText>
                      </Pressable>
                      <PressFeedback style={styles.iconBtn}>
                        <PhoneIcon />
                      </PressFeedback>
                      <PressFeedback onPress={() => removeContact(c.id)} style={[styles.iconBtn, { backgroundColor: C.dangerSoft }]}>
                        <TrashIcon />
                      </PressFeedback>
                    </View>
                  )}
                </View>
              </Reveal>
            ))}

            <PressFeedback onPress={addContact} style={styles.addBtn}>
              <PlusIcon color={C.primary} />
              <ThemedText variant="label" color={C.primary} style={{ fontWeight: '700' }}>
                Add Contact
              </ThemedText>
            </PressFeedback>
          </>
        )}

        {/* Default SOS Message */}
        {tab === 'message' && (
          <Reveal delay={0}>
            <View style={styles.card}>
              <View style={styles.sectionHeaderRow}>
                <MessageIcon />
                <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                  Default SOS Message
                </ThemedText>
              </View>
              <ThemedText variant="caption" color={C.textMuted} style={{ marginBottom: 10 }}>
                This message is sent to your emergency contacts when you activate SOS.
              </ThemedText>
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                style={[styles.input, styles.inputMultiline, { minHeight: 120 }]}
              />
              <ThemedText variant="caption" color={C.textMuted} style={{ marginTop: 6, marginBottom: 14 }}>
                {message.length} characters
              </ThemedText>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <PressFeedback onPress={saveMessage} style={[styles.saveBtn, { flex: 1 }]}>
                  <CheckIcon />
                  <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
                    {savedFlash ? 'Saved!' : 'Save Message'}
                  </ThemedText>
                </PressFeedback>
                <PressFeedback onPress={() => setMessage(DEFAULT_SOS_MESSAGE)} style={styles.resetBtn}>
                  <ThemedText variant="label" color={C.textSecondary} style={{ fontWeight: '700' }}>
                    Reset
                  </ThemedText>
                </PressFeedback>
              </View>
            </View>
          </Reveal>
        )}

        {/* Medical Information */}
        {tab === 'medical' && (
          <Reveal delay={0}>
            <View style={styles.card}>
              <View style={styles.sectionHeaderRow}>
                <MedicalIcon />
                <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                  Medical Information
                </ThemedText>
              </View>
              <ThemedText variant="caption" color={C.textMuted} style={{ marginBottom: 14 }}>
                Shared with responders during an emergency.
              </ThemedText>

              <View style={{ gap: 14 }}>
                <FormField label="Blood Group" value={bloodGroup} onChangeText={setBloodGroup} placeholder="e.g. O+" />
                <FormField label="Allergies" value={allergies} onChangeText={setAllergies} placeholder="e.g. Peanuts, Penicillin" />
                <FormField label="Medical Conditions" value={conditions} onChangeText={setConditions} placeholder="e.g. Asthma, Diabetes" />
                <FormField label="Current Medications" value={medications} onChangeText={setMedications} placeholder="e.g. Inhaler" />
                <FormField label="Additional Notes" value={medicalNotes} onChangeText={setMedicalNotes} placeholder="Anything else responders should know" multiline />
              </View>

              <PressFeedback style={[styles.saveBtn, { marginTop: 16 }]}>
                <CheckIcon />
                <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
                  Save Medical Info
                </ThemedText>
              </PressFeedback>
            </View>
          </Reveal>
        )}

        {/* SOS History */}
        {tab === 'history' &&
          (SOS_HISTORY.length === 0 ? (
            <Reveal delay={40}>
              <View style={styles.emptyState}>
                <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center' }}>
                  No SOS alerts triggered yet.
                </ThemedText>
              </View>
            </Reveal>
          ) : (
            SOS_HISTORY.map((h, i) => (
              <Reveal key={h.id} delay={i * 80}>
                <View style={styles.row}>
                  <View style={[styles.rowIconWrap, { backgroundColor: C.dangerSoft }]}>
                    <AlertIcon />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                      {h.location}
                    </ThemedText>
                    <ThemedText variant="caption" color={C.textMuted}>
                      {h.date}
                    </ThemedText>
                  </View>
                  <View style={styles.resolvedBadge}>
                    <ThemedText variant="caption" color={C.success} style={{ fontWeight: '700' }}>
                      {h.status}
                    </ThemedText>
                  </View>
                </View>
              </Reveal>
            ))
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  header: {
    backgroundColor: C.card,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: { gap: 8, paddingHorizontal: 16 },
  tabChip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: '#F3F4F8' },
  tabChipActive: { backgroundColor: C.primary },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  helplineRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 12, marginBottom: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.primary,
    borderStyle: 'dashed',
  },
  input: {
    backgroundColor: C.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: C.textPrimary,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 12,
    backgroundColor: C.primary,
  },
  resetBtn: {
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F8',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  rowIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resolvedBadge: { backgroundColor: C.successSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  emptyState: { padding: 40, alignItems: 'center' },
});

export default EmergencyContactsScreen;