import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '@constants/index';
import { ThemedText } from './Typography';
import { Icon, IconName } from './Icon';

export interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  error?: string;
}

/**
 * Input — themed text field with optional label, icons and error state.
 */
export function Input({
  label,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={{ gap: spacing.sm, width: '100%' }}>
      {label && (
        <ThemedText variant="label" color={colors.textSecondary}>
          {label}
        </ThemedText>
      )}
      <View style={[styles.field, { borderColor }]}>
        {leftIcon && <Icon name={leftIcon} size={20} color={colors.textMuted} />}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} hitSlop={8}>
            <Icon name={rightIcon} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error && (
        <ThemedText variant="caption" color={colors.danger}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 54,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    height: '100%',
  },
});

export default Input;
