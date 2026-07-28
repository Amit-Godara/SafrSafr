import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';
import { useTravelers, type Traveler } from '../contexts/TravelersContext';

/** Same light "Guardian" palette used on Home. */
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
};

/* ---------------------------------------------------------------------- */
/* Inline icons — self-contained, matching Home's approach.               */
/* ---------------------------------------------------------------------- */

function ChevronLeftIcon({ size = 22, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SearchIcon({ size = 17, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={11} cy={11} r={6.5} stroke={color} strokeWidth={1.9} fill="none" />
      <Path d="M20 20l-4.3-4.3" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function ChatIcon({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5.5h16v10H9l-4 3.5v-3.5H4v-10z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Reusable animation primitives — same pattern as HomeScreen.            */
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

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}

function PressFeedback({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}) {
  const scale = useSharedValue(1);
  const shadow = useSharedValue(0.06);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadow.value,
    elevation: 2 + shadow.value * 55,
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 320 });
        shadow.value = withTiming(0.16, { duration: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 260 });
        shadow.value = withTiming(0.06, { duration: 220 });
      }}
      android_ripple={{ color: 'rgba(16,24,40,0.06)' }}
      style={[style, animStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

function PulseDot() {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.6, { duration: 1000, easing: Easing.out(Easing.ease) }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: 2 - scale.value }));
  return (
    <View style={styles.onlineDotWrap}>
      <Animated.View style={[styles.onlineDotPulse, style]} />
      <View style={styles.onlineDot} />
    </View>
  );
}

/* ---------------------------------------------------------------------- */
/* Data now comes from the shared TravelersContext (see contexts/).      */
/* ---------------------------------------------------------------------- */

type TabKey = 'nearby' | 'connections';

function TravelerCard({
  traveler,
  delay,
  onToggleConnect,
  onChat,
}: {
  traveler: Traveler;
  delay: number;
  onToggleConnect: () => void;
  onChat: () => void;
}) {
  return (
    <Reveal delay={delay}>
      <View style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: traveler.avatarColor }]}>
          <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '800' }}>
            {traveler.initials}
          </ThemedText>
          {traveler.online && (
            <View style={styles.onlineBadge}>
              <PulseDot />
            </View>
          )}
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
            {traveler.name}
          </ThemedText>
          <ThemedText variant="caption" color={C.textMuted}>
            {traveler.distance}
          </ThemedText>
          <ThemedText variant="caption" color={traveler.online ? C.success : C.textMuted} style={{ fontWeight: '600' }}>
            {traveler.online ? 'Online now' : 'Offline'}
          </ThemedText>
        </View>

        <PressFeedback
          onPress={traveler.connected ? onChat : onToggleConnect}
          style={[styles.connectBtn, traveler.connected ? styles.connectedBtn : styles.connectBtnOutline]}
        >
          {traveler.connected ? (
            <>
              <ChatIcon />
              <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
                Chat
              </ThemedText>
            </>
          ) : (
            <ThemedText variant="caption" color={C.primary} style={{ fontWeight: '700' }}>
              Connect
            </ThemedText>
          )}
        </PressFeedback>
      </View>
    </Reveal>
  );
}

export interface NearbyTravelersScreenProps {
  onBack?: () => void;
  onChatWithTraveler?: (traveler: Traveler) => void;
}

/**
 * NearbyTravelersScreen — Nearby / Connections tabs, search, animated
 * traveler cards. Same light theme + animation language as HomeScreen.
 * Once connected, a traveler's Connect button becomes a Chat button that
 * opens the app's Chat tab. Dummy data only, no backend.
 */
export function NearbyTravelersScreen({ onBack, onChatWithTraveler }: NearbyTravelersScreenProps) {
  const insets = useSafeAreaInsets();
  const { travelers, toggleConnect } = useTravelers();
  const [tab, setTab] = useState<TabKey>('nearby');
  const [query, setQuery] = useState('');

  const base = tab === 'nearby' ? travelers : travelers.filter((t) => t.connected);
  const filtered = base.filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            Nearby Travelers
          </ThemedText>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search travelers…"
            placeholderTextColor={C.textMuted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.tabRow}>
          {(['nearby', 'connections'] as TabKey[]).map((key) => {
            const active = tab === key;
            return (
              <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, active && styles.tabActive]}>
                <ThemedText
                  variant="bodySm"
                  color={active ? '#FFFFFF' : C.textSecondary}
                  style={{ fontWeight: '700' }}
                >
                  {key === 'nearby' ? 'Nearby' : 'Connections'}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 24 }}
      >
        {filtered.length === 0 ? (
          <Reveal delay={40}>
            <View style={styles.emptyState}>
              <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center' }}>
                {tab === 'connections'
                  ? "You haven't connected with anyone yet."
                  : 'No travelers match your search.'}
              </ThemedText>
            </View>
          </Reveal>
        ) : (
          filtered.map((t, i) => (
            <TravelerCard
              key={t.id}
              traveler={t}
              delay={i * 80}
              onToggleConnect={() => toggleConnect(t.id)}
              onChat={() => onChatWithTraveler?.(t)}
            />
          ))
        )}
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
    gap: 14,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F3F4F8',
  },
  searchInput: { flex: 1, color: C.textPrimary, fontSize: 15 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F8',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 9 },
  tabActive: { backgroundColor: C.primary },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDotWrap: { width: 10, height: 10, alignItems: 'center', justifyContent: 'center' },
  onlineDotPulse: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(34,197,94,0.4)',
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.success },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  connectBtnOutline: { backgroundColor: C.primarySoft },
  connectedBtn: { backgroundColor: C.success },
  emptyState: { padding: 32, alignItems: 'center' },
});

export default NearbyTravelersScreen;