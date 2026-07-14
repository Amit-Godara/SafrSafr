import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@constants/index';
import { ThemedText } from '@components/ui/Typography';
import { Icon, IconName } from '@components/ui/Icon';

export interface SocialButtonProps {
  label: string;
  icon?: IconName;
  onPress?: () => void;
}

/**
 * SocialButton — light, bordered provider button (e.g. Continue with Google).
 */
export function SocialButton({ label, icon = 'google', onPress }: SocialButtonProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.btn, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
          <Icon name={icon} size={22} />
          <ThemedText variant="label" color={colors.textPrimary}>
            {label}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    height: 56,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
  },
});

export default SocialButton;
