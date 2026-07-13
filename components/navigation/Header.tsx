import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@constants/index';
import { ThemedText } from '../ui/Typography';
import { Icon, IconName } from '../ui/Icon';

export interface HeaderAction {
  icon: IconName;
  onPress?: () => void;
}

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: HeaderAction;
  transparent?: boolean;
}

/**
 * Header — top app bar with optional back button and one trailing action.
 */
export function Header({ title, onBack, rightAction, transparent = false }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.sm, backgroundColor: transparent ? 'transparent' : colors.background },
      ]}
    >
      <View style={styles.side}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={10} style={styles.iconBtn}>
            <Icon name="chevron-left" size={26} color={colors.textPrimary} />
          </Pressable>
        )}
      </View>

      <ThemedText variant="title" color={colors.textPrimary}>
        {title}
      </ThemedText>

      <View style={[styles.side, { alignItems: 'flex-end' }]}>
        {rightAction && (
          <Pressable onPress={rightAction.onPress} hitSlop={10} style={styles.iconBtn}>
            <Icon name={rightAction.icon} size={24} color={colors.textPrimary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  side: { width: 44, justifyContent: 'center' },
  iconBtn: { padding: spacing.xs },
});

export default Header;
