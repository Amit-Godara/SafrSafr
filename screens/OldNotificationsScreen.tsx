import React, { useEffect } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';
import { useNotifications } from '../contexts/NotificationsContext';

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
};

function ChevronLeftIcon({ size = 22, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon({ size = 15, color = C.amber, filled }: { size?: number; color?: string; filled?: boolean }) {
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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useEffect(() => {
    const cfg = { duration: 380, easing: Easing.out(Easing.cubic) };
    opacity.value = withDelay(delay, withTiming(1, cfg));
    translateY.value = withDelay(delay, withTiming(0, cfg));
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
  return <Animated.View style={animStyle}>{children}</Animated.View>;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export interface OldNotificationsScreenProps {
  onBack?: () => void;
}

/**
 * OldNotificationsScreen — read notifications from the last 7 days.
 * Anything read and older than 7 days is filtered out by
 * NotificationsContext before it ever reaches this screen.
 */
export function OldNotificationsScreen({ onBack }: OldNotificationsScreenProps) {
  const insets = useSafeAreaInsets();
  const { old, toggleImportant } = useNotifications();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ChevronLeftIcon />
          </Pressable>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
            Old Notifications
          </ThemedText>
          <View style={{ width: 36 }} />
        </View>
        <ThemedText variant="caption" color={C.textMuted}>
          Showing read notifications from the last 7 days
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 24 }}>
        {old.length === 0 ? (
          <Reveal delay={40}>
            <View style={styles.emptyState}>
              <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center' }}>
                No read notifications in the last 7 days.
              </ThemedText>
            </View>
          </Reveal>
        ) : (
          old.map((n, i) => (
            <Reveal key={n.id} delay={i * 60}>
              <View style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                      {n.title}
                    </ThemedText>
                    <ThemedText variant="caption" color={C.textMuted} style={{ marginTop: 2 }}>
                      {formatDate(n.timestamp)}
                    </ThemedText>
                  </View>
                  <Pressable onPress={() => toggleImportant(n.id)} hitSlop={8}>
                    <StarIcon filled={n.important} />
                  </Pressable>
                </View>
                <ThemedText variant="bodySm" color={C.textSecondary} style={{ marginTop: 8, lineHeight: 19 }}>
                  {n.message}
                </ThemedText>
              </View>
            </Reveal>
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
    gap: 6,
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
  emptyState: { padding: 40, alignItems: 'center' },
});

export default OldNotificationsScreen;