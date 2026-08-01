import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
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
import { useNotifications, type AppNotification } from '../contexts/NotificationsContext';

const C = {
  page: '#F7F8FC',
  card: '#FFFFFF',
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  border: '#E7ECF4',
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

function HistoryIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={13} r={8} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M12 9v4l3 2" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M9 3h6M6 5l2 2M18 5l-2 2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function BellRingIcon({ size = 40, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a5 5 0 0 0-5 5v3.2c0 .6-.2 1.2-.6 1.7L5 15.5h14l-1.4-2.6a2.8 2.8 0 0 1-.6-1.7V8a5 5 0 0 0-5-5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" stroke={color} strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function StarIcon({ size = 17, color = C.amber, filled }: { size?: number; color?: string; filled?: boolean }) {
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

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr${hr > 1 ? 's' : ''} ago`;
  const day = Math.floor(hr / 24);
  return `${day} day${day > 1 ? 's' : ''} ago`;
}

function NotificationCard({
  notification,
  delay,
  onPress,
  onToggleImportant,
}: {
  notification: AppNotification;
  delay: number;
  onPress: () => void;
  onToggleImportant: () => void;
}) {
  return (
    <Reveal delay={delay}>
      <Pressable onPress={onPress} style={styles.card}>
        <View style={styles.cardTopRow}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
              {notification.title}
            </ThemedText>
            <ThemedText variant="caption" color={C.textMuted} style={{ marginTop: 2 }}>
              {formatRelativeTime(notification.timestamp)}
            </ThemedText>
          </View>
          <Pressable onPress={onToggleImportant} hitSlop={8}>
            <StarIcon filled={notification.important} />
          </Pressable>
        </View>
        <ThemedText variant="bodySm" color={C.textSecondary} style={{ marginTop: 8, lineHeight: 19 }}>
          {notification.message}
        </ThemedText>
      </Pressable>
    </Reveal>
  );
}

type TabKey = 'unread' | 'important';

export interface NotificationsScreenProps {
  onBack?: () => void;
  onViewOld?: () => void;
}

/**
 * NotificationsScreen — Unread / Important tabs, mark-as-important star,
 * tapping a notification marks it read (moving it out of Unread). Empty
 * state shown when there's nothing unread. Light theme, dummy data via
 * NotificationsContext, no backend.
 */
export function NotificationsScreen({ onBack, onViewOld }: NotificationsScreenProps) {
  const insets = useSafeAreaInsets();
  const { unread, important, markAsRead, toggleImportant } = useNotifications();
  const [tab, setTab] = useState<TabKey>('unread');

  const list = tab === 'unread' ? unread : important;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            Notifications
          </ThemedText>
          <Pressable onPress={onViewOld} hitSlop={10} style={styles.historyBtn}>
            <HistoryIcon />
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          {(['unread', 'important'] as TabKey[]).map((key) => {
            const active = tab === key;
            return (
              <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, active && styles.tabActive]}>
                <ThemedText variant="bodySm" color={active ? '#FFFFFF' : C.textSecondary} style={{ fontWeight: '700' }}>
                  {key === 'unread' ? `Unread${unread.length ? ` (${unread.length})` : ''}` : 'Important'}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 24 }}>
        {list.length === 0 ? (
          <Reveal delay={40}>
            <View style={styles.emptyState}>
              <BellRingIcon />
              <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center', marginTop: 14 }}>
                {tab === 'unread'
                  ? "We're also waiting for notifications 👀"
                  : "No important notifications yet. Tap the star on any notification to save it here."}
              </ThemedText>
            </View>
          </Reveal>
        ) : (
          list.map((n, i) => (
            <NotificationCard
              key={n.id}
              notification={n}
              delay={i * 70}
              onPress={() => !n.read && markAsRead(n.id)}
              onToggleImportant={() => toggleImportant(n.id)}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
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
  historyBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: { flexDirection: 'row', backgroundColor: '#F3F4F8', borderRadius: 12, padding: 4, gap: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 9 },
  tabActive: { backgroundColor: C.primary },
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  emptyState: { alignItems: 'center', padding: 48 },
});

export default NotificationsScreen;