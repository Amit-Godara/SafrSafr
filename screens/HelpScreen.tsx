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
  amber: '#F59E0B',
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

function HelpCircleIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M9.5 9.3a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 1.9" stroke={color} strokeWidth={1.7} strokeLinecap="round" fill="none" />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function HeadsetIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 13v-1a8 8 0 0 1 16 0v1" stroke={color} strokeWidth={1.7} strokeLinecap="round" fill="none" />
      <Rect x={3} y={13} width={4} height={6} rx={1.5} stroke={color} strokeWidth={1.7} fill="none" />
      <Rect x={17} y={13} width={4} height={6} rx={1.5} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M19 19v1a2 2 0 0 1-2 2h-3" stroke={color} strokeWidth={1.7} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function BugIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={8} y={8} width={8} height={10} rx={4} stroke={color} strokeWidth={1.7} fill="none" />
      <Path
        d="M12 8V6M9 9L6.5 6.5M15 9l2.5-2.5M4 13h4M16 13h4M5 18l3-2M19 18l-3-2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function StarIcon({ size = 24, color = C.amber, filled }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.6 6.8L12 17l-6.2 3.5 1.6-6.8-5.2-4.7 6.9-.7L12 2z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={filled ? 0 : 1.6}
      />
    </Svg>
  );
}

function DocLockIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" fill="none" />
      <Rect x={9} y={13} width={6} height={5} rx={1.2} stroke={color} strokeWidth={1.5} fill="none" />
      <Path d="M10.5 13v-1.5a1.5 1.5 0 0 1 3 0V13" stroke={color} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

function DocIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" fill="none" />
      <Path d="M8 12h8M8 16h8M8 9h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function SendIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11.5L20.5 3 12.5 20.5 10 13 3 11.5z" fill={color} />
    </Svg>
  );
}

function ShieldIcon({ size = 30, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z" fill={color} opacity={0.95} />
      <Path d="M9 12l2 2 4-4" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

function SectionTitle({ children }: { children: string }) {
  return (
    <ThemedText variant="caption" color={C.textMuted} style={styles.sectionTitle}>
      {children.toUpperCase()}
    </ThemedText>
  );
}

function ExpandableRow({
  icon,
  label,
  isLast,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  isLast?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={!isLast ? styles.rowBorder : undefined}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.row}>
        <View style={styles.iconWrap}>{icon}</View>
        <ThemedText variant="bodySm" color={C.textPrimary} style={{ flex: 1, fontWeight: '600' }}>
          {label}
        </ThemedText>
        <ChevronDownIcon rotated={open} />
      </Pressable>
      {open && <View style={styles.expandBody}>{children}</View>}
    </View>
  );
}

/* ---------------------------------------------------------------------- */
/* Small feature blocks                                                  */
/* ---------------------------------------------------------------------- */

const FAQS = [
  { q: 'How is my Safety Score calculated?', a: 'It combines crime data, crowd density, lighting, police presence, and recent community reports for the area you\'re viewing. Scores update as conditions change.' },
  { q: 'What happens when I activate SOS?', a: 'Holding the SOS button for 3 seconds sends an alert with your live location to your emergency contacts and shows you the nearest police station and hospital.' },
  { q: 'Can I use the app without sharing my location?', a: 'Some features like Safety Score search still work, but SOS, Nearby Help, and live location sharing need location access to function properly.' },
  { q: 'Is the AI Agent giving real-time predictions?', a: 'The AI Agent uses available safety data and community reports to give guidance — always use your own judgment in addition to the app\'s suggestions.' },
  { q: 'How do I remove a saved emergency contact?', a: 'Go to Profile → Emergency Contacts → Contacts tab, then tap the trash icon next to the contact you want to remove.' },
];

function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setRating(0);
      setText('');
    }, 2200);
  };

  if (sent) {
    return (
      <ThemedText variant="caption" color={C.success} style={{ fontWeight: '700' }}>
        Thanks for your feedback! 🎉
      </ThemedText>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setRating(n)} hitSlop={6}>
            <StarIcon filled={n <= rating} />
          </Pressable>
        ))}
      </View>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Tell us what you think…"
        placeholderTextColor={C.textMuted}
        multiline
        style={[styles.input, styles.inputMultiline]}
      />
      <PressFeedback onPress={submit} style={styles.submitBtn}>
        <SendIcon />
        <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
          Submit Feedback
        </ThemedText>
      </PressFeedback>
    </View>
  );
}

