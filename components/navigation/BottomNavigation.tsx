import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';

const C = {
  bar: '#FFFFFF',
  border: '#E7ECF4',
  active: '#3A63F3',
  inactive: '#8D96B5',
};

export type TabIconName = 'home' | 'map' | 'chat' | 'profile';

export interface TabItem {
  key: string;
  label: string;
  icon: TabIconName;
}

export interface BottomNavigationProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

/* ---- inline icons, self-contained (no dependency on the shared Icon set) ---- */

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-8.5z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function MapIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4.5L4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M9 4.5v13M15 6.5v13" stroke={color} strokeWidth={1.9} />
    </Svg>
  );
}

function ChatIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5.5h16v10H9l-4 3.5v-3.5H4v-10z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function ProfileIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={8} r={3.4} stroke={color} strokeWidth={1.9} fill="none" />
      <Path
        d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

const ICONS: Record<TabIconName, (props: { color: string }) => React.ReactElement> = {
  home: HomeIcon,
  map: MapIcon,
  chat: ChatIcon,
  profile: ProfileIcon,
};

function Tab({
  item,
  isActive,
  onPress,
}: {
  item: TabItem;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const labelOpacity = useSharedValue(isActive ? 1 : 0.7);
  const indicatorWidth = useSharedValue(isActive ? 20 : 0);

  useEffect(() => {
    if (isActive) {
      scale.value = withSequence(
        withTiming(0.85, { duration: 90 }),
        withTiming(1.15, { duration: 140 }),
        withTiming(1, { duration: 110 }),
      );
      indicatorWidth.value = withTiming(20, { duration: 220, easing: Easing.out(Easing.cubic) });
      labelOpacity.value = withTiming(1, { duration: 220 });
    } else {
      indicatorWidth.value = withTiming(0, { duration: 180 });
      labelOpacity.value = withTiming(0.7, { duration: 180 });
    }
  }, [isActive]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: labelOpacity.value }));
  const indicatorStyle = useAnimatedStyle(() => ({ width: indicatorWidth.value }));

  const Icon = ICONS[item.icon];
  const color = isActive ? C.active : C.inactive;

  return (
    <Pressable onPress={onPress} style={styles.tab} android_ripple={{ color: 'rgba(58,99,243,0.08)', borderless: true }}>
      <Animated.View style={iconStyle}>
        <Icon color={color} />
      </Animated.View>
      <Animated.View style={labelStyle}>
        <ThemedText variant="caption" color={color} style={styles.label}>
          {item.label}
        </ThemedText>
      </Animated.View>
      <Animated.View style={[styles.indicator, indicatorStyle]} />
    </Pressable>
  );
}

/**
 * BottomNavigation — light-theme tab bar (Home / Map / Chat / Profile).
 * Active tab: icon bounce, label fade-in, expanding indicator pill.
 * Inactive tabs: settle to 70% opacity.
 */
export function BottomNavigation({ items, activeKey, onChange }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {items.map((item) => (
        <Tab key={item.key} item={item} isActive={item.key === activeKey} onPress={() => onChange(item.key)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: C.bar,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontWeight: '700', fontSize: 11 },
  indicator: {
    height: 3,
    borderRadius: 2,
    backgroundColor: C.active,
    marginTop: 2,
  },
});

export default BottomNavigation;