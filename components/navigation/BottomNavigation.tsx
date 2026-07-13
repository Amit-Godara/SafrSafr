import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@constants/index';
import { ThemedText } from '../ui/Typography';
import { Icon, IconName } from '../ui/Icon';

export interface TabItem {
  key: string;
  label: string;
  icon: IconName;
}

export interface BottomNavigationProps {
  items: TabItem[];
  activeKey: string;
  onChange?: (key: string) => void;
}

/**
 * BottomNavigation — glass tab bar (Home / Map / Community / Profile).
 * Presentational: emits `onChange`, holds no routing state itself.
 */
export function BottomNavigation({ items, activeKey, onChange }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || spacing.md }]}>
      {items.map((item) => {
        const active = item.key === activeKey;
        const tint = active ? colors.primary : colors.textMuted;
        return (
          <Pressable
            key={item.key}
            style={styles.tab}
            onPress={() => onChange?.(item.key)}
            hitSlop={6}
          >
            <Icon name={item.icon} size={24} color={tint} />
            <ThemedText variant="caption" color={tint}>
              {item.label}
            </ThemedText>
            {active && <View style={styles.activeDot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  tab: { alignItems: 'center', gap: spacing.xs, flex: 1 },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});

export default BottomNavigation;