function SimpleForm({ placeholder, buttonLabel, confirmation }: { placeholder: string; buttonLabel: string; confirmation: string }) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setText('');
    }, 2200);
  };

  if (sent) {
    return (
      <ThemedText variant="caption" color={C.success} style={{ fontWeight: '700' }}>
        {confirmation}
      </ThemedText>
    );
  }

  return (
    <View style={{ gap: 10 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        multiline
        style={[styles.input, styles.inputMultiline]}
      />
      <PressFeedback onPress={submit} style={styles.submitBtn}>
        <SendIcon />
        <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
          {buttonLabel}
        </ThemedText>
      </PressFeedback>
    </View>
  );
}

const PRIVACY_POLICY_TEXT =
  "SafeSafar collects location and usage data solely to power safety features like Safety Score, SOS alerts, and route recommendations. We never sell your personal data to third parties. Location data is only shared with your chosen emergency contacts during an SOS event. You can review or delete your data anytime from Privacy settings.";

const TERMS_TEXT =
  "By using SafeSafar, you agree to use the app responsibly and understand that safety scores and AI suggestions are guidance, not guarantees. You're responsible for verifying critical safety decisions independently. Misuse of the SOS feature may result in account restrictions. These terms may be updated periodically.";

/* ---------------------------------------------------------------------- */

export interface HelpScreenProps {
  onBack?: () => void;
}

/**
 * HelpScreen — FAQs, Contact Support, Report a Bug, Send Feedback, About
 * SafeSafar, Privacy Policy, Terms & Conditions. Light theme matching
 * Home. Dummy data only, no backend.
 */
export function HelpScreen({ onBack }: HelpScreenProps) {
  const insets = useSafeAreaInsets();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            Help & Support
          </ThemedText>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 4 }}>
        {/* FAQs */}
        <Reveal delay={0}>
          <SectionTitle>FAQs</SectionTitle>
          <View style={styles.card}>
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <View key={f.q} style={i < FAQS.length - 1 ? styles.rowBorder : undefined}>
                  <Pressable onPress={() => setOpenFaq(open ? null : i)} style={styles.row}>
                    <View style={styles.iconWrap}>
                      <HelpCircleIcon />
                    </View>
                    <ThemedText variant="bodySm" color={C.textPrimary} style={{ flex: 1, fontWeight: '600' }}>
                      {f.q}
                    </ThemedText>
                    <ChevronDownIcon rotated={open} />
                  </Pressable>
                  {open && (
                    <View style={styles.expandBody}>
                      <ThemedText variant="caption" color={C.textSecondary} style={{ lineHeight: 19 }}>
                        {f.a}
                      </ThemedText>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </Reveal>

        {/* Contact & feedback */}
        <Reveal delay={60}>
          <SectionTitle>Get in Touch</SectionTitle>
          <View style={styles.card}>
            <ExpandableRow icon={<HeadsetIcon />} label="Contact Support">
              <SimpleForm
                placeholder="How can we help you?"
                buttonLabel="Send Message"
                confirmation="Message sent! We'll get back to you within 24 hours."
              />
            </ExpandableRow>

            <ExpandableRow icon={<BugIcon />} label="Report a Bug">
              <SimpleForm
                placeholder="Describe what went wrong…"
                buttonLabel="Submit Report"
                confirmation="Thanks — your bug report has been submitted."
              />
            </ExpandableRow>

            <ExpandableRow icon={<StarIcon size={16} filled />} label="Send Feedback" isLast>
              <FeedbackForm />
            </ExpandableRow>
          </View>
        </Reveal>

        {/* About & legal */}
        <Reveal delay={120}>
          <SectionTitle>About</SectionTitle>
          <View style={styles.card}>
            <View style={[styles.aboutCard, styles.rowBorder]}>
              <View style={styles.aboutLogo}>
                <ShieldIcon />
              </View>
              <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 10 }}>
                SafeSafar
              </ThemedText>
              <ThemedText variant="caption" color={C.textMuted}>
                Version 1.0.0
              </ThemedText>
              <ThemedText variant="caption" color={C.textSecondary} style={{ textAlign: 'center', marginTop: 8, lineHeight: 18 }}>
                Your smart travel safety companion — real-time safety scores, emergency SOS, and safer routes, wherever you go.
              </ThemedText>
            </View>

            <ExpandableRow icon={<DocLockIcon />} label="Privacy Policy">
              <ThemedText variant="caption" color={C.textSecondary} style={{ lineHeight: 19 }}>
                {PRIVACY_POLICY_TEXT}
              </ThemedText>
            </ExpandableRow>

            <ExpandableRow icon={<DocIcon />} label="Terms & Conditions" isLast>
              <ThemedText variant="caption" color={C.textSecondary} style={{ lineHeight: 19 }}>
                {TERMS_TEXT}
              </ThemedText>
            </ExpandableRow>
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
  input: {
    backgroundColor: C.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: C.textPrimary,
  },
  inputMultiline: { minHeight: 84, textAlignVertical: 'top' },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.primary,
  },
  aboutCard: { alignItems: 'center', paddingVertical: 20 },
  aboutLogo: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HelpScreen;