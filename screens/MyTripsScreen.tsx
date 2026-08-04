import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet , ImageBackground } from 'react-native';
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
  amberSoft: '#FEF3C7',
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

function ChevronRightIcon({ size = 16, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MapTripIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4.5L4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function BookmarkIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 4h12v16l-6-4-6 4V4z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function HeartIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20s-7.5-4.6-9.7-9.1C.8 7.6 2.4 4.5 5.6 4c2-.3 3.7.7 4.9 2.3l1.5 2 1.5-2C14.7 4.7 16.4 3.7 18.4 4c3.2.5 4.8 3.6 3.3 6.9C19.5 15.4 12 20 12 20z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function SearchIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={11} cy={11} r={6.5} stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M20 20l-4.3-4.3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ClockIcon({ size = 13, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} fill="none" />
      <Path d="M12 7v5l3.5 2" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function RulerIcon({ size = 13, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 15l5-5 3 3 8-8M13 3l3 0 0 3M15 12l0 3-3 0"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
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

function NavigateIcon({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 19-7-4-7 4 7-19z" fill={color} />
    </Svg>
  );
}

function EmptyBoxIcon({ size = 40, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={9} width={16} height={11} rx={2} stroke={color} strokeWidth={1.6} fill="none" />
      <Path d="M4 9l3-5h10l3 5" stroke={color} strokeWidth={1.6} strokeLinejoin="round" fill="none" />
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

/* ---------------------------------------------------------------------- */
/* Mock data — no backend                                                */
/* ---------------------------------------------------------------------- */

type TabKey = 'history' | 'routes' | 'favorites' | 'searches';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'history', label: 'Trip History' },
  { key: 'routes', label: 'Saved Routes' },
  { key: 'favorites', label: 'Favorite Places' },
  { key: 'searches', label: 'Recent Searches' },
];

const TRIP_HISTORY = [
  { id: 'h1', from: 'Home', to: 'Connaught Place', date: 'Jul 26, 2026', distance: '5.2 km', status: 'Safe Trip' },
  { id: 'h2', from: 'Office', to: 'Airport', date: 'Jul 22, 2026', distance: '18.4 km', status: 'Safe Trip' },
  { id: 'h3', from: 'Hostel', to: 'Old Market', date: 'Jul 18, 2026', distance: '3.1 km', status: 'SOS Used' },
];

const SAVED_ROUTES = [
  { id: 'r1', name: 'Home → College', source: 'Home', destination: 'College', distance: '6.8 km', duration: '22 min' },
  { id: 'r2', name: 'Office → Gym', source: 'Office', destination: 'Gym', distance: '2.4 km', duration: '9 min' },
];

const FAVORITE_PLACES = [
  { id: 'f1', name: 'Connaught Place', category: 'Popular Area' },
  { id: 'f2', name: 'City Care Hospital', category: 'Hospital' },
  { id: 'f3', name: 'Vidhayak Nagar Police Station', category: 'Police Station' },
];

const RECENT_SEARCHES = ['Jaipur safety score', 'Nearest police station', 'Safe hotels in Delhi', 'Market St crowd report'];

/* ---------------------------------------------------------------------- */

function InfoCard({ icon, title, subtitle, meta, badge, delay }: { icon: React.ReactNode; title: string; subtitle: string; meta?: React.ReactNode; badge?: { label: string; color: string; bg: string }; delay: number }) {
  return (
    <Reveal delay={delay}>
      <View style={styles.row}>
        <View style={styles.rowIconWrap}>{icon}</View>
        <View style={{ flex: 1, gap: 3 }}>
          <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
            {title}
          </ThemedText>
          <ThemedText variant="caption" color={C.textMuted}>
            {subtitle}
          </ThemedText>
          {meta}
        </View>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <ThemedText variant="caption" color={badge.color} style={{ fontWeight: '700' }}>
              {badge.label}
            </ThemedText>
          </View>
        )}
      </View>
    </Reveal>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Reveal delay={40}>
      <View style={styles.emptyState}>
        <EmptyBoxIcon />
        <ThemedText variant="bodySm" color={C.textMuted} style={{ marginTop: 10, textAlign: 'center' }}>
          {label}
        </ThemedText>
      </View>
    </Reveal>
  );
}

export interface MyTripsScreenProps {
  onBack?: () => void;
  onNavigateRoute?: (route: { source: string; destination: string; distance: string; duration: string }) => void;
}

/**
 * MyTripsScreen — Trip History / Saved Routes / Favorite Places / Recent
 * Searches, switchable via a horizontal tab row. Tapping the Navigate
 * button on a Saved Route opens it on the Map/Navigation screen with a
 * dummy route drawn between the two points. Light theme matching Home.
 * Dummy data only, no backend.
 */
export function MyTripsScreen({ onBack, onNavigateRoute }: MyTripsScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('history');

  return (
    <ImageBackground
      source={require('../assets/images/background/watercolor-bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            My Trips
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: insets.bottom + 24 }}>
        {tab === 'history' &&
          (TRIP_HISTORY.length === 0 ? (
            <EmptyState label="No trips yet. Your travel history will appear here." />
          ) : (
            TRIP_HISTORY.map((t, i) => (
              <InfoCard
                key={t.id}
                delay={i * 70}
                icon={<MapTripIcon />}
                title={`${t.from} → ${t.to}`}
                subtitle={`${t.date} • ${t.distance}`}
                badge={
                  t.status === 'Safe Trip'
                    ? { label: t.status, color: C.success, bg: C.successSoft }
                    : { label: t.status, color: '#E53935', bg: '#FDECEC' }
                }
              />
            ))
          ))}

        {tab === 'routes' &&
          (SAVED_ROUTES.length === 0 ? (
            <EmptyState label="No saved routes yet. Save a route from the planner to see it here." />
          ) : (
            SAVED_ROUTES.map((r, i) => (
              <Reveal key={r.id} delay={i * 70}>
                <View style={styles.row}>
                  <View style={styles.rowIconWrap}>
                    <BookmarkIcon />
                  </View>
                  <View style={{ flex: 1, gap: 3 }}>
                    <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                      {r.name}
                    </ThemedText>
                    <View style={styles.metaRow}>
                      <RulerIcon />
                      <ThemedText variant="caption" color={C.textMuted}>
                        {r.distance}
                      </ThemedText>
                      <ClockIcon />
                      <ThemedText variant="caption" color={C.textMuted}>
                        {r.duration}
                      </ThemedText>
                    </View>
                  </View>
                  <PressFeedback
                    onPress={() =>
                      onNavigateRoute?.({
                        source: r.source,
                        destination: r.destination,
                        distance: r.distance,
                        duration: r.duration,
                      })
                    }
                    style={styles.navigateBtn}
                  >
                    <NavigateIcon />
                  </PressFeedback>
                </View>
              </Reveal>
            ))
          ))}

        {tab === 'favorites' &&
          (FAVORITE_PLACES.length === 0 ? (
            <EmptyState label="No favorite places yet. Places you save will show up here." />
          ) : (
            FAVORITE_PLACES.map((f, i) => (
              <InfoCard key={f.id} delay={i * 70} icon={<PinIcon />} title={f.name} subtitle={f.category} />
            ))
          ))}

        {tab === 'searches' &&
          (RECENT_SEARCHES.length === 0 ? (
            <EmptyState label="No recent searches yet." />
          ) : (
            RECENT_SEARCHES.map((s, i) => (
              <Reveal key={s} delay={i * 60}>
                <View style={styles.searchRow}>
                  <SearchIcon size={16} color={C.textMuted} />
                  <ThemedText variant="bodySm" color={C.textPrimary} style={{ flex: 1 }}>
                    {s}
                  </ThemedText>
                  <ChevronRightIcon />
                </View>
              </Reveal>
            ))
          ))}
      </ScrollView>
    </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
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
  rowIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  navigateBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  emptyState: { alignItems: 'center', padding: 40 },
});

export default MyTripsScreen;